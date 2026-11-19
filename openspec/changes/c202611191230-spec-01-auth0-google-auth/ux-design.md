## Fluxo de Navegação

### Telas

| Tela | Rota | Ator | Descrição |
|------|------|------|-----------|
| Tela de Login | `/login` | Usuário | Exibe botão "Continuar com Google" quando não há sessão ativa |
| Dashboard | `/dashboard` | Usuário | Tela principal após autenticação bem-sucedida |

### Transições

```mermaid
graph TD
    A([Usuário abre o app]) --> B{Existe sessão ativa?}
    B -->|Sim| C[Dashboard /dashboard]
    B -->|Não| D[Tela de Login /login]

    D --> E[Usuário clica "Continuar com Google"]
    E --> F[Redireciona para Auth0]
    F --> G[Login Google + autorização]
    G --> H[Auth0 retorna com token]
    H --> I[Valida token JWT]

    I -->|Token válido| C
    I -->|Token inválido/expirado| D

    C --> J[Usuário clica "Sair"]
    J --> K[Encerra sessão]
    K --> D

    L[Falha de rede no login] --> D
    M[Usuário cancela no Auth0] --> D
```

### Definição de cada nó

| Nó | Tipo | Ação |
|----|------|------|
| A | Entrada | Usuário abre o aplicativo |
| B | Decisão | Verifica se existe sessão ativa (token válido) |
| C | Tela | Dashboard — conteúdo principal do app |
| D | Tela | Login — exibe botão "Continuar com Google" |
| E | Ação | Usuário clica no botão de login |
| F | Redirecionamento | Navega para o provedor Auth0 |
| G | Ação externa | Usuário faz login com Google e autoriza |
| H | Retorno | Auth0 redireciona de volta com token de sessão |
| I | Decisão | Valida presença e expiração do token JWT |
| J | Ação | Usuário clica em "Sair" |
| K | Ação | Remove token de sessão |
| L | Exceção | Falha de rede durante o fluxo de login |
| M | Exceção | Usuário cancela o login no Auth0 |

---

## Telas

### Tela: Login

**Rota:** `/login`  
**Ator:** Usuário  
**Use Cases atendidos:** UC-01

#### Wireframe

```
+--------------------------------------------------+
|  [Logo: GreenKeeper Botânica]                    |
+--------------------------------------------------+
|                                                  |
|  Cuide das suas plantas                          |
|  com inteligência                                |
|                                                  |
|  Lembretes de rega, telemetria de luz e umidade  |
|  e identificação por foto, tudo no seu bolso.    |
|                                                  |
|                                                  |
|                      [Continuar com Google]      |
|                                                  |
|                                                  |
+--------------------------------------------------+
|  [Rodapé vazio - sem termos de serviço]          |
+--------------------------------------------------+
```

#### Estados da Tela

- **Vazio:** Tela de login exibida, aguardando interação do usuário
- **Loading:** Durante o redirecionamento para Auth0 e validação do token
- **Erro de validação:** Não se aplica (não há campos de entrada nesta tela)
- **Erro de servidor:** Falha de rede durante o login → exibe erro e permite tentar novamente
- **Sucesso:** Token válido → redireciona para o dashboard

#### Componentes
- `LogoComponent` — exibe a marca "GreenKeeper Botânica"
- `LoginButtonComponent` — botão "Continuar com Google" com ícone do Google
- `AuthRedirectService` — gerencia o redirecionamento para Auth0 e callback

#### Ações e Navegação
- **[Continuar com Google]** → chama UC-01 → redireciona para Auth0 → se sucesso, navega para `/dashboard`
- **Token inválido/expirado** → permanece em `/login`

---

### Tela: Dashboard

**Rota:** `/dashboard`  
**Ator:** Usuário (autenticado)  
**Use Cases atendidos:** UC-01, UC-02, UC-03

#### Wireframe

```
+--------------------------------------------------+
|  [Header] [Avatar: foto Google ou genérico] [Sair]|
+--------------------------------------------------+
|                                                  |
|  Minhas Plantas                                  |
|  X tarefas para hoje                             |
|                                                  |
|  [Cartão: Planta 1]  [Cartão: Planta 2]  ...     |
|                                                  |
|  [Notificações]                                  |
+--------------------------------------------------+
|  [Nav inferior: Dashboard | Plantas | Cuidados | |
|   Perfil | Configurações]                        |
+--------------------------------------------------+
```

#### Estados da Tela

- **Vazio:** Nenhuma planta cadastrada → exibe estado vazio com call-to-action para cadastrar planta
- **Loading:** Durante a validação da sessão e carregamento dos dados
- **Erro de validação:** Não se aplica
- **Erro de servidor:** Falha ao carregar dados → exibe mensagem de erro com opção de tentar novamente
- **Sucesso:** Dados carregados → exibe plantas e tarefas

#### Componentes
- `HeaderComponent` — com avatar do usuário e botão "Sair"
- `PlantCardComponent` — exibe informações de cada planta
- `TaskListComponent` — lista de tarefas diárias
- `AuthGuard` — verifica sessão ativa antes de renderizar

#### Ações e Navegação
- **[Botão Sair]** → chama UC-02 → encerra sessão → navega para `/login`
- **[Qualquer rota interna]** → protegida por UC-03 (guard de rota)

#### Regra de exibição do avatar
- Se o token do Auth0 incluir `picture` (foto do perfil Google) → exibe essa foto
- Se não houver foto disponível → exibe avatar genérico (placeholder)
