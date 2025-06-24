# 🔄 CI/CD com GitHub Actions

---

## 🎯 O que é CI/CD?

- **CI (Continuous Integration):** integrações automáticas de código.
- **CD (Continuous Deployment):** automatiza entrega em produção.
- Garantem qualidade contínua no ciclo de vida do software. 🚀

---

## ⚙️ Estrutura dos Workflows

No repositório, criamos a pasta:

```
.github/workflows/
```

Cada arquivo YAML define um pipeline.

---

## 🧪 Exemplo de Workflow de Testes Automatizados

Arquivo: `.github/workflows/tests.yaml`

```yaml
name: Automated Tests

on: pull_request

jobs:
  jest:
    name: Jest Ubuntu
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "lts/hydrogen"
      - run: npm ci
      - run: npm test
```

---

## 🎨 Exemplo de Workflow de Linting (Prettier)

Arquivo: `.github/workflows/linting.yaml`

```yaml
name: Linting Tests

on: pull_request

jobs:
  prettier:
    name: Prettier
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "lts/hydrogen"
      - run: npm ci
      - run: npm run lint:prettier:check
```

---

## 📝 Proteção de Branch com Status Checks

No GitHub:

1️⃣ Settings → Rules → Rulesets → Create Ruleset  
2️⃣ Target: branch `main`  
3️⃣ Exigir status checks de workflows  
4️⃣ Bloqueia merge enquanto houver falhas ❌

**Benefício:**  
Garante qualidade automática no código que chega na branch principal. 🔒

---

## ✅ Commitlint na CI

Validação automática de mensagens de commit (conventional commits):

```yaml
commitlint:
  name: Commitlint
  runs-on: ubuntu-latest

  steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0
    - uses: actions/setup-node@v4
      with:
        node-version: "lts/hydrogen"
    - run: npm ci
    - run: npx commitlint --from ${{ github.event.pull_request.base.sha }} --to ${{ github.event.pull_request.head.sha }} --verbose
```

---

## 🔄 Ciclo completo ao abrir um Pull Request

1️⃣ Dev cria branch ➔ Faz push ➔ Abre PR  
2️⃣ Workflows são acionados:  
- Testes automatizados.  
- Linting de código.  
- Validação de commits.  
3️⃣ Só pode fazer merge se tudo passou ✅

---

## 🎯 Vantagem profissional:

- Feedback imediato.
- Erros identificados antes de chegar em produção.
- Todo código em `main` está 100% validado automaticamente.

---

# 🚀 CI/CD profissional rodando no GitHub Actions!