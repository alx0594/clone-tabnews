# Dia 31

## Primeira Pista lenta

### Criar processo de CI com GitHub Actions.

1. Criar nova branch chamada `actions`
2. Criar pasta de workflows: `.github/workflows`
3. Criar workflow `tests.yaml`

**Workflow de Tests**

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

#### Configurar Regra de permitir merge apenas quando a action de teste der sucesso

1. No `settings` do repositório > Rules > RuleSets.
2. Nome da Ruleset: `Branch main` > `Active`
3. Em `target` branch, add `branch default`.
4. Em **branch roles**, selecionar `Require a pull request before merging`
5. Em **branch roles**, selecionar `Require status checks to pass` (obrigado que a verificação de status passem)
6. Em `Require status checks to pass` + **Add checks** > Adicionar nome do Job, no caso: `Jest Ubuntu`
7. `Create` (Criar conjunto de regras)
   [regra criada](https://github.com/alx0594/clone-tabnews/settings/rules/5372543)

**Check Status**  
![alt text](images/status_checks_to_pass.png)

**Enquanto estiver com falhar, botão de merge desabilitado**

![alt text](images/merge_disable.png)

#### Dicas

**Qual a diferença entre `npm ci` e `npm install`**

**npm install:** Resolve, re-calcula as dependências encontradas no `package.json` (Irá devolver resultados diferentes se houver pacotes atualizados ao longo do caminho)
**npm ci:** Irá usar exatamente as dependências descritas no `package-lock.json` (Sempre irá devolver o mesmo resultado ao longo do tempo). Dessa forma, torna-se importante fazer o commit do `package-lock.json`

**Executando comando git de uma só vez**

`git add -A && git commit --amend --no-edit && git push -f`

## Segunda Pista Lenta.

### Criar Worflow para o Lint

1. Criar branch `lint-format-action`
2. Criar workflow: `linting.yaml`
3. No `package.json`, alterar o nome do script de lint para: `lint:prettier:check` e `lint:prettier:fix`

**Workflow de Lint**

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

### Branch Protection para o Prettier

1. Settings > Rules > Rulesets
2. Entrar na Rulset que já temos para branch main.
3. Em `Require status checks to pass` adicionar Job: `Prettier`.
4. `Save changes`

![alt text](images/status_chek_prettier.png)

> Na aba de checks da Pull Request tem todos os checkes que a Pull Request passou. Exemplo: `https://github.com/alx0594/clone-tabnews/pull/18/checks`

#### Dicas

#### Formatadores

**pré-formatador de estilização:** Editor Config (.editorconfig)
**pós-formatador de estilização:** Prettier (Estilização após salvar o arquivo com o código)
**pós-formatador de qualidade:** ESLint.

##### Comando para mudar só a data do commit

`git commit --amend --date=now`

## Terceira Pista Lenta.

### Configurando ESLint

**ESLint:** encontra e conserta problemas no código JavaScript.
[ESLint](https://eslint.org/docs/latest/rules)

**ESLint Integração com NEXT.js**
[NextJS e ESLint](https://nextjs.org/docs/pages/api-reference/config/eslint)
Facilita e abstrai o uso do ESLint.

1. Criar nova branch `git checkout -b lint-quality-cations`
2. Adicionar script para `ESLint` no **package.json** `"lint:eslint:check": "next lint --dir .",`
3. Executar lint: `npm run lint:eslint:check`
4. Após execução, rodando de forma **scritch**, o arquivo `.eslintrc.json` foi criado de forma automática.
5. No arquivo `.eslintrc.json` adicionar `eslint:recommended` em `extends`, criando um array nesse parâmetro:
   `"extends": ["eslint:recommended", "next/core-web-vitals"]`

**Para o ESLint entender como o Jest funciona, vamos precisar instalar a lib `eslint-plugin-jest`**

1. `npm install -D eslint-plugin-jest@28.6.0`

### Código

### Dicas

#### Instalar ESLint no VSCode

1. Em extensões do VSCode, bucar por ESLINT (extensão da Microsoft).

#### Apontamento ESLint:

```
next lint
Invalid Options:
- Unknown options: useEslintrc, extensions, resolvePluginsRelativeTo, rulePaths, ignorePath, reportUnusedDisableDirectives
- 'extensions' has been removed.
- 'resolvePluginsRelativeTo' has been removed.
- 'ignorePath' has been removed.
- 'rulePaths' has been removed. Please define your rules using plugins.
- 'reportUnusedDisableDirectives' has been removed. Please use the 'overrideConfig.linterOptions.reportUnusedDisableDirectives' option instead.
```

**Correção**  
Erro de compartibilidade das versões instaladas automaticamente pelo Next, então rodar o comando:

1. `npm install eslint@8.57.0 eslint-config-next@14.2.4`

2. Instalar `ESLint` pelos módulos do VSCode.

3. Rodar: `npm i -D eslint-plugin-jest@28.6.0`

4. Rodar:` npm i -D eslint-config-prettier@9.1.0`

5. Rodar: git commit -m 'adds `lint:eslint:check` script with `ESLint`'

6. Corrigir os erros encontrados pelo ESLint

7. Rodar: git commit -m 'fix `eslint` linting'
