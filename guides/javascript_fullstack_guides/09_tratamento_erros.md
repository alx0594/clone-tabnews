# 🚨 Tratamento de Erros Customizados (JavaScript Fullstack)

---

## 🎯 Por que criar erros customizados?

- Padroniza as respostas de erro para o frontend.
- Facilita debugging e suporte.
- Separa erros de validação, lógicos e internos.

**Analogia:** Como categorizar tipos de alerta em um hospital 🏥

---

## 🏗️ Criando uma classe de erro customizada

### Exemplo: `InternalServerError`

```javascript
export class InternalServerError extends Error {
  constructor({ cause }) {
    super("Um erro interno não esperado aconteceu.", { cause });
    this.name = "InternalServerError";
    this.action = "Entre em contato com o suporte";
    this.statusCode = 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode
    };
  }
}
```

---

## 🔧 Uso prático no controller API

```javascript
import database from "infra/database.js";
import { InternalServerError } from "infra/errors.js";

async function status(request, response) {
  try {
    const result = await database.query("SELECT version();");
    response.status(200).json(result.rows);
  } catch (error) {
    const publicError = new InternalServerError({ cause: error });
    console.error(publicError);
    response.status(500).json(publicError);
  }
}

export default status;
```

---

## 🔄 Benefício no Frontend

Exemplo de resposta padronizada:

```json
{
  "name": "InternalServerError",
  "message": "Um erro interno não esperado aconteceu.",
  "action": "Entre em contato com o suporte",
  "status_code": 500
}
```

---

## 🔑 Dicas de expert:

- Não retornar stack trace em APIs públicas.
- Manter logs detalhados no backend.
- Criar subclasses: `ValidationError`, `UnauthorizedError`, `ConflictError`, etc.

---

# 🎯 Agora seu backend responde com erros profissionais e seguros!