# 🏷️ Conventional Commits (Boas práticas profissionais de commits)

---

## 🎯 O que são Conventional Commits?

É um **padrão semântico** para escrever mensagens de commit:

- Facilita leitura de histórico.
- Permite geração automática de changelog.
- Permite ferramentas validarem commits.

**Analogia:** Linguagem universal que todos desenvolvedores entendem ao olhar o histórico 🗂️

---

## 📝 Estrutura da mensagem

```bash
tipo(escopo): mensagem
```

### Exemplos práticos:

| Tipo | Descrição |
| ---- | --------- |
| `feat:` | Adiciona nova funcionalidade |
| `fix:` | Corrige um bug |
| `docs:` | Alterações de documentação |
| `style:` | Mudanças de formatação |
| `refactor:` | Refatoração de código |
| `test:` | Testes adicionados ou alterados |
| `ci:` | Ajustes de CI/CD |
| `chore:` | Tarefas de manutenção não relacionadas a código de produção |

---

## Exemplo prático:

```bash
feat(login): adiciona autenticação JWT
fix(user): corrige validação de e-mail
chore(deps): atualiza dependências npm
```

---

## 💡 Vantagens reais

- Rollback granular por tipo de alteração.
- Geração automática de changelog (ex.: semantic-release).
- CI bloqueia commits inválidos.
- Revisores entendem rapidamente o que o commit faz.

---

## 🛑 Evite commits genéricos como:

```bash
"ajustes"
"alterações"
"teste de push"
"subindo coisas"
```

**Prefira sempre:**

```bash
feat: adiciona feature X
fix: corrige bug Y
```

---

## 📄 Convite para disciplina profissional

- Cada commit é uma micro-documentação do projeto.
- Padrão usado em projetos Open Source (Angular, React, Kubernetes).
- Histórico limpo é um legado de qualidade! 🎯

---

# 🚀 Agora você comita como um engenheiro de elite!