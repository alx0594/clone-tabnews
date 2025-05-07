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

- Documentação Programmatic API: https://salsita.github.io/node-pg-migrate/api

**Versão 1, que será refatorada no dia 24**

Quando o método for GET, a execução das migrations serão no modo dryRun.
Quando POST, serão executadas de verdade.

```javascript
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(request, response) {
  if (request.method === "GET") {
    const migrations = await migrationRunner({
      databaseUrl: process.env.DATABASE_URL,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    });
    return response.status(200).json(migrations);
  }

  if (request.method === "POST") {
    const migrations = await migrationRunner({
      databaseUrl: process.env.DATABASE_URL,
      dryRun: false,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    });
    return response.status(200).json(migrations);
  }

  return response.status(405).end();
}
```

### Implementação test de integração

**Versão 1, que será refatorada no dia 24**

```javascript
test("POST to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  console.log(responseBody);
  expect(Array.isArray(responseBody)).toBe(true);
});
```

#### Dicas

- Execução específica dos testes. Com o comando abaixo, será executado apenas testes dentro de /migrations
  `npm run test:watch -- migrations`

- Dexiando a execução ainda mais específica, agora para executar apenas o test de post:
  `npm run test:watch -- migrations.post` (migraions.pos é uma Regex)

# Dia 24

### Tornando testes Jest serial (sequencial)

1. No package.json, adicionar o parâmetro `runInBand` nos comandos jest

   `jest --runInBand`  
   `jest --watchAll --runInBand`

### Limpando base de dados para execução dos testes

1. Limpar state do banco de dados.
2. No test de get /migrations, importar dabase.js para executar a query de limpeza do banco de dados.

   > Tem uma questão. A versão do Jest que estamos usando não suporta **_import_** ainda. Erro: **_SyntaxError: Cannot use import statement outside a module_**

   > Dessa forma, vamos criar um arquivo na raiz do projeto chmado `jest.config.js` onde o NextJS dará o super poder de import ao Jest

   > Documentação Jest com Next.js: https://nextjs.org/docs/app/guides/testing/jest

   **jest.config.js**

   ```javascript
   const dotenv = require("dotenv");
   dotenv.config({
     path: ".env.development",
   });
   const nextJest = require("next/jest");

   const createJestConfig = nextJest({
     dir: ".",
   });
   const jestConfig = createJestConfig({
     moduleDirectories: ["node_modules", "<rootDir>"],
   });

   module.exports = jestConfig;
   ```

3. No módulo de `migrations/get.test.js`, agora podemos importar `infra/database.js`

4. Em `migrations/get.test.js` criar function cleanDatabase

   ```javascript
   async function cleanDatabase() {
     await database.query("DROP schema public cascade; create schema public");
   }
   ```

5. Usar a function `beforeAll()` do Jest para executar a function `cleanDatbase()`
   `beforeAll(cleanDatabase);`

6. Fazer o mesmo processo no teste de post, incluindo import, function cleanDabase() e beforeAll()

   ```javascript
   import database from "infra/database.js";

   beforeAll(cleanDatabase);

   async function cleanDatabase() {
     await database.query("DROP schema public cascade; create schema public");
   }
   ```

## Refatorando código e testes

#### Código Concreto /migrations

1. Na function migrations definimos um spread (...defaultMigrationsOptions) definindo as propriedades de como e onde estão as migrations a serem executadas.

2. De acordo com o método de requisição GET ou POST, definiremos se as migrations serão executadas (POST) e `dryRun: false` ou apenas validadas (GET) `dryRun: true`

3. Qualquer chamada ao `/migrations` que não seja usando os método HTTP GET ou POST, deverá retornar status code 405, sem nenhum dado no corpo da requisição `.end()`

```javascript
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(request, response) {
  const defaultMigrationsOptions = {
    databaseUrl: process.env.DATABASE_URL,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(defaultMigrationsOptions);
    return response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false,
    });

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }
    return response.status(200).json(migratedMigrations);
  }

  return response.status(405).end();
}
```

#### Teste /migrations POST

1. Limpa a base de dados, excluindo o schema publica em cascata (cascade), pois existem várias dependências do schema public.

2. Em seguinda, na mesma query, recriamos o schema public, deixando a base de dados sempre limpa para executar os testes.

3. Na primeira execução de POST, esperamos que haja migrations pendentes para serem executadas (tamanho do array maior que zero) e response `[{path: 'infra/migrations/4154646464..', name: '4154646464_test-migrations', timestamp: 4154646464}]`, retornando status code 201. Executando novamente, esperamos que não haja mais migrations pendentes a serem executadas (tamanho do array seja 0) e response `[]`, retorando status code 200.

```javascript
import database from "infra/database.js";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("DROP schema public cascade; create schema public");
}

test("POST to /api/v1/migrations should return 200", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response1.status).toBe(201);

  const response1Body = await response1.json();

  expect(Array.isArray(response1Body)).toBe(true);
  expect(response1Body.length).toBeGreaterThan(0);

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response2.status).toBe(200);

  const response2Body = await response2.json();

  expect(Array.isArray(response2Body)).toBe(true);
  expect(response2Body.length).toBe(0);
});
```

#### Dicas

- Operardor spread **...** (espalhar) `...defaultMigrationsOptions` (...). Irá expalhar dentro de {} todas as propriedades que estão em **defaultMigrationsOptions**

```javascript
const defaultMigrationsOptions = {
  databaseUrl: process.env.DATABASE_URL,
  dryRun: true,
  dir: join("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};
```

```javascript
const migrations = await migrationRunner({
  ...defaultMigrationsOptions,
});
```

- Usando o operador spread, conseguimos sobrescrever qualquer propriedade dentro do objeto, por exemplo `dryRun: false`:

```javascript
const migrations = await migrationRunner({
  ...defaultMigrationsOptions,
  dryRun: false,
});
```

# Dia 25

### Iniciando com uma problemática

- No momento do projeto, nosso arquivo `.env.development` não consegue fazer interpolação de variávies de ambiente, por exemplo, $POSTGRES_USER.

- Isso seria necessário para diminuirmos a duplicação dos valores das variáveis, que também utilizamos em DATABASE_URL (connection string)

Forma atual do `.env.development`:

```yaml
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=local_user
POSTGRES_DB=local_db
POSTGRES_PASSWORD=local_password
DATABASE_URL=postgres://local_user:local_password@localhost:5432/local_db
```

- Para resolvermos isso, iniciamos instalando a dependência `npm install dotenv-expand@11.0.6`, que dará esses poderes ao arquivo `.env.development`

- Ajustando `.env.development`

```yaml
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=local_user
POSTGRES_DB=local_db
POSTGRES_PASSWORD=local_password
DATABASE_URL=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB
```

- para teste, podemos executar os scripts de UP das migrations, que depende da variável **DATABASE_URL** `npm run migration:up`

### Refatatorando `database.js` para retornar uma nova instância do banco de dados

1. Criar function `getNewClient()` e adicionar a ela a lógica de abrir conexão com banco de dados.

```javascript
async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  await client.connect();
  return client;
}
```

2. Na function `query(objectQuery)` usar a function `getNewClient()` para abrir conexão com o banco de dados `client = await getNewClient();`

3. Fazer o export das functions do módulo `database.js`

```javascript
export default {
  query,
  getNewClient,
};
```

4. O módulo completo fica dessa forma agora:

```javascript
import { Client } from "pg";

async function query(queryObject) {
  let client;
  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  await client.connect();
  return client;
}

export default {
  query,
  getNewClient,
};

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV === "production" ? true : false;
}
```

### Agora no /migrations/index.js, podemos importa database.js e usar o `getNewClient()`

1. Substituir `databaseUrl: process.env.DATABASE_URL,` pelo novo método criado `getNewClient()`

2. Declarar variável dbClient:  
   `const dbClient = await database.getNewClient();`

3. Utilizar a variável `dbClient` para compor o objeto `defaultMigrationsOptions`

```javascript
const defaultMigrationsOptions = {
dbClient: dbClient,
dryRun: true,
...
}
```

4. Pelo fato de assumirmos a responsabilidade de abrir a conexão com o banco de dados **(dbClient)**, precisamos implementar o fechamento da conexão para não cair no erro: **_Another migration is already running_**.

Tanto na verificação de ser GET quanto POST, após a execução da função migrationRunner, devemos adicionar o fechamento da conexão `await dbClient.end();`

**Exemplo:**

```javascript
if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(defaultMigrationsOptions);
    await dbClient.end(); // aqui
    ...
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false,
    });
    await dbClient.end(); // aqui
    ...
  }
```

### /migration/index.js completo

```javascript
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();

  const defaultMigrationsOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(defaultMigrationsOptions);
    await dbClient.end();
    return response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false,
    });
    await dbClient.end();
    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }
    return response.status(200).json(migratedMigrations);
  }

  return response.status(405).end();
}
```

### database.js completo

```javascript
import { Client } from "pg";

async function query(queryObject) {
  let client;
  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  await client.connect();
  return client;
}

export default {
  query,
  getNewClient,
};

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV === "production" ? true : false;
}
```

# Dia 26

### Branches Git

- 3º Nível de exemplo de compreensão

![alt text](images/git_branches_head.png)

### Criando banco de dados para Homologação.

1. Entrar onde o banco de dados está hospedado: https://console.neon.tech/

#### Via Project Dasboard

1. Em `Project` > `Dashboard`;
2. Clique em `Connect` > No modal Aberto, clique no menu de seleção `Database`, e selecione `create new database`
3. Database name: `staging`  
   Obs.: Por limitações do plano gratuíto, não podemos criar novo projeto, então optou-se por criar novo banco de dados.

#### Via Project branch

1. Em `Branch` > `Overview`
2. Logo abaixo das informações sobre a branch, há um menu com três abas: Computes|Roles & Database|Child branches;
3. Clique em Roles & Database, e depois em Add database.
4. Database name: `staging`  
   Obs.: Por limitações do plano gratuíto, não podemos criar novo projeto, então optou-se por criar novo banco de dados.

### Atualizando Vercel, ambiente `preview`

1. Vercel > Projects > clone-tabnews > settings > environment variables > `adicionar variáveis` copiadas do novo Database criado na Neon.

### Criando nova branch no repositório clone-tabnews

`fix/migrations-endpoint`  
Nesta branch trabalharemos a questão de não fechar as conexões com o banco de dados quado são realizadas requisições para o endpoint `/migrations` com métodos `HTTP` diferentes de `GET` e `POST`.

### Replicando e corrigindo o bug do enpoint /migrations

> **Cenário atual:** ao realizar requisições ao endpoint `/migrations` usando métodos HTTP diferentes de GET e POST, estão abrindo conexões com o banco de dados e não estão fechando.

#### Solução

1. Verificar quais são os métodos HTTP vindos da requisição. Se for diferente dos métodos permitidos (GET e POST), retornar status code 405. E nisso, nem entrar no passo de abrir conexão com o banco de dados.

```javascript
const allowedMethods = ["GET", "POST"];
if (!allowedMethods.includes(request.method)) {
  return response.status(405).json({
    error: `Method ${request.method} not allowed`,
  });
}
```

2. Retirar a responsabilidade dos métodos `GET` e `POST` de fechar a conexão com o banco de dados e atribuir a um bloco `finally`

**Portanto, neste momento do curso, o controller migrations/index.js está conforme abaixo. Logo será refatorado, separando as responsabilidades em seus devidos módulos:**

```javascript
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method ${request.method} not allowed`,
    });
  }
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const defaultMigrationsOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationsOptions);
      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationsOptions,
        dryRun: false,
      });
      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }
      return response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
```

#### Dicas

**Deixar branch rastreável local/origin**

`git push --set-upstream origin fix/migration-endpoint`

Esse comando ajuda a não precisar ficar colocando sempre o `origin` nos comandos de push, por exemplo, `git push origin fix/migration-endpoint`. Após o comando `--set-upstream origin`, basta usar apenas git push e as alterações serão empurradas para o repositório origin (remoto)

**Deploy manual na Vercel**

1. Acesse a aba Deployments.
2. Clique no botão de [...] para abrir as opções.
3. Selecione Create Deployment.
4. Selecionar a branch, no caso `fix-migration-endpoint`
5. O ambiente `preview` será selecionado automaticamente.

**Deployment Protection**

- https://vercel.com/alx0594s-projects/clone-tabnews/settings/deployment-protection

- Deployment protection é uma proteção implementada pela Vercel que grante que os visitantes destejam conectados ao Vercel e sejma membros da equipe.

- No promeiro momento, vamos desabilitar essa opção, assim, conseguiremos realizar o `curl` contra o endpoint `https://clone-tabnews-git-fix-migration-endpoint-alx0594s-projects.vercel.app/api/v1/status` normalmente via terminal.

**Tratamento do response como JSON no terminal usando Python**

- No comando `curl -s https://clone-tabnews-git-fix-migration-endpoint-alx0594s-projects.vercel.app/api/v1/status` adicionar um pipe (|) no final seguido do comando `python -m json.tool`

- Comando completo:
  `curl -s https://clone-tabnews-git-fix-migration-endpoint-alx0594s-projects.vercel.app/api/v1/status | python -m json.tool`

- No linux, usar **python3**

**Tratamento do response como JSON no terminal usando JQ**
`curl -s https://clone-tabnews-git-fix-migration-endpoint-alx0594s-projects.vercel.app/api/v1/status | jq`

# Dia 27

### Merge

- O git possui duas formas de merge, o `Fast-Forward` e o `3-Way Merge`

- Target Branch (Branch Alvo) do merge e Font Branch (Branch Fonte) com as alterações para realizar o marge.

- Dessa forma, a branch `main` (que estamos atualmente) é nossa target branch (HEAD) e a branch fix-migration-endpoint é nossa font branch. Logo, para fazer o merge, basta executar: `git merge fix-migration-endpoint`

![alt text](images/merge_local_fast_forward.png)

### Ajustando banco de dados na Neon

- A Neon também será nosso banco de dados para produção, logo, precisamos ajustar o que era da DigitalOcean na Vercel para apontar para Neon.

1. Na Neon, alterar database name de alxtab para production.
2. Atualizar variáveis de ambiente de production na Vercel.

#### Dicas

- Como deletar branches?
  `git branch -d <nome-da-branch>`

  - Quando usamos o `-d` o git avalia se o conteúdo da branch que será deletada foi mesclada com a branch principal. Caso não tenha sido, a deleção não é realizada.

  - Caso queira forçar a deleção, basta usar o `-D` maiúsculo.

  - **Importante**, sempre que uma branch é deletada, é retornado o hash do último commit da mesma, por exemplo (07d175c). Se a branch foi excluída por engano, podemos foltar o HEAD para esse commit novamente: `git checkout 07d175c`, log em seguida fazer que o mesmo aponte para uma branch: `git checkou -b fix-migration-endpoint`. Para fazer os dois comandos em um só, podemos fazer: `git checkout -b fix-migration-endpoint 07d175c`

  - **Importante**, o git tem uma política de limpeza [Garbage Collector - git-gc](https://git-scm.com/docs/git-gc) que só deixa esses commits pendurados sem branch por 14 dias. No entando esse tempo pode ser configurado.

  - E no cenário de eu não ter registrado o hash do commit no momento que deletei a branch? Existe um comando no git, que registra tudo que acontece com os comando git: `git reflog` **_reference log_**

  - **Verificando log com linha do tempo**: `git log --graph`

# Dia 28

### Estratégias de branch

1. Trunk-based Development
   Sempre integrar o código na branch `main`

2. **Feature Branch**
   Para cada novo recurso ou correção de bug, criar e desenvolver na `feature branch` e depois fazer o merge para a branch principal. A branch `main` sempre precisa estar pronta para ir para `produção`.

   ![alt text](images/feature-branch.png)

3. Git Flow
   Segundo o próprio idealista do modelo Git Flow, essa não é a melhor abordagem para o atual cenário de desenvolvimento, principalmente pelo fato das aplicações serem cada vez mais desenvolvidas para web e com frequência de atualização. Segundo o próprio autor, `Git Flow` se tornou um modelo legado.

   ![alt text](images/git_workflow.png)

4. Trunk-base Development

   ![alt text](images/trunk-based-2.png)

**Usaremos `Feature Branch`**

# Dia 29

**Cenário atual:** Antes de executar a aplicação, queremos subir o banco de dados e executar as migrations.  
Para tanto, a primeira abordagem foi: `"dev": "npm run services:up && npm run migration:up && next dev"`, e acabou gerando um problema.
O comando para executar as migrations inicia a execução antes do banco de dados estar totalmente disponível. Para solucionar esse apontamento, vamos criar um script js.

### Criando Script JS

1. Na pasta `infra`, criar pasta `scripts`
2. Dentro da pasta scripts, criar script `wait-for-postgres.js`
3. No `package.json`, criar execução do script: `"wait-for-posgres": "node infra/scripts/wait-for-postgres.js"`
4. Primeiro comando no script para testes:
   console.log("🔴Aguardando Postgres aceitar conexões");
5. Execução: `npm run wait-for-postgres`

**Melhorando wait-for-posgres.js**

1. No infra/compose.yaml, definir qual será o nome do container:
   `container_name: "postgres-dev"`
2. Para executar processos dentro de scripts JS, precisamos usar a dependência child_process. No script `wait-for-postres.js`, importar `require("node:child_process")` Não vamos usar import, pois esse arquivo não será transpilado.
3. No import, usaremos a `desestruturação`, trazendo o método `exec` para fora: `const { exec } = require("node:child_process");`

**O que esse script faz?**

- Ele verifica se o banco de dados Postgres está pronto para aceitar conexões, usando o comando Docker. Se ainda não estiver pronto, ele espera um pouco e tenta de novo.

- **Callback**
  `exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);`

  1. A função exec(...) executa um comando no terminal.
  2. Esse comando vai rodar de forma assíncrona — ou seja, ele não para o código, ele vai rodar em segundo plano.
  3. Quando o comando terminar (pode ser rápido ou demorar), ele chama a função handleReturn com os resultados do comando.
     - Isso é o callback: a função handleReturn é chamada quando o comando terminar.

- **Recursividade**
  Recursividade é quando uma função **chama ela mesma**.

  ```javascript
  if (stdout.search("accepting connections") === -1) {
    process.stdout.write(".");
    checkPosgres(); // Chama de novo a função checkPosgres()
    return;
  }
  ```

  - Se o banco de dados **ainda não está pronto** (a frase “accepting connections” não apareceu), ele **chama de novo a própria função** `checkPosgres`.
  - Isso continua até o Postgres finalmente responder que está pronto.

  **Script completo**

```javascript
const { exec } = require("node:child_process");

function checkPosgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);
  // Depois que terminar a execução **docker exec postgres-dev pg_isready --host localhost**, chame a função de callback **handleReturn**

  function handleReturn(error, stdout, stderr) {
    // handleReturn -> Função de callback
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write("."); // adicionando . na saída padrão stdout
      checkPosgres(); // Chama de novo a função checkPosgres()
      return;
    }
    console.log("\n🟢 Postgres está pronto e aceitando conexões\n");
  }
}

process.stdout.write("\n\n🔴 Aguardando Postgres aceitar conexões");
checkPosgres();
```

### Execução dos Testes

**Cenário atual:** Não conseguimos executar o comando `npm test` para os testes de migração sem antes subir o banco de dados e executar as migrations. Iremos trabalhar na automação para execução dos testes.

1. No package.json, atualizar o comando de **test** `"test": "npm run services:up && npm run wait-for-postgres && jest --runInBand",`

   - Só que neste ponto temos uma questão. Também precisamos que o servidor de aplicação esteja em execução para realizarmos o `fetch`. Por conta disso, iremos instalar uma dependência de concorrência `concurrently` e posteriormente orquestrar que os testes sejam executados apenas quando o servidor da aplicação esteja disponível.

2. Instalar dependência de [concorrência](https://www.npmjs.com/package/concurrently): `npm install concurrently@8.2.2`

**Primeira abordagem**

```javascript
"test": "npm run services:up && npm run wait-for-postgres && concurrently -n next,jest --hide next -k -s command-jest \"next dev\" \"jest --runInBand\"",
```

Estamos executando o script de `service:up`, em seguida o script `wait-for-postres`, ou seja, subimos o banco de dados e executamos a migration. Agora o próximo estágio é executar de forma concorrente o `next` e o `jest`. Entendendo concurrently e os parâmetros:

- `-n` nome dos serviços que serão executados em paralelos `next,jest` Caso esse parâmetro não seja definido, será retornado [0], [1], [...] na saída dos comandos.

- `--hide` para esconder a saída do `next` pois o que importa para nós é a saída do `jest`

- `-k` kill do processo do `concurrently` para não ficar prendendo o terminal.

- `-s` status de `success` de acordo com status retornado pelo jest `command-jest`

- `\"next dev\" \"jest --runInBand\"` os serviços que serão executados, no caso `next` e `jest`

#### Fazendo orquestrador para os testes

Decidido, a princípio, que o melhor local para ter o `orchestrator` é na raiz da pasta tests.

2. Na pasta tests, criar módulo `orchestrator.js`

3. No testes de get status, `get.test.js` importar o médulo **orchestrator.js** `import orchestrator from "tests/orchestrator.js";`

4. Instalar a dependência [async-retry](https://www.npmjs.com/package/async-retry) responsável por fazer a retentativa até receber o retorno 200: `npm install async-retry@1.3.3`

5. Implementar o `orchestrator.js` conforme a baixo:

```javascript
import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      const responsebody = await response.json();
    }
  }
}

export default {
  waitForAllServices,
};
```

6. Nos testes de `status` get.test.js, chamar o `orchestrator.js` antes das execuções dos testes

```javascript
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});
```

7. Nos testes de **migrations** `get.test.js` e `post.test.js` chamar o `orchestrator.js` antes das execuções:

```javascript
import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("DROP schema public cascade; create schema public");
});
```

**Para tornar os testes mais recilientes, ajustamos o timeout do jest, para não ser interrompido pelo valor default de 5 segundos**

8. Em `jest.config.js`, ajustar o tempo de espera dos tests do Jest. `testTimeout: 6000, //ms`

9. No `package.json` ajustar script de `test`, removendo a execução do script `wait-for-postgres` Agora fica conforme abaixo:

`"test": "npm run services:up && concurrently -n next,jest --hide next -k -s command-jest \"next dev\" \"jest --runInBand\"",`

### Dicas

### Função callback

Uma **função de callback** é como dizer:  
**"Quando você terminar, me chame!"**

### Saídas de programas

**stdout:** Standard Output, usado para exibir a saída normal/padrão de um programa.

**stderr:** Standard Error, usado para saída de mensagem de erro.

### Emojis VSCode no Windows.

- Atalho: `Win` + `.`

### Docker prune

Comando docker para deletar tudo e iniciar do zero: `docker system prune -a`

**Curiosidade**
Are you sure you want to continue? [y/N]  
A letra que fica em maiúsca é sempre a default caso apertemos enter.

### Exit code

**echo $?** representa o exit code do último processo que foi encerrado.
**code 130** `SIGINT` - Signal Interrupt - Interrupção de Sinal. Por exemplo, interromper uma execução com o `control + c`.

# Dia 30

Ponto de parada: https://curso.dev/web/estabilizar-npm-test-revisao-2
