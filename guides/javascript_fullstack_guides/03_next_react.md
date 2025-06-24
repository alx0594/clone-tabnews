# ⚛️ React + Next.js - Fullstack com API Routes

---

## 🎯 O que é o Next.js?

O **Next.js** é um framework baseado em React que:

- Simplifica o desenvolvimento fullstack.
- Permite criar tanto frontend quanto backend (API routes) em um único projeto.
- Faz roteamento automático baseado na estrutura de arquivos.
- Suporta Server-side Rendering (SSR) e Static Generation (SSG).

**Analogia simples:**  
Next.js é o "canivete suíço" do desenvolvedor web moderno! 🧰

---

## 🛠️ Inicializando o Projeto Next.js

### Criação do projeto:

```bash
npm init -y
npm install next@13.1.6 react@18.2.0 react-dom@18.2.0
```

### Scripts no `package.json`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start"
}
```

### Rodar localmente:

```bash
npm run dev
```

---

## 📂 Estrutura de Diretórios Padrão

```
📦 root
┣ 📂 pages        --> Frontend e rotas públicas
┃ ┗ 📜 index.js
┣ 📂 pages/api    --> Backend (API Routes)
┃ ┗ 📂 v1
┃   ┗ 📜 status.js
┣ 📂 models        --> Regras de negócio
┣ 📂 infra         --> Banco, migrations e provisões
┣ 📂 tests         --> Testes unitários e integração
```

---

## 🖼️ Criando o Frontend (pages/index.js)

```javascript
function Home() {
  return <h1>Bem-vindo ao Projeto Fullstack 🚀</h1>;
}
export default Home;
```

---

## 🌐 API Routes (Backend Fullstack integrado)

### Exemplo básico: `/pages/api/v1/status.js`

```javascript
export default function status(request, response) {
  response.status(200).json({ status: "API operante!" });
}
```

---

## 🚀 Deploy Simplificado com Vercel

1️⃣ Login com GitHub na Vercel.  
2️⃣ Importar repositório do projeto.  
3️⃣ Deploy com CI/CD automáticos.  
4️⃣ Variáveis de ambiente configuráveis via dashboard.

**Extra:**  
A Vercel foi criada pela mesma equipe do Next.js, integração perfeita! 🧪

---

## 🔗 Dicas de Expert

- Use `pages/api` para APIs REST simples.
- Para APIs maiores, use `next-connect` com middlewares.
- Aproveite o melhor dos dois mundos: Frontend + Backend unificados! 💡

---

# 🎯 Agora você já domina o coração do Next.js!