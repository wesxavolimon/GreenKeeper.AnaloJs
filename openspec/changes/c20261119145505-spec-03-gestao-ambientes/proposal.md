## Why

O GreenKeeper organiza plantas por ambiente, mas não existe nenhuma estrutura para cadastrar casas e áreas: o dashboard usa três cômodos fixos em memória (`Corredor`, `Sala de Estar`, `Banheiro`) sem vínculo com o usuário autenticado e sem os atributos que influenciam o cuidado (luminosidade, orientação, chuva direta). Sem isso, plantas não têm onde ser vinculadas e as Specs 04/05 (cadastro e listagem de plantas) não têm base.

## What Changes

- Nova capability `environments`: casas e áreas com ciclo de vida completo (cadastro, edição, listagem, exclusão de área, inativação/reativação de casa)
- Entidades `House` e `Area` no domain, com regras puras de inativação segura e validação de vínculo
- `EnvironmentRepositoryPort` na camada de aplicação com use cases de casas e áreas
- Adapter em memória `InMemoryEnvironmentRepository` (Spec 03), substituível por Supabase em spec futura
- Telas de Ambientes (casas expansíveis com suas áreas) e bottom sheets de edição de casa e de área
- Cadastro guiado da primeira casa quando o usuário tem 0 casas
- Seleção automática da casa única ativa nos fluxos de áreas
- Bloqueio de escrita para o papel familiar vinculado (regra de negócio 8 do PRD)
- Substituição dos cômodos de exemplo do dashboard por dados derivados do repositório de ambientes

## Capabilities

### New Capabilities

- `environments`: Gestão de ambientes — casas (nome, tipo, endereço, status, datas) e áreas (nome, casa vinculada, luminosidade, orientação, chuva direta), incluindo inativação segura, movimentação de área entre casas e cadastro guiado do primeiro acesso.

### Modified Capabilities

- (nenhuma — `google-auth` não tem requisitos alterados; Spec 03 apenas consome a sessão autenticada)

## Impact

- Código: novos arquivos em `src/domain/` (modelos e regras), `src/application/` (port e use cases), `src/infrastructure/` (adapter em memória), `src/composition/` (DI) e `src/app/pages/` (telas de ambientes)
- Dados: `INITIAL_BOTANICAL_SNAPSHOT.rooms` deixa de ser a fonte de cômodos do dashboard; passa a derivar do repositório de ambientes
- Rotas: nova rota interna `/environments` protegida por `mobileOnlyGuard` + `authGuard`
- Dependências: nenhuma nova dependência externa
- Testes: Vitest (domínio, aplicação, infraestrutura, composition, páginas) e Playwright (prints e E2E de ambientes), mantendo 100% de cobertura
- Fora deste recorte: persistência online no Supabase, plantas (Spec 04/05) e edição por familiar (Spec 11)