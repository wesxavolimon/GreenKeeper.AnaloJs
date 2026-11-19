## Why

Precisamos migrar o **GreenKeeper** para uma base **100% frontend (PWA, sem backend próprio)** em **AnalogJS**, mais simples de manter, rodar em Docker e publicar no **Netlify** exclusivamente para uso em celular. Este primeiro esqueleto estabelece a arquitetura em TypeScript próxima à Clean Architecture, configurações de ambiente local e produção, qualidade com 100% de cobertura unitária, validação visual por prints e a base sobre a qual os próximos proposes (banco PostgreSQL/Supabase, Auth0+Google e convite familiar) serão construídos.

## What Changes

- **Novo projeto AnalogJS PWA (sem backend próprio)** no repositório `GreenKeeper.AnaloJs` (`git@github.com:wesxavolimon/GreenKeeper.AnaloJs.git`), com Angular, Vite, Tailwind CSS e Web App Manifest + Service Worker instalável.
- **Clean Architecture pragmática no frontend (TypeScript)** separando `domain` (entidades e regras puras), `application` (casos de uso e ports/interfaces), `infrastructure` (adapter em memória para o dashboard, detector de dispositivo, leitor de configuração de ambiente) e `app` / `composition` (páginas AnalogJS, guards e injeção de dependências), validada por testes de fronteira de camadas.
- **Configuração Local e Produção (Netlify)** preparada com `.env.example`, `netlify.toml` (build estático PWA + redirects SPA + escopo de variáveis `VITE_*`) e módulo tipado de configuração de ambiente.
- **Gate exclusivo para celular + Tela Informativa**: o aplicativo só libera o uso quando reconhece dispositivo celular (com override controlado exclusivo de desenvolvimento/testes); acessos por desktop ou tablet exibem apenas a Tela Informativa apresentando o aplicativo e orientando o acesso via celular.
- **Dashboard direto (sem login e sem database real neste esqueleto)**: ao abrir no celular, navega direto para o Dashboard *GreenKeeper — Cuidados Botânicos* (baseado no HTML de referência, sem moldura ou status bar simulada de iPhone, preenchendo a tela real), com estado e interações locais servidas via adapter em memória.
- **Qualidade 100% e Prints em Docker**: Docker Compose orquestrando desenvolvimento/build, suíte **Vitest com 100% de cobertura unitária** e **Playwright** capturando **prints automatizados das telas** (Dashboard mobile e Tela Informativa desktop).
- **Documentação e Governança própria**: criação de `README.md`, `AGENTS.md` (listando as skills relevantes de `C:\Users\User\.skills-manager\skills` e registrando os próximos proposes fora de escopo), `.gitignore`, `.graphifyignore`, execução de `rtk init --agent antigravity`, `graphify .` inicial e regra obrigatória de rodar `graphify update .` antes de todo `git add`.

### Explicitamente diferido para próximos proposes (registrado no `README.md` / `AGENTS.md`)

- **Propose futuro 1 — Database PostgreSQL + Supabase**: `docker-compose.yml` com PostgreSQL + PostgREST local, instalação e integração de `@supabase/supabase-js` para produção no Supabase e persistência real substituindo o adapter em memória.
- **Propose futuro 2 — Autenticação Auth0 + Conta Google**: login/logout via Auth0 com Google e proteção de sessão.
- **Propose futuro 3 — Convite Familiar por Email + Notificações**: compartilhamento do mesmo database entre membros da família, envio de convite por email e notificação no app instalado no celular.

## Capabilities

### New Capabilities
- `project-foundation`: Estrutura AnalogJS PWA 100% frontend sem backend, camadas TypeScript próximas à Clean Architecture, configurações local/Netlify e testes de fronteira arquitetural.
- `pwa-shell`: Configuração de Progressive Web App instalável (manifest, ícones, service worker e build estático para Netlify).
- `mobile-only-gate`: Detecção de celular (com override dev/testes) e Tela Informativa exclusiva quando acessado fora de celular (desktop/tablet).
- `botanical-dashboard`: Dashboard direto sem login seguindo o layout *GreenKeeper — Cuidados Botânicos*, adaptado para viewport real de celular e alimentado por ports + adapter em memória.
- `docker-quality-and-visual-capture`: Ambiente Docker Compose para dev/build, exigência de 100% de cobertura em testes unitários (Vitest) e captura automatizada de prints das telas (Playwright).
- `repo-governance-and-docs`: Bootstrap do repositório `GreenKeeper.AnaloJs` com `README.md`, `AGENTS.md` (skills mapeadas e roadmap dos próximos proposes), `.gitignore`, `.graphifyignore`, `rtk init --agent antigravity` e fluxo obrigatório `graphify update .`.

### Modified Capabilities
<!-- Repositório novo: nenhuma capability existente modificada. -->

## Impact

- **Novo repositório:** `GreenKeeper.AnaloJs` (`git@github.com:wesxavolimon/GreenKeeper.AnaloJs.git`), sem impacto nos repositórios irmãos (`GreenKeeper.Backend`, `GreenKeeper.Frontend`, `GreenKeeper.Frontend.Reactnative`, `GreenKeeper.Frontend.NgNative`).
- **Dependências principais (npm):** `@analogjs/platform`, `@analogjs/router`, `@angular/*`, `tailwindcss`, `@vite-pwa/assets-generator` / `vite-plugin-pwa`, `vitest`, `@vitest/coverage-v8`, `@playwright/test`.
- **Infraestrutura:** `Dockerfile`, `docker-compose.yml`, `netlify.toml`, `.env.example` (zero dependência de Node/browsers instalados no host).
- **Artefatos de governança:** `README.md`, `AGENTS.md`, `.gitignore`, `.graphifyignore`, `.antigravity`/RTK config e `graphify-out/`.
