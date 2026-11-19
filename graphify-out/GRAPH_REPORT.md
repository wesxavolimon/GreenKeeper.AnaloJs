# Graph Report - GreenKeeper.AnaloJs  (2026-11-19)

## Corpus Check
- 54 files · ~23,056 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 416 nodes · 547 edges · 32 communities (27 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4a593d51`
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

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 23 edges
2. `DashboardSnapshot` - 18 edges
3. `DashboardRepositoryPort` - 13 edges
4. `provideGreenKeeperDependencies()` - 12 edges
5. `Home` - 11 edges
6. `3. Requisitos Funcionais por Módulo` - 10 edges
7. `scripts` - 9 edges
8. `EvaluateDeviceAccessUseCase` - 9 edges
9. `InMemoryDashboardRepository` - 9 edges
10. `LoadDashboardUseCase` - 8 edges

## Surprising Connections (you probably didn't know these)
- `mobileOnlyGuard()` --indirect_call--> `EvaluateDeviceAccessUseCase`  [INFERRED]
  src/app/guards/mobile-only.guard.ts → src/application/use-cases.ts
- `BrowserDeviceSignalsAdapter` --implements--> `DeviceSignalsPort`  [EXTRACTED]
  src/infrastructure/browser-device-signals.adapter.ts → src/application/ports.ts
- `provideGreenKeeperDependencies()` --indirect_call--> `EvaluateDeviceAccessUseCase`  [INFERRED]
  src/composition/index.ts → src/application/use-cases.ts
- `provideGreenKeeperDependencies()` --indirect_call--> `LoadDashboardUseCase`  [INFERRED]
  src/composition/index.ts → src/application/use-cases.ts
- `provideGreenKeeperDependencies()` --indirect_call--> `SelectRoomUseCase`  [INFERRED]
  src/composition/index.ts → src/application/use-cases.ts

## Import Cycles
- None detected.

## Communities (32 total, 5 thin omitted)

### Community 0 - "UC-01: Validar Acesso Exclusivo por Celular (Mobile-Only Gate)"
Cohesion: 0.10
Nodes (20): Cenários de Teste — Frontend E2E, Cenários de Teste — Frontend E2E, Cenários de Teste — Frontend E2E, Cenários de Teste — Frontend E2E, Cenários de Teste — Frontend Unit, Cenários de Teste — Frontend Unit, Cenários de Teste — Frontend Unit, Cenários de Teste — Frontend Unit (+12 more)

### Community 1 - "1. Dashboard Botânico (`Minhas Plantas`)"
Cohesion: 0.14
Nodes (13): 1. Dashboard Botânico (`Minhas Plantas`), 2. Tela Informativa (Exclusiva Desktop / Tablet), Ações e Navegação, Ações e Navegação, Componentes, Componentes, Estados da Tela, Estados da Tela (+5 more)

### Community 2 - "Decisions"
Cohesion: 0.17
Nodes (11): 1. AnalogJS configurado como SPA estática (`ssr: false`) para Netlify, 2. Clean Architecture pragmática para Frontend em TypeScript, 3. Regra pura para Mobile-Only Gate + Override controlado, 4. Visual do Dashboard fiel ao HTML *GreenKeeper — Cuidados Botânicos* adaptado a `100dvh`, 5. Estratégia de Cobertura Unitária 100% (Vitest + v8), 6. Captura automatizada de prints via Playwright em Docker, 7. Configuração Local vs Produção (Netlify) e Roadmap de Próximos Proposes, Context (+3 more)

### Community 3 - "concept.md"
Cohesion: 0.18
Nodes (10): Arquitetura Macro, Ator 1: Usuário (no Celular), Ator 2: Visitante (em Desktop ou Tablet), Fora de Escopo, Funcionalidades por Área, Jornadas de Usuário, Mapa Funcional, Riscos Iniciais (+2 more)

### Community 4 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: 100% Frontend AnalogJS Architecture Without Custom Backend, Requirement: Local and Production Environment Configuration, Requirement: Pragmatic Frontend Clean Architecture Layering, Scenario: Application layer dependency direction, Scenario: Composition root dependency wiring, Scenario: Domain layer isolation, Scenario: Netlify build configuration present (+2 more)

### Community 5 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: Botanical Dashboard Visual Structure Adapted to Real Mobile Viewport, Requirement: Direct Entry to Dashboard Without Login, Requirement: In-Memory Repository Adapter and Local Dashboard Interactions, Scenario: Mobile user opens the root URL, Scenario: Mobile viewport displays full botanical dashboard without simulated bezel, Scenario: User adjusts humidifier target level, Scenario: User completes pending watering task on active plant card (+1 more)

### Community 6 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: Controlled Development and Test Override, Requirement: Informative Screen for Non-Mobile Visitors, Requirement: Mobile-Only Access Detection, Scenario: Desktop or tablet browser accesses the app, Scenario: Non-mobile visitor lands on root or deep route, Scenario: Production build ignores dev override query parameters, Scenario: Standard mobile phone browser accesses the app

### Community 7 - "proposal.md"
Cohesion: 0.25
Nodes (7): Capabilities, Explicitamente diferido para próximos proposes (registrado no `README.md` / `AGENTS.md`), Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 8 - "ADDED Requirements"
Cohesion: 0.25
Nodes (7): ADDED Requirements, Requirement: 100% Unit Test Coverage Enforcement, Requirement: Automated Screen Capture via Playwright, Requirement: Fully Containerized Local Workflow via Docker Compose, Scenario: Coverage check fails below 100%, Scenario: Generating mobile and desktop screenshots, Scenario: Running unit tests inside Docker

### Community 9 - "Tasks"
Cohesion: 0.25
Nodes (7): 0. Branch, 1. Governança, RTK, Graphify e Documentação Base, 2. Fundação AnalogJS, Docker e Configurações Local/Produção, 3. Clean Architecture TS: Domain, Application, Infrastructure e Composition, 4. UI AnalogJS: Mobile-Only Gate, Tela Informativa e Dashboard Botânico, 5. Captura Automatizada de Prints (Playwright) e Validação Final, Tasks

### Community 10 - "ADDED Requirements"
Cohesion: 0.33
Nodes (5): ADDED Requirements, Requirement: Installable Web App Manifest, Requirement: Service Worker Registration for PWA Shell, Scenario: Browser evaluates PWA installability metadata, Scenario: Production build emits service worker assets

### Community 11 - "ADDED Requirements"
Cohesion: 0.33
Nodes (5): ADDED Requirements, Requirement: Project README and AGENTS Documentation, Requirement: RTK and Graphify Initialization with Mandatory Pre-Stage Update Rule, Scenario: Developer or AI agent inspects repository root docs, Scenario: Graphify and RTK initialized in repository

### Community 12 - "UC-03: Interagir Localmente com o Dashboard (Concluir Tarefa, Selecionar Ambiente, Ajustar Umidificador)"
Cohesion: 0.10
Nodes (18): AGENTS.md — GreenKeeper.AnaloJs, Arquitetura (Clean Architecture pragmática no frontend), Escopo atual (esqueleto), Governança de ferramentas, Nomenclatura, O que é o projeto, Próximos proposes (registrados, FORA do escopo atual), Qualidade (+10 more)

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
Cohesion: 0.18
Nodes (11): dependencies, @analogjs/router, @angular/common, @angular/compiler, @angular/core, @angular/platform-browser, @angular/router, rxjs (+3 more)

### Community 17 - "greenkeeper-analojs"
Cohesion: 0.09
Nodes (25): App, appConfig, Component, mobileOnlyGuard(), DesktopInfoPage, Component, routeMeta, DashboardRepositoryPort (+17 more)

### Community 18 - "devDependencies"
Cohesion: 0.06
Nodes (32): description, devDependencies, @analogjs/platform, @analogjs/vite-plugin-angular, @analogjs/vitest-angular, @angular/build, @angular/cli, @angular/compiler-cli (+24 more)

### Community 19 - "app.spec.ts"
Cohesion: 0.11
Nodes (9): Home, Component, sampleSnapshot, DeviceAccessDecision, RoomPlantSummary, clampHumidityLevel(), countPendingTasks(), evaluateDeviceAccess() (+1 more)

### Community 20 - "scripts"
Cohesion: 0.08
Nodes (18): AppConfig, AppConfigPort, PwaRegistrationPort, AppEnvironment, DeviceAccessReason, DeviceSignals, FocusInspectionTask, PlantFocusSummary (+10 more)

### Community 21 - "PwaRegistrationPort"
Cohesion: 0.12
Nodes (15): 1. Visão do Produto e Proposta de Valor, 2. Ecossistema de Aplicações e Plataformas, 3.1. Autenticação, Cadastro Local-First e Sessão, 3.2. Perfil do Usuário e Configurações (`ConfigSheet` & `PerfilPage`), 3.3. Gestão de Ambientes: Casas e Áreas, 3.4. Gestão de Plantas e Inteligência Botânica (Espécies), 3.5. Rotina de Cuidados e Tarefas Diárias, 3.6. Inteligência Climática e Supressão por Chuva (+7 more)

## Knowledge Gaps
- **220 isolated node(s):** `Design Thinking`, `Frontend Aesthetics Guidelines`, `Design Thinking`, `Frontend Aesthetics Guidelines`, `Design Thinking` (+215 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DashboardSnapshot` connect `greenkeeper-analojs` to `app.spec.ts`, `scripts`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `Home` connect `app.spec.ts` to `greenkeeper-analojs`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `provideGreenKeeperDependencies()` (e.g. with `AdjustHumidifierUseCase` and `CompletePlantTaskUseCase`) actually correct?**
  _`provideGreenKeeperDependencies()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Design Thinking`, `Frontend Aesthetics Guidelines`, `Design Thinking` to the rest of the system?**
  _220 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UC-01: Validar Acesso Exclusivo por Celular (Mobile-Only Gate)` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `1. Dashboard Botânico (`Minhas Plantas`)` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `UC-03: Interagir Localmente com o Dashboard (Concluir Tarefa, Selecionar Ambiente, Ajustar Umidificador)` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._