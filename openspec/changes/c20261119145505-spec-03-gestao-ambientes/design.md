## Context

O GreenKeeper é um PWA mobile-only (AnalogJS + Angular 22 + Vite 8) 100% frontend, sem backend próprio, deploy estático no Netlify. A Spec 01 entregou autenticação Google via Auth0 (`authGuard` + `mobileOnlyGuard` em cadeia nas rotas internas). O dashboard atual (`src/app/pages/index.page.ts`) consome `DashboardSnapshot` do `InMemoryDashboardRepository`, cujos cômodos (`Corredor`, `Sala de Estar`, `Banheiro`) são dados de exemplo em memória, sem vínculo com o usuário e sem atributos de ambiente.

A Spec 03 introduz a gestão de ambientes (casas e áreas) como capability `environments`, seguindo a Clean Architecture pragmática já existente: `domain` ← `application` ← `infrastructure`/`app`, com `composition` ligando ports a adapters. Nenhuma dependência externa nova é necessária; a persistência em memória é suficiente para este recorte, com o adapter Supabase ficando para spec futura.

## Goals / Non-Goals

**Goals:**
- Modelar `House` e `Area` no domain com regras puras (inativação segura, validação de vínculo, seleção da casa padrão)
- Expor `EnvironmentRepositoryPort` e use cases de casas e áreas na camada de aplicação
- Entregar `InMemoryEnvironmentRepository` como adapter inicial
- Disponibilizar as telas de Ambientes (lista expansível + bottom sheets de casa e área) na rota `/environments`
- Preservar 100% de cobertura unitária (Vitest + v8) e prints Playwright
- Manter a separação mobile-only + autenticação (Spec 01 intacta)

**Non-Goals:**
- Persistência online no Supabase (fica para spec futura; o port já está desenhado para receber o adapter)
- Cadastro, listagem e detalhe de plantas (Spec 04 e Spec 05)
- Identificação de planta por foto (Spec 06)
- Edição de casas/áreas por familiar vinculado (Spec 11; regra de negócio 8 já bloqueada no domain)
- Sincronização entre dispositivos, modo offline, upload de fotos de casas/áreas
- Histórico de alterações de casas e áreas

## Decisions

### 1. Modelar casas e áreas como entidades de domínio puras, com regras em funções/exportações
**Por que:** A inativação segura (bloqueio quando há áreas e nenhuma outra casa ativa) e a validação de vínculo (área só em casa ativa) são regras de negócio puras. Mantê-las em `src/domain/` sem imports de framework preserva a fronteira de Clean Architecture já testada em `src/architecture.spec.ts` e permite cobertura unitária trivial.
**Alternativas consideradas:** Regras no use case (rejeitado: acopla regra de negócio à camada de aplicação e dificulta reuso/teste); regras no componente (rejeitado: fragmenta a lógica e foge da arquitetura).

### 2. `EnvironmentRepositoryPort` com um único snapshot agregado (casas + áreas)
**Por que:** Casas e áreas são um agregado coeso — toda mutação (criar casa, mover área, inativar casa) precisa de visão consistente do conjunto. Um único `getSnapshot()/saveSnapshot()` segue o padrão já usado por `DashboardRepositoryPort` e simplifica o adapter em memória e o futuro adapter Supabase.
**Alternativas consideradas:** Dois ports separados (`HouseRepositoryPort` + `AreaRepositoryPort`) (rejeitado: obriga o use case a coordenar dois ports para operações atômicas como inativar casa com transferência de áreas); repositório por entidade com IDs (rejeitado: mais superfície de DI sem ganho neste recorte).

### 3. Adapter em memória agora, Supabase depois — port já isolado
**Por que:** A Spec 03 não depende de persistência online para entregar valor (cadastro/edição/listagem já funcionam em memória). Isolar o port permite trocar o adapter por Supabase em spec futura sem tocar em domain/application.
**Alternativas consideradas:** Implementar Supabase já nesta spec (rejeitado: aumenta o escopo, exige decisões de schema/RLS e credenciais que não são o foco); usar `localStorage` (rejeitado: a arquitetura é 100% frontend mas o padrão do projeto é adapter injetável, e localStorage adiciona limpeza/estado não trivial).

### 4. Estrutura de arquivos seguindo o padrão existente
- `src/domain/models.ts` — interfaces `House`, `Area`, `HouseType`, `AreaLight`, `HouseStatus`, `EnvironmentSnapshot`
- `src/domain/rules.ts` — funções puras `canDeactivateHouse`, `resolveDefaultHouseId`, `validateAreaLink`, `summarizeHouseAddress`
- `src/application/ports.ts` — `EnvironmentRepositoryPort`
- `src/application/use-cases.ts` — `ListEnvironmentsUseCase`, `SaveHouseUseCase`, `DeactivateHouseUseCase`, `SaveAreaUseCase`, `MoveAreaUseCase`, `DeleteAreaUseCase`, `ResolveDefaultHouseUseCase`
- `src/infrastructure/in-memory-environment.repository.ts` — `InMemoryEnvironmentRepository`
- `src/composition/index.ts` — tokens e providers
- `src/app/pages/environments.page.ts` — tela de Ambientes
- `src/app/pages/house-form.page.ts` e `src/app/pages/area-form.page.ts` — bottom sheets (páginas AnalogJS)

### 5. Substituir os cômodos de exemplo do dashboard por dados derivados do repositório de ambientes
**Por que:** Hoje `INITIAL_BOTANICAL_SNAPSHOT.rooms` contém cômodos fixos. Com a Spec 03, as "salas" do dashboard passam a ser as áreas reais do usuário. Manter os dois mundos duplicaria a fonte de verdade.
**Alternativas consideradas:** Manter o snapshot de exemplo e ignorar ambientes no dashboard (rejeitado: diverge do produto e cria dívida); refatorar o dashboard inteiro agora (rejeitado: o dashboard é alvo das Specs 04/05; esta spec apenas conecta a fonte de áreas).

## Risks / Trade-offs

| Risco | Mitigação |
|-------|-----------|
| Inativar a única casa ativa deixando áreas órfãs | Regra pura `canDeactivateHouse` bloqueia e retorna motivo; use case não persiste; caso de teste dedicado |
| Área vinculada a casa inativa | `validateAreaLink` rejeita; `AreaHousePicker` lista apenas casas ativas; caso de teste dedicado |
| Familiar vinculado editando ambientes | `SaveHouseUseCase`/`SaveAreaUseCase` recebem o papel e negam escrita; regra 8 do PRD coberta por teste |
| Endereço da casa duplicar lógica de CEP/GPS da Spec 02 | Reutilizar o fluxo de endereço já existente; `HouseAddressFieldsComponent` apenas apresenta e emite o sub-objeto de endereço |
| Dados de exemplo em memória divergirem das casas reais | `InMemoryEnvironmentRepository` semeado com dados iniciais; dashboard passa a derivar áreas do snapshot de ambientes |
| Crescimento do `index.page.ts` (24 KB) ao adicionar navegação | Criar páginas dedicadas `/environments` e manter o dashboard enxuto; navegação por rota, não por estado local |

## Migration Plan

1. Adicionar `House`, `Area` e tipos ao `src/domain/models.ts`
2. Adicionar regras puras ao `src/domain/rules.ts` + testes unitários
3. Adicionar `EnvironmentRepositoryPort` ao `src/application/ports.ts` + use cases + testes
4. Criar `InMemoryEnvironmentRepository` em `src/infrastructure/` + testes
5. Registrar tokens e providers no `src/composition/index.ts` + teste de DI
6. Criar páginas `/environments`, `/environments/houses/new`, `/environments/houses/:id`, `/environments/areas/new`, `/environments/areas/:id` com `routeMeta.canActivate = [mobileOnlyGuard, authGuard]`
7. Ajustar o dashboard para derivar as "salas" do snapshot de ambientes (mantendo o snapshot de plantas/cuidados)
8. Rodar `npm run test:coverage` (100% obrigatório) e `npm run build`
9. Rodar prints Playwright (`mobile-environments.png`, `mobile-house-form.png`, `mobile-area-form.png`) e E2E de ambientes
10. Criar PR para `develop` com autorização explícita do usuário

**Rollback:** Reverter o commit da change; o port e o adapter em memória são isolados, e o dashboard volta a usar o snapshot de exemplo.

## Open Questions

- O endereço da casa deve ser um sub-objeto estruturado (CEP, logradouro, número, complemento, bairro, cidade, estado, latitude, longitude) reutilizando o tipo da Spec 02, ou apenas uma string livre? (Proposta: sub-objeto estruturado reutilizando o tipo de endereço da Spec 02.)
- A flag "Recebe chuva direta" da área deve alimentar a supressão de rega já nesta spec ou apenas ficar armazenada para Specs 07/10? (Proposta: apenas armazenar; a supressão é regra de cuidado, fora deste recorte.)
- A rota `/environments` deve substituir o dashboard como rota raiz `/` ou coexistir como rota irmã acessível pela navegação inferior? (Proposta: rota irmã acessível pela navegação inferior, mantendo `/` como dashboard.)