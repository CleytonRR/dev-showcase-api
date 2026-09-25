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
    expect(response.body.details.length).toBeGreaterThan(0);
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
    const listed = await request(app).get("/api/projects");
    expect(listed.status).toBe(200);
    expect(listed.body[0].profile.name).toBe("Dev");
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
    expect((await request(app).get("/api/profiles/999")).status).toBe(404);
    await request(app)
      .post("/api/profiles")
      .send({ name: "A", email: "a@example.com" });
    const duplicate = await request(app)
      .post("/api/profiles")
      .send({ name: "B", email: "a@example.com" });
    expect(duplicate.status).toBe(409);
  });
});
