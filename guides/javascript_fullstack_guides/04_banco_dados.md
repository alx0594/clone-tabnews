# 🗄️ Banco de Dados - Postgres na Nuvem (Neon & DigitalOcean)

---

## 🎯 Objetivo

Aprender a configurar bancos de dados na nuvem e conectar o backend com segurança e boas práticas.

---

## 🐘 Por que usamos PostgreSQL?

- Banco de dados relacional extremamente robusto e maduro.
- Open Source, alta performance, suporta transações ACID.
- Amplamente usado em projetos profissionais.

---

## ☁️ Opções de Banco na Nuvem

### 1️⃣ Neon (Gratuito) 🌱

- neon.tech
- Instâncias rápidas via login GitHub.

### 2️⃣ DigitalOcean (Pago) 🌊

- digitalocean.com
- Ideal para produção com recursos profissionais.

---

## 🔐 Variáveis de Ambiente

Nunca deixar credenciais hardcoded.

Exemplo `.env.development`:

```ini
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=local_user
POSTGRES_DB=local_db
POSTGRES_PASSWORD=local_password
DATABASE_URL=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB
```

### Dotenv-expand (para interpolação automática)

```bash
npm install dotenv-expand
```

---

## 🔒 Conexão com SSL (Segurança na nuvem)

Certificados autoassinados:

1️⃣ Baixar `ca-certificate.crt` da DigitalOcean.  
2️⃣ Transformar o certificado em uma única linha `\n`.  
3️⃣ Adicionar variável:

```ini
POSTGRES_CA="(certificado formatado)"
```

4️⃣ Ajustar código `database.js`:

```javascript
function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return { ca: process.env.POSTGRES_CA };
  }
  return process.env.NODE_ENV === "production" ? true : false;
}
```

---

## ⚙️ Conexão dinâmica com getNewClient()

```javascript
import { Client } from "pg";

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

---

## 🔑 Boas práticas de segurança

- Nunca comitar `.env` no repositório!
- Variáveis por ambiente (dev, stage, prod).
- Limitar permissões no banco (ex: usuários read-only).

---

# 🎯 Agora seu backend fala fluentemente com o banco na nuvem! 🚀