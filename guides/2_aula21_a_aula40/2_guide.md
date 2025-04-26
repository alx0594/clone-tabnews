# Dia 21

## Aplicação em Produção

### Cenário atual

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

### Banco de dados em Produção

- [x] ElephantSQL (gratuíto)
- [x] [Neon](https://neon.tech/) (gratuíto)
- [x] DigitalOcean (pago)

  1. Neon

     - Auth usando GitHub
     - Project Name: QWx4VGFiCg==
     - Branch: production
     - DabaseName: YWx4dGFiCg==
     - Owner: neondb_owner
     - Pegar parâmetros de conexão
     - Adicionar propriedade ssl: true em database.js

  2. Na Vercel, configurar variáveis de ambiente do Banco de dados fornecidos pela Neon.

     - Vercel >> Project (clone-tabnews) >> Settings >> Environment Variables >> Apenas Production [x] >> Adicionar Variáveis >> Save.

     - Em Demployments, fazer redeploy para aplicação pegar as variáveis de ambiente.

### Dicas

Comando git para restaurar alterações: `git restore .` onde o ponto (.) indica que é para restaurar tudo.
