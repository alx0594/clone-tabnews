# Dia 41

## Primeira Pista Lenta

- Criar branch model-user
- Apagar migration de teste /infra/migrations/....teste-migrations
  `git rm infra/migrations/1746050980513_test-migrations.js`
- Estruturar testes integrados para migration de users. `tests\integration\api\v1\users\post.test.js`
- Por hora, criar migrations para users usando o npm: `npm run migrations:create create users`
- No arquivo de migrations user criado, criar tabela **users**
- Ajustar orchestrator para executar as migrations antes de iniciar os testes, visto que a base de dados é limpa a cada teste.

**Orchestrator**  

```javascript
async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}
```

**post.test.js**

```javascript
import orchestrator from "tests/orchestrator.js";
import database from "infra/database";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});
```

**Tabela users**   

```javascript
/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    // Para referência, GitHub limita usernames para 39 caracteres
    username: {
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },

    // Por que 254? https://stackoverflow.com/a/1199238
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },
    // Por que 72? https://security.stackexchange.com/q/39849
    password: {
      type: "varchar(72)",
      notNull: true,
    },

    // Timestamp com time zone: timestamptz
    // Sempre use timestamp com time zone: https://justatheory.com/2012/04/postgres-use-timestamptz/
    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },

    updated_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
  });
};

exports.down = false;

```

**Testanto INSERT temporário pelo módulo de testes**  

```javascript
import orchestrator from "tests/orchestrator.js";
import database from "infra/database";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      await database.query({
        text: "INSERT INTO users (username, email, password, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)",
        values: ["alexdesouza", "alex94tu@gmail.com", "senha123"],
      });
      const users = await database.query("SELECT * FROM users");

      console.log(users.rows);
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
      });
      expect(response.status).toBe(201);
    });
  });
});

```

## Segunda Pista Lenta

### Rota

- Criar /api/v1/users/index.js

### Controller

### Model

### Testes Integrados

- Instalar dependência uuid, para trabalhar com o id da tabela user que está nesse formato.

- No teste post do user, importar `version` de `uuid`

### Dicas

**UUID** - Universally Unique Identifier (Identificador Único Universal)

**varchar** - Variable Character (Caracter variável)

**JSON.stringify({})** - Pega um objeto JavaScript e converte ele para uma string em Json.


# Dia 42

### Segunda pista lenta

`git rebase -i 7397ef542928b55a286a97ca86ff7c826636b6f7^`
Onde iremos fazer a refatoração da tabela User.
O `^` é usado para chegarmos no commit em questão. Ou poderiamos pegar o commit anterior. Teria o mesmo efeito. `git rebase -i 22564db01cc2170d17d3efdb6ea37d8440aea71f`

Por fim, `git commit --amend` e `git rebase --continue`

No Banco de dados Neon, foi necessário excluir a tabela pgmigrations para remover os testes de migração realizado anteriormente.

Projeto >> Editor SQL: DROP table pgmigrations. Tanto para stating quanto para production.

**REQBIN**

https://reqbin.com/

POST para:
https://clone-tabnews-git-model-user-alx0594s-projects.vercel.app/api/v1/migrations

Assim, será executada as migrations em staging

Criar usuário:
POST

https://clone-tabnews-git-model-user-alx0594s-projects.vercel.app/api/v1/users

{
  "username": "Alex",
  "email": "alex@gmail.com",
  "password": "senha123"
}
