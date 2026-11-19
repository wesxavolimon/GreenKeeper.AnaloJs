# Arquitetura — GreenKeeper

Clean Architecture pragmática no frontend. Regras de dependência: `domain` ← `application` ← `infrastructure`/`app`; `composition` conhece todos. `domain` e `application` nunca importam `@angular/*`, `@analogjs/*` nem `infrastructure`.

## Camadas

```
src/
├── domain/          # Entidades, tipos e regras puras (zero imports de framework)
├── application/     # Casos de uso e ports (interfaces TS puras; só depende de domain)
├── infrastructure/  # Adapters concretos (Supabase, BrowserDeviceSignals, ViteEnvConfig, BrowserPwaRegistration)
├── composition/     # Composition Root (InjectionTokens + provideGreenKeeperDependencies)
└── app/             # Rotas AnalogJS, guards, componentes visuais
```

## Stack e dependências externas

- **AnalogJS (Angular 22 + Vite):** framework e build estático
- **TypeScript:** linguagem principal
- **Tailwind CSS:** estilização
- **Auth0:** autenticação com Google (login/logout, sessão, guard de rota)
- **Supabase/PostgreSQL:** banco de dados online em develop e production (substitui o adapter em memória)
- **Pl@ntNet / Open-Meteo:** provedores externos de identificação botânica e clima (sem chave de API no frontend)
- **Vitest + v8:** testes unitários com 100% de cobertura obrigatória
- **Playwright:** captura automatizada de prints em Docker
- **Docker Compose:** zero pegada local (dev, testes, build, playwright)

## Fluxo de autenticação

1. Usuário abre o app sem sessão → tela de login com "Entrar com Google"
2. Redirecionamento para Auth0 → login com conta Google
3. Auth0 retorna com token de sessão (JWT) → dashboard
4. Todas as rotas internas protegidas por guard que redireciona não-autenticados para o login
5. Logout encerra a sessão e retorna à tela de login

## Mobile-only

O `mobileOnlyGuard` verifica User-Agent mobile / `userAgentData.mobile` / viewport touch. Desktop e tablet são redirecionados para `/desktop-info`. Override (`?mobilePreview=1`) só fora de produção.

## Testes

- 100% de cobertura (lines, branches, functions, statements) via Vitest + v8
- Testes de fronteira validam que camadas não importam dependências proibidas
- Comandos rodam via `docker compose` (zero dependência de Node/browsers no host)

_Last updated: 2026-11-19_