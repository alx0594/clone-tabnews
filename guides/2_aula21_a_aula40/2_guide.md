# Dia 21

## Aplicação em Produção

### Cenário atual

**Erro**  
No cenário atual a aplicação está retornando erro 500 na chamada à API: https://alxtab.com.br/api/v1/status.
O erro se deve á última atualização, onde o módulo de status/index.js interage com o banco de dados local.

**Verificar log na Vercel**
Acessar o Projeto >> Logs.
No log (produção) temos erro de conexão com o banco de dados (local): **_Error: connect ECONNREFUSED 127.0.0.1:5432_**

**Destrinchando ECONNREFUSED**

- **E**: Error
- **CONN**: CONNECTION
- **REFUSED**: REFUSED  
  Por tanto, Erro de conexão recusada.

### Banco de dados em Produção

- [x] ElephantSQL (gratuíto)
- [x] [Neon](https://neon.tech/) (gratuíto)
- [x] [DigitalOcean](https://www.digitalocean.com/) (pago)

#### Neon

- Auth usando GitHub
- Project Name: QWx4VGFiCg==
- Branch: production
- DabaseName: YWx4dGFiCg==
- Owner: neondb_owner
- Pegar parâmetros de conexão
- Adicionar propriedade ssl: true em database.js

```javascript
ssl: process.env.NODE_ENV === "development" ? false : true,
```

- Na Vercel, configurar variáveis de ambiente do Banco de dados fornecidos pela Neon.

- Vercel >> Project (clone-tabnews) >> Settings >> Environment Variables >> Apenas Production [x] >> Adicionar Variáveis >> Save.

- Em Demployments, fazer redeploy para aplicação pegar as variáveis de ambiente.

#### DigitalOcean

- Auth usando GitHub
- Project Name: QWx4VGFiCg==
- Branch: production
- DabaseName: YWx4dGFiCg==
- Necessário adiconar forma de pagamento.

  ### Passos

  1. Deploy in database
  2. No menu database >> Postgres 16
  3. Nome da instância do banco de dados: production-postgres
  4. Create Database Cluster
  5. Atualizar variáveis de ambiente na Vercel, com base no que a Digital Ocean forneceu.

  ### Passos certificado autoassinado

  **Erro após apontar para o servidor de banco de dados da DigitalOcean:**

  ```
  Error: self-signed certificate in certificate chain
  code: 'SELF_SIGNED_CERT_IN_CHAIN'
  ```

  **Adicionar Certificado**

  1.  Baixar certificado da DigitalOcean `ca-certificate.crt`
  2.  Simular erro no ambiente local. Atualizar .env.development com as credenciais do banco de dados da DigitalOcean

  3.  Chamar o endpoint: `http://localhost:3000/api/v1/status`

      - Exato mesmo erro de produção:  
        `Error: self-signed certificate in certificate chain`

  4.  Para consertar, criaremos uma function adicionando o certificado autoassinado.

      - Ajustar conteúdo do certificado autoassinado para ficar na mesma linha.

      - Para fazer isso, basta selecionar a quebra de linha (\n) invisível de cada linha. Selecionar a primeira e ir para as próximas usando crtl + d. Substituir toda a seleção por `\n`. Isso fará que todo conteúdo vá para mesma linha automaticamente.

      - Criar variável de ambiente `POSTGRES_CA` em `.env.development` e adicionar a linha com o certificado em base64 dentro de aspas duplas para os caracteres especiais serem interpretados.

      - Function getSSLValues()

        ```javascript
        function getSSLValues() {
          if (process.env.POSTGRES_CA) {
            return {
              ca: process.env.POSTGRES_CA,
            };
          }
          return process.env.NODE_ENV === "development" ? true : true;
        }
        ```

      - Parâmetro SSL

        `ssl: getSSLValues(),`

      - Funcionou localmente. Agora adiconar variável de ambiente `POSTGRES_CA` com o certificado, na Vercel.

### Dicas

Comando git para restaurar alterações: `git restore .` onde o ponto (.) indica que é para restaurar tudo.

Ou simplemente de um arquivo `git restore .env.development `
