# 🚀 Setup do Ambiente de Desenvolvimento JavaScript Fullstack

---

## 🎯 Objetivo

Vamos configurar um ambiente profissional, consistente e produtivo para desenvolvimento Fullstack com JavaScript, Node.js, Next.js e banco de dados.

---

## 🧰 Instalação do Node.js com NVM (Node Version Manager)

### Por que usar o NVM? 🤔

- Permite gerenciar múltiplas versões do Node.js facilmente.
- Compatível com diferentes projetos simultaneamente.

### Instalação no Windows:
1. Acessar: [nvm-windows releases](https://github.com/coreybutler/nvm-windows/releases)
2. Baixar e executar: `nvm-setup.exe`
3. Instalar versão do Node desejada:
```bash
nvm install 18.14.2
```
4. Verificar versões instaladas:
```bash
nvm ls
```

---

## 🖥️ Visual Studio Code (VSCode)

O editor padrão para produtividade máxima no desenvolvimento moderno.

### Extensões essenciais:

| Extensão | Função |
| -------- | ----------- |
| **EditorConfig** | Padronização de formatação entre editores |
| **Prettier** | Formatação automática de código |
| **ESLint** | Análise estática de qualidade do código |
| **GitLens** | Superpoderes para trabalhar com Git |

---

## 📝 Configurando o EditorConfig

Arquivo `.editorconfig` na raiz do projeto:

```ini
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```

**Benefício:** Todos os devs terão o mesmo padrão de formatação, independente do editor utilizado. 🎯

---

## 🎨 Configurando o Prettier (Formatação automática)

### Instalação no projeto:
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
- Verificar formatação: `npm run lint:prettier:check`
- Corrigir formatação: `npm run lint:prettier:fix`

### Ignorar arquivos (opcional):
Criar `.prettierignore` e incluir diretórios como `.next/`

---

## 🔎 Configurando o ESLint (Qualidade de Código)

### Instalação com Next.js integrado:
```bash
npm install eslint@8.57.0 eslint-config-next@14.2.4 --save-dev
```

### Extensões adicionais:
```bash
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

## 🔧 Ativando Formatação Automática no VSCode

- `Settings -> Format On Save -> [✔] Enable`
- Configurar `Prettier` como formatador padrão.

---

## 🚀 Benefícios de um Ambiente Padronizado:

- Código limpo e consistente.
- Menos discussões sobre formatação no time.
- Mais foco no que importa: resolver problemas e entregar valor! 💡

---

# 🎯 Ambiente de desenvolvimento pronto para projetos profissionais!