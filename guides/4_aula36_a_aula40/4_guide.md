# Dia 36

## Segunda Pista Lenta

### Criar nova Milestone e suas recpectivas issues

Milestone: Codando https://github.com/alx0594/clone-tabnews/milestones

# Dia 37

## Primeira Pista Lenta

### Fronted simples com React

- **Componentes**
- **Propriedades**

1. Criar branch `status-page`
2. Em pages, criar pasta status e posteriormente o arquivo index.js

## Segunda Pista Lenta

- **Data Fetching**

- Instalar `swr` na versão exta **(-E)** https://www.npmjs.com/package/swr
- `npm install -E swr@2.2.5`

1. Criar função para chamar o backend:

```javascript
async function fechAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}
```

2. Criar function default que irá renderizar os componentes da página:

```javascript
export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdateAt />
      <DatabaseStatus />
    </>
  );
}
```

3. Componente UpdateAt

```javascript
function UpdateAt() {
  const { isLoading, data } = useSWR("/api/v1/status/", fechAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";
  if (!isLoading && data) {
    updatedAtText = new Date(data.update_at).toLocaleString("pt-BR");
  }
  return <div>Última atualização: {updatedAtText}</div>;
}
```

4. Componente DatabaseStatus

```javascript
function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status/", fechAPI);

  let databaseStatusInformation = "Carregando...";
  if (!isLoading && data) {
    databaseStatusInformation = (
      <>
        <div>Versão: {data.dependencies.database.version}</div>
        <div>
          Conexões abertas: {data.dependencies.database.opened_connections}
        </div>
        <div>
          Conexões Máximas: {data.dependencies.database.max_connections}
        </div>
      </>
    );
  }
  return (
    <>
      <h2>Database</h2>
      {databaseStatusInformation}
    </>
  );
}
```

**Explicando**

1. StatusPage renderiza os componentes UpdateAt e DatabaseStatus.
2. Os componentes UpdateAt e DatabaseStatus chamam a function fetchAPI, passando como key o endpoint `api/v1/status`
3. Usando `useSWR`, recuperamos `isLoading` (como se fosse um await, retorna true se os dados retornaram ou false se ainda não)
4. Fazemos a verificação, se não está loading e existe data, setamos a variável que será retornada
