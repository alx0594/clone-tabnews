import email from "infra/email.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();
    await email.send({
      from: "FinTab <contato@fintab.com.br>",
      to: "contato@gmail.com",
      subject: "Teste de assunto",
      text: "Teste de Corpo.",
    });

    await email.send({
      from: "FinTab <contato@fintab.com.br>",
      to: "contato@gmail.com",
      subject: "Último email enviado",
      text: "Último email",
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<contato@fintab.com.br>");
    expect(lastEmail.recipients[0]).toBe("<contato@gmail.com>");
    expect(lastEmail.subject).toBe("Último email enviado");
    expect(lastEmail.text).toBe("Último email\r\n");
  });
});
