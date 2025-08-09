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


# Dia 43

### Primeira pista lenta

- Nunca assumir que o assunto segurança está tudo Ok.
- Nunca armazenar senha em texto puro.

O correto é não armazenar as senhas no banco de dados. Tá, mas como fazemos isso?

1. Usando Hash
crackstation.net (Quebra de hash de senhas comuns). Não usar senhas fracas!

2. Usando Hash + Salt
Ajudamos os usuários mesmo quando usam senhas fracas

- Bcrypt
Algoritmo usado para computar hash
Site para usar de exemplo: https://bcrypt-generator.com/

3. Usando Hash + Salt + Pepper
Além do sal (salt) também vamos apimentar (pepper) a senha do usuário.

- Pepper não deve ser salvo no banco de dados.
- O Pepper pode ser declarado em uma variável de ambiente.
- Senha + Pepper + Salt -> A partir disso é gerado o hash.

Exemplo:
No gerenciadores de senha, usado como plug-in do navegador, o bitwarden, por exemplo. Eles sempre geram uma senha de auto entropia, e quando adicionamos a essa senha, por exemplo, a letra A no início e a letra Z no final, é um tipo de pepper entre o bitwarden e o site que estou adicinando a senha.

# Dia 44

## Primeira pista lenta.

1. Criar model password.
2. Instalar dependência bcryptjs: `npm install bcryptjs@3.0.2`


## Segunda Pista Lenta

Método PUT ou Método Patch?
Por que existe do métodos para atualizar algo?
A diferença está na granularidade. 

Se a diferença está na granularidade. O correto então, quando formos atualizar o campo específico, devemos usar PATCH. Exemplo:

Se um usuário tiver: username, idade, email. E eu só quero atualizar o e-mail, o correto é usar o método HTTP PATCH.

- PATCH: Atualizar atributo específico.
- PUT: Sobrepoem o objeto anterior.

Se nos meus registros tenho o seguinte usuário:

```json
{
  "username": "alexdesouza",
  "email": "alex@gmail.com",
  "email2": "alex2@gmail.com",
}
```

E eu enviar uma requisição HTTP usando o método PUT apenas com usuário e email, o valor será sobreposto, ficando conforme abaixo:

```json
{
  "username": "alexdesouza",
  "email": "alex@gmail.com",
}
```

Por tanto, para atualização completa do objeto, usar PUT. 
Para apeans um campo específico, usar PATCH (Remendo).

### Usando testes de guerrilha

O teste de guerrilha é uma estratégia de construção do máximo de testes de falhas possíveis. Por exemplo, testar atualizar o usuário que não exite. Tentar atualizar um usuário que já existe para outro usuário, etc. Indo de cenário e cenário de erros.


### Regex Jest para teste específico:

npm run test:watch -- users/.username./patch

O ponto (.) em Regex significa qualquer caractere


### Closure

Nada mais é do que uma função dentro da outra.

async function create() {
  await userUniqueValidade();
  await emailUniqueValidade();

  async function userUniqueValidade(){};
  async function emailUniqueValidade(){};
}


### Usando Speread ... (Espalhar)

... spread. Espalhar o que tem dentro do objeto.
O que está na direita irá sobrescrever o que está na esquerda
const userWithNewValue = {...currentUser, ...userInputValues}

## Quarta Pista Lenta

### Gerando usuários automáticos para testes.

Regex para apenas teste de get: `npm run test:watch -- username./get`

Instalar Faker para geração de emails ou username: `npm install -E -D faker-js/faker@9.7.0`

Importar o faker no **orchestrator.js**
`import { faker } from @faker-js/facker`

E agora usar: `faker.internet.email(),`

O método createUser no módulo `orchestrator.js` deverá ficar conforme abaixo:

```javascript
  async function createUser(userObject) {
  return await user.create({
    username:
      userObject.username || faker.internet.username().replace(/[_.-]/g, ""), // # regex para subistituir _ . - da string username, que pode ser gerada pelo faker.
    email: userObject.email || faker.internet.email(),
    password: userObject.password || "validaPassword",
  });
}
```

Logo, nos meus testes que não diz respeito a insersão de usuário, não precisará mais realizar request de POST para adiconar usuário antes de testes de GET ou PATCH, por exemplo.

Exemplo módulo de teste:

```javascript
   test("With duplicated 'username'", async () => {
      await orchestrator.createUser({
        username: "user1",
      });
```

Regex para ajustar string de username gerada pelo faker
o `/g` significa que irá varrer a string de forma geral.

```javascript
userObject.username || faker.internet.username().replace(/[_.-]/g, ""), // # regex para subistituir _ . - da string username, que pode ser gerada pelo faker.
```