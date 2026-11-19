# 🌿 GreenKeeper.AnaloJs

PWA de cuidado de plantas domésticas, **exclusivo para celular**, construído em **AnalogJS (Angular 22 + Vite)** e **100% frontend (sem backend próprio)**. Publicado como site estático no **Netlify**.

> Este repositório contém Clean Architecture em TypeScript, 100% de cobertura de testes unitários (Vitest), Mobile-Only Gate, autenticação Google via Auth0, banco de dados Supabase/PostgreSQL, Dashboard Botânico, captura automatizada de prints via Playwright em Docker e convite de familiar com edição provisória.

---

## 📱 Prints das Telas (Gerados via Playwright em Docker)

| Dashboard Mobile (`390x844`) | Tela Informativa Desktop/Tablet (`1280x800`) |
| :---: | :---: |
| ![Dashboard Mobile](screenshots/mobile-dashboard.png) | ![Tela Informativa Desktop](screenshots/desktop-info.png) |

---

## ✨ Funcionalidades

- **Autenticação Google via Auth0**: login/logout, sessão e guard de rota que protege todas as telas contra acesso não autenticado
- **Mobile-Only Gate (`mobileOnlyGuard` + `EvaluateDeviceAccessUseCase`)**:
  - Libera o aplicativo apenas quando reconhece um smartphone (User-Agent mobile / `userAgentData.mobile` / viewport touch de celular).
  - Bloqueia acessos por desktop e tablet, redirecionando para a **Tela Informativa** (`/desktop-info`).
  - Permite override controlado (`?mobilePreview=1`) **somente fora de produção** (`VITE_APP_ENV !== 'production'`).
- **Dashboard Botânico Direto (`/`)**:
  - Abertura direta no Dashboard (após autenticação), fiel ao layout *GreenKeeper — Cuidados Botânicos* adaptado para ocupar 100% da tela real do celular (`100dvh`, sem moldura simulada de iPhone nem barra `09:41`).
  - Ambientes empilhados (*Corredor*, *Sala de Estar*, *Banheiro / Calathea* com métricas de Água e Luz e conclusão de rega pendente).
  - Card *Planta em Foco* (*Aloe Arborescens* com *Rega* e *Inspeção*).
  - Widget *Umidade do Ambiente Ideal* (`64%`) com controle interativo de *Nível Umidificador* (`-` / `+`).
  - Dock flutuante inferior com atalho de câmera.
- **Cadastro e listagem de plantas por ambiente/área**: apelido, espécie, foto, notas e status (Ativa/Morta/Removida)
- **Identificação de planta por foto** (câmera/galeria)
- **Registro de cuidados** (rega, adubação, poda) com recálculo automático da próxima data
- **Tarefas diárias** (Hoje, Amanhã, Esta semana) com ações de concluir e adiar
- **Clima local** (temperatura e precipitação) com base na localização do usuário
- **Alertas** (rega atrasada, temperatura crítica, nova planta, cuidado concluído)
- **Perfil do usuário** (dados pessoais, endereço com CEP e GPS)
- **Convite de familiar**: acesso restrito a plantas, edição provisória com aprovação pelo dono
- **PWA Instalável**:
  - `manifest.webmanifest`, ícones (`192x192`, `512x512`) e Service Worker (`sw.js`) registrados no cliente.

---

## 🏛️ Arquitetura (Clean Architecture Pragmática no Frontend)

```text
src/
├── domain/          # Entidades, tipos e regras puras (zero imports de Angular/infra)
├── application/     # Casos de uso e ports (interfaces TS puras; só depende de domain)
├── infrastructure/  # Adapters concretos (Supabase, BrowserDeviceSignalsAdapter, ViteEnvConfigAdapter, BrowserPwaRegistrationAdapter)
├── composition/     # Composition Root (InjectionTokens + provideGreenKeeperDependencies)
├── app/             # Páginas AnalogJS (/ e /desktop-info) e guard mobileOnlyGuard
└── architecture.spec.ts # Testes automatizados de fronteira entre camadas
```

Regras de dependência: `domain` ← `application` ← `infrastructure`/`app`; `composition` conhece todos. `domain` e `application` nunca importam `@angular/*`, `@analogjs/*` nem `infrastructure`. Testes de fronteira validam isso.

Detalhes completos em [`docs/architecture.md`](docs/architecture.md) e visão do produto em [`docs/project-overview.md`](docs/project-overview.md).

---

## 🐳 Comandos via Docker Compose (Zero Pegada Local)

```bash
# Subir servidor de desenvolvimento (http://localhost:5173)
docker compose up app

# Executar testes unitários com exigência de 100% de cobertura (Vitest + v8)
docker compose run --rm test

# Gerar build estático de produção (dist/analog/public)
docker compose run --rm build

# Gerar prints automatizados das telas mobile e desktop (Playwright)
docker compose run --rm playwright
```

---

## ⚙️ Configurações Local e Produção (Netlify)

1. Copie `.env.example` para `.env` em desenvolvimento local (nunca commitar `.env`).
2. Em produção no **Netlify**, o arquivo [`netlify.toml`](netlify.toml) define o comando de build (`npm run build`), o diretório estático (`dist/analog/public`) e o fallback de SPA (`/* -> /index.html`).
3. Configure as variáveis públicas `VITE_*` na UI do Netlify com escopo **Builds**:
   - `VITE_APP_ENV=production`
   - *(Placeholders preparados para os próximos proposes: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`)*.

---

## 🗺️ Roadmap (Próximos Proposes)

- **Notificações push** para lembretes de cuidado e convites de familiar
- **Convite de familiar por email** com notificação no PWA instalado no celular da pessoa convidada (Realtime/Web Notification; Edge Functions para Web Push e email)

Itens já entregues neste escopo: autenticação Auth0 + Google, banco Supabase/PostgreSQL em develop e production, convite de familiar com edição provisória.

---

## 🤖 Governança e Agentes de IA

Consulte [`AGENTS.md`](AGENTS.md) para as regras completas do repositório, a lista curada de skills de `C:\Users\User\.skills-manager\skills` e a regra obrigatória de executar `graphify update .` antes de todo `git add`.
