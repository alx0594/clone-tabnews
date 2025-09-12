# Aula 46
## Primeira Pista Lenta

Regra de como iremos tratar os cookies do usuário através do endpoint `api/v1/user` (sim, no singular)  
E verificar que o usuário está "vivo" no sistema, e consultar seus dados pessoais.  

![alt text](images/renova_sessao_get_user.png)


## Segunda Pista Lenta

1. Criar pasta de teste `user` com o teste `get.test.js`
2. Implementar o teste de `GET` ao endopoint `/api/v1/user`   

  - De novo, teremos a implementação da function `await orchestrator.createSession(createdUser.id);` que criará uma sessão para o nosso usuário.  

3. Implementar a rota que irá receber essa requisição em `pages/user/api/v1/user/index.js`  

4. No `orchestrator.js` criar o método `createSession`  

5. No user controller (user/index):
  - receberemos um requisição informando o cookie do módulo de teste
    ```javascript
     const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });
    ```

    - Vamos recupear o cookie através de:
      `const sessionToken = request.cookies.session_id`

    - Vamos verificar se o token existe na tabela sessions e se a data de expiração dele é maior que a data de agora NOW():
    ```javascript 
    const sessionObject = await session.findOneValidByToken(sessionToken);
    ```
    - Agora, devemos verificar se o usuário existe através de user_id data tabela sessions:

    ```javascript
      const userFound = await user.findOneById(sessionObject.user_id);
      return response.status(200).json(userFound);
    ```

## Terceira Pista Lenta

### Usando Fake Timers

1. Fazer teste enviando token de sessão inválido:

```javascript
const nonexistentToken =
  "f85cb32f493c872f4782f6f2e5153d38f9f55c0ea5ff83b6176a9400dc9b6266f862571e237888ba53c99fb03b2499b5";

  const response = await fetch("http://localhost:3000/api/v1/user", {
    headers: {
      Cookie: `session_id=${nonexistentToken}`,
    },
  });
```

2. Criando teste para testar sessão expirada.

Dessa forma, usaremos `jest.useFakeTimers()`
O `FakeTimers` afeta todo cenário do teste que está sendo executado.
Por exemplo, se o teste injeta datas de forma automática, como `created_at` e `updated_at` essas datas serão afetadas. Isso pelo fato de estarmos criando usuários e sessões através do `orchestrator`, que está sendo chamado nos testes jest.

Para voltar a data para o período correto, basta inserir o método jest após o trecho que deveria usar FakeTimer: `jest.useRealTimers();`

Exemplo:

```javascript
(...)
  jest.useFakeTimers({
    now: new Date(Date.now() - session.EXPIRATION_IN_MILLESECONDS),
  });

  const createdUser = await orchestrator.createUser({
    username: "UserWithExpiredSession",
  });

  const sessionObject = await orchestrator.createSession(createdUser.id);

  jest.useRealTimers();
(...)
```

## Quarta Pista Lenta

### Renovando sessão através de `/user`

No test `With valid session` adicionar lógica de renovação da sessão.

Funcionará da seguinte forma.

1. No teste, criar uma sessão válida
  - Adicionar usuário no banco de dados

    ```javascript
    const createdUser = await orchestrator.createUser({
      username: "UserWithValidSession",
    });
    ```
  - Criar nova sessão

    ```javascript
    const sessionObject = await orchestrator.createSession(createdUser.id);

    const response = await fetch("http://localhost:3000/api/v1/user", {
      headers: {
        Cookie: `session_id=${sessionObject.token}`,
      },
    });
    ```

  - Validar todo o retorno da criação do usuário.

  - Agora vamos fazer a renovação da sessão, iniciamos buscando uma sessão valida, com base na que já foi criada anteriormente acima.

    ```javascript
      const renewedSessionObject = await session.findOneValidByToken(
        sessionObject.token,
      );
    ```

  - Na camada controller (index), adicionamos o método de renovação de sessão

    ```javascript
    await session.renew(sessionObject.id);
    ```

  - Na camada model, adicionamos o update de expires_at e também do updated_at

    ```javascript
      async function renew(sessionId) {
      const expiresAt = new Date(Date.now() + session.EXPIRATION_IN_MILLESECONDS);
      const renewedSessionObject = await runUpdateQuery(sessionId, expiresAt);
      return renewedSessionObject;

      async function runUpdateQuery(sessionId, expiresAt) {
        const results = await database.query({
          text: `
            UPDATE
              sessions
            SET
              expires_at = $2,
              updated_at = NOW()
            
            WHERE
              id = $1
            RETURNING
              *
          ;`,
          values: [sessionId, expiresAt],
        });

        return results.rows[0];
      }
    }
    ```
  - Agora devemos retornar o valor da sessão atualizada (expires_at) no heder do nosso response na camada controller (index)



