# Tasks

## 0. Branch

- [ ] 0.1 **Criar worktree isolada `worktrees/feature/spec-02-user-profile-address` a partir de `develop`**
  - **Comando:** `git worktree add worktrees/feature/spec-02-user-profile-address -b feature/spec-02-user-profile-address develop`
  - **Contexto:** Regra absoluta do AGENTS.md — nunca `git checkout -b` na raiz; toda change usa worktree isolada
  - **Done:** `git worktree list` mostra a worktree em `feature/spec-02-user-profile-address` e `git branch` mostra `develop` como base

- [ ] 0.2 **Confirmar que a Spec 01 (Auth0) está integrada na base**
  - **O que verificar:** `AuthPort`, `Auth0Adapter`, `AuthGuard` e a rota `/login` presentes em `develop`
  - **Contexto:** A Spec 02 depende da sessão Auth0 para obter o `auth_id` e proteger a rota `/perfil`
  - **Done:** `src/application/ports.ts` exporta `AuthPort` e `src/app/guards/auth.guard.ts` existe na base

---

## 1. Dependências

- [ ] 1.1 **Adicionar `@supabase/supabase-js` e `zod` ao `package.json`**
  - **O que mudar:** Adicionar `"@supabase/supabase-js": "^2.58.0"` e `"zod": "^4.1.5"` às `dependencies`
  - **Contexto:** Decisões 1 e 5 do design.md — persistência no Supabase e validação com Zod
  - **Done:** `package.json` contém as duas dependências em `dependencies`

- [ ] 1.2 **Instalar dependências**
  - **Comando:** `npm ci`
  - **Done:** `node_modules/@supabase/supabase-js` e `node_modules/zod` existem

- [ ] 1.3 **Commit + push do grupo 1**
  - **Comando:** `git add package.json package-lock.json && git commit -m "feat: add supabase and zod dependencies" && git push`
  - **Done:** `git log --oneline -1` mostra o commit acima

---

## 2. Banco de dados — tabela `profiles` e RLS

- [ ] 2.1 **Versionar o script SQL de criação da tabela `profiles`**
  - **O que mudar:** Criar `supabase/migrations/0001_create_profiles.sql` com a tabela `public.profiles` (`id uuid primary key default gen_random_uuid()`, `auth_id uuid not null unique`, `email text not null`, `full_name text not null`, `phone text`, `date_of_birth date`, `zip_code text`, `street text`, `number text`, `complement text`, `district text`, `city text`, `state text`, `latitude double precision`, `longitude double precision`, `created_at timestamptz not null default now()`, `updated_at timestamptz not null default now()`)
  - **Contexto:** Decisão 1 do design.md — tabela `profiles` no Supabase/PostgreSQL
  - **Done:** o arquivo existe em `supabase/migrations/` e é idempotente (`create table if not exists`)

- [ ] 2.2 **Adicionar as políticas RLS de isolamento por usuário**
  - **O que mudar:** No mesmo script, habilitar RLS e criar políticas `select`, `insert`, `update` e `delete` com `auth.uid() = auth_id`
  - **Contexto:** Decisão 2 do design.md — RLS como barreira de isolamento, não apenas filtro no cliente
  - **Done:** o script contém `alter table public.profiles enable row level security` e as quatro políticas com `auth.uid() = auth_id`

- [ ] 2.3 **Documentar a aplicação da migração em develop e production**
  - **O que mudar:** Registrar no `README.md` (ou no próprio arquivo de migração) os comandos de aplicação via Supabase CLI ou SQL Editor
  - **Done:** o README descreve como aplicar `supabase/migrations/0001_create_profiles.sql` em develop e production

---

## 3. Domain — modelos e schema de validação

- [ ] 3.1 **Criar os modelos de perfil em `src/domain/models.ts`**
  - **O que mudar:** Adicionar `UserProfile`, `UserAddress`, `GeoCoordinates` e `AddressLookupResult` (interfaces puras, sem imports de framework)
  - **Contexto:** Decisão 3 do design.md — `domain` sem dependências de framework
  - **Done:** `src/domain/models.ts` exporta as quatro interfaces

- [ ] 3.2 **Criar o schema Zod de validação do perfil em `src/domain/profile-schema.ts`**
  - **O que mudar:** Criar `profileSchema` com `fullName` (min 2), `phone` (máscara BR), `dateOfBirth` (data válida, não futura), `zipCode` (8 dígitos), `street`, `number`, `complement` (opcional), `district`, `city`, `state` (2 letras), `latitude`/`longitude` (opcionais, -90..90 / -180..180); mensagens em português por campo
  - **Contexto:** Decisão 5 do design.md — schema no `domain` com erros por campo
  - **Done:** `src/domain/profile-schema.ts` exporta `profileSchema` e o tipo inferido do perfil

- [ ] 3.3 **Criar as regras puras de perfil em `src/domain/profile-rules.ts`**
  - **O que mudar:** Adicionar `normalizeZipCode`, `formatPhone`, `formatDateOfBirth` e `isProfileComplete`
  - **Contexto:** Decisão 5 do design.md — regras puras no `domain`
  - **Done:** `src/domain/profile-rules.ts` exporta as quatro funções

- [ ] 3.4 **Exportar os novos módulos em `src/domain/index.ts`**
  - **O que mudar:** Reexportar `profile-schema` e `profile-rules`
  - **Done:** `src/domain/index.ts` expõe os novos símbolos

- [ ] 3.5 **Testes unitários do domain (Vitest)**
  - **O que mudar:** Criar `src/domain/profile.spec.ts` cobrindo o schema (casos válido e cada campo inválido) e as regras de normalização
  - **Contexto:** UC-07 — validação das entradas do perfil
  - **Done:** `docker compose run --rm test npm run test:coverage` passa com 100% em `src/domain/`

- [ ] 3.6 **Commit + push do grupo 3**
  - **Comando:** `git add src/domain/ && git commit -m "feat: add profile domain models, schema and rules" && git push`
  - **Done:** `git log --oneline -1` mostra o commit acima

---

## 4. Application — ports e use cases

- [ ] 4.1 **Criar as ports de perfil em `src/application/ports.ts`**
  - **O que mudar:** Adicionar `ProfilePort` (`getProfile(userId)`, `saveProfile(userId, profile)`), `AddressLookupPort` (`lookupByZipCode(zipCode)`) e `GeolocationPort` (`getCurrentCoordinates()`)
  - **Contexto:** Decisão 3 do design.md — ports puras na camada `application`
  - **Done:** `src/application/ports.ts` exporta as três interfaces

- [ ] 4.2 **Estender `AuthPort` com `getAccessToken()`**
  - **O que mudar:** Adicionar `getAccessToken(): Promise<string | null>` à interface `AuthPort`
  - **Contexto:** Decisão 4 do design.md — o adapter do Supabase autentica as chamadas com o token do Auth0
  - **Done:** `src/application/ports.ts` declara `getAccessToken()`

- [ ] 4.3 **Criar os use cases de perfil em `src/application/profile-use-cases.ts`**
  - **O que mudar:** Criar `LoadProfileUseCase` (carrega e faz upsert inicial com os dados do Auth0), `SaveProfileUseCase` (valida com Zod e persiste), `LookupAddressByCepUseCase` e `CaptureLocationUseCase`
  - **Contexto:** UC-02, UC-03, UC-04, UC-05, UC-06 da `use-cases.md`
  - **Done:** `src/application/profile-use-cases.ts` exporta os quatro use cases

- [ ] 4.4 **Exportar os novos módulos em `src/application/index.ts`**
  - **O que mudar:** Reexportar `profile-use-cases`
  - **Done:** `src/application/index.ts` expõe os novos use cases

- [ ] 4.5 **Testes unitários da application (Vitest)**
  - **O que mudar:** Criar `src/application/profile.spec.ts` com mocks das ports cobrindo: carregamento com perfil salvo, primeiro acesso (upsert), erro de carregamento, salvamento válido, erro de validação, erro de persistência, CEP encontrado, CEP não encontrado, falha de rede no CEP, GPS com sucesso, permissão negada e geolocalização indisponível
  - **Contexto:** UC-02 a UC-07 — todos os fluxos alternativos
  - **Done:** `docker compose run --rm test npm run test:coverage` passa com 100% em `src/application/`

- [ ] 4.6 **Commit + push do grupo 4**
  - **Comando:** `git add src/application/ && git commit -m "feat: add profile ports and use cases" && git push`
  - **Done:** `git log --oneline -1` mostra o commit acima

---

## 5. Infrastructure — adapters

- [ ] 5.1 **Implementar `getAccessToken()` em `Auth0Adapter`**
  - **O que mudar:** Adicionar o método em `src/infrastructure/auth0.adapter.ts` usando `client.getTokenSilently()`
  - **Contexto:** Decisão 4 do design.md
  - **Done:** `Auth0Adapter` implementa `AuthPort` completo

- [ ] 5.2 **Criar `SupabaseProfileAdapter` em `src/infrastructure/supabase-profile.adapter.ts`**
  - **O que mudar:** Implementar `ProfilePort` com `createClient` do `@supabase/supabase-js`, usando `supabaseUrl`/`supabaseAnonKey` do `AppConfigPort` e o access token do `AuthPort` no header `Authorization`; `getProfile` faz `select` por `auth_id` e, se não houver registro, faz `upsert` com `email`/`name` do Auth0; `saveProfile` faz `upsert` do registro do usuário
  - **Contexto:** Decisões 1, 4 e 8 do design.md
  - **Done:** `src/infrastructure/supabase-profile.adapter.ts` implementa `ProfilePort` e nunca usa service role key

- [ ] 5.3 **Criar `ViaCepAddressAdapter` em `src/infrastructure/viacep-address.adapter.ts`**
  - **O que mudar:** Implementar `AddressLookupPort` com `fetch` em `https://viacep.com.br/ws/{cep}/json/`, normalizando a resposta e traduzindo "não encontrado" e falha de rede em erros de domínio
  - **Contexto:** Decisão 6 do design.md
  - **Done:** `src/infrastructure/viacep-address.adapter.ts` implementa `AddressLookupPort`

- [ ] 5.4 **Criar `BrowserGeolocationAdapter` em `src/infrastructure/browser-geolocation.adapter.ts`**
  - **O que mudar:** Implementar `GeolocationPort` com `navigator.geolocation.getCurrentPosition`, traduzindo `PERMISSION_DENIED`, `POSITION_UNAVAILABLE` e `TIMEOUT` em mensagens de domínio
  - **Contexto:** Decisão 7 do design.md
  - **Done:** `src/infrastructure/browser-geolocation.adapter.ts` implementa `GeolocationPort`

- [ ] 5.5 **Exportar os novos adapters em `src/infrastructure/index.ts`**
  - **O que mudar:** Reexportar `supabase-profile.adapter`, `viacep-address.adapter` e `browser-geolocation.adapter`
  - **Done:** `src/infrastructure/index.ts` expõe os novos adapters

- [ ] 5.6 **Testes unitários da infrastructure (Vitest)**
  - **O que mudar:** Criar `src/infrastructure/profile-adapters.spec.ts` com mocks do client Supabase, do `fetch` e do `navigator.geolocation`, cobrindo sucesso, registro ausente (upsert), erro do Supabase, CEP encontrado, CEP inexistente, falha de rede, GPS com sucesso, permissão negada e indisponibilidade
  - **Contexto:** UC-02, UC-05, UC-06 — fluxos alternativos
  - **Done:** `docker compose run --rm test npm run test:coverage` passa com 100% em `src/infrastructure/`

- [ ] 5.7 **Commit + push do grupo 5**
  - **Comando:** `git add src/infrastructure/ && git commit -m "feat: add supabase, viacep and geolocation adapters" && git push`
  - **Done:** `git log --oneline -1` mostra o commit acima

---

## 6. Composition — bindings de DI

- [ ] 6.1 **Criar os tokens de DI**
  - **O que mudar:** Adicionar `PROFILE_PORT`, `ADDRESS_LOOKUP_PORT` e `GEOLOCATION_PORT` em `src/composition/index.ts`
  - **Contexto:** Decisão 3 do design.md — `composition` é o único lugar que liga ports → adapters
  - **Done:** os três `InjectionToken` estão exportados

- [ ] 6.2 **Registrar os bindings das ports e dos use cases**
  - **O que mudar:** Ligar `PROFILE_PORT` → `SupabaseProfileAdapter` (deps `APP_CONFIG_PORT`, `AUTH_PORT`), `ADDRESS_LOOKUP_PORT` → `ViaCepAddressAdapter`, `GEOLOCATION_PORT` → `BrowserGeolocationAdapter`, e registrar `LoadProfileUseCase`, `SaveProfileUseCase`, `LookupAddressByCepUseCase` e `CaptureLocationUseCase`
  - **Done:** `provideGreenKeeperDependencies()` retorna todos os providers novos

- [ ] 6.3 **Atualizar o teste de composição**
  - **O que mudar:** Ajustar `src/composition/composition.spec.ts` para cobrir os novos bindings
  - **Done:** `docker compose run --rm test npm run test:coverage` passa com 100% em `src/composition/`

- [ ] 6.4 **Commit + push do grupo 6**
  - **Comando:** `git add src/composition/ && git commit -m "feat: wire profile ports to adapters in DI" && git push`
  - **Done:** `git log --oneline -1` mostra o commit acima

---

## 7. App — tela de Perfil

- [ ] 7.1 **Criar a página de Perfil em `src/app/pages/profile.page.ts`**
  - **O que mudar:** Criar o componente com modo visualização e modo edição, conforme o wireframe do `ux-design.md`; usar formulário reativo Angular com `profileSchema` do `domain` na validação
  - **Contexto:** UC-01 a UC-07 e o `ux-design.md`
  - **Done:** `src/app/pages/profile.page.ts` exporta o componente com os dois modos

- [ ] 7.2 **Implementar os estados da tela**
  - **O que mudar:** Implementar loading (skeleton), erro de servidor com "Tentar novamente", erros de validação por campo, banner de erro no topo e toast de sucesso "Perfil atualizado"
  - **Contexto:** UC-02, UC-03, UC-04, UC-07 — estados da tela no `ux-design.md`
  - **Done:** todos os estados listados no `ux-design.md` estão implementados

- [ ] 7.3 **Implementar a busca por CEP e a captura de GPS**
  - **O que mudar:** Ligar o botão "Buscar" ao `LookupAddressByCepUseCase` e o botão "Usar minha localização" ao `CaptureLocationUseCase`, com spinner e mensagens de erro nos campos
  - **Contexto:** UC-05 e UC-06
  - **Done:** os dois botões executam os use cases e preenchem os campos correspondentes

- [ ] 7.4 **Proteger a rota `/perfil`**
  - **O que mudar:** Adicionar `canActivate: [mobileOnlyGuard, authGuard]` à rota `profile.page.ts` (padrão `RouteMeta` do AnalogJS)
  - **Contexto:** Requirement "Acesso à tela de Perfil" da spec `user-profile`
  - **Done:** a rota `/perfil` exige sessão ativa e dispositivo mobile

- [ ] 7.5 **Adicionar o avatar no header do dashboard**
  - **O que mudar:** Em `src/app/pages/index.page.ts`, incluir o avatar do usuário (foto do Google ou genérico) à direita do header, mais próximo da lateral, e deslocar o ícone de notificação para a esquerda; o toque navega para `/perfil`
  - **Contexto:** Decisão 10 do design.md — avatar como ponto de entrada, sem aba na navegação inferior
  - **Done:** o header exibe o avatar à direita, o sino deslocado à esquerda, e o toque navega para `/perfil`

- [ ] 7.6 **Testes unitários do app (Vitest)**
  - **O que mudar:** Criar `src/app/pages/profile.page.spec.ts` cobrindo carregamento, primeiro acesso, erro de carregamento, entrada em edição, salvamento válido, erro de validação por campo, erro de persistência, busca de CEP com sucesso e com falha, GPS com sucesso e com permissão negada, navegação pelo avatar e proteção da rota
  - **Contexto:** UC-01 a UC-07 — cenários Frontend Unit
  - **Done:** `docker compose run --rm test npm run test:coverage` passa com 100% em `src/app/`

- [ ] 7.7 **Commit + push do grupo 7**
  - **Comando:** `git add src/app/ && git commit -m "feat: add profile page and dashboard avatar" && git push`
  - **Done:** `git log --oneline -1` mostra o commit acima

---

## 8. Testes E2E e prints (Playwright em Docker)

- [ ] 8.1 **Criar o teste E2E da tela de Perfil**
  - **O que mudar:** Criar `e2e/profile.spec.ts` cobrindo: acesso pelo avatar, visualização do perfil, entrada em edição, salvamento com confirmação, erro de validação exibido no campo, busca por CEP e captura de GPS
  - **Contexto:** UC-01 a UC-07 — cenários Frontend E2E
  - **Done:** `docker compose run --rm playwright npm run e2e:screenshots` passa para `e2e/profile.spec.ts`

- [ ] 8.2 **Gerar o print `mobile-profile.png`**
  - **O que mudar:** Adicionar a captura da tela de Perfil em modo visualização (390x844) em `e2e/screenshots.spec.ts`
  - **Contexto:** Requisito de prints do projeto — aprovação obrigatória antes do merge
  - **Done:** `screenshots/mobile-profile.png` é gerado em 390x844

- [ ] 8.3 **Atualizar o print `mobile-dashboard.png` com o avatar**
  - **O que mudar:** Garantir que o print do dashboard mostre o avatar no header, à direita, com o sino deslocado à esquerda
  - **Done:** `screenshots/mobile-dashboard.png` reflete o novo header

- [ ] 8.4 **Aprovação de testes e prints**
  - **O que fazer:** Revisar os prints gerados e os resultados dos testes E2E com o usuário antes de prosseguir
  - **Contexto:** Regra do `openspec/config.yaml` — aprovação de testes e prints obrigatória antes do merge
  - **Done:** aprovação explícita do usuário registrada na conversa

- [ ] 8.5 **Commit + push do grupo 8**
  - **Comando:** `git add e2e/ screenshots/ && git commit -m "test: add profile e2e coverage and screenshots" && git push`
  - **Done:** `git log --oneline -1` mostra o commit acima

---

## 9. Verificação final

- [ ] 9.1 **Rodar a suíte completa com cobertura**
  - **Comando:** `docker compose run --rm test npm run test:coverage`
  - **Done:** 100% de cobertura (lines, branches, functions, statements)

- [ ] 9.2 **Rodar o build de produção**
  - **Comando:** `docker compose run --rm build npm run build`
  - **Done:** `dist/analog/public` gerado com sucesso

- [ ] 9.3 **Rodar os testes de fronteira de arquitetura**
  - **Comando:** `docker compose run --rm test npm run test -- src/architecture.spec.ts`
  - **Contexto:** Regra de dependência — `domain` e `application` sem imports de Angular/AnalogJS/infrastructure
  - **Done:** o teste passa sem nenhuma violação de camada

- [ ] 9.4 **Rodar `graphify update .`**
  - **Comando:** `graphify update .`
  - **Contexto:** Regra absoluta do AGENTS.md — obrigatório antes de qualquer `git add`
  - **Done:** `graphify-out/` atualizado e sem erros

- [ ] 9.5 **Atualizar a documentação**
  - **O que fazer:** Rodar `/documentation-writer` para atualizar `README.md` e `docs/architecture.md` com a tabela `profiles`, os novos adapters e a rota `/perfil`
  - **Contexto:** Contexto do `openspec/config.yaml` — documentação depois dos testes ok
  - **Done:** README e `docs/architecture.md` refletem a Spec 02

- [ ] 9.6 **Commit + push do grupo 9**
  - **Comando:** `git add README.md docs/ graphify-out/ && git commit -m "docs: document user profile feature" && git push`
  - **Done:** `git log --oneline -1` mostra o commit acima

---

## Final. Checklist pré-PR

- [ ] Final.1 **Testes unitários com 100% de cobertura aprovados**
  - **Comando:** `docker compose run --rm test npm run test:coverage`
  - **Done:** 100% em lines, branches, functions e statements

- [ ] Final.2 **Build de produção aprovado**
  - **Comando:** `docker compose run --rm build npm run build`
  - **Done:** `dist/analog/public` gerado sem erros

- [ ] Final.3 **Prints Playwright aprovados**
  - **Comando:** `docker compose run --rm playwright npm run e2e:screenshots`
  - **Done:** `mobile-profile.png` e `mobile-dashboard.png` revisados e aprovados pelo usuário

- [ ] Final.4 **README atualizado**
  - **Done:** README documenta a tabela `profiles`, a rota `/perfil` e a aplicação da migração

- [ ] Final.5 **`graphify update .` executado antes do `git add`**
  - **Done:** `graphify-out/` atualizado e commitado

- [ ] Final.6 **[MANUAL] Criar Pull Request no GitHub**
  - Source: `feature/spec-02-user-profile-address` → Target: `develop`
  - **Contexto:** Regra absoluta do AGENTS.md — sem autorização explícita do usuário, não criar commit, push ou PR
  - **Done:** PR criado e aprovado
