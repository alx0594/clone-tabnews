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

## Primeira Pista Lenta

### Erros customizados

Os erros customizados auxiliam na tratativa de erros, facilita a identificação do erro e onde o mesmo pode ter sido ocasionado. O nome da classe de erro é um dos fatores que auxilia o tipo de erro lançado.

Seguiu-se da seguinte maneira.

1. Lançar o erro custmizado e só depois se preocupar com a implementação.

```javascript
catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });

    console.log("\n Erro dentro do catch do controller:");
    console.log(publicErrorObject);

    response.status(500).json(publicErrorObject);
  }
```

2. Nossa Classe de erro customizada é a InternalServerError

   - Dentro da pasta infra, criar o módulo errors.js
   - Implementar a classe conforme a seguir:

   ```javascript
   export class InternalServerError extends Error {
     constructor({ cause }) {
       super("Um erro interno não esperado aconteceu.", {
         cause,
       });
       this.name = "InternalServerError";
       this.action = "Entre em contato com o suporte";
       this.statusCode = 500;
     }

     toJSON() {
       return {
         name: this.name,
         message: this.message,
         action: this.action,
         status_code: this.statusCode,
       };
     }
   }
   ```

**Detalhes**

- O construtor recebe o cause passado na tratativa de uma possível exceção, por ser um objeto, podemos desestruturá-lo e usá-lo já como uma variável `cause`

- Usamos o super para passar as informações para classe pai `Error`, que no caso está sendo enviada uma mensagem e o `cause`

- Definimos variáveis da classe InternalServerError: `name`, `action` e `statusCode`

- Usamos o toJSON() para converter os textos em JSON. Semelhante ao toString() do Java.

- **Na sáida do erro teremos algo como:**

```
InternalServerError: Um erro interno não esperado aconteceu.

{
  action: 'Entre em contato com o suporte',
  statusCode: 500,
  [cause]: error: password authentication failed for user "local_user2"
  ...
}

```

- **Na resposta da requisição `curl -s http://localhost:3000/api/v1/status | jq`**

```json
{
  "name": "InternalServerError",
  "message": "Um erro interno não esperado aconteceu.",
  "action": "Entre em contato com o suporte",
  "status_code": 500
}
```

#### Versão com a tratativa customizada de erro status/index.js

```javascript
import database from "infra/database.js";
import { InternalServerError } from "infra/errors";

async function status(request, response) {
  try {
    const updateAt = new Date().toISOString();

    const databaseVersionResult = await database.query("SHOW server_version;");
    const databaseVersionValue = databaseVersionResult.rows[0].server_version;

    const databaseMaxConnectionsResult = await database.query(
      "SHOW max_connections;",
    );
    const databaseConnectionsValue =
      databaseMaxConnectionsResult.rows[0].max_connections;

    const databaseName = process.env.POSTGRES_DB;
    const databaseOpenConnectionsResult = await database.query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName],
    });
    const databaseOpenedConnectionsValue =
      databaseOpenConnectionsResult.rows[0].count;

    response.status(200).json({
      update_at: updateAt,
      dependencies: {
        database: {
          version: databaseVersionValue, //"postgres:16.0-alpine3.18" compose.yaml
          max_connections: parseInt(databaseConnectionsValue),
          opened_connections: databaseOpenedConnectionsValue,
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });

    console.log("\n Erro dentro do catch do controller:");
    console.log(publicErrorObject);

    response.status(500).json(publicErrorObject);
  }
}

export default status;
```

#### No módulo database.js adicionamos o `Optional Chaing` para verificação de valores `undefined` antes de chamar o método

```javascript
async function query(queryObject) {
  let client;
  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.log("\nErro dentro do catch do database.js");
    console.error(error);
    throw error;
  } finally {
    await client?.end(); // <-------|
  }
}
```

### Dicas

**Erro de fallback**: Quando não temos a mínima ideia do erro retornado pelo servidor.
**?**: Em JavaScript o Optional Chaining (Encadeamento Opcional). Ele verifica se a variável não possui um valor `undefined` ou `null` daí sim chama o método quem vem depois: `clien?.end()`

## Segunda Pista Lenta

### Padronizar os controllers

1. Instalar **next-connect** `npm i -E next-connect@1.0.0` para trabalhar com rotas.
