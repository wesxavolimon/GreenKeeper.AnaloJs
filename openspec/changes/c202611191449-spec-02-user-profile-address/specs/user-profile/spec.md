## ADDED Requirements

### Requirement: Acesso à tela de Perfil
O sistema SHALL disponibilizar uma rota `/perfil` acessível pelo avatar do usuário exibido no header do dashboard, protegida pelo guard de autenticação e pelo gate mobile-only.

#### Scenario: Usuário autenticado acessa o Perfil pelo avatar
- **WHEN** o usuário autenticado toca no avatar exibido no header do dashboard
- **THEN** o sistema navega para a rota `/perfil` e exibe a tela de Perfil

#### Scenario: Avatar exibe a foto do Google quando disponível
- **WHEN** o token do Auth0 contém a foto do perfil Google
- **THEN** o avatar no header exibe essa foto

#### Scenario: Avatar exibe imagem genérica quando não há foto
- **WHEN** o token do Auth0 não contém foto do perfil
- **THEN** o avatar no header exibe uma imagem genérica

#### Scenario: Usuário não autenticado tenta acessar a rota de Perfil
- **WHEN** um usuário sem sessão ativa acessa a rota `/perfil` diretamente pela URL
- **THEN** o guard de rota redireciona para a tela de login

### Requirement: Visualização do perfil
O sistema SHALL exibir na tela de Perfil os dados pessoais e o endereço do usuário autenticado, em modo somente leitura.

#### Scenario: Perfil carregado com sucesso
- **WHEN** o usuário autenticado abre a tela de Perfil e existe perfil salvo para sua conta
- **THEN** o sistema exibe nome, email, telefone, data de nascimento e os campos de endereço preenchidos

#### Scenario: Primeiro acesso sem perfil salvo
- **WHEN** o usuário autenticado abre a tela de Perfil e ainda não existe registro de perfil para sua conta
- **THEN** o sistema cria o registro a partir dos dados do Auth0 (nome e email) e exibe a tela de Perfil com os demais campos vazios

#### Scenario: Falha ao carregar o perfil
- **WHEN** o carregamento do perfil falha por erro de rede ou de servidor
- **THEN** o sistema exibe mensagem de erro com opção de tentar novamente

### Requirement: Edição de dados pessoais
O sistema SHALL permitir que o usuário autenticado edite e salve seus dados pessoais: nome completo, telefone e data de nascimento.

#### Scenario: Usuário entra em modo de edição
- **WHEN** o usuário toca em "Editar" na tela de Perfil
- **THEN** o sistema habilita os campos de dados pessoais e de endereço para edição

#### Scenario: Usuário salva dados pessoais válidos
- **WHEN** o usuário preenche nome completo, telefone e data de nascimento válidos e toca em "Salvar"
- **THEN** o sistema persiste as alterações, exibe confirmação e volta ao modo de visualização com os dados atualizados

#### Scenario: Telefone com formato inválido
- **WHEN** o usuário preenche um telefone em formato inválido e toca em "Salvar"
- **THEN** o sistema exibe mensagem de erro no campo do telefone e mantém a tela em modo de edição

#### Scenario: Data de nascimento inválida
- **WHEN** o usuário preenche uma data de nascimento inválida ou futura e toca em "Salvar"
- **THEN** o sistema exibe mensagem de erro no campo da data de nascimento e mantém a tela em modo de edição

#### Scenario: Nome completo vazio
- **WHEN** o usuário apaga o nome completo e toca em "Salvar"
- **THEN** o sistema exibe mensagem de erro no campo do nome e mantém a tela em modo de edição

### Requirement: Edição do endereço
O sistema SHALL permitir que o usuário autenticado edite e salve seu endereço: CEP, logradouro, número, complemento, bairro, cidade e estado.

#### Scenario: Usuário salva endereço completo válido
- **WHEN** o usuário preenche todos os campos obrigatórios do endereço com valores válidos e toca em "Salvar"
- **THEN** o sistema persiste o endereço, exibe confirmação e volta ao modo de visualização

#### Scenario: CEP com formato inválido
- **WHEN** o usuário preenche um CEP que não possui 8 dígitos e toca em "Salvar"
- **THEN** o sistema exibe mensagem de erro no campo do CEP e mantém a tela em modo de edição

#### Scenario: Cidade ou estado vazios
- **WHEN** o usuário deixa a cidade ou o estado vazios e toca em "Salvar"
- **THEN** o sistema exibe mensagem de erro nos campos correspondentes e mantém a tela em modo de edição

### Requirement: Busca de endereço por CEP
O sistema SHALL buscar o endereço correspondente ao CEP informado e preencher automaticamente logradouro, bairro, cidade e estado.

#### Scenario: CEP válido encontrado
- **WHEN** o usuário preenche um CEP válido e solicita a busca
- **THEN** o sistema consulta o serviço de endereços e preenche logradouro, bairro, cidade e estado nos respectivos campos

#### Scenario: CEP não encontrado
- **WHEN** o usuário preenche um CEP válido mas inexistente e solicita a busca
- **THEN** o sistema exibe mensagem de erro no campo do CEP e mantém os demais campos inalterados

#### Scenario: Falha no serviço de endereços
- **WHEN** a consulta ao serviço de endereços falha por erro de rede
- **THEN** o sistema exibe mensagem de erro no campo do CEP e permite preenchimento manual dos campos de endereço

### Requirement: Captura de coordenadas GPS
O sistema SHALL permitir que o usuário autenticado capture suas coordenadas geográficas e as salve junto ao endereço.

#### Scenario: Localização capturada com sucesso
- **WHEN** o usuário toca em "Usar minha localização" e o navegador concede a permissão
- **THEN** o sistema preenche latitude e longitude nos campos de coordenadas

#### Scenario: Permissão de localização negada
- **WHEN** o usuário nega a permissão de localização ao navegador
- **THEN** o sistema exibe mensagem explicando a necessidade da permissão e mantém os campos de coordenadas editáveis para preenchimento manual

#### Scenario: Serviço de geolocalização indisponível
- **WHEN** o navegador não oferece suporte a geolocalização ou a posição não pode ser obtida
- **THEN** o sistema exibe mensagem de erro e mantém os campos de coordenadas editáveis para preenchimento manual

### Requirement: Persistência e isolamento dos dados do perfil
O sistema SHALL persistir os dados do perfil no Supabase/PostgreSQL e garantir que cada usuário acesse e modifique exclusivamente o próprio perfil.

#### Scenario: Perfil salvo com sucesso
- **WHEN** o usuário autenticado salva um perfil válido
- **THEN** o sistema grava o registro na tabela `profiles` vinculado ao identificador da conta autenticada

#### Scenario: Falha ao salvar o perfil
- **WHEN** a gravação do perfil falha por erro de rede ou de servidor
- **THEN** o sistema exibe mensagem de erro, mantém a tela em modo de edição e não descarta os dados digitados

#### Scenario: Usuário tenta acessar o perfil de outra conta
- **WHEN** um usuário autenticado tenta ler ou gravar o perfil vinculado a outra conta
- **THEN** o sistema impede a operação e não expõe dados de terceiros

### Requirement: Validação das entradas do perfil
O sistema SHALL validar todas as entradas do formulário de perfil antes de persistir, com mensagens de erro por campo.

#### Scenario: Formulário com campos inválidos
- **WHEN** o usuário envia o formulário com ao menos um campo inválido
- **THEN** o sistema impede a gravação e exibe a mensagem de erro correspondente a cada campo inválido

#### Scenario: Formulário com campos válidos
- **WHEN** o usuário envia o formulário com todos os campos válidos
- **THEN** o sistema aceita a entrada e prossegue para a gravação
