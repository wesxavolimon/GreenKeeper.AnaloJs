# Tasks

## 0. Setup

- [ ] 0.1 **Criar branch `feature/spec-01-auth0-google-auth`**
  - **Comando:** `git checkout -b feature/spec-01-auth0-google-auth develop && git push -u origin feature/spec-01-auth0-google-auth`
  - **Done:** `git branch` mostra `* feature/spec-01-auth0-google-auth`

## 1. Dependências

- [ ] 1.1 **Adicionar `@auth0/auth0-spa-js` ao `package.json`**
  - **O que mudar:** Adicionar `"@auth0/auth0-spa-js": "^2.2.0"` às `dependencies` em `package.json`
  - **Novo conteúdo:** `"@auth0/auth0-spa-js": "^2.2.0"` em `dependencies`
  - **Contexto:** Decisão 1 do design.md — SDK oficial do Auth0 para SPAs
  - **Done:** `npm ls @auth0/auth0-spa-js --depth=0` mostra a versão instalada

- [ ] 1.2 **Instalar dependências**
  - **Comando:** `npm ci`
  - **Done:** `node_modules/@auth0/auth0-spa-js` existe

- [ ] 1.3 **Commit + push do grupo 1**
  - **Comando:** `git add package.json package-lock.json && git commit -m "feat: add auth0-spa-js dependency" && git push`
  - **Done:** `git log --oneline -1` mostra o commit acima

## 2. Domain — modelo e regras de autenticação

- [ ] 2.1 **Criar entidade `User` em `src/domain/models.ts`**
  - **O que mudar:** Adicionar interface `User` com campos `id`, `email`, `name`, `picture`, `provider`
  - **Novo conteúdo:** Interface `User` exportada de `src/domain/models.ts`
  - **Contexto:** Spec 01 — dados do usuário: id, email, nome, foto do perfil, provedor (Google)
  - **Done:** `src/domain/models.ts` exporta a interface `User`

- [ ] 2.2 **Criar regras de autenticação em `src/domain/rules.ts`**
  - **O que mudar:** Adicionar funções puras `isAuthenticated(token)`, `isTokenExpired(token)`, `validateSession(token)`
  - **Novo conteúdo:** Funções puras exportadas de `src/domain/rules.ts`
  - **Contexto:** Decisão 4 do design.md — camada domain com regras puras
  - **Done:** `src/domain/rules.ts` exporta funções de validação de sessão

- [ ] 2.3 **Testes unitários do domain (Vitest)**
  - **O que mudar:** Criar `src/domain/auth.spec.ts` cobrindo `isAuthenticated`, `isTokenExpired`, `validateSession`
  - **Novo conteúdo:** Testes Vitest com 100% de coverage para as funções de rules
  - **Contexto:** Critério de aceitação — 100% de coverage unitário
  - **Done:** `npm run test:coverage` passa com 100% para `src/domain/`

- [ ] 2.4 **Commit + push do grupo 2**
  - **Comando:** `git add src/domain/ && git commit -m "feat: add auth domain model and rules" && git push`
  - **Done:** `git log --oneline -1` mostra o commit acima

## 3. Application — ports e use cases

- [ ] 3.1 **Criar `AuthPort` em `src/application/ports.ts`**
  - **O que mudar:** Adicionar interface `AuthPort` com métodos `login()`, `logout()`, `getUser()`, `isAuthenticated()`
  - **Novo conteúdo:** Interface `AuthPort` exportada de `src/application/ports.ts`
  - **Contexto:** Decisão 4 do design.md — portas de aplicação puras
  - **Done:** `src/application/ports.ts` exporta `AuthPort`

- [ ] 3.2 **Criar use cases em `src/application/use-cases.ts`**
  - **O que mudar:** Adicionar `LoginUseCase`, `LogoutUseCase`, `CheckAuthUseCase`
  - **Novo conteúdo:** Classes de use case exportadas de `src/application/use-cases.ts`
  - **Contexto:** UC-01, UC-02, UC-03 dos use-cases.md
  - **Done:** `src/application/use-cases.ts` exporta os três use cases

- [ ] 3.3 **Testes unitários da application (Vitest)**
  - **O que mudar:** Criar `src/application/auth.spec.ts` cobrindo os use cases com mocks do `AuthPort`
  - **Novo conteúdo:** Testes Vitest com 100% de coverage para use cases
  - **Contexto:** Critério de aceitação — 100% de coverage unitário
  - **Done:** `npm run test:coverage` passa com 100% para `src/application/`

- [ ] 3.4 **Commit + push do grupo 3**
  - **Comando:** `git add src/application/ && git commit -m "feat: add auth application ports and use cases" && git push`
  - **Done:** `git log --oneline -1` mostra o commit acima

## 4. Infrastructure — adapter Auth0

- [ ] 4.1 **Criar `Auth0Adapter` em `src/infrastructure/auth0.adapter.ts`**
  - **O que mudar:** Implementar `AuthPort` usando `@auth0/auth0-spa-js` (loginWithRedirect, logout, getUser, isAuthenticated)
  - **Novo conteúdo:** Classe `Auth0Adapter` exportada de `src/infrastructure/auth0.adapter.ts`
  - **Contexto:** Decisão 1 e 2 do design.md — SDK Auth0, token em memória
  - **Done:** `src/infrastructure/auth0.adapter.ts` implementa `AuthPort`

- [ ] 4.2 **Testes unitários do infrastructure (Vitest)**
  - **O que mudar:** Criar `src/infrastructure/auth0.adapter.spec.ts` com mocks do SDK Auth0
  - **Novo conteúdo:** Testes Vitest com 100% de coverage para o adapter
  - **Contexto:** Critério de aceitação — 100% de coverage unitário
  - **Done:** `npm run test:coverage` passa com 100% para `src/infrastructure/`

- [ ] 4.3 **Commit + push do grupo 4**
  - **Comando:** `git add src/infrastructure/ && git commit -m "feat: add auth0 infrastructure adapter" && git push`
  - **Done:** `git log --oneline -1` mostra o commit acima

## 5. App — guard de rota, tela de login e rotas

- [ ] 5.1 **Criar `AuthGuard` em `src/app/guards/auth.guard.ts`**
  - **O que mudar:** Implementar `CanActivateFn` que verifica sessão ativa e redireciona para `/login` se não autenticado
  - **Novo conteúdo:** `authGuard` exportado de `src/app/guards/auth.guard.ts`
  - **Contexto:** Decisão 3 do design.md — guard no AnalogJS Router via `canActivate`
  - **Done:** `src/app/guards/auth.guard.ts` exporta `authGuard`

- [ ] 5.2 **Criar tela de login em `src/app/pages/login.page.ts`**
  - **O que mudar:** Componente Angular com botão "Continuar com Google" que chama `login()` do use case
  - **Novo conteúdo:** Componente `LoginPage` exportado de `src/app/pages/login.page.ts`
  - **Contexto:** UX design — tela de Login com wireframe aprovado
  - **Done:** `src/app/pages/login.page.ts` exporta `LoginPage`

- [ ] 5.3 **Atualizar rotas para proteger telas internas**
  - **O que mudar:** Adicionar `authGuard` ao `canActivate` das rotas internas em `app.config.ts` ou rotas AnalogJS
  - **Novo conteúdo:** Rotas internas com `canActivate: [mobileOnlyGuard, authGuard]`
  - **Contexto:** UC-03 — guard de rota protege telas internas
  - **Done:** Rotas internas incluem `authGuard` no `canActivate`

- [ ] 5.4 **Atualizar rota raiz para redirecionar não-autenticados**
  - **O que mudar:** Rota `/` redireciona para `/login` se não autenticado, ou `/dashboard` se autenticado
  - **Novo conteúdo:** Lógica de redirecionamento na rota raiz
  - **Contexto:** Fluxo de navegação — nó B (decisão de sessão ativa)
  - **Done:** Rota raiz redireciona corretamente com/sem sessão

- [ ] 5.5 **Testes unitários do app (Vitest)**
  - **O que mudar:** Criar `src/app/guards/auth.guard.spec.ts` e `src/app/pages/login.page.spec.ts`
  - **Novo conteúdo:** Testes Vitest com 100% de coverage para guard e página de login
  - **Contexto:** Critério de aceitação — 100% de coverage unitário
  - **Done:** `npm run test:coverage` passa com 100% para `src/app/`

- [ ] 5.6 **Commit + push do grupo 5**
  - **Comando:** `git add src/app/ && git commit -m "feat: add auth guard, login page and protected routes" && git push`
  - **Done:** `git log --oneline -1` mostra o commit acima

## 6. Composition — DI wiring

- [ ] 6.1 **Ligar `AuthPort` → `Auth0Adapter` no `composition/`**
  - **O que mudar:** Adicionar binding de `AuthPort` para `Auth0Adapter` no container de DI
  - **Novo conteúdo:** Provider de `AuthPort` usando `Auth0Adapter` em `src/composition/`
  - **Contexto:** Decisão 4 do design.md — composition conhece todos os adapters
  - **Done:** `AuthPort` está vinculado a `Auth0Adapter` no DI

- [ ] 6.2 **Commit + push do grupo 6**
  - **Comando:** `git add src/composition/ && git commit -m "feat: wire auth port to auth0 adapter in DI" && git push`
  - **Done:** `git log --oneline -1` mostra o commit acima

## 7. Testes E2E (Playwright)

- [ ] 7.1 **Criar teste E2E de login com Google**
  - **O que mudar:** Criar `e2e/auth.spec.ts` com teste de fluxo de login (mock do Auth0 ou teste integrado)
  - **Novo conteúdo:** Teste Playwright cobrindo UC-01 fluxo principal
  - **Contexto:** Critério de aceitação — prints e testes aprovados antes do merge
  - **Done:** `npm run e2e:screenshots` passa para o teste de auth

- [ ] 7.2 **Criar teste E2E de logout**
  - **O que mudar:** Adicionar teste de logout em `e2e/auth.spec.ts`
  - **Novo conteúdo:** Teste Playwright cobrindo UC-02
  - **Contexto:** Critério de aceitação — prints e testes aprovados antes do merge
  - **Done:** `npm run e2e:screenshots` passa para o teste de logout

- [ ] 7.3 **Commit + push do grupo 7**
  - **Comando:** `git add e2e/ && git commit -m "feat: add auth e2e tests" && git push`
  - **Done:** `git log --oneline -1` mostra o commit acima

## 8. Build e verificação

- [ ] 8.1 **Rodar testes com cobertura**
  - **Comando:** `npm run test:coverage`
  - **Done:** 100% de coverage (lines, branches, functions, statements)

- [ ] 8.2 **Rodar build de produção**
  - **Comando:** `npm run build`
  - **Done:** `dist/analog/public` gerado com sucesso

- [ ] 8.3 **Commit + push do grupo 8**
  - **Comando:** `git add . && git commit -m "feat: complete spec 01 auth0 google authentication" && git push`
  - **Done:** `git log --oneline -1` mostra o commit acima

## Final. PR (manual)

- [ ] Final.1 **[MANUAL] Criar Pull Request no GitHub**
  - Source: `feature/spec-01-auth0-google-auth` → Target: `develop`
  - Solicitar revisão e aguardar aprovação antes de concluir.
  - **Done:** PR criado e aprovado
