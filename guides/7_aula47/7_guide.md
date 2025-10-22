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


