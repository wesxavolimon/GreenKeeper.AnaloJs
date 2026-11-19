## Why

O app GreenKeeper permite acesso direto ao dashboard sem autenticação, sem isolamento de dados por usuário e sem proteção de rotas. Esta change adiciona autenticação com conta Google via Auth0, garantindo que apenas usuários autenticados acessem o app e que cada usuário veja apenas suas próprias plantas.

## What Changes

- Nova tela de login com botão "Entrar com Google"
- Fluxo de redirecionamento para Auth0 e retorno com token de sessão
- Guard de rota que bloqueia telas internas para não-autenticados
- Logout com encerramento de sessão e retorno à tela de login
- Validação de token JWT (presença e expiração)
- Substituição do acesso direto ao dashboard por fluxo autenticado

## Capabilities

### New Capabilities

- `google-auth`: Autenticação com conta Google via Auth0, incluindo login, logout, sessão, guard de rota e validação de token JWT.

### Modified Capabilities

- (nenhum — não há specs existentes para modificar)

## Impact

- Código: novas pastas em `src/domain/`, `src/application/`, `src/infrastructure/` e `src/app/` para autenticação
- Dependências: Auth0 SDK (a ser adicionado ao `package.json`)
- Variáveis de ambiente: `VITE_AUTH0_DOMAIN` e `VITE_AUTH0_CLIENT_ID` (já preparadas em `netlify.toml` e `.env.example`)
- Rotas: todas as rotas internas passam a ser protegidas pelo guard de autenticação
