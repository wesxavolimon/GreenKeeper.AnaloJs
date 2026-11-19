## Why

O GreenKeeper já autentica o usuário via Google/Auth0 (Spec 01), mas não existe uma área de Perfil: o usuário não consegue consultar nem manter seus dados pessoais e seu endereço, que são a base do clima local e dos alertas de cuidado (rega atrasada, temperatura crítica). Esta change entrega a tela de Perfil mobile-only com edição e persistência dos dados, fechando o ciclo de "quem sou eu e onde estou" antes das specs de plantas, cuidados e clima.

## What Changes

- Nova rota `/perfil`, protegida por `authGuard` + `mobileOnlyGuard`, acessível pelo avatar no header do dashboard
- Avatar do usuário (foto do Google ou genérico) no header, posicionado à direita e mais próximo da lateral, com o ícone de notificação deslocado para a esquerda
- Tela de Perfil em modo visualização: exibe dados pessoais (nome, email, telefone, data de nascimento) e endereço (CEP, logradouro, número, complemento, bairro, cidade, estado, coordenadas GPS)
- Modo de edição com validação de entradas via Zod e mensagens de erro por campo
- Busca de endereço por CEP via API pública do ViaCEP, com preenchimento automático de logradouro, bairro, cidade e estado
- Captura de coordenadas GPS via Geolocation API do navegador, com fallback para preenchimento manual
- Persistência dos dados do perfil no Supabase/PostgreSQL (tabela `profiles`), com isolamento por usuário via RLS (`auth.uid() = auth_id`)
- Upsert do perfil no primeiro acesso, semeando nome e email vindos do Auth0
- Script SQL versionado para criação da tabela `profiles` e das políticas RLS em develop e production

## Capabilities

### New Capabilities

- `user-profile`: Perfil do usuário autenticado — visualização e edição de dados pessoais e endereço, busca de endereço por CEP, captura de GPS, persistência no Supabase com isolamento por usuário e acesso via avatar no header.

### Modified Capabilities

- (nenhum — `openspec/specs/` ainda não possui specs arquivadas; a spec `google-auth` da Spec 01 permanece em `openspec/changes/` e não tem requisito alterado por esta change)

## Impact

- **Código:** novos arquivos em `src/domain/` (modelos e regras de perfil), `src/application/` (ports e use cases), `src/infrastructure/` (adapters Supabase, ViaCEP e Geolocation), `src/composition/` (bindings de DI) e `src/app/pages/profile.page.ts` (tela de Perfil)
- **Dependências:** `@supabase/supabase-js` (client e tipos), `zod` (validação de entradas)
- **Banco de dados:** nova tabela `profiles` com RLS por `auth_id`; script SQL versionado no repositório para develop e production
- **APIs externas:** ViaCEP (busca de endereço por CEP, sem chave de API) e Geolocation API do navegador (GPS)
- **Variáveis de ambiente:** `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (já existentes em `netlify.toml` e `.env.example`); nenhuma chave de serviço exposta ao navegador
- **UI:** header do dashboard passa a exibir o avatar do usuário com acesso à rota `/perfil`
- **Qualidade:** 100% de cobertura unitária (Vitest + v8) e prints Playwright em Docker, com aprovação antes do merge
