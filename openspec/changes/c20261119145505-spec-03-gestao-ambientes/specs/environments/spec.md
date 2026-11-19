## ADDED Requirements

### Requirement: Listagem de casas e áreas
O sistema SHALL exibir a lista de casas do usuário autenticado, com as áreas de cada casa listadas sob a casa correspondente.

#### Scenario: Usuário com casas cadastradas
- **WHEN** o usuário autenticado acessa a tela de ambientes e possui ao menos uma casa
- **THEN** o sistema exibe cada casa com seu nome, tipo e status, e as áreas vinculadas sob a respectiva casa

#### Scenario: Casa inativa com badge visual
- **WHEN** o usuário possui uma casa com status Inativa
- **THEN** o sistema exibe a casa com um badge visual indicando "Inativa"

#### Scenario: Casa sem áreas
- **WHEN** o usuário expande uma casa que não possui áreas vinculadas
- **THEN** o sistema exibe um estado vazio com ação para cadastrar a primeira área daquela casa

### Requirement: Cadastro guiado da primeira casa
O sistema SHALL conduzir o usuário ao cadastro da primeira casa quando ele não possuir nenhuma casa cadastrada.

#### Scenario: Usuário sem casas
- **WHEN** o usuário autenticado acessa a tela de ambientes e possui 0 casas
- **THEN** o sistema exibe o estado vazio e conduz ao cadastro guiado da primeira casa

#### Scenario: Primeira casa cadastrada
- **WHEN** o usuário conclui o cadastro guiado informando um nome válido
- **THEN** o sistema cria a casa com status Ativa e a exibe na listagem

### Requirement: Cadastro e edição de casa
O sistema SHALL permitir cadastrar e editar casas com nome, tipo, endereço, status e datas de entrada e saída.

#### Scenario: Cadastro de casa válido
- **WHEN** o usuário informa nome e tipo e salva uma nova casa
- **THEN** o sistema cria a casa com status Ativa e data de entrada igual à data atual

#### Scenario: Cadastro de casa sem nome
- **WHEN** o usuário tenta salvar uma casa sem preencher o nome
- **THEN** o sistema exibe erro de validação e não salva a casa

#### Scenario: Edição de casa existente
- **WHEN** o usuário altera o nome ou o endereço de uma casa existente e salva
- **THEN** o sistema atualiza a casa preservando o identificador e as áreas vinculadas

#### Scenario: Tipo de casa inválido
- **WHEN** o usuário informa um tipo de casa fora de Residência, Prédio ou Comercial
- **THEN** o sistema rejeita o cadastro e não salva a casa

### Requirement: Inativação segura de casa
O sistema SHALL permitir inativar uma casa somente quando ela não possuir áreas vinculadas ou quando existir outra casa ativa para receber essas áreas.

#### Scenario: Inativação de casa sem áreas
- **WHEN** o usuário inativa uma casa que não possui áreas vinculadas
- **THEN** o sistema altera o status da casa para Inativa e registra a data de saída

#### Scenario: Inativação bloqueada sem outra casa ativa
- **WHEN** o usuário tenta inativar a única casa ativa e ela possui áreas vinculadas
- **THEN** o sistema bloqueia a inativação e exibe mensagem orientando a transferência prévia das áreas

#### Scenario: Inativação após transferência das áreas
- **WHEN** o usuário transfere todas as áreas da casa para outra casa ativa e então inativa a casa
- **THEN** o sistema conclui a inativação e a casa passa a ter status Inativa

#### Scenario: Reativação de casa
- **WHEN** o usuário reativa uma casa inativa
- **THEN** o sistema altera o status para Ativa e remove a data de saída

### Requirement: Cadastro e edição de área
O sistema SHALL permitir cadastrar e editar áreas com nome, casa vinculada ativa, luminosidade, orientação e flag de chuva direta.

#### Scenario: Cadastro de área válido
- **WHEN** o usuário informa nome, seleciona uma casa ativa e salva uma nova área
- **THEN** o sistema cria a área vinculada à casa selecionada e a exibe sob aquela casa

#### Scenario: Cadastro de área sem nome
- **WHEN** o usuário tenta salvar uma área sem preencher o nome
- **THEN** o sistema exibe erro de validação e não salva a área

#### Scenario: Área vinculada a casa inativa
- **WHEN** o usuário tenta vincular uma área a uma casa com status Inativa
- **THEN** o sistema rejeita a operação e não salva a área

#### Scenario: Luminosidade fora do conjunto permitido
- **WHEN** o usuário informa uma luminosidade diferente de Sombra, Meia Sombra ou Sol Pleno
- **THEN** o sistema rejeita o cadastro e não salva a área

#### Scenario: Edição de área existente
- **WHEN** o usuário altera o nome, a luminosidade, a orientação ou a flag de chuva direta de uma área
- **THEN** o sistema atualiza a área preservando o identificador e a casa vinculada

### Requirement: Movimentação de área entre casas
O sistema SHALL permitir mover uma área de uma casa para outra casa ativa.

#### Scenario: Movimentação para casa ativa
- **WHEN** o usuário move uma área de uma casa para outra casa com status Ativa
- **THEN** o sistema atualiza a casa vinculada da área e ela passa a aparecer sob a nova casa

#### Scenario: Movimentação para casa inativa
- **WHEN** o usuário tenta mover uma área para uma casa com status Inativa
- **THEN** o sistema rejeita a movimentação e mantém a área na casa original

### Requirement: Exclusão de área
O sistema SHALL permitir excluir uma área existente.

#### Scenario: Exclusão de área
- **WHEN** o usuário confirma a exclusão de uma área
- **THEN** o sistema remove a área da listagem da casa correspondente

#### Scenario: Exclusão de área inexistente
- **WHEN** o usuário tenta excluir uma área cujo identificador não existe
- **THEN** o sistema não altera a listagem e retorna o estado inalterado

### Requirement: Seleção automática da casa única ativa
O sistema SHALL selecionar automaticamente a casa nos fluxos de áreas quando o usuário possuir exatamente uma casa ativa.

#### Scenario: Uma única casa ativa
- **WHEN** o usuário acessa o cadastro de área e possui exatamente uma casa ativa
- **THEN** o sistema pré-seleciona essa casa no seletor de casa vinculada

#### Scenario: Nenhuma casa ativa
- **WHEN** o usuário acessa o cadastro de área e não possui nenhuma casa ativa
- **THEN** o sistema bloqueia o cadastro e orienta o usuário a cadastrar ou reativar uma casa

### Requirement: Isolamento por usuário autenticado
O sistema SHALL vincular casas e áreas ao usuário autenticado e exibir apenas os ambientes desse usuário.

#### Scenario: Usuário autenticado acessa ambientes
- **WHEN** um usuário autenticado acessa a tela de ambientes
- **THEN** o sistema lista somente as casas e áreas vinculadas àquele usuário

#### Scenario: Familiar vinculado tenta editar ambiente
- **WHEN** um familiar vinculado tenta cadastrar, editar, inativar ou excluir uma casa ou área
- **THEN** o sistema nega a operação de escrita e mantém os ambientes inalterados