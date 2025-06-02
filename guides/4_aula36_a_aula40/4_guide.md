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

# Dia 38

## Tratamento e Padronização de Erros

**Exemplos de customização de erros em JavaScript**

```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

function salvarUsuario(input) {
  if (!input) {
    throw new ReferenceError("É necessário enviar um 'input'");
  }

  if (!input.name) {
    throw new ValidationError("Preencha o seu nome completo!");
  }

  if (!input.username) {
    throw new ValidationError("Preencha o seu apelindo!");
  }

  user.save(input);
}

try {
  //salvarUsuario(); // Throw é necessário enviar um input linha 10
  salvarUsuario({ name: "Alex" }); // Throw preenche o seu apelido! linha 18
  //salvarUsuario({ name: "Alex", username: "Tu" }); // Throw user not defined linha 21
} catch (error) {
  if (error instanceof ReferenceError) {
    throw error;
  }

  if (error instanceof ValidationError) {
    console.error(error);
    return;
  }

  console.log("Erro desconhecido");
  console.log(error.stack);
}
```

**Importante**  
Em conformidade com os testes, quando não usamos try catch, o status code lançado é sempre maior que um `echo $?`, porém ao adicionar o try catch, entende-se que o erro foi tratado e sempre retorna status code `0`

# Dia 39

### Dicas

**Erro de fallback**: Quando não temos a mínima ideia do erro retornado pelo servidor.
**?**: Em JavaScript o Optional Chaining (Encadeamento Opcional). Ele verifica se a variável não possui um valor `undefined` ou `null` daí sim chama o método quem vem depois: `clien?.end()`
