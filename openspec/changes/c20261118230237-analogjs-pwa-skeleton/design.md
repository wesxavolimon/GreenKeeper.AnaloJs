## Context

O projeto `GreenKeeper.AnaloJs` (`git@github.com:wesxavolimon/GreenKeeper.AnaloJs.git`) nasce do zero para consolidar o GreenKeeper como um **PWA em AnalogJS (Angular + Vite) 100% frontend (sem backend próprio)** publicado como site estático no **Netlify**, com foco exclusivo em uso por celular.

Em paralelo, os demais pilares completos do produto (persistência PostgreSQL no Docker local / Supabase em produção, autenticação Auth0 + Google e convite familiar por email com notificação) foram explicitamente fatiados para os próximos proposes, mantendo este primeiro entregável focado em uma fundação limpa, testável com **100% de cobertura unitária** e visualmente validada por **prints automatizados via Playwright em Docker**.

## Goals / Non-Goals

**Goals:**
- Estruturar o repositório `GreenKeeper.AnaloJs` com AnalogJS (`ssr: false`, build estático para Netlify, sem backend próprio).
- Aplicar Clean Architecture pragmática para frontend em TypeScript:
  - `src/domain/`: entidades (`Room`, `Plant`, `PlantTask`, `HumiditySetting`), value objects/invariantes (ex.: clamp de umidade `0..100`, cálculo de tarefas pendentes) e regra pura de classificação mobile-only — **zero dependências externas ou de Angular**.
  - `src/application/`: ports (`DashboardRepositoryPort`, `DeviceSignalsPort`, `AppConfigPort`, `PwaRegistrationPort`) e use cases (`EvaluateDeviceAccessUseCase`, `LoadDashboardUseCase`, `CompletePlantTaskUseCase`, `SelectRoomUseCase`, `AdjustHumidifierUseCase`).
  - `src/infrastructure/`: `InMemoryDashboardRepository`, `BrowserDeviceSignalsAdapter`, `ViteEnvConfigAdapter`, `BrowserPwaRegistrationAdapter`.
  - `src/composition/`: `provideGreenKeeperDependencies()` ligando ports → adapters via DI do Angular.
  - `src/app/`: páginas/rotas AnalogJS (`/` Dashboard e `/desktop-info` Tela Informativa), guard `mobileOnlyGuard` e componentes visuais fiéis ao HTML *GreenKeeper — Cuidados Botânicos*.
- Garantir **100% de cobertura unitária** no Vitest (`statements`, `branches`, `functions`, `lines`) sobre o código da aplicação, incluindo testes arquiteturais validando as fronteiras entre camadas.
- Rodar toda a esteira em **Docker Compose** (servidor dev, suíte Vitest com coverage, build estático e script Playwright gerando prints mobile e desktop).
- Documentar o projeto com `README.md`, `AGENTS.md` (incluindo mapeamento das skills relevantes em `C:\Users\User\.skills-manager\skills` e roadmap dos próximos proposes), inicializar `rtk init --agent antigravity` e `graphify .`, e registrar a regra obrigatória de `graphify update .` antes de todo `git add`.

**Non-Goals:**
- Nenhuma rota de API / Nitro (`src/server/**`) ou backend próprio.
- Nenhuma configuração de containers PostgreSQL/PostgREST nem instalação/integração do `@supabase/supabase-js` neste primeiro esqueleto (diferido para o próximo propose).
- Nenhuma integração Auth0 + Google ou fluxo de login neste esqueleto (diferido para propose posterior).
- Nenhum envio real de convite familiar por email, compartilhamento multi-usuário ou Web Push (diferido para propose posterior).

## Decisions

### 1. AnalogJS configurado como SPA estática (`ssr: false`) para Netlify
- **Decisão:** Configurar `@analogjs/platform` com `ssr: false` e `nitro` sem rotas server, gerando output estático (`dist/client` ou `dist/analog/public` conforme output do plugin) publicado diretamente pelo `netlify.toml` com redirect `/* -> /index.html (200)`.
- **Motivo:** Atende à premissa estrita "PWA sem backend", evita runtime serverless no Netlify neste estágio e mantém o bundle compatível com Service Worker PWA (`vite-plugin-pwa`).
- **Alternativa descartada:** SSR/Nitro server routes — adicionaria complexidade de backend desnecessária e fugiria da proposta 100% client-side.

### 2. Clean Architecture pragmática para Frontend em TypeScript
- **Decisão:** Adotar 4 camadas de código + 1 camada de composição (`domain` → `application` → `infrastructure` + `app` ligadas por `composition`), utilizando **ports em classes abstratas ou `InjectionToken` + interfaces TS puras** (mantendo `domain` e `application` 100% livres de `@angular/core` — usando interfaces TS puras em `application/ports/` e `InjectionToken` apenas dentro de `composition/` e `app/`).
- **Motivo:** Permite testar todo o coração da aplicação (`domain` + `application`) em Node puro com Vitest em milissegundos, sem depender de `TestBed` pesado, e permite trocar `InMemoryDashboardRepository` por `SupabaseDashboardRepository` / `PostgrestDashboardRepository` no próximo propose sem alterar nenhum componente ou caso de uso.
- **Alternativa descartada:** Colocar lógica e dados diretamente em serviços `@Injectable()` acoplados ao Angular — mistura infraestrutura/framework com regras de negócio e dificulta a troca futura para Supabase/Docker.

### 3. Regra pura para Mobile-Only Gate + Override controlado
- **Decisão:** Separar a leitura de sinais do navegador (`BrowserDeviceSignalsAdapter`) da decisão pura de acesso (`DeviceAccessPolicy` em `domain` + `EvaluateDeviceAccessUseCase` em `application`). Considera celular quando houver combinação coerente de UA mobile / `userAgentData.mobile` / (`pointer: coarse` com largura ≤ 540px), bloqueando tablets largos (> 540px ou iPad/Android tablet) e desktops.
- **Override em dev/testes:** Aceito **somente** quando `env.appEnv !== 'production'` via `?mobilePreview=1` ou `localStorage` flag de dev; em produção (`VITE_APP_ENV=production`) o override é ignorado completamente.
- **Alternativa descartada:** Media query CSS apenas (`hidden md:block`) — vazaria os dados e o DOM do Dashboard para visitantes em desktop/tablet.

### 4. Visual do Dashboard fiel ao HTML *GreenKeeper — Cuidados Botânicos* adaptado a `100dvh`
- **Decisão:** Migrar integralmente a paleta, tipografia (`Plus Jakarta Sans`), classes `.glass-card`, `.glass-dock`, sombras e os 4 blocos principais do HTML fornecido (`Header`, `StackedRooms` com SVG inline da `Calathea`, `PlantFocusCard` com `Aloe Arborescens`, `ClimateHumidityWidget` com matriz de pontos e `-`/`+`, `FloatingCameraDock`), removendo a moldura externa de desktop (`sm:rounded-[48px] sm:border-[8px]`) e a barra simulada `09:41` / Dynamic Island / ícone de bateria para que o app ocupe 100% do viewport real do smartphone (`min-h-[100dvh]`).
- **Alternativa descartada:** Renderizar a barra `09:41` falsa dentro do PWA instalado — causaria duplicação visual feia com a barra de status real do Android/iOS.

### 5. Estratégia de Cobertura Unitária 100% (Vitest + v8)
- **Decisão:** Configurar Vitest com `@vitest/coverage-v8` exigindo `thresholds: { lines: 100, functions: 100, branches: 100, statements: 100 }` sobre `src/**/*.ts`. Arquivos puramente declarativos de bootstrap/config que não contêm lógica testável (como `main.ts` se reduzido a uma linha, `app.config.ts` ou `.d.ts`) terão a lógica extraída para funções puras testáveis em `src/composition/` e `src/app/` para manter cobertura real de **100%**, reduzindo exclusões ao mínimo absoluto (`*.d.ts`, `main.ts` se apenas invocar `bootstrapApplication`, ou melhor: testar até a função de bootstrap exportada com mock).
- **Alternativa descartada:** Deixar `thresholds` em 80% — violaria o requisito explícito de 100% de cobertura unitária.

### 6. Captura automatizada de prints via Playwright em Docker
- **Decisão:** Criar serviço `playwright` no `docker-compose.yml` usando imagem oficial `mcr.microsoft.com/playwright` alinhada à versão de `@playwright/test`, executando script que inicia/aguarda o preview do build PWA e salva:
  - `screenshots/mobile-dashboard.png` (emulação `390x844`, `isMobile: true`, `hasTouch: true`, UA mobile).
  - `screenshots/desktop-info.png` (viewport `1280x800`, desktop sem override).
- **Motivo:** Permite validar visualmente as duas telas obrigatórias em qualquer máquina sem instalar Chromium no host.

### 7. Configuração Local vs Produção (Netlify) e Roadmap de Próximos Proposes
- **Decisão:** Criar `AppConfigPort` e `ViteEnvConfigAdapter` lendo `import.meta.env` (`VITE_APP_ENV`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`), com `.env.example` documentado e `netlify.toml` configurado. No esqueleto atual, apenas `VITE_APP_ENV` é exigida funcionalmente; as chaves de Supabase e Auth0 ficam tipadas como opcionais/placeholder até seus respectivos proposes.
- **Skills mapeadas para `AGENTS.md`** (verificadas em `C:\Users\User\.skills-manager\skills`):
  - Arquitetura e Angular/TS: `angular-developer`, `clean-architecture`, `clean-code`, `frontend-design`, `ui-ux-pro-max`, `design-tokens`, `design-system-patterns`
  - Testes, Qualidade e Docker: `unit-testing`, `test-driven-development`, `test-anti-patterns`, `e2e-testing`, `e2e-testing-patterns`, `docker`, `static-analysis`, `code-review`
  - OpenSpec, Git e Graphify: `openspec-propose`, `openspec-apply-change`, `openspec-archive-change`, `openspec-explore`, `openspec-worktree`, `git-worktree`, `conventional-git`, `validate-naming`, `graphify`, `graphify-windows`
  - Próximos proposes já mapeados: `postgresql-table-design`, `authentication`, `oauth`, `pwa` / `web-push` (via `authentication`/`oauth`/`postgresql-table-design`).

## Risks / Trade-offs

- **[Detecção mobile em iPadOS ou browsers que mascaram UA]** → Combinar `userAgentData?.mobile`, regex de smartphone (excluindo `iPad` / `Tablet` explícitos) e checagem de `maxTouchPoints` + `innerWidth <= 540` + `pointer: coarse`; toda a lógica fica em `DeviceAccessPolicy` com 100% de testes unitários de matriz de dispositivos.
- **[Branch coverage de 100% em componentes Angular/AnalogJS]** → Manter templates simples sem expressões ternárias mortas e mover toda decisão condicional para `domain`/`application` ou métodos explícitos testados com Vitest + `@analogjs/vitest-angular` / Angular `TestBed`.
- **[Playwright offline sem acesso à fonte Google externa no container]** → Configurar timeout seguro e fallback de fontes limpo em CSS para que o container não trave caso esteja sem rede externa, carregando `Plus Jakarta Sans` normalmente quando houver rede.
