const request = require("supertest");
const app = require("../src/app");
const { sequelize } = require("../src/models");

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("API REST", () => {
  test("valida campos obrigatórios e URL de perfil", async () => {
    const response = await request(app)
      .post("/api/profiles")
      .send({ name: "  ", email: "invalido" });
    expect(response.status).toBe(400);
    expect(response.body.error.status).toBe(400);
    expect(response.body.error.details.length).toBeGreaterThan(0);
  });

  test("cadastra perfil e o busca com seus projetos", async () => {
    const created = await request(app)
      .post("/api/profiles")
      .send({ name: "Ana Dev", email: "ana@example.com" });
    expect(created.status).toBe(201);
    const found = await request(app).get(`/api/profiles/${created.body.id}`);
    expect(found.status).toBe(200);
    expect(found.body.name).toBe("Ana Dev");
    expect(found.body.projects).toEqual([]);
  });

  test("cria tecnologia e projeto com relacionamento N:N", async () => {
    const profile = await request(app)
      .post("/api/profiles")
      .send({ name: "Dev", email: "dev@example.com" });
    const technology = await request(app)
      .post("/api/technologies")
      .send({ name: "Node.js", category: "Backend" });
    const project = await request(app)
      .post("/api/projects")
      .send({
        title: "Portfólio",
        profileId: profile.body.id,
        technologyIds: [technology.body.id],
        url: "https://example.com",
      });
    expect(project.status).toBe(201);
    expect(project.body.technologies).toHaveLength(1);
    expect(project.body.likes).toBe(0);
    const listed = await request(app).get("/api/projects");
    expect(listed.status).toBe(200);
    expect(listed.body.data[0].profile.name).toBe("Dev");
    expect(listed.body.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    });
    const filtered = await request(app).get(
      `/api/projects?technologyId=${technology.body.id}`,
    );
    expect(filtered.body.data).toHaveLength(1);
    expect(filtered.body.pagination.total).toBe(1);
  });

  test("registra e lista feedback de projeto", async () => {
    const profile = await request(app)
      .post("/api/profiles")
      .send({ name: "Dev", email: "dev@example.com" });
    const project = await request(app)
      .post("/api/projects")
      .send({ title: "App", profileId: profile.body.id });
    const feedback = await request(app)
      .post(`/api/projects/${project.body.id}/feedback`)
      .send({ author: "João", content: "Muito bom" });
    expect(feedback.status).toBe(201);
    const listed = await request(app).get(
      `/api/projects/${project.body.id}/feedback`,
    );
    expect(listed.body).toHaveLength(1);
    expect(listed.body[0].content).toBe("Muito bom");
  });

  test("retorna 404 para perfil inexistente e 409 para email duplicado", async () => {
    const missing = await request(app).get("/api/profiles/999");
    expect(missing.status).toBe(404);
    expect(missing.body.error.code).toBe("NOT_FOUND");
    await request(app)
      .post("/api/profiles")
      .send({ name: "A", email: "a@example.com" });
    const duplicate = await request(app)
      .post("/api/profiles")
      .send({ name: "B", email: "a@example.com" });
    expect(duplicate.status).toBe(409);
    expect(duplicate.body.error.code).toBe("DUPLICATE_RESOURCE");
  });

  test("cria avaliações, valida rating e recalcula média e quantidade", async () => {
    const profile = await request(app)
      .post("/api/profiles")
      .send({ name: "Dev", email: "rating@example.com" });
    const project = await request(app)
      .post("/api/projects")
      .send({ title: "App avaliado", profileId: profile.body.id });

    const first = await request(app)
      .post(`/api/projects/${project.body.id}/feedbacks`)
      .send({ rating: 5, comment: "Excelente" });
    expect(first.status).toBe(201);
    expect(first.body.averageRating).toBe(5);
    expect(first.body.ratingCount).toBe(1);

    const second = await request(app)
      .post(`/api/projects/${project.body.id}/feedbacks`)
      .send({ rating: 4, comment: "Muito bom" });
    expect(second.status).toBe(201);
    expect(second.body.averageRating).toBe(4.5);
    expect(second.body.ratingCount).toBe(2);

    const listed = await request(app).get("/api/projects");
    expect(listed.body.data[0].averageRating).toBe(4.5);
    expect(listed.body.data[0].ratingCount).toBe(2);
    expect(
      (await request(app).get(`/api/projects/${project.body.id}/feedbacks`))
        .body,
    ).toHaveLength(2);
  });

  test.each([0, 6, 2.5, "5"])("rejeita rating inválido: %p", async (rating) => {
    const profile = await request(app)
      .post("/api/profiles")
      .send({ name: "Dev", email: `invalid-${String(rating)}@example.com` });
    const project = await request(app)
      .post("/api/projects")
      .send({ title: "App", profileId: profile.body.id });
    const response = await request(app)
      .post(`/api/projects/${project.body.id}/feedbacks`)
      .send({ rating, comment: "Teste" });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  test("rejeita comentário vazio e informa projeto inexistente", async () => {
    const invalid = await request(app)
      .post("/api/projects/999/feedbacks")
      .send({ rating: 5, comment: " " });
    expect(invalid.status).toBe(400);
    const missing = await request(app)
      .post("/api/projects/999/feedbacks")
      .send({ rating: 5, comment: "Legal" });
    expect(missing.status).toBe(404);
    expect(missing.body.error.code).toBe("NOT_FOUND");
  });

  test("incrementa upvotes e retorna 404 para projeto inexistente", async () => {
    const profile = await request(app)
      .post("/api/profiles")
      .send({ name: "Dev", email: "vote@example.com" });
    const project = await request(app)
      .post("/api/projects")
      .send({ title: "App", profileId: profile.body.id });
    expect(
      (await request(app).put(`/api/projects/${project.body.id}/upvote`)).body
        .likes,
    ).toBe(1);
    expect(
      (await request(app).put(`/api/projects/${project.body.id}/upvote`)).body
        .likes,
    ).toBe(2);
    const missing = await request(app).put("/api/projects/999/upvote");
    expect(missing.status).toBe(404);
  });

  test("valida parâmetros de paginação, formata 404 e documenta OpenAPI", async () => {
    const invalid = await request(app).get("/api/projects?page=0&limit=101");
    expect(invalid.status).toBe(400);
    expect(invalid.body.error.code).toBe("VALIDATION_ERROR");
    const unknown = await request(app).get("/rota-inexistente");
    expect(unknown.status).toBe(404);
    expect(unknown.body.error).toMatchObject({
      code: "NOT_FOUND",
      status: 404,
    });
    const spec = await request(app).get("/api-docs.json");
    expect(spec.status).toBe(200);
    expect(spec.body.paths["/api/projects/{id}/upvote"]).toBeDefined();
    expect((await request(app).get("/api-docs/")).status).toBe(200);
  });

  test("padroniza resposta para JSON malformado", async () => {
    const malformed = await request(app)
      .post("/api/profiles")
      .set("Content-Type", "application/json")
      .send('{"name":');
    expect(malformed.status).toBe(400);
    expect(malformed.body.error.code).toBe("MALFORMED_JSON");
  });
});
