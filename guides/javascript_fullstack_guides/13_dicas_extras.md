# 💡 Dicas Extras, Troubleshooting e Boas Práticas Fullstack

---

## 🛑 Atenção com o `.env`

- Nunca comite arquivos de ambiente.
- Sempre adicionar no `.gitignore`:

```
.env*
```

- Separar variáveis por ambiente:
  - `.env.development`
  - `.env.staging`
  - `.env.production`

---

## 🔄 Rollback seguro com Git

- Commits atômicos facilitam rollback seguro.
- Use `git revert` para desfazer commits mantendo histórico.
- Rebase interativo para limpar histórico:

```bash
git rebase -i HEAD~N
```

---

## ⚙️ Optional Chaining em JavaScript (`?.`)

Permite acessar propriedades aninhadas com segurança:

```javascript
const user = response?.data?.user;
```

Evita quebra de execução se qualquer nível for `undefined`.

---

## 🔎 Debug e Logs em produção

- Use `console.error` com `cause` no backend (não expor para o cliente).
- Na Vercel: aproveite os logs por deploy.
- Em produção profissional: usar ferramentas como Sentry, Datadog, LogRocket, Elastic.

---

## 🌐 DNS e Deploy

- Use `whatsmydns.net` para verificar propagação de DNS global.
- No Registro.br configure os nameservers da Vercel corretamente.
- Sempre valide SSL ativo no domínio.

---

## 🔑 Pensamento profissional

- ✅ Testes sempre automatizados.
- ✅ Deploy sempre via CI/CD.
- ✅ Linters e padronizadores sempre ativos.
- ✅ Commits sempre padronizados.
- ✅ PRs sempre revisados.

---

# 🎯 Agora você tem um ciclo Dev Fullstack com qualidade de engenharia de ponta!