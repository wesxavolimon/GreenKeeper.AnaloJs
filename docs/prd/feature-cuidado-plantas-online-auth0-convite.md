# PRD — GreenKeeper: Cuidado de Plantas Online com Auth0 e Convite de Familiar

> Tipo: PRD de feature · Data: 2026-11-19
> **Status:** Aguardando implementação
>
> <!-- Valores possíveis: "Aguardando implementação" | "Implementada". Atualize para "Implementada" quando todas as specs estiverem concluídas. -->

## 1. Visão geral

O GreenKeeper é um aplicativo móvel (PWA) exclusivo para celular que ajuda pessoas a cuidar de plantas domésticas. O usuário cadastra plantas por ambiente (casa/área), registra cuidados (rega, adubação, poda), recebe tarefas diárias, alertas de pendência e informações climáticas locais. Esta feature adiciona autenticação com conta Google via Auth0, modo online (sem sincronização offline), identificação de planta por foto e convite de familiar com acesso restrito a plantas.

## 2. Problema que resolve

Pessoas com plantas em casa esquecem de regar, adubar e podar, não sabem identificar espécies e não têm um lugar simples para organizar cuidados por ambiente. Hoje isso é feito de forma espalhada (anotações, memória, lembretes genéricos). O app centraliza isso em um único lugar, exclusivo para celular, com login via Google e possibilidade de convidar um familiar para ajudar nos cuidados das plantas.

## 3. Público-alvo

Pessoas que possuem plantas domésticas (apartamentos, casas com quintal, varandas) e querem organizar os cuidados por ambiente, incluindo usuários que desejam compartilhar o acesso com um familiar (ex.: cônjuge, parente) que pode ver e registrar cuidados nas plantas, mas não editar nem excluir ambientes.

## 4. Objetivo do recorte atual

Entregar um PWA mobile-only, 100% frontend (sem backend próprio), online, com autenticação Google via Auth0, banco de dados Supabase/PostgreSQL em develop e production, cadastro e listagem de plantas por ambiente, identificação por foto, registro de cuidados, tarefas diárias, alertas, clima local, perfil do usuário e convite de familiar com regras de edição provisória e aprovação pelo dono.

## 5. Funcionalidades

**Essenciais:**

- Autenticação com Google via Auth0 (login/logout, sessão, guard de rota)
- Perfil do usuário (dados pessoais, endereço com CEP e GPS)
- Gestão de ambientes (casas e áreas)
- Cadastro de planta (apelido, espécie, área, foto, notas)
- Listagem de plantas por ambiente/área
- Identificação de planta por foto (câmera/galeria)
- Registro de cuidados (rega, adubação, poda)
- Tarefas diárias (hoje, amanhã, esta semana)
- Dashboard com indicadores (plantas ativas, tarefas pendentes, alertas)
- Alertas (rega atrasada, temperatura crítica, nova planta, cuidado concluído)
- Clima local (temperatura, precipitação)
- Convite de familiar e familiares vinculados (acesso restrito a plantas, edição provisória com aprovação)

**Desejáveis:**

- Não se aplica (todos os itens essenciais estão no escopo deste recorte)

## 6. Fora do escopo

- Sincronização multi-dispositivo
- Modo offline / local-first
- Pagamentos / assinaturas
- Login social além do Google (Apple, etc.)
- Identificação botânica por múltiplos provedores (são usados os provedores definidos na stack)
- Notificações push
- Convite de familiar com edição de ambientes (casas/áreas) — o familiar só acessa plantas

## 7. Regras de negócio

1. Usuário só vê suas próprias plantas (isolamento por conta Google).
2. Planta morta não aparece em tarefas ativas.
3. Registro de cuidado recalcula a próxima data automaticamente.
4. Temperatura fora da faixa segura da espécie gera alerta térmico.
5. Apenas contas Google autenticadas acessam o app.
6. Cadastro online (sem modo offline, sem sincronização).
7. Usuário familiar vê plantas de quem o convidou.
8. Familiar vinculado não pode editar nem excluir casas e áreas — apenas plantas.
9. Alteração de planta por familiar é provisória até o dono aceitar ou recusar.
10. Se o familiar alterar a mesma planta 10 vezes, o dono pode recusar da mais recente até a mais antiga.
11. Se o dono aceitar a alteração mais recente, todas as anteriores são ignoradas (remoção física no banco de dados).

## 8. Fluxos principais

### Fluxo 1 — Autenticação e primeiro acesso

1. O usuário abre o app e é direcionado para a tela de login (se não houver sessão ativa).
2. O usuário escolhe "Entrar com Google" e é redirecionado para o provedor Auth0.
3. Após autenticação, o app recebe o token de sessão e redireciona para o dashboard.
4. Se for o primeiro acesso, o sistema conduz ao cadastro de perfil (dados pessoais e endereço).

### Fluxo 2 — Cadastro de planta

1. O usuário acessa a tela de cadastro de planta.
2. Informa apelido, seleciona espécie (texto ou identificação por foto), escolhe a área/ambiente, adiciona foto e notas.
3. O sistema salva a planta vinculada ao usuário autenticado e à área selecionada.
4. A planta aparece na listagem da área e no dashboard.

### Fluxo 3 — Registro de cuidado e tarefa diária

1. O usuário abre a tela de tarefas diárias.
2. Vê as tarefas pendentes agrupadas por hoje, amanhã e esta semana.
3. Toca em "Concluir" em uma rega, adubação ou poda.
4. O sistema registra o evento de cuidado, recalcula a próxima data e move a tarefa para concluídos.
5. Um alerta de "cuidado concluído" é gerado.

### Fluxo 4 — Convite de familiar

1. O dono acessa a tela de convites e familiares vinculados.
2. Informa o email do familiar e envia o convite.
3. O familiar recebe o convite, aceita e passa a ver as plantas do dono.
4. O familiar pode editar plantas (provisoriamente) mas não casas/áreas.
5. O dono revisa as alterações pendentes do familiar e aceita ou recusa.

## 9. Critérios de aceite

- O usuário consegue fazer login com conta Google via Auth0.
- O sistema não permite acesso a nenhuma tela sem sessão autenticada.
- O usuário consegue cadastrar, listar e visualizar detalhes de plantas por ambiente.
- O usuário consegue identificar uma planta tirando ou escolhendo uma foto.
- O usuário consegue registrar rega, adubação e poda, e a próxima data é recalculada automaticamente.
- O dashboard exibe indicadores de plantas ativas, tarefas pendentes e alertas não lidos.
- O sistema gera alerta quando uma rega está atrasada.
- O sistema gera alerta térmico quando a temperatura local está fora da faixa da espécie.
- O usuário consegue convidar um familiar por email e o familiar vê as plantas do dono.
- O familiar não consegue editar nem excluir casas e áreas.
- Alterações de planta feitas pelo familiar ficam provisórias até o dono aprovar ou recusar.

## 10. Stack

AnalogJS (Angular 22 + Vite), TypeScript, Tailwind CSS, Vitest + v8 (testes unitários), Playwright (prints automatizados), Docker Compose, Auth0 (autenticação Google), Supabase/PostgreSQL (banco online em develop e production), provedor de identificação botânica (ex.: Pl@ntNet), provedor de clima (ex.: Open-Meteo).

## 11. Justificativa da stack

Reutiliza a stack já presente no repositório (AnalogJS, Angular 22, TypeScript, Tailwind, Vitest, Playwright, Docker), evitando reinventar tecnologias. Auth0 é o provedor de autenticação já preparado nos placeholders de variáveis de ambiente (`VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`). Supabase/PostgreSQL é o banco de dados online usado tanto em `develop` quanto em `production`, substituindo o adapter em memória. Provedores externos (Pl@ntNet, Open-Meteo) são gratuitos e sem necessidade de chave de API no frontend, alinhados ao princípio de 100% frontend sem backend próprio.

## 12. Fases de construção

### Fase 1 — Autenticação e perfil do usuário

Objetivo: permitir que apenas usuários autenticados com Google acessem o app e cadastrem seus dados pessoais e endereço.

Specs:

- Spec 01 — Autenticação com Google via Auth0
- Spec 02 — Perfil do usuário (dados pessoais e endereço)

### Fase 2 — Ambientes e plantas

Objetivo: permitir a organização de plantas por casa e área, com cadastro e listagem.

Specs:

- Spec 03 — Gestão de ambientes (casas e áreas)
- Spec 04 — Cadastro de planta
- Spec 05 — Listagem de plantas por ambiente/área

### Fase 3 — Identificação botânica

Objetivo: permitir que o usuário identifique espécies de plantas por foto.

Specs:

- Spec 06 — Identificação de planta por foto (câmera/galeria)

### Fase 4 — Cuidados e tarefas diárias

Objetivo: permitir o registro de cuidados e a visualização de tarefas pendentes por dia.

Specs:

- Spec 07 — Registro de cuidados (rega, adubação, poda)
- Spec 08 — Tarefas diárias (hoje, amanhã, esta semana)

### Fase 5 — Clima e alertas

Objetivo: fornecer informações climáticas locais e gerar alertas automáticos de cuidado e temperatura.

Specs:

- Spec 09 — Clima local (temperatura, precipitação)
- Spec 10 — Alertas (rega atrasada, temperatura crítica, nova planta, cuidado concluído)

### Fase 6 — Convite de familiar

Objetivo: permitir que o dono convide um familiar para ver e editar (provisoriamente) suas plantas, com aprovação do dono.

Specs:

- Spec 11 — Convite de familiar e familiares vinculados

## 13. Specs funcionais detalhadas

### Spec 01 — Autenticação com Google via Auth0

- **Fase:** Fase 1 — Autenticação e perfil do usuário
- **Objetivo (o quê):** Permitir que o usuário faça login e logout com conta Google via Auth0, mantendo sessão ativa no app e protegendo todas as rotas contra acesso não autenticado.
- **Intenção (por quê):** O app é online e isolado por usuário; sem autenticação não há como separar os dados de cada pessoa nem garantir que cada usuário veja apenas suas próprias plantas.
- **Contexto:** O esqueleto existente tem mobile-only guard e dashboard direto sem login. Esta spec substitui o acesso direto por fluxo autenticado. As variáveis de ambiente `VITE_AUTH0_DOMAIN` e `VITE_AUTH0_CLIENT_ID` já estão preparadas no `netlify.toml` e `.env.example`.
- **Atores:** Usuário (pessoa com conta Google), sistema (Auth0 provedor de identidade).
- **Descrição do comportamento:** Ao abrir o app sem sessão, o usuário vê a tela de login com opção "Entrar com Google". Ao clicar, é redirecionado para o Auth0. Após autenticação bem-sucedida, retorna ao app com token de sessão válido e é direcionado ao dashboard. O logout encerra a sessão e retorna à tela de login. Todas as rotas internas são protegidas por um guard que redireciona não-autenticados para o login.
- **Entradas e saídas:** Entrada: credenciais do Google (via popup/redirecionamento do Auth0). Saída: token de sessão (JWT) armazenado no cliente, usuário autenticado, redirecionamento para dashboard ou login.
- **Dados/entidades envolvidos (conceitual):** Usuário: id, email, nome, foto do perfil, provedor (Google), data de criação, data do último login.
- **Estados e transições:** Não autenticado → Autenticado (após login bem-sucedido) → Não autenticado (após logout ou expiração de sessão).
- **Regras de negócio:** Apenas contas Google autenticadas acessam o app. Usuário não autenticado não acessa nenhuma tela além do login.
- **Validações:** Token de sessão deve ser válido e não expirado. Email do usuário deve pertencer ao domínio Google (garantido pelo provedor Auth0).
- **Fluxo do usuário (passo a passo):**
  1. Usuário abre o app sem sessão ativa.
  2. Sistema exibe tela de login com botão "Entrar com Google".
  3. Usuário toca no botão e é redirecionado para o Auth0.
  4. Usuário faz login com conta Google e autoriza o app.
  5. Auth0 redireciona de volta ao app com token de sessão.
  6. Sistema valida o token e redireciona para o dashboard.
- **Casos de borda e erros:** Usuário cancela o login no Auth0 → retorna à tela de login com mensagem opcional. Token expirado → redireciona para login. Falha de rede durante o login → exibe erro e permite tentar novamente. Usuário já autenticado abre o app → vai direto ao dashboard.
- **Impacto no existente:** Substitui o dashboard direto sem login por fluxo autenticado. O mobile-only guard continua funcionando (primeiro verifica dispositivo móvel, depois verifica autenticação).
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado que o usuário não tem sessão ativa Quando abre o app Então vê a tela de login com opção "Entrar com Google".
  - Dado que o usuário está na tela de login Quando toca em "Entrar com Google" Então é redirecionado para o Auth0.
  - Dado que o usuário autenticou com sucesso no Auth0 Quando retorna ao app Então vê o dashboard e está com sessão ativa.
  - Dado que o usuário tem sessão ativa Quando toca em "Sair" Então a sessão é encerrada e ele retorna à tela de login.
- **Definição de pronto:** Login com Google funciona, logout encerra a sessão, rotas protegidas bloqueiam não-autenticados, testes unitários cobrem o guard e o caso de uso de autenticação.
- **Dependências:** Nenhuma.
- **Fora do escopo desta spec:** Login social além do Google (Apple, etc.), cadastro de usuário com email/senha, recuperação de senha.

### Spec 02 — Perfil do usuário (dados pessoais e endereço)

- **Fase:** Fase 1 — Autenticação e perfil do usuário
- **Objetivo (o quê):** Permitir que o usuário autenticado cadastre e edite seus dados pessoais (nome completo, apelido, sexo, data de nascimento) e endereço (CEP, logradouro, número, complemento, bairro, cidade, estado, latitude/longitude via GPS ou CEP).
- **Intenção (por quê):** O endereço e as coordenadas são usados para resolver a localização do clima local e para associar ambientes (casas/áreas) a um endereço físico. Os dados pessoais identificam o dono da conta.
- **Contexto:** Requer Spec 01 (usuário autenticado). O `prd-old.md` descreve `PerfilFieldSheet`, `PerfilEnderecoSheet`, busca por CEP via AwesomeAPI e GPS via `IGeolocationService`. No escopo atual (100% frontend), esses serviços são adaptados para chamar APIs externas diretamente do cliente ou via adapter existente.
- **Atores:** Usuário autenticado.
- **Descrição do comportamento:** O usuário acessa o menu de configurações (5º ícone da barra inferior) e escolhe "Perfil". Lá edita dados pessoais em bottom sheets individuais e endereço com busca automática por CEP (preenchendo logradouro, bairro, cidade, estado e coordenadas) ou uso de GPS. O email é exibido apenas para leitura (imutável). As alterações são salvas online no banco de dados.
- **Entradas e saídas:** Entrada: dados pessoais e endereço digitados pelo usuário, ou CEP digitado (dispara busca automática), ou GPS acionado. Saída: perfil salvo e exibido na tela.
- **Dados/entidades envolvidos (conceitual):** Perfil do usuário: nome completo, apelido, sexo, data de nascimento, email (somente leitura), endereço (CEP, logradouro, número, complemento, bairro, cidade, estado, latitude, longitude), foto de perfil (opcional).
- **Estados e transições:** Não se aplica.
- **Regras de negócio:** Email é imutável (somente leitura). Endereço pode ser preenchido automaticamente via CEP ou GPS. Coordenadas (latitude/longitude) são usadas para resolução de clima.
- **Validações:** CEP deve ter 8 dígitos para disparar busca automática. Campos obrigatórios: nome completo, apelido. Endereço é opcional mas recomendado para clima local.
- **Fluxo do usuário (passo a passo):**
  1. Usuário autenticado abre o menu de configurações.
  2. Escolhe "Perfil".
  3. Edita dados pessoais (nome, apelido, sexo, data de nascimento) em bottom sheets individuais.
  4. Edita endereço: digita CEP (busca automática preenche os demais campos) ou toca em "Usar GPS".
  5. Salva as alterações.
- **Casos de borda e erros:** CEP inválido ou não encontrado → exibe erro e permite digitação manual. GPS negado pelo usuário → oculta silenciosamente a opção de coordenadas via GPS, permitindo preenchimento manual. Falha na busca de CEP → exibe mensagem de erro e permite tentar novamente.
- **Impacto no existente:** Adiciona tela de perfil e endereço ao menu de configurações existente (5º ícone). Não altera o dashboard nem o mobile-only guard.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado que o usuário está autenticado Quando acessa o menu de configurações e escolhe "Perfil" Então vê a tela de edição de dados pessoais e endereço.
  - Dado que o usuário digita um CEP válido de 8 dígitos Quando toca em buscar Então o sistema preenche automaticamente logradouro, bairro, cidade e estado.
  - Dado que o usuário toca em "Usar GPS" Quando o GPS está disponível Então o sistema obtém latitude e longitude do dispositivo.
  - Dado que o usuário edita o email Quando tenta salvar Então o email permanece inalterado (somente leitura).
- **Definição de pronto:** Usuário consegue editar nome, apelido, sexo, data de nascimento e endereço; busca por CEP preenche endereço; GPS obtém coordenadas; email é somente leitura; testes unitários cobrem validações e adapters de CEP/GPS.
- **Dependências:** Spec 01 (usuário autenticado).
- **Fora do escopo desta spec:** Upload de foto de perfil (opcional, pode ficar para depois), sincronização de perfil entre dispositivos.

### Spec 03 — Gestão de ambientes (casas e áreas)

- **Fase:** Fase 2 — Ambientes e plantas
- **Objetivo (o quê):** Permitir que o usuário cadastre, edite, liste e exclua casas (ambientes físicos) e áreas (cômodos/espaços dentro de cada casa), com atributos de luminosidade, orientação e flag de chuva direta.
- **Intenção (por quê):** Plantas são organizadas por ambiente. A área define onde a planta fica e suas características (luminosidade, chuva direta) influenciam os cuidados (ex.: supressão de rega por chuva).
- **Contexto:** Requer Spec 01 (usuário autenticado). O `prd-old.md` descreve `CasasPage`, `CasaEditSheet`, `AreasPage`, `AreaEditSheet`. No escopo atual, essas telas são reimplementadas no frontend AnalogJS com adapter online.
- **Atores:** Usuário autenticado (dono). Familiar vinculado não pode editar nem excluir casas/áreas (regra de negócio 8).
- **Descrição do comportamento:** O usuário acessa a tela de ambientes e vê a lista de casas. Cada casa pode ter várias áreas. Ao editar uma casa, define nome, tipo (Residência, Prédio, Comercial), endereço, status (Ativa/Inativa), datas de entrada/saída. Ao editar uma área, define nome, casa vinculada (apenas casas ativas), luminosidade/exposição solar (Sombra, Meia Sombra, Sol Pleno), orientação e flag "Recebe chuva direta". Permite mover área de uma casa para outra e excluir áreas.
- **Entradas e saídas:** Entrada: dados da casa e da área digitados pelo usuário. Saída: lista de casas e áreas salva e exibida.
- **Dados/entidades envolvidos (conceitual):** Casa: nome, tipo, endereço, status, data de entrada, data de saída. Área: nome, casa vinculada, luminosidade/exposição solar, orientação, recebe chuva direta.
- **Estados e transições:** Casa: Ativa ↔ Inativa. Área: vinculada a uma casa ativa.
- **Regras de negócio:** Se o usuário tem 0 casas, o sistema conduz ao cadastro guiado no primeiro uso. Se tem 1 casa ativa, ela é selecionada automaticamente nos fluxos de áreas e plantas. Ao inativar uma casa com áreas vinculadas, exige transferência prévia das áreas para outra casa ativa (e bloqueia se não houver outra casa ativa). Área só pode ser vinculada a casa ativa.
- **Validações:** Nome da casa é obrigatório. Casa vinculada à área deve estar ativa. Não é possível inativar a única casa ativa sem transferir áreas primeiro.
- **Fluxo do usuário (passo a passo):**
  1. Usuário acessa a tela de ambientes (casas e áreas).
  2. Vê a lista de casas e, ao expandir uma casa, vê suas áreas.
  3. Toca em "Nova casa" para cadastrar ou edita uma casa existente.
  4. Dentro de uma casa, toca em "Nova área" para cadastrar ou edita uma área existente.
  5. Pode mover uma área para outra casa ou excluir uma área.
- **Casos de borda e erros:** Usuário sem casas → conduz ao cadastro guiado. Tentativa de inativar casa com áreas e sem outra casa ativa → bloqueia e exibe mensagem. Área vinculada a casa inativa → não é permitida.
- **Impacto no existente:** Adiciona telas de casas e áreas ao app. Não altera o dashboard nem a autenticação.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado que o usuário está autenticado Quando acessa a tela de ambientes Então vê a lista de casas e áreas.
  - Dado que o usuário cadastra uma casa Quando salva Então a casa aparece na lista.
  - Dado que o usuário cadastra uma área vinculada a uma casa ativa Quando salva Então a área aparece sob aquela casa.
  - Dado que o usuário tenta inativar a única casa ativa Quando não há outra casa ativa Então o sistema bloqueia e exibe mensagem.
- **Definição de pronto:** Usuário consegue cadastrar, editar, listar e excluir casas e áreas; regras de inativação segura funcionam; áreas só vinculam a casas ativas; testes unitários cobrem repositório e casos de uso de ambientes.
- **Dependências:** Spec 01 (usuário autenticado).
- **Fora do escopo desta spec:** Edição de casas/áreas por familiar vinculado (não permitido), sincronização de ambientes entre dispositivos.

### Spec 04 — Cadastro de planta

- **Fase:** Fase 2 — Ambientes e plantas
- **Objetivo (o quê):** Permitir que o usuário cadastre uma nova planta com apelido, espécie, área vinculada, foto e notas, vinculada ao usuário autenticado.
- **Intenção (por quê):** O cadastro de planta é o núcleo do app — sem plantas não há cuidados, tarefas nem alertas. A planta é a entidade central que conecta usuário, área e cuidados.
- **Contexto:** Requer Spec 01 (usuário autenticado) e Spec 03 (ambientes existentes). O `prd-old.md` descreve `PlantasPage` com cadastro de apelido, espécie, área, foto comprimida, notas e configuração de poda.
- **Atores:** Usuário autenticado (dono). Familiar vinculado pode editar plantas (provisoriamente, veja Spec 11).
- **Descrição do comportamento:** O usuário acessa a tela de cadastro de planta, informa apelido, seleciona ou busca uma espécie (texto ou por foto), escolhe a área onde a planta fica, opcionalmente tira ou escolhe uma foto e adiciona notas. Ao salvar, a planta é criada vinculada ao usuário e à área, com status "Ativa".
- **Entradas e saídas:** Entrada: apelido, espécie, área, foto (opcional), notas. Saída: planta cadastrada e exibida na listagem da área.
- **Dados/entidades envolvidos (conceitual):** Planta: apelido, espécie, área vinculada, foto, notas, status (Ativa/Removida/Morta), data de cadastro, data de óbito (se morta).
- **Estados e transições:** Planta: Ativa → Morta (define data de óbito) → Ativa (reverte, preserva histórico). Planta: Ativa → Removida (exclusão).
- **Regras de negócio:** Planta morta não aparece em tarefas ativas (regra 2). Planta está vinculada a um usuário e a uma área.
- **Validações:** Apelido é obrigatório. Espécie é obrigatória (pode ser nome livre se não houver enriquecimento). Área deve existir e estar ativa.
- **Fluxo do usuário (passo a passo):**
  1. Usuário acessa a tela de cadastro de planta (atalho "Nova planta" no dashboard ou menu).
  2. Informa apelido da planta.
  3. Seleciona espécie (busca por texto ou identificação por foto — veja Spec 06).
  4. Escolhe a área/ambiente onde a planta fica.
  5. Opcionalmente, tira ou escolhe uma foto da planta.
  6. Adiciona notas (opcional).
  7. Salva a planta.
- **Casos de borda e erros:** Apelido vazio → exibe erro de validação. Área não selecionada → exibe erro. Foto muito grande → comprime ou exibe aviso. Espécie não encontrada → permite nome livre com enriquecimento pendente.
- **Impacto no existente:** Adiciona tela de cadastro de planta. Não altera autenticação nem ambientes (depende deles).
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado que o usuário está autenticado Quando acessa a tela de cadastro de planta Então vê os campos para apelido, espécie, área, foto e notas.
  - Dado que o usuário preenche apelido, espécie e área Quando salva Então a planta é criada com status "Ativa" e aparece na listagem da área.
  - Dado que o usuário não preenche o apelido Quando tenta salvar Então o sistema exibe erro de validação e não salva.
- **Definição de pronto:** Usuário consegue cadastrar planta com todos os campos; planta aparece na área correta; validações funcionam; testes unitários cobrem caso de uso e validações.
- **Dependências:** Spec 01 (usuário autenticado), Spec 03 (ambientes), Spec 06 (identificação por foto — opcional, para seleção de espécie).
- **Fora do escopo desta spec:** Identificação automática de espécie por foto (é Spec 06), configuração avançada de poda (pode ficar para depois).

### Spec 05 — Listagem de plantas por ambiente/área

- **Fase:** Fase 2 — Ambientes e plantas
- **Objetivo (o quê):** Permitir que o usuário visualize todas as plantas agrupadas por casa e área, com status de cada planta (ativa, morta, removida) e acesso rápido aos detalhes.
- **Intenção (por quê):** O usuário precisa ver quais plantas tem em cada ambiente para decidir quais cuidados registrar. A listagem é a porta de entrada para o detalhe da planta e para o registro de cuidados.
- **Contexto:** Requer Spec 01, Spec 03 e Spec 04. Exibe plantas cadastradas pelo usuário autenticado (ou pelo familiar vinculado, veja Spec 11).
- **Atores:** Usuário autenticado (dono). Familiar vinculado (vê plantas do dono).
- **Descrição do comportamento:** O usuário acessa a tela de listagem de plantas e vê as plantas agrupadas por casa e área. Cada planta exibe apelido, espécie, área, status e um indicativo visual de cuidado pendente (ex.: "Rega pendente"). Tocar em uma planta abre os detalhes. Filtrar por status (Ativa, Removida, Morta) é suportado.
- **Entradas e saídas:** Entrada: nenhum (ou filtro de status). Saída: lista de plantas agrupadas por casa/área.
- **Dados/entidades envolvidos (conceitual):** Planta: apelido, espécie, área, status, último cuidado, próximo cuidado pendente.
- **Estados e transições:** Não se aplica (listagem apenas).
- **Regras de negócio:** Usuário vê apenas suas próprias plantas (regra 1). Planta morta não aparece em tarefas ativas (mas pode aparecer na listagem com status Morta). Familiar vinculado vê plantas do dono (regra 7).
- **Validações:** Não se aplica (listagem apenas).
- **Fluxo do usuário (passo a passo):**
  1. Usuário acessa a tela de listagem de plantas.
  2. Vê as plantas agrupadas por casa e área.
  3. Opcionalmente, filtra por status (Ativa, Removida, Morta).
  4. Toca em uma planta para ver os detalhes.
- **Casos de borda e erros:** Nenhuma planta cadastrada → exibe estado vazio com incentivo para cadastrar. Área sem plantas → exibe área vazia.
- **Impacto no existente:** Adiciona tela de listagem de plantas. Não altera cadastro nem ambientes.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado que o usuário está autenticado Quando acessa a listagem de plantas Então vê suas plantas agrupadas por casa e área.
  - Dado que o usuário filtra por status "Morta" Quando aplica o filtro Então vê apenas plantas com status Morta.
  - Dado que o usuário toca em uma planta Quando seleciona Então abre a tela de detalhes da planta.
- **Definição de pronto:** Listagem exibe plantas agrupadas por casa/área; filtro por status funciona; toque em planta abre detalhes; testes unitários cobrem listagem e filtros.
- **Dependências:** Spec 01, Spec 03, Spec 04.
- **Fora do escopo desta spec:** Detalhes da planta com grid de métricas (pode ser parte do detalhe, mas não é foco desta spec), histórico de cuidados (é parte do detalhe, não da listagem).

### Spec 06 — Identificação de planta por foto (câmera/galeria)

- **Fase:** Fase 3 — Identificação botânica
- **Objetivo (o quê):** Permitir que o usuário tire uma foto ou escolha uma da galeria para identificar a espécie da planta, recebendo sugestões com score de confiança.
- **Intenção (por quê):** Muitos usuários não sabem o nome científico ou popular da planta que têm. A identificação por foto facilita o cadastro correto da espécie e o enriquecimento automático de dados de cuidado (exposição solar, frequência de rega, temperatura).
- **Contexto:** Requer Spec 01 (usuário autenticado). Usa um provedor externo de identificação botânica (ex.: Pl@ntNet via proxy ou chamada direta). No escopo atual (100% frontend), a chamada pode ser feita diretamente do cliente ou via adapter existente.
- **Atores:** Usuário autenticado.
- **Descrição do comportamento:** O usuário acessa a tela de identificação por foto (ou a opção dentro do cadastro de planta), tira uma foto com a câmera ou escolhe da galeria. O app envia a imagem para o provedor de identificação e exibe sugestões de espécies com nomes populares e científicos e score de confiança. O usuário escolhe uma sugestão para usar como espécie da planta.
- **Entradas e saídas:** Entrada: imagem da planta (câmera ou galeria). Saída: lista de sugestões de espécies com nome popular, nome científico e score de confiança.
- **Dados/entidades envolvidos (conceitual):** Espécie sugerida: nome popular, nome científico, score de confiança, fonte (provedor).
- **Estados e transições:** Não se aplica.
- **Regras de negócio:** Se o provedor falhar ou o usuário estiver sem conexão, permite cadastro com nome de espécie livre (enriquecimento pendente). Não se aplica modo offline (regra 6 — cadastro online).
- **Validações:** Imagem deve ser uma foto válida. Mínimo de qualidade para envio (não muito pequena).
- **Fluxo do usuário (passo a passo):**
  1. Usuário acessa a tela de identificação por foto.
  2. Escolhe "Tirar foto" ou "Escolher da galeria".
  3. Captura ou seleciona a imagem.
  4. Sistema envia para o provedor de identificação.
  5. Sistema exibe sugestões de espécies com scores.
  6. Usuário escolhe uma sugestão (ou digita manualmente).
- **Casos de borda e erros:** Câmera não disponível → oferece apenas galeria. Provedor indisponível → exibe erro e permite cadastro com nome livre. Imagem não reconhecida → exibe "nenhuma espécie encontrada" e permite digitação manual.
- **Impacto no existente:** Adiciona tela de identificação por foto e integração com provedor externo. Não altera cadastro nem ambientes.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado que o usuário está na tela de identificação Quando tira uma foto Então o sistema envia a imagem para o provedor e exibe sugestões de espécies.
  - Dado que o provedor retorna sugestões Quando o usuário escolhe uma Então a espécie selecionada é usada no cadastro da planta.
  - Dado que o provedor falha Quando o usuário tenta identificar Então o sistema permite cadastro com nome de espécie livre.
- **Definição de pronto:** Usuário consegue tirar/escolher foto, receber sugestões de espécie e selecionar uma; fallback para nome livre funciona; testes unitários cobrem integração com provedor e fallback.
- **Dependências:** Spec 01 (usuário autenticado).
- **Fora do escopo desta spec:** Múltiplos provedores de identificação (são usados os definidos na stack), identificação automática sem intervenção do usuário.

### Spec 07 — Registro de cuidados (rega, adubação, poda)

- **Fase:** Fase 4 — Cuidados e tarefas diárias
- **Objetivo (o quê):** Permitir que o usuário registre eventos de cuidado (rega, adubação, poda) para uma planta, com data/hora, observações e dados específicos de cada tipo (volume em mL para rega, tipo de adubo para adubação, etc.).
- **Intenção (por quê):** O registro de cuidado é a ação principal do usuário. Cada registro recalcula a próxima data de cuidado, alimentando as tarefas diárias e os alertas.
- **Contexto:** Requer Spec 01, Spec 03, Spec 04. O `prd-old.md` descreve `RegistrarCuidadoSheet` com rega (volume mL, pulada por chuva), adubação (tipo, produto) e poda (manutenção).
- **Atores:** Usuário autenticado (dono). Familiar vinculado pode registrar cuidados (provisoriamente, veja Spec 11).
- **Descrição do comportamento:** O usuário acessa a tela de registro de cuidado (ou a partir de uma planta/tarefa), escolhe o tipo (rega, adubação ou poda), informa data/hora (permite registro retroativo) e campos específicos do tipo. Para rega: volume opcional em mL, observação, flag "Pulada por chuva". Para adubação: tipo de adubo, produto utilizado, observação. Para poda: data, observação, histórico por planta. Ao salvar, o sistema recalcula automaticamente a próxima data de cuidado.
- **Entradas e saídas:** Entrada: tipo de cuidado, data/hora, campos específicos (volume, tipo de adubo, etc.), observação. Saída: evento de cuidado registrado e próxima data recalculada.
- **Dados/entidades envolvidos (conceitual):** Evento de cuidado: tipo (rega/adubação/poda), data/hora, volume mL (rega), tipo de adubo e produto (adubação), observação, pulada por chuva (rega), próxima data calculada.
- **Estados e transições:** Não se aplica (registro de evento).
- **Regras de negócio:** Registro de cuidado recalcula a próxima data automaticamente (regra 3). Para áreas com "Recebe chuva direta = true", dias com precipitação relevante suprimem a necessidade de rega manual (regra relacionada ao clima — Spec 09/10).
- **Validações:** Data/hora não pode ser futura (ou pode ser, para registro agendado — definir comportamento). Tipo de cuidado é obrigatório. Planta deve existir.
- **Fluxo do usuário (passo a passo):**
  1. Usuário acessa a tela de registro de cuidado (ou a partir de uma planta).
  2. Escolhe o tipo de cuidado (rega, adubação ou poda).
  3. Informa data/hora (pode ser retroativa).
  4. Preenche campos específicos do tipo (volume mL para rega, tipo de adubo para adubação, etc.).
  5. Adiciona observação (opcional).
  6. Salva o registro.
  7. Sistema recalcula a próxima data de cuidado.
- **Casos de borda e erros:** Data futura → permite ou bloqueia (definir). Planta não encontrada → erro. Volume inválido → erro de validação.
- **Impacto no existente:** Adiciona tela de registro de cuidado. Não altera cadastro nem ambientes.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado que o usuário está autenticado Quando acessa o registro de cuidado Então vê opções para rega, adubação e poda.
  - Dado que o usuário registra uma rega Quando salva Então o evento é registrado e a próxima data de rega é recalculada.
  - Dado que o usuário registra uma adubação Quando salva Então o evento é registrado com tipo de adubo e produto.
- **Definição de pronto:** Usuário consegue registrar os três tipos de cuidado; próxima data é recalculada automaticamente; validações funcionam; testes unitários cobrem caso de uso e recálculo de datas.
- **Dependências:** Spec 01, Spec 03, Spec 04.
- **Fora do escopo desta spec:** Notificações push de lembrete de cuidado (fora do escopo), registro de cuidado por familiar com aprovação (é Spec 11).

### Spec 08 — Tarefas diárias (hoje, amanhã, esta semana)

- **Fase:** Fase 4 — Cuidados e tarefas diárias
- **Objetivo (o quê):** Exibir as tarefas de cuidado pendentes de todas as plantas ativas, agrupadas por Hoje, Amanhã e Esta semana, com ações rápidas de concluir e adiar.
- **Intenção (por quê):** O usuário precisa saber o que fazer hoje e nos próximos dias sem navegar por cada planta. A central de tarefas é a visão operacional diária do app.
- **Contexto:** Requer Spec 01, Spec 03, Spec 04, Spec 07. O `prd-old.md` descreve `TarefasDiariasPage` com três grupos temporais e ações rápidas (concluir, adiar +1 dia).
- **Atores:** Usuário autenticado (dono). Familiar vinculado (vê tarefas das plantas do dono).
- **Descrição do comportamento:** O usuário acessa a tela de tarefas diárias e vê três seções: Hoje (inclui tarefas do dia e atrasadas), Amanhã, Esta semana. Cada tarefa exibe planta, tipo de cuidado e prazo. Ações rápidas: "Concluir tarefa" (checkbox circular que registra o cuidado imediatamente e move para a seção colapsável "Concluídos") e "Adiar (+1 dia)" (posterga em 24 horas com um toque).
- **Entradas e saídas:** Entrada: nenhum (ou filtro por planta/área). Saída: lista de tarefas agrupadas por período.
- **Dados/entidades envolvidos (conceitual):** Tarefa: planta, tipo de cuidado, data prevista, status (pendente/concluída/adiada), próxima data.
- **Estados e transições:** Tarefa: Pendente → Concluída (após checkbox). Tarefa: Pendente → Adiada (data +1 dia).
- **Regras de negócio:** Planta morta não aparece em tarefas ativas (regra 2). Concluir uma tarefa registra o cuidado e recalcula a próxima data (regra 3).
- **Validações:** Não se aplica (exibição e ação sobre tarefas existentes).
- **Fluxo do usuário (passo a passo):**
  1. Usuário acessa a tela de tarefas diárias.
  2. Vê as tarefas agrupadas por Hoje, Amanhã, Esta semana.
  3. Toca em "Concluir" em uma tarefa → registra o cuidado e move para Concluídos.
  4. Toca em "Adiar (+1 dia)" em uma tarefa → posterga em 24 horas.
- **Casos de borda e erros:** Nenhuma tarefa pendente → exibe estado vazio. Tarefa atrasada → aparece na seção Hoje com destaque.
- **Impacto no existente:** Adiciona tela de tarefas diárias. Não altera cadastro nem ambientes.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado que o usuário está autenticado Quando acessa as tarefas diárias Então vê tarefas agrupadas por Hoje, Amanhã e Esta semana.
  - Dado que o usuário toca em "Concluir" em uma tarefa Quando confirma Então o cuidado é registrado e a tarefa move para Concluídos.
  - Dado que o usuário toca em "Adiar (+1 dia)" Quando confirma Então a tarefa é postergada em 24 horas.
- **Definição de pronto:** Tarefas exibidas agrupadas por período; concluir e adiar funcionam; plantas mortas não aparecem; testes unitários cobrem agrupamento e ações.
- **Dependências:** Spec 01, Spec 03, Spec 04, Spec 07.
- **Fora do escopo desta spec:** Notificações push de lembrete (fora do escopo), visualização de tarefas concluídas por histórico longo (seção Concluídos é local e simples).

### Spec 09 — Clima local (temperatura, precipitação)

- **Fase:** Fase 5 — Clima e alertas
- **Objetivo (o quê):** Fornecer a temperatura local atual e a precipitação diária com base na localização do usuário (GPS ou endereço do perfil), para uso em alertas térmicos e supressão de rega por chuva.
- **Intenção (por quê):** O clima afeta diretamente os cuidados das plantas (regar menos se choveu, alertar se temperatura está fora da faixa segura da espécie). Sem dados climáticos, não há alertas térmicos nem supressão automática de rega.
- **Contexto:** Requer Spec 01 (usuário autenticado) e Spec 02 (endereço/coordenadas do perfil). Usa provedor de clima gratuito sem API key (ex.: Open-Meteo). O `prd-old.md` descreve `ClimaService` e `LocationResolver` com GPS e fallback para coordenadas do perfil.
- **Atores:** Usuário autenticado. Sistema (busca automática de clima).
- **Descrição do comportamento:** O sistema resolve a localização do usuário (GPS em tempo real, com fallback para coordenadas do endereço do perfil). Consulta a API de clima para obter temperatura atual e precipitação diária. Se nenhuma coordenada existir, oculta silenciosamente o badge climático sem interromper o usuário. Os dados são exibidos no dashboard (badge de temperatura) e usados pelos alertas (Spec 10).
- **Entradas e saídas:** Entrada: coordenadas (GPS ou perfil). Saída: temperatura atual, precipitação diária.
- **Dados/entidades envolvidos (conceitual):** Clima local: temperatura atual, precipitação diária, localização (latitude/longitude), data/hora da consulta.
- **Estados e transições:** Não se aplica.
- **Regras de negócio:** Se não houver coordenadas, o badge climático é ocultado silenciosamente (não bloqueia o usuário). Dados climáticos são usados para alertas térmicos (Spec 10) e supressão de rega por chuva (regra relacionada).
- **Validações:** Coordenadas devem ser válidas para consulta. API de clima deve responder com dados válidos.
- **Fluxo do usuário (passo a passo):**
  1. Usuário abre o dashboard.
  2. Sistema resolve localização (GPS ou perfil).
  3. Sistema consulta a API de clima.
  4. Temperatura atual é exibida no dashboard (badge).
  5. Precipitação diária é usada internamente pelos alertas.
- **Casos de borda e erros:** GPS negado → fallback para coordenadas do perfil. Sem coordenadas → badge climático oculto. API de clima falha → exibe último dado disponível ou oculta silenciosamente, sem interromper o usuário.
- **Impacto no existente:** Adiciona dados climáticos ao dashboard e aos alertas. Não altera autenticação nem cadastro.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado que o usuário tem coordenadas no perfil Quando abre o dashboard Então vê a temperatura local atual.
  - Dado que o usuário não tem coordenadas Quando abre o dashboard Então o badge climático é ocultado silenciosamente.
  - Dado que a API de clima falha Quando o sistema tenta consultar Então o usuário não é interrompido (exibe último dado ou oculta).
- **Definição de pronto:** Temperatura e precipitação são obtidas e exibidas; fallback para perfil funciona; ausência de coordenadas não quebra o app; testes unitários cobrem resolução de localização e integração com API de clima.
- **Dependências:** Spec 01, Spec 02.
- **Fora do escopo desta spec:** Previsão do tempo para vários dias (apenas atual e precipitação diária), alertas de clima severo além da temperatura.

### Spec 10 — Alertas (rega atrasada, temperatura crítica, nova planta, cuidado concluído)

- **Fase:** Fase 5 — Clima e alertas
- **Objetivo (o quê):** Gerar e exibir alertas persistidos para o usuário: rega atrasada (urgente), temperatura crítica fora da faixa segura da espécie (aviso), nova planta adicionada (info) e cuidado concluído (sucesso). Permitir marcar como lido e remover individualmente.
- **Intenção (por quê):** O usuário precisa ser notificado sobre cuidados pendentes e problemas com as plantas sem precisar verificar manualmente cada uma. Os alertas são o mecanismo de engajamento e segurança das plantas.
- **Contexto:** Requer Spec 01, Spec 04, Spec 07, Spec 09. O `prd-old.md` descreve `AlertasPage` com geração automática e deduplicada, agrupamento por Hoje/Esta semana/Anterior, marcação como lido e remoção.
- **Atores:** Usuário autenticado (dono). Familiar vinculado (vê alertas das plantas do dono).
- **Descrição do comportamento:** O sistema gera alertas automaticamente ao abrir o dashboard: rega atrasada (urgente, avaliada ao abrir), temperatura crítica (aviso, comparando temperatura local com TempMinC/TempMaxC da espécie), nova planta (info), cuidado concluído (sucesso). Alertas são agrupados em Hoje, Esta semana e Anterior. Tocar no alerta marca como lido. Botão de remoção exclui individualmente. "Limpar tudo" remove todos mediante confirmação.
- **Entradas e saídas:** Entrada: nenhum (geração automática). Saída: lista de alertas agrupados por período.
- **Dados/entidades envolvidos (conceitual):** Alerta: tipo (urgente/aviso/info/sucesso), planta relacionada, mensagem, data/hora, lido (sim/não).
- **Estados e transições:** Alerta: Não lido → Lido (após tocar). Alerta: Lido → Removido (após excluir).
- **Regras de negócio:** Temperatura fora da faixa da espécie gera alerta térmico (regra 4). Alertas não são duplicados para o mesmo tipo e planta (deduplicação).
- **Validações:** Não se aplica (geração automática).
- **Fluxo do usuário (passo a passo):**
  1. Usuário acessa a tela de alertas (ou vê no dashboard).
  2. Vê alertas agrupados por Hoje, Esta semana, Anterior.
  3. Toca em um alerta para marcar como lido.
  4. Toca em "✕" para remover individualmente ou "Limpar tudo" para remover todos.
- **Casos de borda e erros:** Nenhum alerta → exibe estado vazio. Falha ao gerar alerta → não interrompe o usuário.
- **Impacto no existente:** Adiciona tela de alertas e integração com dashboard (indicador de alertas não lidos). Não altera autenticação nem cadastro.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado que há uma rega atrasada Quando o usuário abre o dashboard Então um alerta urgente é exibido.
  - Dado que a temperatura está fora da faixa da espécie Quando o sistema avalia Então um alerta térmico é gerado.
  - Dado que o usuário toca em um alerta Quando confirma Então o alerta é marcado como lido.
  - Dado que o usuário toca em "Limpar tudo" Quando confirma Então todos os alertas são removidos.
- **Definição de pronto:** Alertas são gerados automaticamente, agrupados, marcáveis como lido e removíveis; deduplicação funciona; testes unitários cobrem geração e gestão de alertas.
- **Dependências:** Spec 01, Spec 04, Spec 07, Spec 09.
- **Fora do escopo desta spec:** Notificações push (fora do escopo), alertas por email (fora do escopo).

### Spec 11 — Convite de familiar e familiares vinculados

- **Fase:** Fase 6 — Convite de familiar
- **Objetivo (o quê):** Permitir que o dono convide um familiar por email para acessar suas plantas, com regras de edição provisória: o familiar vê as plantas do dono, pode editar plantas (provisoriamente) mas não casas/áreas, e as alterações do familiar precisam ser aprovadas ou recusadas pelo dono.
- **Intenção (por quê):** Muitas casas têm mais de uma pessoa cuidando das plantas. O familiar precisa ajudar nos registros de cuidado, mas não deve ter controle total sobre ambientes. O fluxo de aprovação garante que o dono mantenha o controle final.
- **Contexto:** Requer Spec 01 (usuário autenticado), Spec 03 (ambientes), Spec 04 (plantas). O `prd-old.md` menciona convite de familiar como próximo propose (fora do escopo atual do esqueleto), mas esta feature o traz para o escopo deste PRD.
- **Atores:** Usuário dono (convida e aprova/recusa). Usuário familiar (recebe convite, vê e edita plantas provisoriamente).
- **Descrição do comportamento:** O dono acessa a tela de convites e familiares vinculados, informa o email do familiar e envia o convite. O familiar recebe o convite, aceita e passa a ver as plantas do dono. O familiar pode editar plantas (apelido, notas, cuidados) mas não casas/áreas. Alterações de planta feitas pelo familiar ficam marcadas como provisórias. O dono revisa a lista de alterações pendentes e pode aceitar ou recusar cada uma. Se o familiar alterar a mesma planta 10 vezes, o dono pode recusar da mais recente até a mais antiga. Se o dono aceitar a mais recente, todas as anteriores são ignoradas (remoção física no banco de dados). Se recusar, a alteração é desfeita.
- **Entradas e saídas:** Entrada: email do familiar (convite), decisão de aceitar/recusar (dono), edições de planta (familiar). Saída: convite enviado, familiar vinculado, alterações aprovadas/recusadas.
- **Dados/entidades envolvidos (conceitual):** Convite: email do familiar, status (pendente/aceito/recusado), data. Familiar vinculado: usuário familiar, usuário dono, data de vínculo. Alteração provisória: planta alterada, campo alterado, valor antigo, valor novo, status (pendente/aprovado/recusado), data.
- **Estados e transições:** Convite: Pendente → Aceito (familiar aceita) → Recusado (dono ou familiar recusa). Alteração provisória: Pendente → Aprovado (dono aceita) → Recusado (dono recusa).
- **Regras de negócio:** Familiar vinculado vê plantas do dono (regra 7). Familiar não edita nem exclui casas/áreas (regra 8). Alteração de planta por familiar é provisória até aprovação (regra 9). Se 10 alterações pendentes na mesma planta, dono recusa da mais recente para a mais antiga (regra 10). Aceitar a mais recente ignora todas as anteriores (remoção física) (regra 11).
- **Validações:** Email do familiar deve ser válido. Familiar não pode ser o próprio dono. Familiar já vinculado não recebe novo convite duplicado.
- **Fluxo do usuário (passo a passo):**
  1. Dono acessa a tela de convites e familiares vinculados.
  2. Dono informa email do familiar e envia convite.
  3. Familiar recebe o convite (por email ou notificação no app) e aceita.
  4. Familiar passa a ver as plantas do dono.
  5. Familiar edita uma planta (alteração marcada como provisória).
  6. Dono acessa a tela de alterações pendentes.
  7. Dono aceita ou recusa cada alteração.
  8. Se aprovado, a alteração é aplicada definitivamente. Se recusado, é desfeita.
- **Casos de borda e erros:** Email inválido → erro de validação. Familiar não aceita o convite → convite permanece pendente. Familiar tenta editar casa/área → bloqueado. 10ª alteração na mesma planta → lista mostra todas as 10 para o dono recusar em ordem inversa.
- **Impacto no existente:** Adiciona tela de convites, familiares vinculados e alterações pendentes. Não altera autenticação, cadastro de plantas nem ambientes (mas restringe edição de ambientes para familiar).
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado que o dono está autenticado Quando envia um convite por email Então o familiar recebe o convite.
  - Dado que o familiar aceita o convite Quando acessa o app Então vê as plantas do dono.
  - Dado que o familiar edita uma planta Quando salva Então a alteração fica marcada como provisória.
  - Dado que o dono revisa alterações pendentes Quando aceita a mais recente Então todas as anteriores são ignoradas (remoção física).
  - Dado que o familiar tenta editar uma casa ou área Quando tenta salvar Então o sistema bloqueia e exibe mensagem.
- **Definição de pronto:** Dono consegue convidar familiar, familiar aceita e vê plantas, familiar edita plantas provisoriamente, dono aprova/recusa alterações, regras de 10 alterações e remoção física funcionam; testes unitários cobrem convite, vínculo e fluxo de aprovação.
- **Dependências:** Spec 01, Spec 03, Spec 04.
- **Fora do escopo desta spec:** Familiar edita casas/áreas (não permitido), notificações push para o familiar (fora do escopo), convite por email com template customizado (pode ser simples).

## 14. Ordem recomendada de implementação

1. Spec 01 — Autenticação com Google via Auth0 (base de tudo — sem login não há isolamento de dados)
2. Spec 02 — Perfil do usuário (depende da autenticação; fornece endereço para clima)
3. Spec 03 — Gestão de ambientes (depende da autenticação; necessário para cadastro de planta)
4. Spec 04 — Cadastro de planta (depende de ambientes e autenticação)
5. Spec 05 — Listagem de plantas por ambiente/área (depende do cadastro de planta)
6. Spec 06 — Identificação de planta por foto (depende da autenticação; opcional para cadastro)
7. Spec 07 — Registro de cuidados (depende de plantas e autenticação)
8. Spec 08 — Tarefas diárias (depende de cuidados e plantas)
9. Spec 09 — Clima local (depende do perfil; usado por alertas)
10. Spec 10 — Alertas (depende de cuidados, plantas e clima)
11. Spec 11 — Convite de familiar (depende de autenticação, ambientes e plantas)

Seguir esta ordem evita implementar partes fora de contexto (ex.: tarefas diárias sem cuidados registrados, alertas sem clima, convite sem plantas) e respeita as dependências entre specs. Cada spec é autossuficiente e pode ser implementada por um agente de codificação com base apenas nesta descrição e nas specs de que depende.