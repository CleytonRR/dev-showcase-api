const pathId = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "integer", minimum: 1 },
};

const errorResponse = {
  description: "Resposta de erro padronizada",
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ErrorResponse" },
      example: {
        error: {
          status: 400,
          code: "VALIDATION_ERROR",
          message: "Um ou mais campos são inválidos",
        },
      },
    },
  },
};

module.exports = {
  openapi: "3.0.3",
  info: {
    title: "DevShowcase API",
    version: "1.1.0",
    description:
      "API REST de perfis, projetos, tecnologias, feedbacks avaliados e votos.",
  },
  servers: [{ url: "http://localhost:3000", description: "Servidor local" }],
  tags: [
    { name: "Profiles", description: "Perfis de desenvolvedores" },
    { name: "Technologies", description: "Tecnologias disponíveis" },
    { name: "Projects", description: "Projetos, listagem e votos" },
    { name: "Feedback", description: "Opiniões legadas e avaliações de 1 a 5" },
  ],
  paths: {
    "/health": {
      get: {
        summary: "Verifica a disponibilidade da API",
        responses: { 200: { description: "API disponível" } },
      },
    },
    "/api/profiles": {
      post: {
        tags: ["Profiles"],
        summary: "Cadastra um perfil",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProfileInput" },
            },
          },
        },
        responses: {
          201: { description: "Perfil criado" },
          400: errorResponse,
          409: errorResponse,
        },
      },
    },
    "/api/profiles/{id}": {
      get: {
        tags: ["Profiles"],
        summary: "Busca um perfil por ID",
        parameters: [pathId],
        responses: {
          200: { description: "Perfil encontrado" },
          404: errorResponse,
        },
      },
    },
    "/api/technologies": {
      get: {
        tags: ["Technologies"],
        summary: "Lista tecnologias",
        responses: { 200: { description: "Lista de tecnologias" } },
      },
      post: {
        tags: ["Technologies"],
        summary: "Cadastra uma tecnologia",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TechnologyInput" },
            },
          },
        },
        responses: {
          201: { description: "Tecnologia criada" },
          400: errorResponse,
          409: errorResponse,
        },
      },
    },
    "/api/projects": {
      get: {
        tags: ["Projects"],
        summary: "Lista projetos com filtros e paginação",
        parameters: [
          {
            name: "technologyId",
            in: "query",
            schema: { type: "integer", minimum: 1 },
            description: "Filtra pela tecnologia associada",
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
          },
        ],
        responses: {
          200: { description: "Projetos e metadados da paginação" },
          400: errorResponse,
        },
      },
      post: {
        tags: ["Projects"],
        summary: "Cadastra um projeto",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProjectInput" },
            },
          },
        },
        responses: {
          201: { description: "Projeto criado" },
          400: errorResponse,
        },
      },
    },
    "/api/projects/{id}/upvote": {
      put: {
        tags: ["Projects"],
        summary: "Incrementa em um o número de curtidas do projeto",
        parameters: [pathId],
        responses: {
          200: {
            description: "Projeto atualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Project" },
              },
            },
          },
          404: errorResponse,
        },
      },
    },
    "/api/projects/{id}/feedbacks": {
      get: {
        tags: ["Feedback"],
        summary: "Lista feedbacks avaliados do projeto",
        parameters: [pathId],
        responses: {
          200: { description: "Avaliações do projeto" },
          404: errorResponse,
        },
      },
      post: {
        tags: ["Feedback"],
        summary: "Registra uma nota e atualiza a média do projeto",
        parameters: [pathId],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RatedFeedbackInput" },
              example: { rating: 5, comment: "Projeto excelente!" },
            },
          },
        },
        responses: {
          201: { description: "Avaliação registrada e média recalculada" },
          400: errorResponse,
          404: errorResponse,
        },
      },
    },
    "/api/projects/{projectId}/feedback": {
      get: {
        tags: ["Feedback"],
        summary: "Lista feedback legado",
        parameters: [{ ...pathId, name: "projectId" }],
        responses: {
          200: { description: "Feedback legado" },
          404: errorResponse,
        },
      },
      post: {
        tags: ["Feedback"],
        summary: "Cria feedback legado (mantido por compatibilidade)",
        parameters: [{ ...pathId, name: "projectId" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LegacyFeedbackInput" },
            },
          },
        },
        responses: {
          201: { description: "Feedback criado" },
          400: errorResponse,
          404: errorResponse,
        },
      },
    },
  },
  components: {
    schemas: {
      ProfileInput: {
        type: "object",
        required: ["name", "email"],
        properties: {
          name: { type: "string", minLength: 1 },
          email: { type: "string", format: "email" },
          bio: { type: "string", nullable: true },
          avatarUrl: { type: "string", format: "uri", nullable: true },
        },
      },
      TechnologyInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 1 },
          category: { type: "string", nullable: true },
        },
      },
      ProjectInput: {
        type: "object",
        required: ["title", "profileId"],
        properties: {
          title: { type: "string", minLength: 1 },
          description: { type: "string", nullable: true },
          url: { type: "string", format: "uri", nullable: true },
          profileId: { type: "integer", minimum: 1 },
          technologyIds: {
            type: "array",
            items: { type: "integer", minimum: 1 },
          },
        },
      },
      RatedFeedbackInput: {
        type: "object",
        required: ["rating", "comment"],
        properties: {
          rating: { type: "integer", minimum: 1, maximum: 5 },
          comment: { type: "string", minLength: 1 },
        },
      },
      LegacyFeedbackInput: {
        type: "object",
        required: ["author", "content"],
        properties: {
          author: { type: "string", minLength: 1 },
          content: { type: "string", minLength: 1 },
        },
      },
      Project: {
        type: "object",
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          likes: { type: "integer", minimum: 0 },
          averageRating: { type: "number", minimum: 0, maximum: 5 },
          ratingCount: { type: "integer", minimum: 0 },
        },
      },
      ErrorResponse: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "object",
            required: ["status", "code", "message"],
            properties: {
              status: { type: "integer" },
              code: { type: "string" },
              message: { type: "string" },
              details: {
                type: "array",
                items: { type: "object", additionalProperties: true },
              },
            },
          },
        },
      },
    },
  },
};
