# 🌿 GreenKeeper.AnaloJs

PWA de cuidado de plantas domésticas, **exclusivo para celular**, feito em **AnalogJS (Angular + Vite)** e **sem backend próprio**. Publicado como site estático no **Netlify**.

> Este é o esqueleto inicial. Banco de dados, login e convite familiar vêm em changes futuras.

## O que já faz

- **Mobile-only gate**: só libera o app em celular. Desktop/tablet veem apenas uma **Tela Informativa** (`/desktop-info`).
- **Dashboard direto**, sem tela de login: ambientes empilhados, planta ativa, *Planta em Foco*, umidade do ambiente e atalho de câmera. Dados em memória por enquanto.
- **PWA instalável** (manifest + service worker).

## Arquitetura

Clean Architecture pragmática em TypeScript:

```
src/
├── domain/          # entidades e regras puras
├── application/     # use cases e ports
├── infrastructure/  # adapters (em memória, sinais do dispositivo, env, PWA)
├── composition/     # ligação ports → adapters
└── app/             # rotas AnalogJS, guards e componentes
```

## Docker (sem instalar nada no host)

```bash
docker compose up app                     # dev server
docker compose run --rm test              # Vitest com 100% de cobertura
docker compose run --rm playwright        # prints das telas em screenshots/
docker compose run --rm app npm run build # build estático
```

## Variáveis de ambiente

Copie `.env.example` para `.env` (nunca commitar o `.env`).

| Variável | Uso |
| -------- | --- |
| `VITE_APP_ENV` | `development` ou `production`. Em `production` o override de dispositivo é ignorado |

Na produção (Netlify), configure as variáveis `VITE_*` na UI do Netlify com escopo *Builds*. Só valores públicos entram no bundle.

## Prints das telas

Gerados pelo Playwright em Docker: `mobile-dashboard.png` (390x844) e `desktop-info.png` (1280x800).

## Qualidade

- 100% de cobertura de testes unitários (Vitest).
- Testes de fronteira entre camadas.

## Roadmap (próximos proposes)

1. PostgreSQL + PostgREST no Docker local e `@supabase/supabase-js` com Supabase em produção.
2. Autenticação Auth0 com conta Google.
3. Convite de familiar por email, compartilhando o mesmo database, com notificação no celular.

## Desenvolvimento com agentes

Veja [AGENTS.md](AGENTS.md) para regras, fluxo OpenSpec, skills relevantes e a regra obrigatória `graphify update .` antes de todo `git add`.
