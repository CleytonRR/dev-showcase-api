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

O arquivo `.env` não deve conter segredos compartilhados nem ser enviado ao Git. TLS é ativado automaticamente para endereços PostgreSQL remotos; conexões locais (`localhost`, `127.0.0.1` ou `::1`) usam conexão sem TLS. `DATABASE_SSL=true` força TLS e `DATABASE_SSL=false` o desativa explicitamente.

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
| POST   | `/api/projects/:id/feedbacks`       | Cadastra avaliação: `rating` (inteiro 1–5), `comment`                                   |
| GET    | `/api/projects/:id/feedbacks`       | Lista avaliações com nota                                                               |
| PUT    | `/api/projects/:id/upvote`          | Incrementa em um a quantidade de curtidas                                               |

`GET /api/projects` aceita `technologyId`, `page` (padrão 1) e `limit` (padrão 10, máximo 100). Retorna `{ "data": [...], "pagination": { "page": 1, "limit": 10, "total": 0, "totalPages": 0 } }`.

Avaliações novas devem conter `rating` inteiro de 1 a 5 e `comment` não vazio. A média aritmética é recalculada a cada avaliação e arredondada para duas casas; feedbacks legados sem nota não afetam a média. Cada chamada de upvote incrementa `likes`; como não há autenticação, votos repetidos não são deduplicados. A migração não atribui notas artificiais ao histórico.

Erros seguem `{ "error": { "status": 400, "code": "VALIDATION_ERROR", "message": "...", "details": [] } }`. Entradas inválidas retornam `400`, recursos ausentes `404`, valores únicos duplicados `409`; erros `500` não expõem detalhes internos. URLs devem ser válidas quando fornecidas. Projeto e tecnologias são associados em uma transação.

Documentação interativa: `http://localhost:3000/api-docs`; documento OpenAPI JSON: `http://localhost:3000/api-docs.json`.

Após obter a migração nova, aplique-a com `npm run db:migrate` antes de iniciar uma base já existente.

## Testes

Execute `npm test`. Os testes usam SQLite em memória; a execução da API e das migrações usa PostgreSQL.

## Insomnia

Importe `insomnia/DevShowcase.insomnia.json` no Insomnia. A coleção inclui requests com bodies de exemplo e casos inválidos. Para os requests que dependem de relacionamentos, execute primeiro `Create profile` e `Create technology`, depois `Create project` e os requests de feedback. Os exemplos usam IDs `1`, então ajuste os IDs no body/URL se o banco já tiver registros. A variável `base_url` está definida como `http://localhost:3000` no ambiente da coleção.

## Relacionamentos

- Perfil 1:N Projetos
- Projeto N:N Tecnologias (`project_technologies`)
- Projeto 1:N Feedback
