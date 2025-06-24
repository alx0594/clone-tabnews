# 📚 Fundamentos de Git e GitHub

---

## 🎯 O que é o Git?

O **Git** é um sistema de controle de versão distribuído.

- Ele permite **rastrear o histórico** de alterações em arquivos.
- Facilita o trabalho em equipe, permitindo que múltiplos desenvolvedores colaborem de forma segura.
- Cada desenvolvedor tem uma **cópia completa (local)** do repositório.

**Analogia simples:**
> Imagine um Google Docs, mas sem internet. Cada um tem sua própria cópia. Depois, sincronizamos as mudanças. 🌐

---

## ☁️ O que é o GitHub?

O **GitHub** é um serviço online que hospeda repositórios Git.

- Permite acesso remoto aos repositórios.
- Facilita o trabalho colaborativo com Pull Requests, Issues, Milestones e integrações.

**Comparativo:**
- Git ➜ Ferramenta local de controle de versão.
- GitHub ➜ Plataforma de hospedagem remota para compartilhar seu código.

---

## 🧱 Estados de Arquivos no Git

Todo arquivo pode estar em um dos seguintes estados:

| Estado | Descrição |
| ------ | ----------- |
| Untracked | Arquivo novo, não controlado ainda |
| Modified | Arquivo alterado |
| Staged | Arquivo preparado para commit |
| Committed | Alteração salva no repositório |

Visual:
```
Untracked ➔ Modified ➔ Staged ➔ Committed
```

---

## 🔧 Comandos Essenciais

| Comando | Ação |
| ------- | ---------- |
| `git status` | Mostra estado dos arquivos |
| `git add arquivo` | Move arquivo para staged |
| `git commit -m "mensagem"` | Salva alterações no repositório |
| `git push` | Envia commits para o GitHub |
| `git pull` | Atualiza repositório local com remoto |
| `git log` | Exibe histórico de commits |
| `git diff` | Mostra diferenças de código |

---

## 📝 Amend: Ajustando Commits

✅ Permite corrigir o commit anterior sem criar um novo:

```bash
git commit --amend
```

*Alerta:* O hash do commit é alterado, pois commits são imutáveis! 🔄

---

## 🔀 Rebase Interativo (Refinando o Histórico)

Permite reescrever a história de commits:

```bash
git rebase -i HEAD~3
```

- Pode combinar (squash), reordenar ou editar mensagens de commits.
- Ideal para limpar o histórico antes de enviar para o repositório remoto.

**Dica de ouro:** Mantenha seu histórico limpo e lógico para facilitar manutenção e rollback. 🚀

---

## 🔐 Proteção de Branches (Branch Protection Rules)

No GitHub, podemos criar **regras de proteção da branch principal**:

- Exigir Pull Request para merge.
- Exigir aprovações de revisores.
- Exigir sucesso dos testes automáticos.
- Validar padrão de commits (via Commitlint).

⭐ **Benefício:** Garante código revisado, testado e padronizado antes de ser integrado na branch principal.

---

## 🗂️ Trabalhando com Issues e Milestones

- **Issues 🔢:** Pequenas tarefas ou bugs.
- **Milestones 🌟:** Agrupamento de issues para organizar entregas.

Exemplo:
- Milestone: "MVP v1.0".
- Issues: "Configurar DNS", "Criar endpoint de status", "Adicionar ESLint".

---

## 🧠 Dicas de Expert:

- Commits pequenos e atômicos facilitam rollback seguro.
- Nunca tenha medo de usar `git rebase -i` para limpar histórico.
- Sempre use mensagens de commit claras, com padrão **Conventional Commits**.

Exemplo:
```bash
feat: adiciona endpoint de status
fix: corrige conexão com banco de dados
ci: ajusta workflow de deploy
```

---

# 🔄 Capítulo concluído: Git e GitHub com confiança!