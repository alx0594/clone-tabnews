# 🎯 Linting e Padronização de Código (Prettier, ESLint, Commitlint, Husky, Commitizen)

---

## 📖 Por que padronizar o código?

- Elimina discussões estéticas.
- Código fica limpo e legível por todos.
- Ajuda na manutenção e escalabilidade.

**Analogia:** Como se todos no time usassem o mesmo uniforme de qualidade. 👕

---

## 🎨 Prettier - Formatação Automática

### Instalação:

```bash
npm install --save-dev prettier
```

### Scripts no `package.json`:

```json
"scripts": {
  "lint:prettier:check": "prettier --check .",
  "lint:prettier:fix": "prettier --write ."
}
```

### Execução:

```bash
npm run lint:prettier:check
npm run lint:prettier:fix
```

---

## 🔍 ESLint - Qualidade de Código

### Instalação:

```bash
npm install eslint@8.57.0 eslint-config-next@14.2.4 --save-dev
npm install eslint-plugin-jest@28.6.0 eslint-config-prettier@9.1.0 --save-dev
```

### Arquivo `.eslintrc.json`:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:jest/recommended",
    "next/core-web-vitals",
    "prettier"
  ]
}
```

### Script no `package.json`:

```json
"scripts": {
  "lint:eslint:check": "next lint --dir ."
}
```

### Execução:

```bash
npm run lint:eslint:check
```

---

## 🏷️ Conventional Commits

### Exemplo de prefixos:

| Tipo | Significado |
| ---- | ----------- |
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `chore:` | Alterações irrelevantes |
| `ci:` | Ajustes de CI/CD |

Exemplo:

```bash
feat: adiciona tela de cadastro
fix: corrige validação de email
```

---

## 🛑 Commitlint - Validação automática dos commits

### Instalação:

```bash
npm install @commitlint/cli@19.3.0 @commitlint/config-conventional@19.2.2 --save-dev
```

### Arquivo `commitlint.config.js`:

```javascript
module.exports = {
  extends: ["@commitlint/config-conventional"],
};
```

---

## 🪝 Husky - Bloqueando commits inválidos localmente

### Instalação:

```bash
npm install --save-dev husky@9.1.4
npx husky init
```

### Criando hook `commit-msg`:

```bash
npx husky add .husky/commit-msg "npx commitlint --edit $1"
```

### Teste:

```bash
git commit -m "teste errado"
```

> ❌ Husky irá bloquear o commit se não seguir o padrão.

---

## ✨ Commitizen - Assistente interativo para commits

### Instalação:

```bash
npm install --save-dev commitizen@4.3.0
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

### Script no `package.json`:

```json
"scripts": {
  "commit": "cz"
}
```

### Executando:

```bash
npm run commit
```

> Interface interativa para escolher tipo e descrição do commit 🎯

---

## 🎯 Benefícios da padronização:

- Todos seguem o mesmo padrão.
- Evita divergência no repositório.
- Simplifica revisões e histórico do projeto.

---

# 🚀 Agora seu time programa com disciplina de empresa top-tier!