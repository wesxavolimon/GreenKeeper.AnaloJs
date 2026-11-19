# Tasks

## 0. Branch

- [x] 0.1 **Inicializar branch base (`main` e `develop`) e worktree isolada**
  - **Nota:** `GreenKeeper.AnaloJs` foi clonado vazio (`git@github.com:wesxavolimon/GreenKeeper.AnaloJs.git`). Criar commit inicial de bootstrap (`.gitignore`, `.graphifyignore`, `openspec/`), criar branch `develop` e criar a worktree isolada em `GreenKeeper.AnaloJs/worktrees/analogjs-pwa-skeleton` na branch `feature/analogjs-pwa-skeleton` a partir de `develop` (mediante autorização explícita do usuário para commit/push).
  - **Done:** `git worktree list` mostra `worktrees/analogjs-pwa-skeleton [feature/analogjs-pwa-skeleton]`.

---

## 1. Governança, RTK, Graphify e Documentação Base

- [x] 1.1 **Configurar `.gitignore` e `.graphifyignore` em `GreenKeeper.AnaloJs/`**
  - Ignorar `node_modules/`, `dist/`, `.analog/`, `coverage/`, `worktrees/`, `screenshots/` (ou manter só se versionado conforme decisão), `graphify-out/cache`, `.env`, `.env.local`.
  - **Done:** `.gitignore` e `.graphifyignore` criados e validados.

- [x] 1.2 **Inicializar RTK e Graphify na raiz do projeto**
  - Executar `rtk init --agent antigravity` e `graphify .` dentro de `GreenKeeper.AnaloJs`.
  - **Done:** Configuração RTK para Antigravity gerada e `graphify-out/graph.json` + `GRAPH_REPORT.md` criados.

- [x] 1.3 **Criar `README.md` e `AGENTS.md` próprios de `GreenKeeper.AnaloJs`**
  - `README.md`: visão do PWA AnalogJS sem backend, estrutura Clean Architecture TS, comandos Docker (dev, testes 100%, build, prints Playwright), variáveis de ambiente local vs produção (Netlify) e roadmap dos próximos proposes.
  - `AGENTS.md`: regras de arquitetura, fluxo OpenSpec/worktree, **regra obrigatória de executar `graphify update .` antes de todo `git add`**, lista curada das skills relevantes de `C:\Users\User\.skills-manager\skills` e registro detalhado dos 3 próximos proposes (1. PostgreSQL Docker + Supabase `@supabase/supabase-js`; 2. Auth0 + Google; 3. Convite familiar por email + notificação no celular + compartilhamento de database).
  - **Done:** `README.md` e `AGENTS.md` revisados e completos.

- [ ] 1.4 **Commit + push do grupo 1 (com `graphify update .` antes do `git add`)**
  - **Comando:** `graphify update . && git add ... && git commit -m "chore: bootstrap governance, rtk, graphify and docs" && git push -u origin feature/analogjs-pwa-skeleton`
  - **Done:** Commit registrado em `feature/analogjs-pwa-skeleton` (após autorização explícita).

---

## 2. Fundação AnalogJS, Docker e Configurações Local/Produção

- [ ] 2.1 **Criar estrutura base do projeto AnalogJS + Tailwind CSS (`ssr: false`, sem backend próprio)**
  - Configurar `package.json` (`@analogjs/platform`, `@analogjs/router`, `@angular/*`, `tailwindcss`, `vite-plugin-pwa`, `vitest`, `@vitest/coverage-v8`, `@playwright/test`), `tsconfig.json` (strict mode + path aliases `@domain/*`, `@application/*`, `@infrastructure/*`, `@composition/*`, `@app/*`) e `vite.config.ts` sem Nitro server routes.
  - **Done:** Estrutura inicial compilável via Vite/AnalogJS sem rotas de backend.

- [ ] 2.2 **Configurar ambiente Docker Compose (zero pegada local)**
  - Criar `Dockerfile` (Node 22) e `docker-compose.yml` com serviços `app` (dev/build AnalogJS), `test` (`vitest run --coverage`) e `playwright` (`mcr.microsoft.com/playwright` para captura de prints).
  - **Done:** `docker compose build` e comandos de teste/preview funcionam em container.

- [ ] 2.3 **Configurar variáveis Local e Produção (`netlify.toml`, `.env.example`)**
  - Criar `.env.example` (`VITE_APP_ENV=development` e placeholders `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`).
  - Criar `netlify.toml` com `[build]` (`command = "npm run build"`, `publish = ...`) e redirect SPA `/* -> /index.html` status `200`.
  - **Done:** `netlify.toml` e `.env.example` presentes e válidos.

- [ ] 2.4 **Configurar PWA (`manifest.webmanifest`, ícones e Service Worker)**
  - Configurar `vite-plugin-pwa` (ou `@angular/service-worker` / manifest estático + ícones PNG) e registrar SW no cliente de forma resiliente.
  - **Done:** Build de produção gera `manifest.webmanifest` e arquivo de Service Worker registrados corretamente.

- [ ] 2.5 **Commit + push do grupo 2 (com `graphify update .` antes do `git add`)**
  - **Done:** Commit registrado após autorização explícita.

---

## 3. Clean Architecture TS: Domain, Application, Infrastructure e Composition

- [ ] 3.1 **Implementar camada `src/domain/` (100% pura)**
  - Entidades e tipos: `Room`, `Plant`, `PlantFocus`, `PlantTask`, `HumidityControl`, `DashboardSnapshot`.
  - Regras puras: `clampHumidityLevel`, `countPendingTasks`, `DeviceAccessPolicy.evaluate(signals, appEnv)`.
  - **Done:** Zero imports externos em `src/domain/`.

- [ ] 3.2 **Implementar camada `src/application/` (Ports e Use Cases)**
  - Ports: `DashboardRepositoryPort`, `DeviceSignalsPort`, `AppConfigPort`, `PwaRegistrationPort`.
  - Use cases: `EvaluateDeviceAccessUseCase`, `LoadDashboardUseCase`, `CompletePlantTaskUseCase`, `SelectRoomUseCase`, `AdjustHumidifierUseCase`, `RegisterPwaUseCase`.
  - **Done:** Zero imports de Angular ou `src/infrastructure/` em `src/application/`.

- [ ] 3.3 **Implementar camada `src/infrastructure/` e `src/composition/`**
  - `InMemoryDashboardRepository` (com dados iniciais fiéis ao HTML *Cuidados Botânicos*: *Corredor*, *Sala de Estar*, *Banheiro / Calathea*, *Aloe Arborescens*, `64%` umidade, `3` tarefas).
  - `BrowserDeviceSignalsAdapter`, `ViteEnvConfigAdapter`, `BrowserPwaRegistrationAdapter`.
  - `provideGreenKeeperDependencies()` em `src/composition/`.
  - **Done:** Todos os ports injetados exclusivamente via `src/composition/`.

- [ ] 3.4 **Escrever testes unitários das camadas `domain`, `application`, `infrastructure`, `composition` e fronteiras**
  - Testes de fronteira arquitetural (AST/regex validando imports proibidos entre camadas).
  - Testes unitários cobrindo 100% de linhas, branches, funções e statements.
  - **Done:** Suíte de camada pura e infra passando em Docker com 100% de cobertura.

- [ ] 3.5 **Commit + push do grupo 3 (com `graphify update .` antes do `git add`)**
  - **Done:** Commit registrado após autorização explícita.

---

## 4. UI AnalogJS: Mobile-Only Gate, Tela Informativa e Dashboard Botânico

- [ ] 4.1 **Implementar `mobileOnlyGuard` e Tela Informativa (`/desktop-info`)**
  - Guard bloqueando rotas do app quando `EvaluateDeviceAccessUseCase` retornar `allowed: false`, redirecionando para `/desktop-info`.
  - Página `/desktop-info` estilizada na identidade `#F4F6F2` / `#1A1E1D` / `emerald-600` (`Plus Jakarta Sans`), apresentando o app e instruindo acesso pelo celular.
  - **Done:** Desktop/tablet bloqueado em qualquer rota; override só ativo fora de `production`.

- [ ] 4.2 **Implementar Dashboard direto (`/`) fiel ao HTML *GreenKeeper — Cuidados Botânicos***
  - Adaptar para tela cheia real do celular (`min-h-[100dvh]`, sem moldura desktop e sem status bar falsa `09:41` / Dynamic Island).
  - Implementar componentes: `DashboardHeader`, `StackedRooms` (com SVG da *Calathea*, métricas `18% Água` / `98% Luz`, botão `Concluir`), `PlantFocusCard` (*Aloe Arborescens*, *Rega*, *Inspeção*), `ClimateHumidityWidget` (`64%`, partículas, botões `-`/`+`) e `FloatingCameraDock` (botão *Câmera*).
  - **Done:** Todas as interações locais funcionam via use cases.

- [ ] 4.3 **Escrever testes unitários de UI/Guards e validar 100% de cobertura global**
  - Configurar Vitest (`thresholds: 100` para `lines`, `branches`, `functions`, `statements`).
  - Executar `docker compose run --rm test` e garantir 100% verde.
  - **Done:** `vitest run --coverage` sai com código 0 e 100% em todas as métricas.

- [ ] 4.4 **Commit + push do grupo 4 (com `graphify update .` antes do `git add`)**
  - **Done:** Commit registrado após autorização explícita.

---

## 5. Captura Automatizada de Prints (Playwright) e Validação Final

- [ ] 5.1 **Implementar script Playwright para capturar prints das telas em Docker**
  - Configurar `playwright.config.ts` / script de captura que serve o build estático e salva:
    - `screenshots/mobile-dashboard.png` (`390x844`, `isMobile: true`, `hasTouch: true`)
    - `screenshots/desktop-info.png` (`1280x800`, desktop sem override)
  - Executar `docker compose run --rm playwright` e inspecionar visualmente os PNGs gerados comparando com o HTML de referência.
  - **Done:** Ambos os prints gerados em Docker e validados visualmente.

- [ ] 5.2 **Checklist Pré-PR**
  - Atualizar `README.md` com instruções finais e referência aos prints gerados.
  - Executar `graphify update .` (obrigatório antes do `git add`).
  - **Done:** `README.md` atualizado e grafo sincronizado.

- [ ] 5.3 **Commit final + push + criar PR no GitHub**
  - Push de `feature/analogjs-pwa-skeleton` e criação de Pull Request para `develop` no repositório `wesxavolimon/GreenKeeper.AnaloJs` (somente após autorização explícita do usuário).
  - **Done:** PR aberto apontando `feature/analogjs-pwa-skeleton` → `develop`.
