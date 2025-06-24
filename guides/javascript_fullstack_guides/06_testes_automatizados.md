# 🧪 Testes Automatizados com Jest (Unitário e Integração)

---

## 🎯 Por que testar?

- Confiança contínua no código.
- Evita regressões ao alterar funcionalidades.
- Permite refatorar com segurança.

**Analogia:** Testes são o cinto de segurança do seu projeto 🔒

---

## 🛠️ Instalando Jest no projeto

```bash
npm install jest@29.6.2 --save-dev
```

---

## 📂 Estrutura de pastas de testes

```
tests/
 ┣ unit/
 ┗ integration/
```

| Tipo | Descrição |
| ---- | --------- |
| Unit | Testa funções isoladas |
| Integration | Testa interação entre módulos/sistemas |

---

## 📝 Primeiro teste unitário simples

### Exemplo: arquivo `calculadora.js`

```javascript
function somar(a, b) {
  return a + b;
}
module.exports = { somar };
```

### Arquivo de teste `calculadora.test.js`

```javascript
const { somar } = require("../models/calculadora.js");

test("somar 2 + 2 deve retornar 4", () => {
  expect(somar(2, 2)).toBe(4);
});
```

---

## 🔄 Modo watch (execução automática)

### Scripts no `package.json`:

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watchAll"
}
```

### Execução contínua:

```bash
npm run test:watch
```

---

## 🧪 Testes de Integração com o Banco de Dados

Limpeza do banco antes dos testes:

```javascript
beforeAll(async () => {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
});
```

### Exemplo de teste de API:

```javascript
test("GET /api/v1/status deve retornar 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);
});
```

---

## ⚙️ Configurando Jest com Next.js

### Arquivo `jest.config.js`:

```javascript
const dotenv = require("dotenv");
dotenv.config({ path: ".env.development" });
const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "." });
const jestConfig = createJestConfig({ moduleDirectories: ["node_modules", "<rootDir>"] });

module.exports = jestConfig;
```

---

## 💡 Dicas práticas de expert

- Isole dependências externas nos testes unitários.
- Prefira integração programática nas APIs durante testes.
- Testes de integração validam o ciclo real completo da aplicação 🔄

---

# 🎯 Agora você testa com confiança e disciplina profissional! 🚀