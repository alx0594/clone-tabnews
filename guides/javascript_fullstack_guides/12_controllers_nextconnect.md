# 🧭 Padronização de Controllers com Next-connect (Next.js Fullstack)

---

## 🎯 Problema clássico em APIs REST no Next.js

- API Routes nativas ficam verbosas com múltiplos métodos HTTP.
- Não oferecem suporte nativo a middlewares reutilizáveis.

---

## 🧰 Solução elegante: `next-connect`

- Middleware leve para Next.js API Routes.
- Permite modularizar os handlers por método HTTP.
- Facilita reutilizar middlewares como autenticação, validação, logs.

### Instalação:

```bash
npm install next-connect@0.13.2
```

---

## 🏗️ Exemplo de controller com next-connect

```javascript
import nc from "next-connect";
import database from "infra/database";
import { InternalServerError } from "infra/errors";

const handler = nc();

handler.get(async (req, res) => {
  try {
    const result = await database.query("SELECT version();");
    res.status(200).json(result.rows);
  } catch (error) {
    const publicError = new InternalServerError({ cause: error });
    res.status(500).json(publicError);
  }
});

export default handler;
```

---

## 🧹 Benefícios claros

- Clareza: handlers separados por método.
- Reaproveitamento: middlewares reutilizáveis.
- Escalável: fácil manutenção em APIs grandes.
- Padrão: mesmo estilo de controllers no backend inteiro.

---

## 🛠️ Exemplo adicionando middleware (logger simples)

```javascript
const logRequest = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const handler = nc().use(logRequest);
```

> Agora todo request passará pelo logger antes dos handlers! 🔎

---

## 🔑 Dicas de expert

- Use `next-connect` sempre que criar APIs REST no Next.js.
- Mantenha middlewares desacoplados (ex.: `middlewares/auth.js`).
- Evite código duplicado entre rotas.

---

# 🚀 Agora suas APIs são modulares, escaláveis e profissionais!