## UC-01: Acesso à tela de Perfil

**Ator:** Usuário autenticado (conta Google)
**Tipo:** `Frontend only`
**Pré-condição:** Usuário tem sessão ativa no app

### Fluxo Principal
1. Usuário autenticado toca no avatar exibido no header do dashboard
2. Sistema navega para a rota `/perfil`
3. Sistema exibe a tela de Perfil

### Fluxos Alternativos
- **1a.** Usuário não tem sessão ativa → guard de rota redireciona para a tela de login
- **1b.** Token do Auth0 não contém foto do perfil → avatar exibe imagem genérica
- **1c.** Token do Auth0 contém foto do perfil → avatar exibe a foto do Google

### Cenários de Teste — Frontend Unit
- **Given** componente de header com usuário autenticado e foto no token
  **When** o usuário toca no avatar
  **Then** o sistema navega para a rota `/perfil`

- **Given** componente de header com usuário autenticado sem foto no token
  **When** o header é renderizado
  **Then** o avatar exibe a imagem genérica

- **Given** rota `/perfil` protegida por `authGuard` e `mobileOnlyGuard`
  **When** um usuário sem sessão tenta acessar a rota
  **Then** o guard redireciona para `/login`

### Cenários de Teste — Frontend E2E
- **Given** usuário autenticado no dashboard
  **When** o usuário toca no avatar do header
  **Then** a tela de Perfil é exibida

---

## UC-02: Carregamento e visualização do perfil

**Ator:** Usuário autenticado (conta Google)
**Tipo:** `Frontend only`
**Pré-condição:** Usuário tem sessão ativa no app

### Fluxo Principal
1. Tela de Perfil solicita o carregamento do perfil
2. Sistema busca o registro na tabela `profiles` pelo identificador da conta autenticada
3. Sistema exibe nome, email, telefone, data de nascimento e endereço em modo somente leitura

### Fluxos Alternativos
- **2a.** Não existe registro de perfil para a conta → sistema cria o registro a partir dos dados do Auth0 (nome e email) e exibe os demais campos vazios
- **2b.** Falha de rede ou de servidor ao carregar → sistema exibe mensagem de erro com opção "Tentar novamente"

### Cenários de Teste — Frontend Unit
- **Given** `LoadProfileUseCase` com `ProfilePort` retornando um perfil salvo
  **When** o use case é executado
  **Then** o perfil é retornado com todos os campos preenchidos

- **Given** `LoadProfileUseCase` com `ProfilePort` que falha
  **When** o use case é executado
  **Then** o erro é propagado para a tela exibir a mensagem de erro

- **Given** `ProfilePort` sem registro para a conta autenticada
  **When** o perfil é carregado
  **Then** o sistema faz upsert com nome e email do Auth0 e retorna o perfil criado

### Cenários de Teste — Frontend E2E
- **Given** usuário autenticado com perfil salvo
  **When** o usuário abre a tela de Perfil
  **Then** os dados pessoais e o endereço são exibidos em modo somente leitura

---

## UC-03: Edição e salvamento de dados pessoais

**Ator:** Usuário autenticado (conta Google)
**Tipo:** `Frontend only`
**Pré-condição:** Usuário tem sessão ativa e a tela de Perfil está carregada

### Fluxo Principal
1. Usuário toca em "Editar"
2. Sistema habilita os campos de dados pessoais e de endereço para edição
3. Usuário altera nome completo, telefone e data de nascimento
4. Usuário toca em "Salvar"
5. Sistema valida as entradas
6. Sistema persiste o perfil no Supabase
7. Sistema exibe confirmação e volta ao modo de visualização com os dados atualizados

### Fluxos Alternativos
- **3a.** Telefone, nome ou data de nascimento inválidos → sistema exibe mensagem de erro no campo correspondente e mantém a tela em modo de edição
- **3b.** Falha ao persistir → sistema exibe mensagem de erro, mantém a tela em modo de edição e preserva os dados digitados

### Cenários de Teste — Frontend Unit
- **Given** tela de Perfil em modo de visualização
  **When** o usuário toca em "Editar"
  **Then** os campos ficam editáveis

- **Given** formulário com nome, telefone e data de nascimento válidos
  **When** o usuário toca em "Salvar"
  **Then** o `SaveProfileUseCase` é chamado com os dados validados e a tela volta ao modo de visualização

- **Given** formulário com telefone em formato inválido
  **When** o usuário toca em "Salvar"
  **Then** o sistema exibe mensagem de erro no campo do telefone e não chama o `SaveProfileUseCase`

- **Given** `SaveProfileUseCase` com `ProfilePort` que falha
  **When** o use case é executado
  **Then** o erro é propagado e a tela permanece em modo de edição

### Cenários de Teste — Frontend E2E
- **Given** usuário autenticado na tela de Perfil
  **When** o usuário edita o telefone e toca em "Salvar"
  **Then** a confirmação é exibida e o novo telefone aparece na tela

---

## UC-04: Edição e salvamento do endereço

**Ator:** Usuário autenticado (conta Google)
**Tipo:** `Frontend only`
**Pré-condição:** Usuário tem sessão ativa e a tela de Perfil está em modo de edição

### Fluxo Principal
1. Usuário preenche CEP, logradouro, número, complemento, bairro, cidade e estado
2. Usuário toca em "Salvar"
3. Sistema valida as entradas do endereço
4. Sistema persiste o endereço junto ao perfil
5. Sistema exibe confirmação e volta ao modo de visualização

### Fluxos Alternativos
- **4a.** CEP, cidade ou estado inválidos → sistema exibe mensagem de erro nos campos correspondentes e mantém a tela em modo de edição
- **4b.** Falha ao persistir → sistema exibe mensagem de erro e mantém a tela em modo de edição

### Cenários de Teste — Frontend Unit
- **Given** formulário com todos os campos de endereço válidos
  **When** o usuário toca em "Salvar"
  **Then** o `SaveProfileUseCase` é chamado com o endereço preenchido

- **Given** formulário com CEP sem 8 dígitos
  **When** o usuário toca em "Salvar"
  **Then** o sistema exibe mensagem de erro no campo do CEP e não persiste

- **Given** formulário com cidade vazia
  **When** o usuário toca em "Salvar"
  **Then** o sistema exibe mensagem de erro no campo da cidade e não persiste

### Cenários de Teste — Frontend E2E
- **Given** usuário autenticado na tela de Perfil em modo de edição
  **When** o usuário preenche o endereço e toca em "Salvar"
  **Then** a confirmação é exibida e o endereço aparece na tela

---

## UC-05: Busca de endereço por CEP

**Ator:** Usuário autenticado (conta Google)
**Tipo:** `Frontend only`
**Pré-condição:** Usuário tem sessão ativa e a tela de Perfil está em modo de edição

### Fluxo Principal
1. Usuário preenche o CEP
2. Usuário toca em "Buscar"
3. Sistema consulta o serviço de endereços (ViaCEP)
4. Sistema preenche logradouro, bairro, cidade e estado nos respectivos campos

### Fluxos Alternativos
- **5a.** CEP válido mas inexistente → sistema exibe mensagem de erro no campo do CEP e mantém os demais campos inalterados
- **5b.** Falha de rede no serviço de endereços → sistema exibe mensagem de erro no campo do CEP e permite preenchimento manual

### Cenários de Teste — Frontend Unit
- **Given** `LookupAddressByCepUseCase` com `AddressLookupPort` retornando endereço
  **When** o use case é executado com um CEP válido
  **Then** o endereço retornado contém logradouro, bairro, cidade e estado

- **Given** `AddressLookupPort` que retorna "CEP não encontrado"
  **When** o use case é executado
  **Then** o erro é propagado para exibição no campo do CEP

- **Given** `AddressLookupPort` que falha por erro de rede
  **When** o use case é executado
  **Then** o erro é propagado e o preenchimento manual permanece disponível

### Cenários de Teste — Frontend E2E
- **Given** usuário autenticado na tela de Perfil em modo de edição
  **When** o usuário informa um CEP válido e toca em "Buscar"
  **Then** os campos de endereço são preenchidos automaticamente

---

## UC-06: Captura de coordenadas GPS

**Ator:** Usuário autenticado (conta Google)
**Tipo:** `Frontend only`
**Pré-condição:** Usuário tem sessão ativa e a tela de Perfil está em modo de edição

### Fluxo Principal
1. Usuário toca em "Usar minha localização"
2. Navegador solicita e concede a permissão de localização
3. Sistema obtém as coordenadas geográficas
4. Sistema preenche latitude e longitude nos campos de coordenadas

### Fluxos Alternativos
- **6a.** Usuário nega a permissão → sistema exibe mensagem explicando a necessidade da permissão e mantém os campos de coordenadas editáveis
- **6b.** Navegador sem suporte a geolocalização ou posição indisponível → sistema exibe mensagem de erro e mantém os campos de coordenadas editáveis

### Cenários de Teste — Frontend Unit
- **Given** `CaptureLocationUseCase` com `GeolocationPort` retornando coordenadas
  **When** o use case é executado
  **Then** latitude e longitude são retornadas

- **Given** `GeolocationPort` que reporta permissão negada
  **When** o use case é executado
  **Then** o erro é propagado com mensagem de permissão

- **Given** `GeolocationPort` que reporta geolocalização indisponível
  **When** o use case é executado
  **Then** o erro é propagado com mensagem de indisponibilidade

### Cenários de Teste — Frontend E2E
- **Given** usuário autenticado na tela de Perfil em modo de edição
  **When** o usuário toca em "Usar minha localização" e concede a permissão
  **Then** os campos de latitude e longitude são preenchidos

---

## UC-07: Validação das entradas do perfil

**Ator:** Sistema
**Tipo:** `Frontend only`
**Pré-condição:** Usuário está no modo de edição e toca em "Salvar"

### Fluxo Principal
1. Usuário envia o formulário de perfil
2. Sistema valida as entradas com o schema do perfil
3. Se todas as entradas forem válidas, o sistema prossegue para a gravação
4. Se alguma entrada for inválida, o sistema impede a gravação e exibe a mensagem de erro de cada campo inválido

### Fluxos Alternativos
- **4a.** Múltiplos campos inválidos → o sistema exibe todas as mensagens de erro simultaneamente

### Cenários de Teste — Frontend Unit
- **Given** payload do perfil com todos os campos válidos
  **When** o schema de validação é aplicado
  **Then** a validação é aceita

- **Given** payload do perfil com CEP inválido, telefone inválido e nome vazio
  **When** o schema de validação é aplicado
  **Then** a validação é rejeitada com erro para cada campo inválido

- **Given** payload do perfil com data de nascimento futura
  **When** o schema de validação é aplicado
  **Then** a validação é rejeitada com erro no campo da data de nascimento

### Cenários de Teste — Frontend E2E
- **Given** usuário autenticado na tela de Perfil em modo de edição
  **When** o usuário salva um formulário com campo inválido
  **Then** a mensagem de erro é exibida no campo correspondente e nada é persistido
