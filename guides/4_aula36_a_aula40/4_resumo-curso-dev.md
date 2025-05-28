# Dia 36

## Segunda Pista Lenta

### Criar nova Milestone e suas recpectivas issues

Milestone: Codando

Issues:

1. Frontend /status simples
2. Padronizar erros
   - Tratar status code.
   - Criar exceções customizados
   - Propriedades: name, mensagem, actions, status code. snake case
3. Padronização dos controllers
   - status
   - migrations
4. Criação de usuários
   - CRUD dos usuários
   - Criar migration nova para criar tabela user
   - Model de user
   - Controller de user
   - api/v1/users -create
   - api/v1/user/username - consultar
   - Autenticação do usuário.
   - Retornar todos os campos do usuário (name, email, senha)
5. Sistema de autenticação
   - email e senha para login
   - Guardar sessão em cokie
   - Encript da senha
   - Estágio de login
6. Serviço de e-mail
   - Novo container docker para e-mail capter
   - Módulo para enviar e-mail
   - Limpar caixa de entrada pelo orchestrator.js
7. Sistema de Autorização
   - Autorização por perfil
