# AGENTS.md — GreenKeeper.AnaloJs

Instruções para agentes de IA (e humanos) neste repositório. Fonte de verdade do projeto junto com o `README.md`.

## ⛔ Regras absolutas

1. **Nunca implementar sem change OpenSpec aprovada** (`openspec/changes/<change>/`). Fluxo: propose → apply → archive.
2. **Nunca `git commit`, `git push` ou criar PR sem autorização explícita do usuário** na conversa.
3. **`graphify update .` é OBRIGATÓRIO antes de TODO `git add`.** Sem exceção.
4. **Nunca fazer `git checkout -b` na raiz** — toda change usa worktree isolada em `worktrees/<branch>/`.
5. **Docker obrigatório**: build, testes e prints rodam via `docker compose`. Zero dependência de Node/browsers no host.
6. **Nunca assumir**: em dúvida, perguntar ao usuário.
7. **Nunca commitar segredos** (`.env`, chaves). Só `.env.example` com placeholders.

## Nomenclatura

- Change: `c<YYYYMMDDhhmmss>-<nome-kebab>` (ex.: `c20261118230237-analogjs-pwa-skeleton`).
- Branch: `feature/<nome>` / `bugfix/<nome>` / `hotfix/<nome>` — sem prefixo `c` nem timestamp.
- Branch base e destino de PR: `develop`.
- `tasks.md` sempre começa com `## 0. Branch` e termina com checklist pré-PR (README + `graphify update .`) e PR.

## Contexto do projeto

- Visão do produto: `docs/project-overview.md`
- Arquitetura técnica: `docs/architecture.md`

## Diretrizes essenciais

- Preserve a separação entre as áreas de funcionário e morador.
- Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` ou o admin client ao navegador.
- Valide entradas externas com Zod.
- Prefira Server Components; use Client Components somente quando necessário.

## O que é o projeto

PWA **AnalogJS (Angular + Vite) 100% frontend, sem backend próprio**, para cuidado de plantas, **exclusivo para celular**. Desktop/tablet veem apenas uma Tela Informativa. Deploy estático no **Netlify**.

### Escopo atual

- Autenticação Google via Auth0 (login/logout, sessão, guard de rota)
- Banco de dados Supabase/PostgreSQL em develop e production
- Mobile-only gate + Tela Informativa
- Dashboard Botânico com cadastro, listagem e identificação de plantas por foto
- Registro de cuidados (rega, adubação, poda) e tarefas diárias
- Clima local e alertas (rega atrasada, temperatura crítica, nova planta, cuidado concluído)
- Perfil do usuário (dados pessoais, endereço com CEP e GPS)
- Convite de familiar com edição provisória de plantas e aprovação pelo dono
- PWA instalável, Docker, 100% de cobertura unitária, prints via Playwright

### Próximos proposes (registrados, FORA do escopo atual)

1. **Notificações push** para lembretes de cuidado e convites de familiar
2. **Convite de familiar por email** com notificação no PWA instalado no celular da pessoa convidada (Realtime/Web Notification; Edge Functions para Web Push e email)

Não antecipar nenhum desses itens fora de uma change própria.

## Arquitetura (Clean Architecture pragmática no frontend)

Não é fidelidade total — organizar o mais próximo possível da arquitetura limpa:

```
src/
├── domain/          # entidades, regras puras. ZERO imports de framework
├── application/     # use cases + ports (interfaces TS puras). Só depende de domain
├── infrastructure/  # adapters (in-memory, device signals, env config, PWA)
├── composition/     # único lugar que liga ports → adapters (DI)
└── app/             # rotas AnalogJS, guards, componentes visuais
```

Regras de dependência: `domain` ← `application` ← `infrastructure`/`app`; `composition` conhece todos. `domain` e `application` nunca importam `@angular/*`, `@analogjs/*` nem `infrastructure`. Testes de fronteira validam isso.

## Qualidade

- **100% de cobertura unitária** (lines, branches, functions, statements) via Vitest + v8. Abaixo disso o comando falha.
- Prints automatizados (Playwright em Docker): `mobile-dashboard.png` (390x844) e `desktop-info.png` (1280x800).
- UI fiel ao HTML de referência *GreenKeeper — Cuidados Botânicos*, mas em tela cheia real (`100dvh`), sem moldura de celular nem status bar `09:41` simulada.

## Governança de ferramentas

- **RTK**: `rtk init --agent antigravity` (regras em `.agents/rules/antigravity-rtk-rules.md`).
- **Graphify**: grafo em `graphify-out/`. Rodar `graphify update .` antes de todo `git add`.

## Skills relevantes

Instaladas em `C:\Users\User\.skills-manager\skills`.

| Área | Skills |
| ---- | ------ |
| Arquitetura / Angular | `angular-developer`, `clean-architecture`, `clean-code`, `architecture-patterns` |
| UI / Design | `frontend-design`, `ui-ux-pro-max`, `design-tokens`, `design-system-patterns` |
| Testes | `unit-testing`, `test-driven-development`, `test-anti-patterns`, `e2e-testing`, `e2e-testing-patterns` |
| Docker / Qualidade | `docker`, `static-analysis`, `code-review` |
| OpenSpec / Git | `openspec-propose`, `openspec-apply-change`, `openspec-archive-change`, `openspec-explore`, `openspec-worktree`, `git-worktree`, `conventional-git`, `validate-naming` |
| Grafo / Docs | `graphify`, `graphify-windows`, `agents-md`, `documentation` |
| Segurança | `owasp`, `supply-chain` |
| Próximos proposes | `postgresql-table-design`, `authentication`, `oauth` |
