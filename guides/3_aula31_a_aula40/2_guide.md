# Dia 31

### Criar processo de CI com GitHub Actions.

1. Criar nova branch chamada `actions`
2. Criar pasta de workflows: `.github/workflows`
3. Criar workflow `tests.yaml`

**Workflow de Tests**

```yaml

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

#### Dicas dia 31

**Qual a diferença entre `npm ci` e `npm install`**

**npm install:** Resolve, re-calcula as dependências encontradas no `package.json` (Irá devolver resultados diferentes se houver pacotes atualizados ao longo do caminho)
**npm ci:** Irá usar exatamente as dependências descritas no `package-lock.json` (Sempre irá devolver o mesmo resultado ao longo do tempo). Dessa forma, torna-se importante fazer o commit do `package-lock.json`

**Executando comando git de uma só vez**

`git add -A && git commit --amend --no-edit && git push -f`
