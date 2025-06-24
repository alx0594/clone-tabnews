# ⚛️ Frontend Dinâmico com SWR (React + Next.js)

---

## 🎯 O que é o SWR?

SWR (Stale-While-Revalidate):
- Estratégia de cache otimista.
- Atualiza dados automaticamente de forma inteligente.
- Ideal para consumir APIs REST no frontend React.

**Analogia:** Exibe rapidamente o dado disponível e já inicia busca por atualização 🔄

---

## 📦 Instalando SWR no projeto

```bash
npm install -E swr@2.2.5
```

---

## 🏗️ Estrutura do componente Status Page

```javascript
import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const data = await response.json();
  return data;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status 🔎</h1>
      <UpdateAt />
      <DatabaseStatus />
    </>
  );
}
```

---

## 🕰️ Componente UpdateAt

```javascript
function UpdateAt() {
  const { isLoading, data } = useSWR("/api/v1/status/", fetchAPI, { refreshInterval: 2000 });

  let updatedAtText = "Carregando...";
  if (!isLoading && data) {
    updatedAtText = new Date(data.update_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updatedAtText}</div>;
}
```

---

## 🗄️ Componente DatabaseStatus

```javascript
function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status/", fetchAPI);

  if (isLoading) return <div>Carregando dados do banco...</div>;

  return (
    <>
      <h2>Banco de Dados 📊</h2>
      <div>Versão: {data.dependencies.database.version}</div>
      <div>Conexões abertas: {data.dependencies.database.opened_connections}</div>
      <div>Conexões máximas: {data.dependencies.database.max_connections}</div>
    </>
  );
}
```

---

## ⚙️ Benefícios práticos do SWR:

- Cache automático ⚡
- Revalidação periódica 🔄
- Experiência fluida para o usuário 🎯
- Fácil integração com API Routes do Next.js

---

## 🔑 Dicas de expert:

- Use `refreshInterval` para dashboards dinâmicos.
- Trate `isLoading` e `error` sempre no frontend.
- Prefira hooks para separar a lógica de carregamento.

---

# 🚀 Agora seu frontend está reativo e atualizado automaticamente!