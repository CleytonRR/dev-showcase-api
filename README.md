# DevShowcase API

API REST em Node.js, Express e Sequelize para perfis de desenvolvedores, projetos, tecnologias e feedback.

## Requisitos

- Node.js 18 ou superior
- PostgreSQL 13 ou superior

## Configuração

1. Instale as dependências com `npm install`.
2. Configure `DATABASE_URL` no `.env`, por exemplo `postgres://postgres:senha@localhost:5432/devshowcase`. O arquivo `.env.example` mostra o formato.
3. Crie o banco `devshowcase` no PostgreSQL.
4. Aplique o esquema com `npm run db:migrate`.
5. Inicie em desenvolvimento com `npm run dev` ou em produção com `npm start`.

O arquivo `.env` não deve conter segredos compartilhados nem ser enviado ao Git. Use `DATABASE_SSL=true` se o provedor PostgreSQL exigir TLS.

## Endpoints

| Método | Caminho                             | Descrição                                                                               |
| ------ | ----------------------------------- | --------------------------------------------------------------------------------------- |
| GET    | `/health`                           | Verificação de disponibilidade                                                          |
| POST   | `/api/profiles`                     | Cadastra perfil: `name`, `email`; opcionais `bio`, `avatarUrl`                          |
| GET    | `/api/profiles/:id`                 | Busca perfil com projetos, tecnologias e feedback                                       |
| POST   | `/api/technologies`                 | Cadastra tecnologia: `name`; opcional `category`                                        |
| GET    | `/api/technologies`                 | Lista tecnologias                                                                       |
| POST   | `/api/projects`                     | Cadastra projeto: `title`, `profileId`; opcionais `description`, `url`, `technologyIds` |
| GET    | `/api/projects`                     | Lista projetos com perfil, tecnologias e feedback                                       |
| POST   | `/api/projects/:projectId/feedback` | Cadastra feedback: `author`, `content`                                                  |
| GET    | `/api/projects/:projectId/feedback` | Lista feedback do projeto                                                               |

Entradas inválidas retornam `400`, recursos ausentes `404` e valores únicos duplicados `409`. URLs devem ser válidas quando fornecidas. Projeto e tecnologias são associados em uma transação.

## Testes

Execute `npm test`. Os testes usam SQLite em memória; a execução da API e das migrações usa PostgreSQL.

## Insomnia

Importe `insomnia/DevShowcase.insomnia.json` no Insomnia. A coleção inclui requests com bodies de exemplo e casos inválidos. Para os requests que dependem de relacionamentos, execute primeiro `Create profile` e `Create technology`, depois `Create project` e os requests de feedback. Os exemplos usam IDs `1`, então ajuste os IDs no body/URL se o banco já tiver registros. A variável `base_url` está definida como `http://localhost:3000` no ambiente da coleção.

## Relacionamentos

- Perfil 1:N Projetos
- Projeto N:N Tecnologias (`project_technologies`)
- Projeto 1:N Feedback
