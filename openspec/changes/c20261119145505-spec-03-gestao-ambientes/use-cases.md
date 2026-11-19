## UC-01: Listar casas e áreas

**Ator:** Usuário autenticado (dono)  
**Tipo:** `Frontend only`  
**Pré-condição:** Usuário autenticado com sessão ativa

### Fluxo Principal
1. Usuário autenticado acessa a tela de ambientes
2. Sistema carrega as casas e áreas vinculadas ao usuário
3. Sistema exibe cada casa com nome, tipo e status
4. Sistema exibe as áreas de cada casa sob a respectiva casa
5. Usuário pode expandir uma casa para ver suas áreas

### Fluxos Alternativos
- **3a.** Casa com status Inativa → sistema exibe badge visual "Inativa"
- **3b.** Casa sem áreas vinculadas → sistema exibe estado vazio com ação "Nova área"
- **2a.** Usuário sem casas → sistema conduz ao cadastro guiado (UC-02)

### Cenários de Teste — Frontend Unit
- **Given** repositório com casas e áreas cadastradas  
  **When** o use case de listagem é executado  
  **Then** retorna a lista de casas com suas áreas agrupadas

- **Given** repositório com uma casa inativa  
  **When** a página de ambientes é renderizada  
  **Then** a casa inativa exibe o badge "Inativa"

- **Given** repositório com casa sem áreas  
  **When** a casa é expandida na tela  
  **Then** o estado vazio com ação "Nova área" é exibido

### Cenários de Teste — Frontend E2E
- **Given** usuário autenticado com casas cadastradas  
  **When** acessa a rota `/environments`  
  **Then** vê a lista de casas com suas áreas

---

## UC-02: Cadastro guiado da primeira casa

**Ator:** Usuário autenticado (dono)  
**Tipo:** `Frontend only`  
**Pré-condição:** Usuário autenticado sem nenhuma casa cadastrada

### Fluxo Principal
1. Usuário acessa a tela de ambientes
2. Sistema detecta 0 casas e exibe estado vazio
3. Sistema conduz ao cadastro guiado da primeira casa
4. Usuário informa nome e tipo da casa
5. Sistema cria a casa com status Ativa e data de entrada atual
6. Sistema exibe a casa recém-criada na listagem

### Fluxos Alternativos
- **4a.** Usuário tenta salvar sem nome → sistema exibe erro de validação e não salva
- **4b.** Usuário informa tipo inválido → sistema rejeita o cadastro

### Cenários de Teste — Frontend Unit
- **Given** repositório sem casas  
  **When** o use case de listagem é executado  
  **Then** retorna lista vazia e a flag `needsFirstHouse` é verdadeira

- **Given** formulário de casa com nome vazio  
  **When** o usuário tenta salvar  
  **Then** o use case não persiste e retorna o estado inalterado

- **Given** formulário de casa com nome e tipo válidos  
  **When** o usuário salva  
  **Then** a casa é criada com status Ativa e aparece na listagem

### Cenários de Teste — Frontend E2E
- **Given** usuário autenticado sem casas  
  **When** acessa `/environments` e cadastra a primeira casa  
  **Then** a casa aparece na listagem

---

## UC-03: Cadastrar e editar casa

**Ator:** Usuário autenticado (dono)  
**Tipo:** `Frontend only`  
**Pré-condição:** Usuário autenticado

### Fluxo Principal
1. Usuário toca em "Nova casa" ou em uma casa existente para editar
2. Sistema exibe o formulário com nome, tipo, endereço, status e datas
3. Usuário preenche os campos e salva
4. Sistema valida nome e tipo
5. Sistema cria ou atualiza a casa
6. Sistema retorna à listagem com a casa atualizada

### Fluxos Alternativos
- **3a.** Nome vazio → sistema exibe erro de validação e mantém o formulário aberto
- **3b.** Tipo fora de Residência/Prédio/Comercial → sistema rejeita e não salva
- **3c.** Edição de casa existente → sistema preserva o identificador e as áreas vinculadas

### Cenários de Teste — Frontend Unit
- **Given** formulário com nome e tipo válidos  
  **When** o use case de cadastro é executado  
  **Then** a casa é persistida com status Ativa e data de entrada

- **Given** formulário com nome vazio  
  **When** o use case de cadastro é executado  
  **Then** retorna o estado inalterado e não persiste

- **Given** casa existente com áreas vinculadas  
  **When** o use case de edição altera o nome  
  **Then** a casa é atualizada preservando id e áreas

- **Given** formulário com tipo "Galpão"  
  **When** o use case de cadastro é executado  
  **Then** retorna o estado inalterado e não persiste

### Cenários de Teste — Frontend E2E
- **Given** usuário na tela de ambientes  
  **When** cadastra uma casa com nome e tipo  
  **Then** a casa aparece na listagem

---

## UC-04: Inativar e reativar casa

**Ator:** Usuário autenticado (dono)  
**Tipo:** `Frontend only`  
**Pré-condição:** Usuário autenticado com ao menos uma casa

### Fluxo Principal
1. Usuário abre a edição de uma casa ativa
2. Usuário altera o status para Inativa e salva
3. Sistema verifica se a casa possui áreas vinculadas
4. Se não possui áreas → sistema inativa a casa e registra a data de saída
5. Sistema exibe a casa com badge "Inativa"

### Fluxos Alternativos
- **3a.** Casa possui áreas e não existe outra casa ativa → sistema bloqueia a inativação e exibe mensagem orientando transferência prévia
- **3b.** Casa possui áreas e existe outra casa ativa → sistema exige transferência prévia das áreas antes de inativar
- **4a.** Reativação de casa inativa → sistema altera status para Ativa e remove a data de saída

### Cenários de Teste — Frontend Unit
- **Given** casa ativa sem áreas  
  **When** o use case de inativação é executado  
  **Then** a casa passa a ter status Inativa e data de saída preenchida

- **Given** única casa ativa com áreas vinculadas  
  **When** o use case de inativação é executado  
  **Then** retorna o estado inalterado e a casa permanece Ativa

- **Given** casa ativa com áreas e outra casa ativa disponível  
  **When** o use case de inativação é executado após transferência  
  **Then** a casa passa a ter status Inativa

- **Given** casa inativa  
  **When** o use case de reativação é executado  
  **Then** a casa passa a ter status Ativa e data de saída nula

### Cenários de Teste — Frontend E2E
- **Given** usuário com casa ativa sem áreas  
  **When** inativa a casa  
  **Then** a casa aparece com badge "Inativa"

---

## UC-05: Cadastrar e editar área

**Ator:** Usuário autenticado (dono)  
**Tipo:** `Frontend only`  
**Pré-condição:** Usuário autenticado com ao menos uma casa ativa

### Fluxo Principal
1. Usuário toca em "Nova área" dentro de uma casa (ou na tela de área)
2. Sistema exibe o formulário com nome, casa vinculada, luminosidade, orientação e flag "Recebe chuva direta"
3. Usuário preenche os campos e salva
4. Sistema valida nome, casa ativa e luminosidade
5. Sistema cria ou atualiza a área
6. Sistema exibe a área sob a casa correspondente

### Fluxos Alternativos
- **3a.** Nome vazio → sistema exibe erro de validação e não salva
- **3b.** Casa vinculada inativa → sistema rejeita e não salva
- **3c.** Luminosidade fora de Sombra/Meia Sombra/Sol Pleno → sistema rejeita e não salva
- **3d.** Edição de área existente → sistema preserva o identificador e a casa vinculada

### Cenários de Teste — Frontend Unit
- **Given** formulário com nome, casa ativa e luminosidade válidos  
  **When** o use case de cadastro é executado  
  **Then** a área é persistida vinculada à casa

- **Given** formulário com nome vazio  
  **When** o use case de cadastro é executado  
  **Then** retorna o estado inalterado e não persiste

- **Given** formulário com casa inativa selecionada  
  **When** o use case de cadastro é executado  
  **Then** retorna o estado inalterado e não persiste

- **Given** formulário com luminosidade "Luar"  
  **When** o use case de cadastro é executado  
  **Then** retorna o estado inalterado e não persiste

- **Given** área existente  
  **When** o use case de edição altera a flag de chuva direta  
  **Then** a área é atualizada preservando id e casa vinculada

### Cenários de Teste — Frontend E2E
- **Given** usuário com casa ativa  
  **When** cadastra uma área com nome e luminosidade  
  **Then** a área aparece sob a casa

---

## UC-06: Mover área entre casas

**Ator:** Usuário autenticado (dono)  
**Tipo:** `Frontend only`  
**Pré-condição:** Usuário autenticado com ao menos duas casas, sendo uma ativa

### Fluxo Principal
1. Usuário abre a edição de uma área
2. Usuário altera a casa vinculada para outra casa ativa
3. Sistema valida que a casa de destino está Ativa
4. Sistema atualiza a casa vinculada da área
5. Sistema exibe a área sob a nova casa

### Fluxos Alternativos
- **3a.** Casa de destino inativa → sistema rejeita a movimentação e mantém a área na casa original

### Cenários de Teste — Frontend Unit
- **Given** área vinculada à casa A e casa B ativa  
  **When** o use case de movimentação move a área para a casa B  
  **Then** a área passa a estar vinculada à casa B

- **Given** área vinculada à casa A e casa B inativa  
  **When** o use case de movimentação tenta mover a área para a casa B  
  **Then** retorna o estado inalterado e a área permanece na casa A

### Cenários de Teste — Frontend E2E
- **Given** usuário com duas casas ativas e uma área na primeira  
  **When** move a área para a segunda casa  
  **Then** a área aparece sob a segunda casa

---

## UC-07: Excluir área

**Ator:** Usuário autenticado (dono)  
**Tipo:** `Frontend only`  
**Pré-condição:** Usuário autenticado com ao menos uma área

### Fluxo Principal
1. Usuário abre a edição de uma área
2. Usuário confirma a exclusão
3. Sistema remove a área da listagem
4. Sistema retorna à listagem sem a área removida

### Fluxos Alternativos
- **3a.** Identificador de área inexistente → sistema não altera a listagem e retorna o estado inalterado

### Cenários de Teste — Frontend Unit
- **Given** área existente  
  **When** o use case de exclusão é executado  
  **Then** a área é removida da listagem

- **Given** identificador de área inexistente  
  **When** o use case de exclusão é executado  
  **Then** retorna o estado inalterado

### Cenários de Teste — Frontend E2E
- **Given** usuário com uma área cadastrada  
  **When** exclui a área  
  **Then** a área deixa de aparecer sob a casa

---

## UC-08: Seleção automática da casa única ativa

**Ator:** Sistema  
**Tipo:** `Frontend only`  
**Pré-condição:** Usuário autenticado

### Fluxo Principal
1. Usuário acessa o cadastro de área
2. Sistema verifica quantas casas ativas o usuário possui
3. Se exatamente uma casa ativa → sistema pré-seleciona essa casa no seletor
4. Usuário pode alterar a seleção ou manter a pré-selecionada

### Fluxos Alternativos
- **3a.** Nenhuma casa ativa → sistema bloqueia o cadastro e orienta o usuário a cadastrar ou reativar uma casa
- **3b.** Duas ou mais casas ativas → sistema não pré-seleciona e exige escolha do usuário

### Cenários de Teste — Frontend Unit
- **Given** usuário com exatamente uma casa ativa  
  **When** o use case de resolução da casa padrão é executado  
  **Then** retorna o identificador da casa ativa

- **Given** usuário sem casas ativas  
  **When** o use case de resolução da casa padrão é executado  
  **Then** retorna nulo e a flag `blocked` é verdadeira

- **Given** usuário com duas casas ativas  
  **When** o use case de resolução da casa padrão é executado  
  **Then** retorna nulo e a flag `blocked` é falsa

### Cenários de Teste — Frontend E2E
- **Given** usuário com uma casa ativa  
  **When** acessa o cadastro de área  
  **Then** a casa já vem pré-selecionada

---

## UC-09: Isolamento por usuário e bloqueio de familiar

**Ator:** Sistema  
**Tipo:** `Frontend only`  
**Pré-condição:** Usuário autenticado (dono ou familiar vinculado)

### Fluxo Principal
1. Usuário autenticado acessa a tela de ambientes
2. Sistema filtra casas e áreas pelo identificador do usuário
3. Sistema exibe apenas os ambientes do usuário
4. Se o usuário for familiar vinculado → sistema desabilita ações de escrita

### Fluxos Alternativos
- **4a.** Familiar vinculado tenta cadastrar, editar, inativar ou excluir → sistema nega a operação e mantém os ambientes inalterados

### Cenários de Teste — Frontend Unit
- **Given** repositório com casas de dois usuários  
  **When** o use case de listagem é executado para o usuário A  
  **Then** retorna apenas as casas do usuário A

- **Given** usuário com papel familiar  
  **When** o use case de cadastro de casa é executado  
  **Then** retorna o estado inalterado e não persiste

### Cenários de Teste — Frontend E2E
- **Given** usuário autenticado como dono  
  **When** acessa `/environments`  
  **Then** vê apenas suas próprias casas e áreas