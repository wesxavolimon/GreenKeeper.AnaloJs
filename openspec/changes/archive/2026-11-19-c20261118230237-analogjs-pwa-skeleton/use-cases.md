## UC-01: Validar Acesso Exclusivo por Celular (Mobile-Only Gate)

**Ator:** Usuário no Celular / Visitante em Desktop ou Tablet
**Tipo:** `Frontend only`
**Pré-condição:** Aplicação servida em navegador web ou PWA instalado.

### Fluxo Principal
1. Visitante acessa qualquer rota do `GreenKeeper.AnaloJs` (por exemplo `/`).
2. `EvaluateDeviceAccessUseCase` consulta o port `DeviceEnvironmentPort` (user-agent/client hints, ponteiro `coarse`, largura da viewport, ambiente e parâmetro de override em dev).
3. Para dispositivo reconhecido como celular, o guard libera a rota do Dashboard.

### Fluxos Alternativos
- **2a.** Dispositivo não é celular (desktop ou tablet) e ambiente é `production` (mesmo com parâmetro de override) → O guard bloqueia todas as rotas do app e exibe apenas a Tela Informativa.
- **2b.** Dispositivo não é celular, porém o ambiente não é `production` e o override explícito de dev/teste está ativo → O acesso ao Dashboard é liberado para depuração/testes.

### Cenários de Teste — Frontend Unit
- **Given** sinais de dispositivo móvel (`userAgent` smartphone, ponteiro `coarse`, largura `390px`)
  **When** `EvaluateDeviceAccessUseCase.execute()` é chamado
  **Then** retorna `allowed: true` e razão `"mobile-device"`
- **Given** sinais de desktop (`1280x800`, ponteiro `fine`) e `appEnv: "production"` com override na query
  **When** `EvaluateDeviceAccessUseCase.execute()` é chamado
  **Then** ignora o override e retorna `allowed: false` redirecionando para a Tela Informativa
- **Given** sinais de desktop e `appEnv: "development"` com override explícito ativo
  **When** `EvaluateDeviceAccessUseCase.execute()` é chamado
  **Then** retorna `allowed: true` e razão `"dev-override"`
- **Given** visitante em desktop na rota raiz
  **When** o componente da Tela Informativa renderiza
  **Then** exibe apresentação do app, instrução para abrir no celular e nenhum dado do Dashboard

### Cenários de Teste — Frontend E2E
- **Given** navegador desktop (`1280x800`) sem override
  **When** acessa `/`
  **Then** a Tela Informativa é exibida e nenhuma seção do Dashboard está visível (print salvo)
- **Given** navegador mobile (`390x844`, `hasTouch: true`, `isMobile: true`)
  **When** acessa `/`
  **Then** o Dashboard *Minhas Plantas* é exibido diretamente (print salvo)

---

## UC-02: Carregar Dashboard Botânico Direto (Sem Login)

**Ator:** Usuário no Celular
**Tipo:** `Frontend only`
**Pré-condição:** Dispositivo aprovado pelo Mobile-Only Gate.

### Fluxo Principal
1. Ao entrar na rota `/`, o app não exibe tela de login e instancia o componente do Dashboard.
2. `LoadDashboardUseCase` consulta `DashboardRepositoryPort` (implementado por `InMemoryDashboardRepository` neste esqueleto).
3. O Dashboard renderiza em tela cheia real (`100dvh`, sem moldura de celular falsa nem barra `09:41`) os blocos: cabeçalho ("Minhas Plantas" + contagem de tarefas), cards empilhados por cômodo (*Corredor*, *Sala de Estar*, *Banheiro / Calathea* com métricas 18% Água e 98% Luz), *Planta em Foco* (*Aloe Arborescens* com tarefas *Rega* e *Inspeção*), widget escuro *Umidade do Ambiente Ideal* (64%) e dock flutuante com botão *Câmera*.

### Fluxos Alternativos
- **2a.** Falha inesperada ao carregar do repositório em memória → Caso de uso retorna erro tratado e a UI exibe fallback amigável sem quebrar a tela.

### Cenários de Teste — Frontend Unit
- **Given** repositório em memória populado com ambientes, planta em foco e umidade inicial `64%`
  **When** `LoadDashboardUseCase.execute()` é executado
  **Then** retorna snapshot completo com contagem correta de tarefas pendentes (`3`)
- **Given** viewport mobile sem moldura simulada
  **When** `DashboardComponent` renderiza o snapshot inicial
  **Then** exibe "Minhas Plantas", "3 tarefas para hoje", "Calathea", "Aloe Arborescens", "64%" e o botão "Câmera", sem elementos de status bar iOS `09:41`

### Cenários de Teste — Frontend E2E
- **Given** dispositivo móvel em `390x844`
  **When** abre a aplicação
  **Then** visualiza imediatamente todos os cartões do Dashboard sem scroll horizontal ou cortes laterais

---

## UC-03: Interagir Localmente com o Dashboard (Concluir Tarefa, Selecionar Ambiente, Ajustar Umidificador)

**Ator:** Usuário no Celular
**Tipo:** `Frontend only`
**Pré-condição:** Dashboard carregado no celular.

### Fluxo Principal
1. Usuário toca no botão **Concluir** da tarefa de rega pendente no card ativo (*Calathea*), ou seleciona outro cômodo empilhado (*Corredor* / *Sala de Estar*), ou toca nos botões `-` / `+` do *Nível Umidificador*.
2. Os casos de uso dedicados (`CompletePlantTaskUseCase`, `SelectRoomUseCase`, `AdjustHumidifierUseCase`) aplicam as regras de domínio e atualizam o estado no `DashboardRepositoryPort`.
3. A UI reflete imediatamente a alteração (tarefa marcada como concluída, contador reduzido, cômodo ativo atualizado ou umidade ajustada entre `0%` e `100%`).

### Fluxos Alternativos
- **1a.** Umidade já está em `0%` e usuário toca `-`, ou em `100%` e usuário toca `+` → Regra de domínio mantém dentro do intervalo `[0, 100]` sem erro.
- **1b.** Usuário toca no botão de notificação, câmera ou opções (`⋮`) presentes no layout do esqueleto → Feedback visual discreto de recurso planejado para os próximos módulos, mantendo estabilidade da UI.

### Cenários de Teste — Frontend Unit
- **Given** tarefa pendente `"Rega Pendente"` e contador total `3`
  **When** `CompletePlantTaskUseCase.execute(plantId)` é chamado
  **Then** marca a tarefa como concluída e decrementa tarefas pendentes para `2`
- **Given** umidade atual `100%`
  **When** `AdjustHumidifierUseCase.execute(+5)` é chamado
  **Then** limita o valor a `100%` (e para `0%` quando decrementado abaixo de zero)
- **Given** cômodos `Corredor`, `Sala de Estar` e `Banheiro`
  **When** `SelectRoomUseCase.execute("sala-estar")` é chamado
  **Then** atualiza o ambiente ativo exibido no card principal

### Cenários de Teste — Frontend E2E
- **Given** usuário no Dashboard mobile com `64%` de umidade e `3 tarefas para hoje`
  **When** toca em `Concluir` e depois em `+` no umidificador
  **Then** o contador passa para `2 tarefas para hoje` e a umidade exibida muda para `65%`

---

## UC-04: Instalação PWA e Captura Automatizada de Prints

**Ator:** Usuário no Celular / Desenvolvedor (Docker + Playwright)
**Tipo:** `Frontend only`
**Pré-condição:** Build PWA gerado e servido em ambiente local ou Docker.

### Fluxo Principal
1. No celular, o navegador lê `manifest.webmanifest` e registra o Service Worker gerado no build de produção para permitir instalação na tela inicial.
2. No Docker Compose, o serviço de captura visual (`playwright`) sobe o app buildado/servido, abre em `390x844` (mobile) e `1280x800` (desktop) e gera os PNGs das duas telas.

### Fluxos Alternativos
- **1a.** Ambiente sem suporte a Service Worker (ex.: teste unitário JSDOM/happy-dom) → Port de registro PWA no-op não lança exceção.

### Cenários de Teste — Frontend Unit
- **Given** ambiente onde `navigator.serviceWorker` não existe
  **When** o serviço de registro PWA inicializa
  **Then** ignora com segurança sem lançar erro (100% coberto)

### Cenários de Teste — Frontend E2E
- **Given** build PWA servido em Docker
  **When** script Playwright executa captura mobile e desktop
  **Then** gera `screenshots/mobile-dashboard.png` e `screenshots/desktop-info.png` válidos e não vazios
