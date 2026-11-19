# Graph Report - GreenKeeper.AnaloJs  (2026-11-19)

## Corpus Check
- 141 files · ~135,408 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1478 nodes · 1542 edges · 109 communities (103 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f150db75`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- UC-01: Validar Acesso Exclusivo por Celular (Mobile-Only Gate)
- 1. Dashboard Botânico (`Minhas Plantas`)
- Decisions
- concept.md
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- proposal.md
- ADDED Requirements
- Tasks
- ADDED Requirements
- ADDED Requirements
- UC-03: Interagir Localmente com o Dashboard (Concluir Tarefa, Selecionar Ambiente, Ajustar Umidificador)
- AGENTS.md — GreenKeeper.AnaloJs
- RTK - Rust Token Killer (Google Antigravity)
- UC-04: Instalação PWA e Captura Automatizada de Prints
- dependencies
- greenkeeper-analojs
- devDependencies
- app.spec.ts
- scripts
- PwaRegistrationPort
- sw.js
- architecture.spec.ts
- SKILL.md
- SKILL.md
- SKILL.md
- Netlify configuration
- Netlify Server
- index.ts
- Netlify caching
- Netlify Image CDN
- Netlify caching
- Netlify Image CDN
- 3. Requisitos Funcionais por Módulo
- Netlify Deployment Patterns
- Netlify Identity
- Netlify Deployment Patterns
- Netlify Identity
- index.page.ts
- Netlify Agent Runner
- Netlify deploy
- Netlify Forms
- Netlify Agent Runner
- Netlify deploy
- Netlify Forms
- 1. Dashboard Botânico (`Minhas Plantas`)
- Netlify CLI Commands Reference
- Gerador de PRD e Specs Funcionais
- Netlify CLI Commands Reference
- Gerador de PRD e Specs Funcionais
- Design System - GreenKeeper
- Migrations
- Next.js on Netlify
- Migrations
- Next.js on Netlify
- Decisions
- Netlify AI Gateway
- Switching to Netlify Database
- Astro on Netlify
- Netlify AI Gateway
- Switching to Netlify Database
- Astro on Netlify
- concept.md
- ADDED Requirements
- Netlify access control — pick the protection layer
- Netlify CLI commands for Netlify Database
- User-Uploaded Images Pipeline
- Netlify access control — pick the protection layer
- Netlify CLI commands for Netlify Database
- User-Uploaded Images Pipeline
- ADDED Requirements
- Vite + React on Netlify
- Vite + React on Netlify
- ADDED Requirements
- PwaRegistrationPort
- Two-Layer Pattern: Company-Only Access + Per-User Identity
- Advanced Identity Patterns
- Two-Layer Pattern: Company-Only Access + Per-User Identity
- Advanced Identity Patterns
- proposal.md
- ADDED Requirements
- Tasks
- Local development
- netlify.toml — Build Configuration for Deploys
- SvelteKit on Netlify
- TanStack Start on Netlify
- Local development
- netlify.toml — Build Configuration for Deploys
- SvelteKit on Netlify
- TanStack Start on Netlify
- Legacy Netlify DB extension (deprecated)
- Netlify Database — operational footguns
- Nuxt on Netlify
- Legacy Netlify DB extension (deprecated)
- Netlify Database — operational footguns
- Nuxt on Netlify
- ADDED Requirements
- ADDED Requirements
- Netlify Identity — authorization and session gotchas
- Netlify Identity — authorization and session gotchas
- Documentation Writer
- Documentation Writer
- Steps

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 23 edges
2. `DashboardSnapshot` - 19 edges
3. `Netlify Functions` - 19 edges
4. `Netlify Functions` - 19 edges
5. `Netlify Blobs` - 17 edges
6. `Netlify Blobs` - 17 edges
7. `Netlify configuration` - 15 edges
8. `Netlify Database` - 15 edges
9. `Netlify MCP Servers` - 15 edges
10. `Netlify configuration` - 15 edges

## Surprising Connections (you probably didn't know these)
- `mobileOnlyGuard()` --indirect_call--> `EvaluateDeviceAccessUseCase`  [INFERRED]
  src/app/guards/mobile-only.guard.ts → src/application/use-cases.ts
- `provideGreenKeeperDependencies()` --indirect_call--> `EvaluateDeviceAccessUseCase`  [INFERRED]
  src/composition/index.ts → src/application/use-cases.ts
- `provideGreenKeeperDependencies()` --indirect_call--> `LoadDashboardUseCase`  [INFERRED]
  src/composition/index.ts → src/application/use-cases.ts
- `provideGreenKeeperDependencies()` --indirect_call--> `SelectRoomUseCase`  [INFERRED]
  src/composition/index.ts → src/application/use-cases.ts
- `provideGreenKeeperDependencies()` --indirect_call--> `CompletePlantTaskUseCase`  [INFERRED]
  src/composition/index.ts → src/application/use-cases.ts

## Import Cycles
- None detected.

## Communities (109 total, 6 thin omitted)

### Community 0 - "UC-01: Validar Acesso Exclusivo por Celular (Mobile-Only Gate)"
Cohesion: 0.04
Nodes (44): CLI reference (`netlify database`), Constraints, Database branches (deploy-time), Drizzle ORM, Local development, Migrations, Modern client (reach for this), Netlify Database (+36 more)

### Community 1 - "1. Dashboard Botânico (`Minhas Plantas`)"
Cohesion: 0.08
Nodes (24): CLI reference (`netlify database`), Constraints, Database branches (deploy-time), Drizzle ORM, Local development, Migrations, Modern client (reach for this), Netlify Database (+16 more)

### Community 2 - "Decisions"
Cohesion: 0.05
Nodes (36): 10. Stack, 11. Justificativa da stack, 12. Fases de construção, 13. Specs funcionais detalhadas, 14. Ordem recomendada de implementação, 1. Visão geral, 2. Problema que resolve, 3. Público-alvo (+28 more)

### Community 3 - "concept.md"
Cohesion: 0.07
Nodes (25): Access control (default to private), Choosing a store type, CLI and UI, Concurrency: atomic conditional writes, Consistency, Constraints, Core writes and reads, Deleting (+17 more)

### Community 4 - "ADDED Requirements"
Cohesion: 0.04
Nodes (45): Access control (default to private), Choosing a store type, CLI and UI, Concurrency: atomic conditional writes, Consistency, Constraints, Core writes and reads, Deleting (+37 more)

### Community 5 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): Conditional requests, `Context`, Declarations, Endpoint, Environment variables, Error handling (`onError`), Files, ⚠️ Footguns (+16 more)

### Community 6 - "ADDED Requirements"
Cohesion: 0.08
Nodes (24): Conditional requests, `Context`, Declarations, Endpoint, Environment variables, Error handling (`onError`), Files, ⚠️ Footguns (+16 more)

### Community 7 - "proposal.md"
Cohesion: 0.08
Nodes (23): Angular, Astro, Build settings by framework, Deploy via CLI (Express, Nuxt, React, Vite), Eleventy, Env vars: modern rules (read first), Express, Gatsby (+15 more)

### Community 8 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): Angular, Astro, Build settings by framework, Deploy via CLI (Express, Nuxt, React, Vite), Eleventy, Env vars: modern rules (read first), Express, Gatsby (+15 more)

### Community 9 - "Tasks"
Cohesion: 0.09
Nodes (21): Background functions (long-running), Bundling & files on disk, Config object, Context object, Custom path routing, Fetchable module shape (alternative), File locations, Integrations (+13 more)

### Community 10 - "ADDED Requirements"
Cohesion: 0.09
Nodes (21): Background functions (long-running), Bundling & files on disk, Config object, Context object, Custom path routing, Fetchable module shape (alternative), File locations, Integrations (+13 more)

### Community 11 - "ADDED Requirements"
Cohesion: 0.10
Nodes (20): Cenários de Teste — Frontend E2E, Cenários de Teste — Frontend E2E, Cenários de Teste — Frontend E2E, Cenários de Teste — Frontend E2E, Cenários de Teste — Frontend Unit, Cenários de Teste — Frontend Unit, Cenários de Teste — Frontend Unit, Cenários de Teste — Frontend Unit (+12 more)

### Community 12 - "UC-03: Interagir Localmente com o Dashboard (Concluir Tarefa, Selecionar Ambiente, Ajustar Umidificador)"
Cohesion: 0.06
Nodes (31): AGENTS.md — GreenKeeper.AnaloJs, Arquitetura (Clean Architecture pragmática no frontend), Contexto do projeto, Diretrizes essenciais, Escopo atual, Governança de ferramentas, Nomenclatura, O que é o projeto (+23 more)

### Community 13 - "AGENTS.md — GreenKeeper.AnaloJs"
Cohesion: 0.06
Nodes (35): angularCompilerOptions, enableI18nLegacyMessageIdFormat, strictInjectionParameters, strictInputAccessModifiers, strictTemplates, compileOnSave, compilerOptions, baseUrl (+27 more)

### Community 14 - "RTK - Rust Token Killer (Google Antigravity)"
Cohesion: 0.40
Nodes (4): Meta Commands, RTK - Rust Token Killer (Google Antigravity), Rule, Why

### Community 15 - "UC-04: Instalação PWA e Captura Automatizada de Prints"
Cohesion: 0.06
Nodes (36): build, serve, test, builder, configurations, defaultConfiguration, options, development (+28 more)

### Community 16 - "dependencies"
Cohesion: 0.10
Nodes (19): Custom headers, Environment variables, Functions, Ignore builds, Injecting env values into headers/redirects, JavaScript SPAs, Modern vs legacy syntax to reach for, Monorepos (+11 more)

### Community 17 - "greenkeeper-analojs"
Cohesion: 0.13
Nodes (3): DashboardRepositoryPort, DashboardSnapshot, InMemoryDashboardRepository

### Community 18 - "devDependencies"
Cohesion: 0.05
Nodes (43): dependencies, @analogjs/router, @angular/common, @angular/compiler, @angular/core, @angular/platform-browser, @angular/router, rxjs (+35 more)

### Community 19 - "app.spec.ts"
Cohesion: 0.15
Nodes (12): sampleSnapshot, DeviceAccessDecision, DeviceAccessReason, FocusInspectionTask, PlantFocusSummary, PlantMetrics, RoomPlantSummary, RoomTone (+4 more)

### Community 20 - "scripts"
Cohesion: 0.10
Nodes (15): AppConfig, AppConfigPort, DeviceSignalsPort, PwaRegistrationPort, AppEnvironment, DeviceSignals, BrowserDeviceSignalsAdapter, BrowserDeviceSource (+7 more)

### Community 21 - "PwaRegistrationPort"
Cohesion: 0.10
Nodes (19): Background work after responding, Client reconnect, Configuration, Context (`context` arg or `getContext()`), Edge caching, Entry file and detection, Errors, Examples (+11 more)

### Community 32 - "Netlify configuration"
Cohesion: 0.10
Nodes (19): Custom headers, Environment variables, Functions, Ignore builds, Injecting env values into headers/redirects, JavaScript SPAs, Modern vs legacy syntax to reach for, Monorepos (+11 more)

### Community 33 - "Netlify Server"
Cohesion: 0.10
Nodes (19): Background work after responding, Client reconnect, Configuration, Context (`context` arg or `getContext()`), Edge caching, Entry file and detection, Errors, Examples (+11 more)

### Community 34 - "index.ts"
Cohesion: 0.34
Nodes (13): AdjustHumidifierUseCase, CompletePlantTaskUseCase, EvaluateDeviceAccessUseCase, LoadDashboardUseCase, RegisterPwaUseCase, SelectRoomUseCase, ToggleFocusFavoriteUseCase, TriggerPlannedFeatureNoticeUseCase (+5 more)

### Community 35 - "Netlify caching"
Cohesion: 0.12
Nodes (16): Cache API (`caches` global), Cache-control header to reach for, Cache key variation — `Netlify-Vary`, Cache tags & opt-out, `cacheHeaders(settings)` → header object, Debugging with `Cache-Status`, Directives, Durable cache (+8 more)

### Community 36 - "Netlify Image CDN"
Cohesion: 0.12
Nodes (16): Additional constraints, Blur placeholders (fm=blurhash), Caching headers, Common transformations, fit behavior, Format notes, Framework image handling, Local development (+8 more)

### Community 37 - "Netlify caching"
Cohesion: 0.12
Nodes (16): Cache API (`caches` global), Cache-control header to reach for, Cache key variation — `Netlify-Vary`, Cache tags & opt-out, `cacheHeaders(settings)` → header object, Debugging with `Cache-Status`, Directives, Durable cache (+8 more)

### Community 38 - "Netlify Image CDN"
Cohesion: 0.12
Nodes (16): Additional constraints, Blur placeholders (fm=blurhash), Caching headers, Common transformations, fit behavior, Format notes, Framework image handling, Local development (+8 more)

### Community 39 - "3. Requisitos Funcionais por Módulo"
Cohesion: 0.12
Nodes (15): 1. Visão do Produto e Proposta de Valor, 2. Ecossistema de Aplicações e Plataformas, 3.1. Autenticação, Cadastro Local-First e Sessão, 3.2. Perfil do Usuário e Configurações (`ConfigSheet` & `PerfilPage`), 3.3. Gestão de Ambientes: Casas e Áreas, 3.4. Gestão de Plantas e Inteligência Botânica (Espécies), 3.5. Rotina de Cuidados e Tarefas Diárias, 3.6. Inteligência Climática e Supressão por Chuva (+7 more)

### Community 40 - "Netlify Deployment Patterns"
Cohesion: 0.13
Nodes (14): "Build failed" / exit code 1, Custom Domains, Environment Variables, Netlify Deployment Patterns, "No site linked", "Not logged in", Pattern 1: Git-Based Continuous Deployment (primary), Pattern 2: Linking an Existing Repo to an Existing Site (+6 more)

### Community 41 - "Netlify Identity"
Cohesion: 0.13
Nodes (14): Audit log (Pro plans or higher), CDN-edge RBAC (redirect rules), Client auth (browser), Configuration (dashboard-only), CSRF: required for server-side auth endpoints, Emails (Pro plans or higher), External JWT providers (Enterprise), Identity event functions (+6 more)

### Community 42 - "Netlify Deployment Patterns"
Cohesion: 0.13
Nodes (14): "Build failed" / exit code 1, Custom Domains, Environment Variables, Netlify Deployment Patterns, "No site linked", "Not logged in", Pattern 1: Git-Based Continuous Deployment (primary), Pattern 2: Linking an Existing Repo to an Existing Site (+6 more)

### Community 43 - "Netlify Identity"
Cohesion: 0.13
Nodes (14): Audit log (Pro plans or higher), CDN-edge RBAC (redirect rules), Client auth (browser), Configuration (dashboard-only), CSRF: required for server-side auth endpoints, Emails (Pro plans or higher), External JWT providers (Enterprise), Identity event functions (+6 more)

### Community 44 - "index.page.ts"
Cohesion: 0.23
Nodes (7): App, appConfig, Component, mobileOnlyGuard(), DesktopInfoPage, Component, routeMeta

### Community 45 - "Netlify Agent Runner"
Cohesion: 0.14
Nodes (13): Creating Agent Tasks, How Agent Tasks Run, List tasks, Managing Agent Tasks, Netlify Agent Runner, Options, Prerequisites, Show task details (+5 more)

### Community 46 - "Netlify deploy"
Cohesion: 0.14
Nodes (13): Constraints & gotchas, Deploy permissions (private repos), Deploy Previews & branch deploys, Deploy to Netlify button, Fixing a failed deploy — no rollbacks, Locking, skipping, and manual production deploys, Managing deploys, Modern CLI (+5 more)

### Community 47 - "Netlify Forms"
Cohesion: 0.14
Nodes (13): AJAX submission, Constraints, Custom success page, Debugging missing submissions, Email notifications & subject line, File uploads, JS-rendered / SSR / framework forms (Next.js, Nuxt, SvelteKit, Astro, Gatsby), Netlify Forms (+5 more)

### Community 48 - "Netlify Agent Runner"
Cohesion: 0.14
Nodes (13): Creating Agent Tasks, How Agent Tasks Run, List tasks, Managing Agent Tasks, Netlify Agent Runner, Options, Prerequisites, Show task details (+5 more)

### Community 49 - "Netlify deploy"
Cohesion: 0.14
Nodes (13): Constraints & gotchas, Deploy permissions (private repos), Deploy Previews & branch deploys, Deploy to Netlify button, Fixing a failed deploy — no rollbacks, Locking, skipping, and manual production deploys, Managing deploys, Modern CLI (+5 more)

### Community 50 - "Netlify Forms"
Cohesion: 0.14
Nodes (13): AJAX submission, Constraints, Custom success page, Debugging missing submissions, Email notifications & subject line, File uploads, JS-rendered / SSR / framework forms (Next.js, Nuxt, SvelteKit, Astro, Gatsby), Netlify Forms (+5 more)

### Community 51 - "1. Dashboard Botânico (`Minhas Plantas`)"
Cohesion: 0.14
Nodes (13): 1. Dashboard Botânico (`Minhas Plantas`), 2. Tela Informativa (Exclusiva Desktop / Tablet), Ações e Navegação, Ações e Navegação, Componentes, Componentes, Estados da Tela, Estados da Tela (+5 more)

### Community 52 - "Netlify CLI Commands Reference"
Cohesion: 0.15
Nodes (12): Authentication, Build, Common Flags, Deployment, Environment variables and local dev, Exit Codes, Functions (Serverless), Logs (+4 more)

### Community 53 - "Gerador de PRD e Specs Funcionais"
Cohesion: 0.15
Nodes (12): Análise crítica antes de gerar, Etapa 1 — Produto / Feature, Etapa 2 — Stack (alto nível), Etapa 3 — Fases e specs, Gerador de PRD e Specs Funcionais, Geração do arquivo, Mensagem inicial, O que NÃO fazer (+4 more)

### Community 54 - "Netlify CLI Commands Reference"
Cohesion: 0.15
Nodes (12): Authentication, Build, Common Flags, Deployment, Environment variables and local dev, Exit Codes, Functions (Serverless), Logs (+4 more)

### Community 55 - "Gerador de PRD e Specs Funcionais"
Cohesion: 0.15
Nodes (12): Análise crítica antes de gerar, Etapa 1 — Produto / Feature, Etapa 2 — Stack (alto nível), Etapa 3 — Fases e specs, Gerador de PRD e Specs Funcionais, Geração do arquivo, Mensagem inicial, O que NÃO fazer (+4 more)

### Community 56 - "Design System - GreenKeeper"
Cohesion: 0.15
Nodes (12): 1. Fundamentos Visuais & Brand Personality, 2. Paleta de Cores (Color Tokens), 3. Tipografia (Typography Scale), 4. Estrutura, Elevações & Formas (Radii & Surfaces), 5. Componentes Principais, Cores Primárias & Destaque (Emerald Botanical), Design System - GreenKeeper, Escala de Tamanhos (+4 more)

### Community 57 - "Migrations"
Cohesion: 0.17
Nodes (11): Admin interfaces instead of repeated DML migrations, Breaking changes — expand and contract, File layout and naming, Iterating on a migration you haven't shipped yet, Manual SQL migrations, Migrations, Never apply migrations to a hosted database yourself, Preview branching (+3 more)

### Community 58 - "Next.js on Netlify"
Cohesion: 0.17
Nodes (11): API Routes, ISR (Incremental Static Regeneration), Key Configuration, Known Patterns, Local Development, Middleware, next.config.js, Next.js on Netlify (+3 more)

### Community 59 - "Migrations"
Cohesion: 0.17
Nodes (11): Admin interfaces instead of repeated DML migrations, Breaking changes — expand and contract, File layout and naming, Iterating on a migration you haven't shipped yet, Manual SQL migrations, Migrations, Never apply migrations to a hosted database yourself, Preview branching (+3 more)

### Community 60 - "Next.js on Netlify"
Cohesion: 0.17
Nodes (11): API Routes, ISR (Incremental Static Regeneration), Key Configuration, Known Patterns, Local Development, Middleware, next.config.js, Next.js on Netlify (+3 more)

### Community 61 - "Decisions"
Cohesion: 0.17
Nodes (11): 1. AnalogJS configurado como SPA estática (`ssr: false`) para Netlify, 2. Clean Architecture pragmática para Frontend em TypeScript, 3. Regra pura para Mobile-Only Gate + Override controlado, 4. Visual do Dashboard fiel ao HTML *GreenKeeper — Cuidados Botânicos* adaptado a `100dvh`, 5. Estratégia de Cobertura Unitária 100% (Vitest + v8), 6. Captura automatizada de prints via Playwright em Docker, 7. Configuração Local vs Produção (Netlify) e Roadmap de Próximos Proposes, Context (+3 more)

### Community 62 - "Netlify AI Gateway"
Cohesion: 0.18
Nodes (10): Billing, limits, constraints, Env vars — which to use, Footguns (read first), Full example (Vite + React + Function), Local development, Netlify AI Gateway, Netlify house rules (ai-gateway), Provider SDKs (instantiate with no args) (+2 more)

### Community 63 - "Switching to Netlify Database"
Cohesion: 0.18
Nodes (10): Cleanup, Operational notes for agents, Phase 1 — Provision the new database, Phase 2 — Swap the code and rehearse on a preview, Phase 3 — Cut over production, Pre-flight: filename ordering for migrated migration files, Prerequisites, Rolling back (+2 more)

### Community 64 - "Astro on Netlify"
Cohesion: 0.18
Nodes (10): API Routes, Astro on Netlify, Build and Deploy, Custom 404, Forms (HTML Pattern), Local Development, Manual Setup, Output Modes (+2 more)

### Community 65 - "Netlify AI Gateway"
Cohesion: 0.18
Nodes (10): Billing, limits, constraints, Env vars — which to use, Footguns (read first), Full example (Vite + React + Function), Local development, Netlify AI Gateway, Netlify house rules (ai-gateway), Provider SDKs (instantiate with no args) (+2 more)

### Community 66 - "Switching to Netlify Database"
Cohesion: 0.18
Nodes (10): Cleanup, Operational notes for agents, Phase 1 — Provision the new database, Phase 2 — Swap the code and rehearse on a preview, Phase 3 — Cut over production, Pre-flight: filename ordering for migrated migration files, Prerequisites, Rolling back (+2 more)

### Community 67 - "Astro on Netlify"
Cohesion: 0.18
Nodes (10): API Routes, Astro on Netlify, Build and Deploy, Custom 404, Forms (HTML Pattern), Local Development, Manual Setup, Output Modes (+2 more)

### Community 68 - "concept.md"
Cohesion: 0.18
Nodes (10): Arquitetura Macro, Ator 1: Usuário (no Celular), Ator 2: Visitante (em Desktop ou Tablet), Fora de Escopo, Funcionalidades por Área, Jornadas de Usuário, Mapa Funcional, Riscos Iniciais (+2 more)

### Community 69 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: 100% Frontend AnalogJS Architecture Without Custom Backend, Requirement: Local and Production Environment Configuration, Requirement: Pragmatic Frontend Clean Architecture Layering, Scenario: Application layer dependency direction, Scenario: Composition root dependency wiring, Scenario: Domain layer isolation, Scenario: Netlify build configuration present (+2 more)

### Community 70 - "Netlify access control — pick the protection layer"
Cohesion: 0.20
Nodes (9): Constraints & footguns, Decision guide (this skill's job), First: disambiguate "auth" — three unrelated layers, Identify the visitor: `context.user`, Key distinction: Private vs Password, Netlify access control — pick the protection layer, Netlify house rules (access-control), SSO-session symptom: 401s after ~1 hour (+1 more)

### Community 71 - "Netlify CLI commands for Netlify Database"
Cohesion: 0.20
Nodes (9): Netlify CLI commands for Netlify Database, `netlify database connect`, `netlify database init`, `netlify database migrations apply`, `netlify database migrations new`, `netlify database migrations pull`, `netlify database migrations reset`, `netlify database reset` (+1 more)

### Community 72 - "User-Uploaded Images Pipeline"
Cohesion: 0.20
Nodes (9): Architecture, Astro Upload (API Route), CDN Redirect, Client-Side Upload (React Example), Dependencies, Key Points, Serve Handler, Upload Handler (+1 more)

### Community 73 - "Netlify access control — pick the protection layer"
Cohesion: 0.20
Nodes (9): Constraints & footguns, Decision guide (this skill's job), First: disambiguate "auth" — three unrelated layers, Identify the visitor: `context.user`, Key distinction: Private vs Password, Netlify access control — pick the protection layer, Netlify house rules (access-control), SSO-session symptom: 401s after ~1 hour (+1 more)

### Community 74 - "Netlify CLI commands for Netlify Database"
Cohesion: 0.20
Nodes (9): Netlify CLI commands for Netlify Database, `netlify database connect`, `netlify database init`, `netlify database migrations apply`, `netlify database migrations new`, `netlify database migrations pull`, `netlify database migrations reset`, `netlify database reset` (+1 more)

### Community 75 - "User-Uploaded Images Pipeline"
Cohesion: 0.20
Nodes (9): Architecture, Astro Upload (API Route), CDN Redirect, Client-Side Upload (React Example), Dependencies, Key Points, Serve Handler, Upload Handler (+1 more)

### Community 76 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: Botanical Dashboard Visual Structure Adapted to Real Mobile Viewport, Requirement: Direct Entry to Dashboard Without Login, Requirement: In-Memory Repository Adapter and Local Dashboard Interactions, Scenario: Mobile user opens the root URL, Scenario: Mobile viewport displays full botanical dashboard without simulated bezel, Scenario: User adjusts humidifier target level, Scenario: User completes pending watering task on active plant card (+1 more)

### Community 77 - "Vite + React on Netlify"
Cohesion: 0.22
Nodes (8): Build and Deploy, Forms (AJAX Pattern), Local Dev, Netlify Functions, Setup, SPA Routing, Vite + React on Netlify, What the Plugin Does

### Community 78 - "Vite + React on Netlify"
Cohesion: 0.22
Nodes (8): Build and Deploy, Forms (AJAX Pattern), Local Dev, Netlify Functions, Setup, SPA Routing, Vite + React on Netlify, What the Plugin Does

### Community 79 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: Controlled Development and Test Override, Requirement: Informative Screen for Non-Mobile Visitors, Requirement: Mobile-Only Access Detection, Scenario: Desktop or tablet browser accesses the app, Scenario: Non-mobile visitor lands on root or deep route, Scenario: Production build ignores dev override query parameters, Scenario: Standard mobile phone browser accesses the app

### Community 81 - "Two-Layer Pattern: Company-Only Access + Per-User Identity"
Cohesion: 0.25
Nodes (7): Option A — Invite-only Netlify Identity (best default for "just my team"), Option B — Auth0 extension (best for a real org with an existing IdP), Option C — Basic Password Protection + Netlify Identity, Option D — Enterprise team-login perimeter + Netlify Identity (the genuine two-layer, double login), Two-Layer Pattern: Company-Only Access + Per-User Identity, What an agent can and can't see, Why the double login can't be wired away (today)

### Community 82 - "Advanced Identity Patterns"
Cohesion: 0.25
Nodes (7): Advanced Identity Patterns, Email Change, Full API Reference, Invite Acceptance, Password Recovery, Session Hydration, SSR Integration Patterns

### Community 83 - "Two-Layer Pattern: Company-Only Access + Per-User Identity"
Cohesion: 0.25
Nodes (7): Option A — Invite-only Netlify Identity (best default for "just my team"), Option B — Auth0 extension (best for a real org with an existing IdP), Option C — Basic Password Protection + Netlify Identity, Option D — Enterprise team-login perimeter + Netlify Identity (the genuine two-layer, double login), Two-Layer Pattern: Company-Only Access + Per-User Identity, What an agent can and can't see, Why the double login can't be wired away (today)

### Community 84 - "Advanced Identity Patterns"
Cohesion: 0.25
Nodes (7): Advanced Identity Patterns, Email Change, Full API Reference, Invite Acceptance, Password Recovery, Session Hydration, SSR Integration Patterns

### Community 85 - "proposal.md"
Cohesion: 0.25
Nodes (7): Capabilities, Explicitamente diferido para próximos proposes (registrado no `README.md` / `AGENTS.md`), Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 86 - "ADDED Requirements"
Cohesion: 0.25
Nodes (7): ADDED Requirements, Requirement: 100% Unit Test Coverage Enforcement, Requirement: Automated Screen Capture via Playwright, Requirement: Fully Containerized Local Workflow via Docker Compose, Scenario: Coverage check fails below 100%, Scenario: Generating mobile and desktop screenshots, Scenario: Running unit tests inside Docker

### Community 87 - "Tasks"
Cohesion: 0.25
Nodes (7): 0. Branch, 1. Governança, RTK, Graphify e Documentação Base, 2. Fundação AnalogJS, Docker e Configurações Local/Produção, 3. Clean Architecture TS: Domain, Application, Infrastructure e Composition, 4. UI AnalogJS: Mobile-Only Gate, Tela Informativa e Dashboard Botânico, 5. Captura Automatizada de Prints (Playwright) e Validação Final, Tasks

### Community 88 - "Local development"
Cohesion: 0.29
Nodes (6): Applying migrations locally, Common issues, Inspecting the local DB, Local development, Resetting local data, Running the app

### Community 89 - "netlify.toml — Build Configuration for Deploys"
Cohesion: 0.29
Nodes (6): Build Settings, Build-Time Environment and Context Overrides, Monorepo with a Base Directory, netlify.toml — Build Configuration for Deploys, Resources, Validating

### Community 90 - "SvelteKit on Netlify"
Cohesion: 0.29
Nodes (6): Edge Rendering, Environment Variables, Local Development, Setup, SvelteKit on Netlify, What the Adapter Does

### Community 91 - "TanStack Start on Netlify"
Cohesion: 0.29
Nodes (6): Build and Deploy, Local Development, Server Functions, Setup, TanStack Start on Netlify, What the Plugin Does

### Community 92 - "Local development"
Cohesion: 0.29
Nodes (6): Applying migrations locally, Common issues, Inspecting the local DB, Local development, Resetting local data, Running the app

### Community 93 - "netlify.toml — Build Configuration for Deploys"
Cohesion: 0.29
Nodes (6): Build Settings, Build-Time Environment and Context Overrides, Monorepo with a Base Directory, netlify.toml — Build Configuration for Deploys, Resources, Validating

### Community 94 - "SvelteKit on Netlify"
Cohesion: 0.29
Nodes (6): Edge Rendering, Environment Variables, Local Development, Setup, SvelteKit on Netlify, What the Adapter Does

### Community 95 - "TanStack Start on Netlify"
Cohesion: 0.29
Nodes (6): Build and Deploy, Local Development, Server Functions, Setup, TanStack Start on Netlify, What the Plugin Does

### Community 96 - "Legacy Netlify DB extension (deprecated)"
Cohesion: 0.33
Nodes (5): Do not confuse the two, Encourage migration, How to recognize an extension-based project, Keeping an extension project working, Legacy Netlify DB extension (deprecated)

### Community 97 - "Netlify Database — operational footguns"
Cohesion: 0.33
Nodes (5): A preview branch is a live copy of production data — including any PII, An unclaimed legacy-extension database is on a deletion timer, Create the database client once, at module scope — never per request, Netlify Database — operational footguns, Scale-to-zero cold starts

### Community 98 - "Nuxt on Netlify"
Cohesion: 0.33
Nodes (5): Environment Variables, Local Development, Nuxt on Netlify, Server Routes, Setup

### Community 99 - "Legacy Netlify DB extension (deprecated)"
Cohesion: 0.33
Nodes (5): Do not confuse the two, Encourage migration, How to recognize an extension-based project, Keeping an extension project working, Legacy Netlify DB extension (deprecated)

### Community 100 - "Netlify Database — operational footguns"
Cohesion: 0.33
Nodes (5): A preview branch is a live copy of production data — including any PII, An unclaimed legacy-extension database is on a deletion timer, Create the database client once, at module scope — never per request, Netlify Database — operational footguns, Scale-to-zero cold starts

### Community 101 - "Nuxt on Netlify"
Cohesion: 0.33
Nodes (5): Environment Variables, Local Development, Nuxt on Netlify, Server Routes, Setup

### Community 102 - "ADDED Requirements"
Cohesion: 0.33
Nodes (5): ADDED Requirements, Requirement: Installable Web App Manifest, Requirement: Service Worker Registration for PWA Shell, Scenario: Browser evaluates PWA installability metadata, Scenario: Production build emits service worker assets

### Community 103 - "ADDED Requirements"
Cohesion: 0.33
Nodes (5): ADDED Requirements, Requirement: Project README and AGENTS Documentation, Requirement: RTK and Graphify Initialization with Mandatory Pre-Stage Update Rule, Scenario: Developer or AI agent inspects repository root docs, Scenario: Graphify and RTK initialized in repository

### Community 104 - "Netlify Identity — authorization and session gotchas"
Cohesion: 0.40
Nodes (4): Admin operations run only in the Functions runtime, Netlify Identity — authorization and session gotchas, Redirect gating only covers CDN document requests, Role changes don't affect live sessions until the JWT refreshes

### Community 105 - "Netlify Identity — authorization and session gotchas"
Cohesion: 0.40
Nodes (4): Admin operations run only in the Functions runtime, Netlify Identity — authorization and session gotchas, Redirect gating only covers CDN document requests, Role changes don't affect live sessions until the JWT refreshes

### Community 106 - "Documentation Writer"
Cohesion: 0.18
Nodes (10): Best Practices, Documentation Writer, Documents Under Management, Execution Protocol — /documentation-writer, Responsibilities, Step 1 — Explore the project, Step 2 — Compare with current documents, Step 3 — Report before editing (+2 more)

### Community 107 - "Documentation Writer"
Cohesion: 0.18
Nodes (10): Best Practices, Documentation Writer, Documents Under Management, Execution Protocol — /documentation-writer, Responsibilities, Step 1 — Explore the project, Step 2 — Compare with current documents, Step 3 — Report before editing (+2 more)

### Community 108 - "Steps"
Cohesion: 0.15
Nodes (12): 1. Detect package manager, 2. Install dependencies, 3. Initialize Husky, 4. Create `.husky/pre-commit`, 5. Create `.lintstagedrc`, 6. Create `.prettierrc` (if missing), 7. Verify, 8. Commit (+4 more)

## Knowledge Gaps
- **1059 isolated node(s):** `$schema`, `version`, `newProjectRoot`, `projectType`, `root` (+1054 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DashboardSnapshot` connect `greenkeeper-analojs` to `index.ts`, `app.spec.ts`, `index.page.ts`, `scripts`?**
  _High betweenness centrality (0.001) - this node is a cross-community bridge._
- **What connects `$schema`, `version`, `newProjectRoot` to the rest of the system?**
  _1059 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UC-01: Validar Acesso Exclusivo por Celular (Mobile-Only Gate)` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Should `1. Dashboard Botânico (`Minhas Plantas`)` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Decisions` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Should `concept.md` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `ADDED Requirements` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._