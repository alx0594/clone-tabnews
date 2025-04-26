# Dia 21

### Aplicação em Produção

#### Cenário atual

**Erro**  
No cenário atual a aplicação está retornando erro 500 na chamada à API: https://alxtab.com.br/api/v1/status.
O erro se deve á última atualização, onde o módulo de status/index.js interage com o banco de dados local.

**Verificar log na Vercel**
Acessar o Projeto >> Logs.
No log (produção) temos erro de conexão com o banco de dados (local): **_Error: connect ECONNREFUSED 127.0.0.1:5432_**

**Destrinchando ECONNREFUSED**

- **E**: Error
- **CONN**: CONNECTION
- **REFUSED**: REFUSED  
  Por tanto, Erro de conexão recusada.
