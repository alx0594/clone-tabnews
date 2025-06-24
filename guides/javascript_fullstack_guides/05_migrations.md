# 🔄 Migrations com node-pg-migrate

---

## 🎯 O que são Migrations?

Migrations (migrações) são scripts versionados que:

- Aplicam alterações controladas no banco de dados.
- Garantem versionamento do esquema (tabelas, colunas, constraints...)
- Permitem reproduzir o estado do banco em qualquer ambiente (dev, staging, produção).

**Analogia:** Histórico de mudanças no banco, como o Git faz com seu código 🔖

---

## 🛠️ Instalando node-pg-migrate

```bash
npm install node-pg-migrate@6.2.2 --save-dev
```

---

## 🚀 Criando Migrations

### Script no `package.json`:

```json
"scripts": {
  "migration:create": "node-pg-migrate --migrate-dir infra/migrations create"
}
```

### Criar nova migration:

```bash
npm run migration:create nome-da-migration
```

Exemplo de arquivo gerado: `infra/migrations/1745879255524_criar-tabela-user.js`

---

## 🏗️ Estrutura de uma Migration

```javascript
exports.up = (pgm) => {
  pgm.createTable("users", {
    id: { type: "serial", primaryKey: true },
    name: { type: "varchar(100)", notNull: true },
    created_at: { type: "timestamp", default: pgm.func("now()") }
  });
};

exports.down = (pgm) => {
  pgm.dropTable("users");
};
```

---

## 🔄 Executando Migrations programaticamente (API Next.js)

### Exemplo via API:

```javascript
import migrationRunner from "node-pg-migrate";
import { join } from "path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();

  const defaultOptions = {
    dbClient,
    dir: join("infra", "migrations"),
    direction: "up",
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    const dryRunMigrations = await migrationRunner({ ...defaultOptions, dryRun: true });
    await dbClient.end();
    return response.status(200).json(dryRunMigrations);
  }

  if (request.method === "POST") {
    const appliedMigrations = await migrationRunner({ ...defaultOptions, dryRun: false });
    await dbClient.end();
    return response.status(201).json(appliedMigrations);
  }

  return response.status(405).end();
}
```

---

## ⚠️ Cuidados importantes

- Nunca alterar banco manualmente.
- Deploys sempre passam pelas migrations automatizadas.
- Evita divergência entre ambientes.

---

## 🧪 Migrations nos testes automatizados

Limpeza de banco antes dos testes:

```javascript
beforeAll(async () => {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
});
```

---

# 🎯 Agora você controla o schema do banco com versionamento seguro!