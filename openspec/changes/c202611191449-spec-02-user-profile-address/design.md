## Context

O GreenKeeper é um PWA mobile-only (AnalogJS + Angular 22 + Vite 8) 100% frontend, sem backend próprio, publicado como site estático no Netlify. A Spec 01 (em andamento) adicionou autenticação Google via Auth0 com `AuthPort`, `Auth0Adapter` e `AuthGuard`. Esta change (Spec 02) entrega a área de Perfil: dados pessoais e endereço, persistidos no Supabase/PostgreSQL, acessados pelo avatar no header do dashboard.

Estado atual relevante:
- `AppConfigPort` já expõe `supabaseUrl` e `supabaseAnonKey` (via `ViteEnvConfigAdapter`), mas **nenhum adapter Supabase existe** — o dashboard usa `InMemoryDashboardRepository`.
- `AuthPort.getUser()` devolve `User` com `id` (= `sub` do Auth0), `email`, `name`, `picture`, `provider`.
- O header do dashboard (`src/app/pages/index.page.ts`) hoje exibe apenas o logo (folha) e o sino de notificações; não há avatar.
- A navegação inferior é um FAB de câmera — não existe aba "Perfil".
- `domain` e `application` não importam Angular/AnalogJS/infrastructure (regra validada por `src/architecture.spec.ts`).
- Cobertura unitária de 100% (lines, branches, functions, statements) via Vitest + v8; build e prints rodam via `docker compose`.

Restrições: nunca expor `SUPABASE_SERVICE_ROLE_KEY` ou admin client ao navegador; validar entradas externas com Zod; preferir Server Components, usando Client Components só quando necessário; Docker obrigatório para build/testes/prints.

## Goals / Non-Goals

**Goals:**
- Tela de Perfil mobile-only em `/perfil`, protegida por `authGuard` + `mobileOnlyGuard`
- Avatar do usuário no header do dashboard como ponto de entrada, posicionado à direita (mais próximo da lateral), com o sino de notificações deslocado para a esquerda
- Visualização e edição de dados pessoais (nome completo, telefone, data de nascimento) e endereço (CEP, logradouro, número, complemento, bairro, cidade, estado, latitude, longitude)
- Busca de endereço por CEP via ViaCEP e captura de GPS via Geolocation API, ambos com fallback manual
- Persistência no Supabase/PostgreSQL com isolamento por usuário via RLS (`auth.uid() = auth_id`)
- Validação de todas as entradas com Zod, com erros por campo
- 100% de cobertura unitária e prints Playwright aprovados antes do merge

**Non-Goals:**
- Exclusão de conta, consentimento de privacidade e exportação de dados (LGPD)
- Upload de foto de perfil (usa a foto do Google)
- Múltiplos endereços, endereços de entrega, configurações de notificação
- Convite de familiar por email e notificações push (specs próprias)
- Substituição do `InMemoryDashboardRepository` por Supabase (permanece em memória nesta change)
- Sincronização de dados de plantas/cuidados (specs futuras)

## Decisions

### 1. Persistência: tabela `profiles` no Supabase com RLS por `auth_id`
**Por que:** O usuário precisa que o endereço persista entre sessões e dispositivos, e o clima local/alertas dependem dele. O `AppConfigPort` já expõe `supabaseUrl`/`supabaseAnonKey`, e o projeto já define Supabase/PostgreSQL como banco de develop e production. A chave de isolamento é o `sub` do Auth0, que o Supabase Auth JWT expõe como `auth.uid()`.
**Alternativas consideradas:** `localStorage` (rejeitado: não sincroniza entre dispositivos e é acessível a XSS); IndexedDB (rejeitado: mesma limitação de sincronização); tabela `public.profiles` com coluna `auth_id uuid references auth.users(id)` (rejeitado: acopla o schema ao schema interno do Auth0, que o Supabase não garante estável).

### 2. RLS como barreira de isolamento, não apenas filtro no cliente
**Por que:** O frontend é 100% público e o `anon key` fica no bundle. Sem RLS, qualquer usuário poderia ler perfis alheios via chamada direta à API. A política `auth.uid() = auth_id` garante o isolamento no banco, independentemente do código do cliente.
**Alternativas consideradas:** filtro `WHERE auth_id = ?` no cliente (rejeitado: inseguro por si só); tabela por usuário (rejeitado: inviável em operação).

### 3. `ProfilePort` na camada `application`, com `SupabaseProfileAdapter` na `infrastructure`
**Por que:** Mantém a Clean Architecture pragmática já adotada: `domain` (modelos + schema Zod) ← `application` (ports + use cases) ← `infrastructure` (adapter Supabase) ← `composition` (bindings). O `domain` e o `application` permanecem sem imports de Angular/AnalogJS/infrastructure, preservando o teste de fronteira `src/architecture.spec.ts`.
**Alternativas consideradas:** chamar o client Supabase direto no componente (rejeitado: quebra a regra de dependência e dificulta testes); criar um "SupabaseService" global (rejeitado: acoplamento escondido e baixa testabilidade).

### 4. `AuthPort` estendido com `getAccessToken()` para autenticar as chamadas ao Supabase
**Por que:** O `auth0-spa-js` já é usado no projeto e o `Auth0Adapter` é o ponto único de acesso à identidade. Expor o access token por uma extension do `AuthPort` permite que o `SupabaseProfileAdapter` envie `Authorization: Bearer <token>` sem duplicar a integração do Auth0 nem acoplar o adapter de perfil ao SDK.
**Alternativas consideradas:** criar um segundo client Supabase autenticado por token (rejeitado: duplicaria a integração Auth0); usar a `anon key` sem token (rejeitado: a RLS exigiria claims do usuário e a chamada falharia).

### 5. Schema Zod no `domain`, com mensagens de erro em português por campo
**Por que:** O projeto exige validação de entradas externas com Zod. O schema fica no `domain` (sem dependência de framework) e produz um mapa `campo → mensagem`, consumido pela tela para exibir erros por campo. A regra de dependência permite que `application` dependa de `domain`.
**Alternativas consideradas:** validação manual com `if` em cada campo (rejeitado: verboso e fácil de divergir); validação só no componente (rejeitado: regra de negócio fora da camada correta).

### 6. ViaCEP para busca de endereço por CEP
**Por que:** API pública, sem chave, com resposta em JSON (`https://viacep.com.br/ws/{cep}/json/`), cobrindo todo o CEP brasileiro. O adapter encapsula o `fetch` e normaliza a resposta para o modelo de domínio.
**Alternativas consideradas:** API do Correios com chave (rejeitado: exige credencial e tem limite de uso); preenchimento 100% manual (rejeitado: pior experiência e mais erro de digitação).

### 7. Geolocation API do navegador para o GPS
**Por que:** API nativa, sem dependência externa nem chave, e já disponível no contexto de PWA mobile. O adapter encapsula `navigator.geolocation.getCurrentPosition` e traduz os códigos de erro em mensagens de domínio (permissão negada, indisponível, timeout).
**Alternativas consideradas:** serviço de geocodificação reversa (rejeitado: exige chave e não é necessário — o app só precisa das coordenadas); GPS nativo via plugin Capacitor (rejeitado: adiciona dependência nativa a um PWA web).

### 8. `ProfilePort` com `getProfile()`/`saveProfile()` e upsert semeando dados do Auth0
**Por que:** O `AuthPort.getUser()` já devolve `id`, `email` e `name` do Google. No primeiro acesso, o adapter faz `upsert` com esses dados, garantindo que o perfil exista sem exigir um passo de cadastro separado. O `saveProfile()` grava os campos editáveis.
**Alternativas consideradas:** exigir um formulário de onboarding antes do dashboard (rejeitado: quebra a experiência de Spec 01 e adiciona fricção); deixar o perfil inexistente e tratar `null` na tela (rejeitado: a spec exige que o registro seja criado no primeiro acesso).

### 9. Tela de Perfil como Client Component com formulário reativo
**Por que:** A tela precisa de estado de formulário, validação por campo, chamadas assíncronas e feedback de loading/erro — interatividade que exige Client Component. O restante do app permanece Server-first conforme a diretriz do projeto.
**Alternativas consideradas:** Server Component com `action` de formulário (rejeitado: o projeto é 100% frontend estático, sem backend para receber a submissão).

### 10. Avatar no header do dashboard, à direita, com o sino deslocado para a esquerda
**Por que:** O novo design não tem aba "Perfil" na navegação inferior (apenas o FAB de câmera). O avatar é o ponto de entrada natural e já existe no design da Spec 01 como fallback de foto do Google. Posicioná-lo à direita, mais próximo da lateral, e deslocar o sino para a esquerda evita sobreposição visual em telas de 390px.
**Alternativas consideradas:** item no menu do FAB (rejeitado: esconde o acesso atrás de dois toques); botão de ícone de pessoa no lugar do avatar (rejeitado: perde a identidade visual do usuário).

## Risks / Trade-offs

| Risco | Mitigação |
|---|---|
| Tabela `profiles` não existe em develop/production | Script SQL versionado no repositório (`supabase/migrations/`) aplicado antes do deploy; a change inclui a etapa de migração no plano |
| RLS mal configurada expõe perfis entre usuários | Política `auth.uid() = auth_id` em `SELECT`/`INSERT`/`UPDATE`/`DELETE`; teste de integração valida o isolamento e a spec cobre o cenário |
| `auth.uid()` vazio quando o token do Auth0 não é o do Supabase Auth | O `SupabaseProfileAdapter` envia o access token do Auth0 no header `Authorization`; se o `auth_id` não resolver, o adapter retorna erro explícito em vez de gravar em massa |
| ViaCEP fora do ar ou com limite de requisições | Falha tratada com mensagem no campo do CEP e preenchimento manual sempre disponível |
| Usuário nega a permissão de geolocalização | Mensagem explicativa e campos de coordenadas editáveis; o GPS é opcional |
| Vazamento de PII em logs de erro | O adapter não loga payload de perfil; erros retornam apenas código e mensagem |
| Cobertura de 100% exige testes de todos os caminhos de erro | Cenários de teste por camada já mapeados na `use-cases.md` (UC-01 a UC-07) |

## Migration Plan

1. Criar a branch `feature/spec-02-user-profile-address` a partir de `develop` em worktree isolada (`worktrees/feature/spec-02-user-profile-address`)
2. Adicionar `@supabase/supabase-js` e `zod` ao `package.json` e instalar via `npm ci`
3. Versionar o script SQL de criação da tabela `profiles` e das políticas RLS em `supabase/migrations/`
4. Criar modelos e schema Zod em `src/domain/`, ports e use cases em `src/application/`
5. Criar `SupabaseProfileAdapter`, `ViaCepAddressAdapter` e `BrowserGeolocationAdapter` em `src/infrastructure/`
6. Registrar os bindings em `src/composition/index.ts`
7. Criar `src/app/pages/profile.page.ts` e o avatar no header de `src/app/pages/index.page.ts`
8. Rodar `docker compose run --rm test npm run test:coverage` (100% obrigatório) e `docker compose run --rm build npm run build`
9. Rodar `docker compose run --rm playwright npm run e2e:screenshots` e validar os prints (`mobile-profile.png`, `mobile-dashboard.png` com avatar)
10. Rodar `graphify update .` antes de qualquer `git add`
11. Abrir PR para `develop` somente com autorização explícita do usuário

**Rollback:** reverter o commit da change, remover a dependência `@supabase/supabase-js` e dropar a tabela `profiles` (o script de rollback fica versionado junto da migração).

## Open Questions

- O `audience` do Auth0 (`https://{domain}/api/v2`) é o mesmo usado para validar o token no Supabase Auth, ou o projeto deve configurar um audience específico do Supabase? Depende da configuração da API do Auth0 e precisa ser confirmado antes da integração.
- A tabela `profiles` deve guardar `email` e `name` duplicados do Auth0, ou apenas `auth_id` + dados editáveis? A duplicação permite exibir o perfil mesmo com o Auth0 indisponível, ao custo de dessincronização.
- O `dateOfBirth` deve ser armazenado como `date` no Postgres ou como `text` ISO? `date` é preferível, mas exige cuidado com fuso horário na conversão.
- O telefone deve ser armazenado como texto livre (com máscara) ou normalizado em E.164? A normalização facilita integrações futuras de notificação.
