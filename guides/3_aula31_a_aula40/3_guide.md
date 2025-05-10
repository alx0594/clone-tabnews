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

   **eslint:recommended** de acordo com a documentação, ativa as regras que o ESLint recomenda que todos usem para evitar possíveis erros.

   **eslint:all** de acordo com a [documentação](https://eslint.org/docs/latest/use/configure/configuration-files#using-predefined-configurations), habilita todas as regras fornecidas com ESLint **não é recomendado para uso em produção.**

**Para o ESLint entender como o Jest funciona, vamos precisar instalar a lib `eslint-plugin-jest`**

1. `npm install -D eslint-plugin-jest@28.6.0`
2. configurar `eslintrc.json`

   ```
   {
   "extends": [
    "eslint:recommended",
    "plugin:jest/recommended",
    "next/core-web-vitals"
   ]
   }
   ```

3. Agora executando o comando: `npm run lint:eslint:check` não teremos mais apontamentos relacionados a forma como o Jest trabalha com seus componentes, onde conseguimos usar sem imports específicos.

4. Para que não acha conflitos com o prettier, instalar: `npm i -D eslint-config-prettier@9.1.0`

5. Adicionar prettier na lista do `extends`

   ```
   {
   "extends": [
    "eslint:recommended",
    "plugin:jest/recommended",
    "next/core-web-vitals",
    "prettier"
   ]
   }
   ```

6. Nas Rulsets, adicionar Job Eslint como obrigatório na checagem de status.

### Iniciar correções apontadas pelo ESLINT

```
./infra/database.js
31:1  Warning: Assign object to a variable before exporting as module default  import/no-anonymous-default-export

./infra/migrations/1746050980513_test-migrations.js
5:15  Error: 'pgm' is defined but never used.  no-unused-vars
7:17  Error: 'pgm' is defined but never used.  no-unused-vars

./infra/scripts/wait-for-postgres.js
7:40  Error: 'stderr' is defined but never used.  no-unused-vars

./pages/api/v1/status/index.js
4:7  Error: 'variavelEsquecida' is defined but never used.  no-unused-vars

./tests/orchestrator.js
22:1  Warning: Assign object to a variable before exporting as module default  import/no-anonymous-default-export

info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/basic-features/eslint#disabling-rules
```

1. Corrigindo `infra/database`
   **Adicionar as funções em uma variável e só depois exportá-la.**

   ```javascript
   const database = {
     query,
     getNewClient,
   };

   export default database;
   ```

2. Corrigindo `/tests/orchestrator.js`

```javascript
const orchestrator = {
  waitForAllServices,
};

export default orchestrator;
```

3. Corrigindo apontamentos dos arquivos de migrations (que futuramente serão excluídos)

   - Basta clicar na lâmpada que aprece ao passar o mouse no apontamento e clicar na opção de igonrar os apontamentos. Será adicionados comentários conforme abaixo:

   ```
   /* eslint-disable camelcase */
   /* eslint-disable  no-unused-vars */
   ```

4. Ao executar o comando `npm run lint:eslint:check` agora deverá retornar: **✔ No ESLint warnings or errors**

### Código

**Workflow com os lintings**

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

eslint:
name: Eslint
runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "lts/hydrogen"

      - run: npm ci

      - run: npm run lint:eslint:check

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

6. **Corrigir os erros/apontamentos encontrados pelo ESLint**

7. Rodar: git commit -m 'fix `eslint` linting'

# Dia 32
