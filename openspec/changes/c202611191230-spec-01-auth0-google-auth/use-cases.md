## UC-01: Login com Google via Auth0

**Ator:** Usuário (conta Google)  
**Tipo:** `Frontend only`  
**Pré-condição:** Usuário não tem sessão ativa no app

### Fluxo Principal
1. Usuário abre o app sem sessão ativa
2. Sistema exibe tela de login com botão "Continuar com Google"
3. Usuário toca em "Continuar com Google"
4. Sistema redireciona para o provedor Auth0
5. Usuário faz login com conta Google e autoriza o app
6. Auth0 redireciona de volta ao app com token de sessão
7. Sistema valida o token e redireciona para o dashboard

### Fluxos Alternativos
- **1a.** Usuário já tem sessão ativa → sistema redireciona diretamente para o dashboard (pula a tela de login)
- **6a.** Usuário cancela o login no Auth0 → sistema retorna à tela de login com mensagem opcional
- **6b.** Token expirado ou inválido → sistema redireciona para a tela de login
- **6c.** Falha de rede durante o login → sistema exibe erro e permite tentar novamente

### Cenários de Teste — Frontend Unit
- **Given** componente de login renderizado sem sessão ativa  
  **When** usuário clica no botão "Continuar com Google"  
  **Then** sistema chama o método de redirecionamento para Auth0

- **Given** componente de login com callback de Auth0 contendo token válido  
  **When** sistema processa o callback  
  **Then** token é armazenado e usuário é redirecionado para o dashboard

- **Given** componente de login com callback de Auth0 contendo token expirado  
  **When** sistema processa o callback  
  **Then** sistema redireciona para a tela de login

### Cenários de Teste — Frontend E2E
- **Given** usuário na tela de login sem sessão ativa  
  **When** usuário clica em "Continuar com Google" e completa o fluxo no Auth0  
  **Then** dashboard é exibido e sessão está ativa

- **Given** usuário na tela de login  
  **When** usuário clica em "Continuar com Google" e cancela no Auth0  
  **Then** tela de login é exibida novamente

---

## UC-02: Logout e encerramento de sessão

**Ator:** Usuário (conta Google, autenticado)  
**Tipo:** `Frontend only`  
**Pré-condição:** Usuário tem sessão ativa no app

### Fluxo Principal
1. Usuário autenticado toca em "Sair"
2. Sistema encerra a sessão (remove token de sessão)
3. Sistema redireciona para a tela de login

### Fluxos Alternativos
- **2a.** Falha ao limpar o token de sessão → sistema exibe erro e mantém o usuário logado

### Cenários de Teste — Frontend Unit
- **Given** componente com sessão ativa  
  **When** usuário clica no botão "Sair"  
  **Then** token de sessão é removido e usuário é redirecionado para a tela de login

- **Given** componente com sessão ativa e falha ao limpar token  
  **When** usuário clica no botão "Sair"  
  **Then** sistema exibe erro e mantém o usuário logado

### Cenários de Teste — Frontend E2E
- **Given** usuário autenticado no dashboard  
  **When** usuário toca em "Sair"  
  **Then** tela de login é exibida e sessão está encerrada

---

## UC-03: Guard de rota (proteção de telas)

**Ator:** Sistema (guard de rota)  
**Tipo:** `Frontend only`  
**Pré-condição:** Existem rotas internas protegidas no app

### Fluxo Principal
1. Usuário tenta acessar uma rota interna (ex.: dashboard)
2. Guard de rota verifica se há sessão ativa
3. Se autenticado → permite o acesso à rota
4. Se não autenticado → redireciona para a tela de login

### Fluxos Alternativos
- **3a.** Token expirado durante a navegação → guard detecta expiração e redireciona para login
- **3b.** Token ausente → guard redireciona para login

### Cenários de Teste — Frontend Unit
- **Given** guard de rota com usuário autenticado  
  **When** rota interna é acessada  
  **Then** guard permite a navegação

- **Given** guard de rota com usuário não autenticado  
  **When** rota interna é acessada  
  **Then** guard redireciona para a tela de login

- **Given** guard de rota com token expirado  
  **When** rota interna é acessada  
  **Then** guard redireciona para a tela de login

### Cenários de Teste — Frontend E2E
- **Given** usuário não autenticado tenta acessar o dashboard diretamente pela URL  
  **When** página é carregada  
  **Then** sistema redireciona para a tela de login

- **Given** usuário autenticado acessa o dashboard  
  **When** página é carregada  
  **Then** dashboard é exibido normalmente
