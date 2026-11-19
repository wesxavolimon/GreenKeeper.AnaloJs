## ADDED Requirements

### Requirement: Login com Google via Auth0
O sistema SHALL exibir uma tela de login com botão "Entrar com Google" quando o usuário não tiver sessão ativa.

#### Scenario: Usuário abre app sem sessão
- **WHEN** o usuário abre o app sem sessão ativa
- **THEN** o sistema exibe a tela de login com a opção "Entrar com Google"

#### Scenario: Usuário inicia login com Google
- **WHEN** o usuário toca em "Entrar com Google"
- **THEN** o sistema redireciona o usuário para o provedor Auth0

#### Scenario: Retorno bem-sucedido do Auth0
- **WHEN** o usuário autentica com sucesso no Auth0 e retorna ao app com token de sessão válido
- **THEN** o sistema valida o token e redireciona para o dashboard

### Requirement: Logout e encerramento de sessão
O sistema SHALL permitir que o usuário autenticado encerre a sessão e retorne à tela de login.

#### Scenario: Usuário faz logout
- **WHEN** o usuário autenticado toca em "Sair"
- **THEN** o sistema encerra a sessão e redireciona para a tela de login

### Requirement: Guard de rota (proteção de telas)
O sistema SHALL bloquear o acesso a todas as rotas internas para usuários não autenticados, redirecionando para a tela de login.

#### Scenario: Não-autenticado tenta acessar rota interna
- **WHEN** um usuário sem sessão ativa tenta acessar qualquer rota interna
- **THEN** o guard de rota redireciona para a tela de login

#### Scenario: Autenticado acessa rota interna
- **WHEN** um usuário com sessão ativa acessa uma rota interna
- **THEN** o guard de rota permite o acesso normalmente

### Requirement: Validação de token JWT
O sistema SHALL validar a presença e expiração do token de sessão antes de permitir acesso a rotas protegidas.

#### Scenario: Token expirado
- **WHEN** o token de sessão está expirado
- **THEN** o sistema redireciona para a tela de login

#### Scenario: Token ausente
- **WHEN** não há token de sessão armazenado
- **THEN** o sistema exibe a tela de login
