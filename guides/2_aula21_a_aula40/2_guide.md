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
          return process.env.NODE_ENV === "development" ? false : true;
        }
        ```

      - Parâmetro SSL

        `ssl: getSSLValues(),`

      - Funcionou localmente. Agora adiconar variável de ambiente `POSTGRES_CA` com o certificado, na Vercel.

### Dicas

Comando git para restaurar alterações: `git restore .` onde o ponto (.) indica que é para restaurar tudo.

Ou simplemente de um arquivo `git restore .env.development `

# Dia 22

## Migrations

1. "Proíbido alterações manuais no banco de dados"
2. Criar arquivo de migração
3. _up_ para fazer alterações
4. _down_ para desfazer alterações

### Instalar dependência

`npm install node-pg-migrate@6.2.2`

**node-pg_migrate**
https://salsita.github.io/node-pg-migrate/getting-started

**node-pg_migrate cli**
https://salsita.github.io/node-pg-migrate/cli

### Adicionar spcripts no package.json

`"migration:create": "node-pg-migrate --migrate-dir infra/migrations create"`

**_--migrate-dir_**: diretório onde as migrations serão criadas, opção reduzida do comando seria `-m`

### Executar comando do script

`npm run migration:create` **_first migrate test_**

**first migrate test** é o nome da migrate que quero criar.

Migration criada: **_clone-tabnews/migrations/1745879255524_first-magrate-test.js_**

**Entendendo o Arquivo Criado**

1. **1745879255524**: Unix timestamp do momento exato da criação do arquivo da migration

2. **first-magrate-test.js**: Nome do arquivo passado como argumento na execução do comando npm run:migration create <nome>

3. Conteúdo que compoem um arquivo de migration

   ```javascript
   exports.shorthands = undefined;

   exports.up = (pgm) => {};

   exports.down = (pgm) => {};
   ```

   **UP**: Aplicando alterações de forma crescente, para cima. Ex.: criar tabela `user`, altera a coluna `idade`

   **DOWN**: Apliquei uma migration, mas foi um erro aplicar ela, desfazer operação.

### Criar script que faz up das migrations no package.json

`"migration:up": "node-pg-migrate -m infra/migrations up"`

**Apresentou erro de credenciais, seguiremos os passos abixo para corrigir**

1. Instalar dotenv para auxiliar o módulo **node-pg-migrate**
   `npm install dotenv@16.4.4`

2. No comando de **UP** adicionar .envPath .env.development
   `"migration:up": "node-pg-migrate --migrate-dir infra/migrations --envPath .env.development up"`

3. Em `.env.development`, adiconar variável `DATBASE_URL` (connection string)

**Exemplo connection string:** protocolo://user:password@host:port/database

```
Protocolo: postgres
user: local_user
password: local_password
host: localhost
port: 5432
database: local_db
```

**Connection string:**
`postgres://local_user:local_password@localhost:5432/local_db`

3. Executar migration
   `npm run migration:up`

## Migrations parte 2

**Dry Run**: Executar as migrations, sem executar de verdade, de "metira". Só para ver o que seria executado se tivesse executado de "verdade" (GET) /migrations

**Live Run**: Execução das migration de verdade (POST) /migrations

### Criando testes de integração e endpoint /migrations

1.  Dentro da pasta test/integration, criar `migrations/get.test.js`
2.  Em **migrations/get.test.js**, adicionar chamada ao endpoint /migrations
    `http://localhost:3000/api/v1/migrations`
3.  A primeira versão do teste ficará conforme abaixo:

    ```javascript
    test("GET to /api/v1/migrations should return 200", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations");
      expect(response.status).toBe(200);
    });
    ```

4.  Neste momento, os testes deverão estar retornando 404. Agora vamos implementar o endpoint /migrations.

5.  Em **pages/api/v1**, criar api para migrations `/migrations/index.js`

6.  Faremos o `export default` já na assinatura da function

    ```javascript
    export default async function migrations(request, response) {
      response.status(200).json({});
    }
    ```

7.  Agora os testes deverão retornar sucesso!

### Implementação migrations/index.js

### Implementação test de integração

#### Dicas

- Execução específica dos testes. Com o comando abaixo, será executado apenas testes dentro de /migrations
  `npm run test:watch -- migrations`
