## Context

O GreenKeeper é um PWA mobile-only (AnalogJS + Angular 22 + Vite 8) 100% frontend, sem backend próprio, deploy estático no Netlify. Atualmente o app permite acesso direto ao dashboard sem autenticação, sem isolamento de dados por usuário e sem proteção de rotas.

A change adiciona autenticação com conta Google via Auth0 (Spec 01). As variáveis de ambiente `VITE_AUTH0_DOMAIN` e `VITE_AUTH0_CLIENT_ID` já estão preparadas em `netlify.toml` e `.env.example`. O banco de dados Supabase/PostgreSQL será usado em develop e production, mas a implementação do adapter online fica para specs posteriores (Spec 02+).

Arquitetura existente: Clean Architecture pragmática com camadas `domain/` ← `application/` ← `infrastructure/`/`app/`, ligadas por `composition/`.

## Goals / Non-Goals

**Goals:**
- Permitir login/logout com conta Google via Auth0
- Manter sessão ativa (token JWT) no cliente
- Proteger todas as rotas internas com guard de rota
- Redirecionar não-autenticados para a tela de login
- Fallback para avatar genérico quando foto do Google não estiver disponível

**Non-Goals:**
- Login social além do Google (Apple, etc.)
- Cadastro de usuário com email/senha
- Recuperação de senha
- Sincronização de sessão entre dispositivos
- Implementação do adapter Supabase online (fica para Specs 02+)
- Notificações push relacionadas à autenticação

## Decisions

### 1. SDK de Auth0: `@auth0/auth0-spa-js` sobre implementação custom com `auth0-js`
**Por que:** O `auth0-spa-js` é o SDK oficial para SPAs, suporta PKCE, token refresh automático e integra bem com Angular. Alternativa seria usar `auth0-js` (legacy) ou implementar o fluxo OIDC manualmente, mas ambos exigem mais código custom e manutenção.
**Alternativas consideradas:** `auth0-js` (rejeitado: legado, sem suporte a refresh token automático), implementação OIDC manual (rejeitado: maior superfície de erro de segurança).

### 2. Armazenamento do token: memória do SDK (in-memory) sem `localStorage`
**Por que:** Evitar exposição do token a XSS via `localStorage`. O SDK gerencia o token internamente. Alternativa seria `sessionStorage`, mas ainda assim expõe o token ao JavaScript da página.
**Alternativas consideradas:** `localStorage` (rejeitado: vulnerável a XSS), `sessionStorage` (rejeitado: ainda expõe ao JS), cookies HttpOnly (rejeitado: requer backend para definir, incompatível com 100% frontend estático).

### 3. Guard de rota no nível do AnalogJS Router (`canActivate`)
**Por que:** O AnalogJS Router suporta `canActivate` em `RouteMeta`, permitindo proteger rotas de forma declarativa. O `mobileOnlyGuard` existente já usa esse padrão; o auth guard será adicionado em cadeia após ele.
**Alternativas consideradas:** middleware de nível de aplicação (rejeitado: não existe em AnalogJS/Vite estático), proteção apenas no componente (rejeitado: não impede navegação direta por URL).

### 4. Estrutura de pastas seguindo Clean Architecture
- `src/domain/models.ts` — entidade `User` (id, email, nome, foto, provedor)
- `src/domain/rules.ts` — regras de autenticação (sessão válida, token não expirado)
- `src/application/ports.ts` — `AuthPort` (login, logout, getUser, isAuthenticated)
- `src/application/use-cases.ts` — `LoginUseCase`, `LogoutUseCase`, `CheckAuthUseCase`
- `src/infrastructure/auth0.adapter.ts` — adapter do SDK Auth0
- `src/app/guards/auth.guard.ts` — guard de rota Angular
- `src/app/pages/login.page.ts` — tela de login
- `src/composition/` — DI ligando ports → adapters

## Risks / Trade-offs

| Risco | Mitigação |
|-------|-----------|
| Token exposto a XSS (armazenado em memória do SDK, acessível via JS) | Não usar `localStorage`; SDK gerencia internamente; considerar cookies HttpOnly se houver backend futuro |
| Usuário cancela login no Auth0 | Retornar à tela de login com mensagem opcional (UC-01, fluxo alternativo 6a) |
| Token expirado durante navegação | Guard de rota detecta expiração e redireciona para login (UC-03, fluxo alternativo 3a) |
| Falha de rede durante login | Exibir erro e permitir tentar novamente (UC-01, fluxo alternativo 6c) |
| Foto do perfil Google não disponível no token | Fallback para avatar genérico (definido no ux-design.md) |
| Dependência externa (Auth0) indisponível | Exibir erro de servidor e permitir tentar novamente |

## Migration Plan

1. Adicionar `@auth0/auth0-spa-js` ao `package.json`
2. Criar arquivos de domínio, aplicação, infraestrutura e app para autenticação
3. Adicionar `auth.guard.ts` às rotas internas via `RouteMeta.canActivate`
4. Criar tela de login (`/login`) e atualizar rota raiz para redirecionar não-autenticados
5. Adicionar variáveis de ambiente `VITE_AUTH0_DOMAIN` e `VITE_AUTH0_CLIENT_ID` ao `.env.example` (placeholders, sem valores reais)
6. Rodar `npm run test:coverage` (100% de cobertura obrigatório)
7. Rodar `npm run build` e verificar `dist/analog/public`
8. Criar PR para `develop` com autorização explícita do usuário

**Rollback:** Reverter o commit da change e remover a dependência `@auth0/auth0-spa-js`.

## Open Questions

- O adapter Supabase online (Spec 02+) precisará do `accessToken` do Auth0 para chamadas à API — como esse token será injetado nas requisições?
- A sessão deve persistir após refresh da página? (O SDK `auth0-spa-js` restaura automaticamente se houver token válido em memória + `cacheLocation`)
- Qual o tempo de expiração (TTL) do token JWT configurado no Auth0?
