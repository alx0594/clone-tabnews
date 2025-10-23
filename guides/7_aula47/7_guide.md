# Aula 47

## Primeira Pista Lenta

### Como e-mails realmente funcionam

Para entender como de fato e-mails funcionam, podemos fazer uma analogia ao serviço de correios.
Não entregamos uma carta diretamente ao destinatário, primeiro a carta é entregue à agência mais próxima do emitente.
Em seguida, a carta é enviada para uma agência do correios mais próxima do destinário. E por fim, um carteiro leva a carta até o destinatário.

Abaixo segue fluxo de como um e-mail é enviado:

![alt text](fluxo-email.png)

![alt text](e-mail-dns-ip.png)

### Verificando IP de um e-mail

`dig MX curso.dev`   
Após o comando, verificar o IP de maior prioridade, o que tiver menor número (1)(5)(10)...  

`dig A aspmx.l.google.com`
Verificando Address

### Protocolo de comunicação de e-mails

SMTP - Simple Mail Transfer Protocol (Protocolo Simples de Transferência de Correspondência)

IMAP - Internet Message Access Protocol (Protocolo de Acessos a Mensagens da Internet)

![alt text](comunicacao.png)


## Segundo Pista Lenta

### Configurar mailcatcher no compose.yaml

- Adicionar serviço de `mailcatcher` no `compose.yaml`

```yaml
 mailcatcher:
    container_name: "mailcatcher-dev"
    image: "sj26/mailcatcher"
    ports:
      - "1025:1025"
      - "1080:1080"
```
- Executar `npm run dev` para subir os serviços.
- Acessar inteface web do mailcatcher: `localhost:1080`

### Enviar e-mail usando telnet

telnet - Telecommunication Network (Abre comunicação entre dois pontos)

- telnet localhost 1025 (Na porta 1025 temos o servidor de FTP). **Response: 220 EventMachine SMTP Server**
- Após o telnet, começar a interagir com o SMTP Server para enviar e-mail pelo terminal.
  1. HELO Alex
  2. MAIL FROM:<alex94tu@gmail.com> (Sim, aceita qualquer e-mail)
  3. RCPT TO:<alex94tu@gmail.com>
  4. DATA
  5. Subject: Teste por Telnet
  6. Aqui terá um espaço em branco. Dar mais um enter.
  7. Escrever corpo do e-mail
  8. Enviar email, basta digitar .
  9. Finalizar com QUIT

## Terceira Pista Lenta

O fato de se comunicar através do protocolo SMTP fugimos de **Vendor Lock in** pois o protocolo é padronizado, logo, podemos trocar 
o serviço de e-mail e continuar usando o mesmo mecanismo de comunicação.

1. Instalar Biblioteca `npm install -E nodemailer@7.0.5`
2. Na pasta `infra`, criar um módulo para email: `email.js`
3. Na pasta `tests/integration`, criar pasta `infra` e adicionar `email.test.js`

- Implementar testes de integração com o e-mail:

```javascript
import email from "infra/email.js";

describe("infra/email.js", () => {
  test("send()", async () => {
    await email.send({
      from: "FinTab <contato@fintab.com.br>",
      to: "contato@gmail.com",
      subject: "Teste de assunto",
      text: "Teste de Corpo.",
    });
  });
});
```

- Construção do módulo de email

```javascript
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_HOST,
  port: process.env.EMAIL_SMTP_PORT,
  auth: {
    user: process.env.EMAIL_SMTP_USER,
    pass: process.env.EMAIL_SMTP_PASSWORD,
  },
  secure: process.env.NODE_ENV === "production" ? true : false,
});

async function send(mailOptions) {
  await transporter.sendMail(mailOptions);
}

const email = {
  send,
};

export default email;

```

## Quarta Pista Lenta

### Entendendo uma funcionalidade que não está documentada na API

A funcionalidade de clear não está documentada para uso na API do mailcatcher. 

Mas existe uma forma de encontrarmos como é feito, uma vez que um client (navegador) consegue fazer, há grande probabilidade de usarmos como API.

1. No navegador, usar o modo desenvolvedor (F12). localhost:1080
2. Clicar na Aba Network
3. Realizar a ação (No caso, clicar no botão clear)
4. A esquerda, clicar no evento realizado, posteriormente a direita em Headers, verificar o que foi realizado.

Request URL: http://localhost:1080/messages
Request Methodo: DELETE
Status Code: 204

### Adicionar funcionalidade de limpar caixa de e-mail nos testes

No orchestrator.js, adiconar function abaixo:

```javascript
async function deleteAllEmails() {
  await fetch(
    `http://${process.env.EMAIL_HTTP_HOST}:${process.env.EMAIL_HTTP_PORT}/messages`,
    {
      method: "DELETE",
    },
  );
}
```




