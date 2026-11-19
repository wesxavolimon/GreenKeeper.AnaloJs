## Fluxo de Navegação

```mermaid
graph TD
    A([Dashboard]) --> B[Toca no avatar do header]
    B --> C[Tela de Perfil /perfil]
    C --> D{Carregamento}
    D -->|Sucesso| E[Modo visualização]
    D -->|Erro| F[Estado de erro com "Tentar novamente"]
    F --> D
    E --> G[Toca em "Editar"]
    G --> H[Modo edição]
    H --> I[Toca em "Salvar"]
    I --> J{Validação}
    J -->|Válido e persistido| K[Confirmação e volta à visualização]
    J -->|Erro de validação| L[Erros por campo, permanece em edição]
    J -->|Erro de servidor| M[Mensagem de erro, permanece em edição]
    H --> N[Toca em "Buscar" no CEP]
    N --> O{Consulta ViaCEP}
    O -->|Encontrado| H
    O -->|Não encontrado ou falha| P[Erro no campo CEP, permanece em edição]
    H --> Q[Toca em "Usar minha localização"]
    Q --> R{Captura GPS}
    R -->|Sucesso| H
    R -->|Permissão negada ou indisponível| S[Mensagem explicativa, campos editáveis]
    H --> T[Toca em "Cancelar"]
    T --> E
```

## Telas

### Tela: Perfil (modo visualização)

**Rota:** `/perfil`
**Ator:** Usuário autenticado
**Use Cases atendidos:** UC-01, UC-02

#### Wireframe

```
+--------------------------------------------------+
|  [<]  Perfil                          [Editar]    |
+--------------------------------------------------+
|                                                  |
|  [Avatar 64px]  Maria Silva                      |
|                 maria@email.com                   |
|                                                  |
|  DADOS PESSOAIS                                  |
|  ------------------------------------------------|
|  Nome completo      Maria Silva                  |
|  Telefone           (11) 98765-4321              |
|  Data de nascimento 12/05/1990                   |
|                                                  |
|  ENDEREÇO                                        |
|  ------------------------------------------------|
|  CEP               01310-100                     |
|  Logradouro        Av. Paulista                   |
|  Número            1000                          |
|  Complemento       Apto 42                       |
|  Bairro            Bela Vista                    |
|  Cidade            São Paulo                     |
|  Estado             SP                           |
|  Coordenadas       -23.5613, -46.6565            |
|                                                  |
+--------------------------------------------------+
```

#### Estados da Tela
- **Vazio:** Não existe perfil salvo para a conta → exibe nome e email do Auth0, demais campos vazios e botão "Editar" ativo
- **Loading:** Skeleton nos campos enquanto o perfil é carregado
- **Erro de validação:** Não se aplica (não há campos de entrada neste modo)
- **Erro de servidor:** Mensagem de erro com opção "Tentar novamente"
- **Sucesso:** Dados do perfil exibidos em modo somente leitura

#### Componentes
- `ProfileHeaderComponent` — avatar, nome e email do usuário
- `ProfileSectionComponent` — seção rotulada ("Dados pessoais", "Endereço")
- `ProfileFieldComponent` — rótulo e valor em modo leitura
- `AvatarComponent` — foto do Google ou imagem genérica

#### Ações e Navegação
- **[Editar]** → chama UC-03 → habilita o modo de edição
- **[Avatar no header do dashboard]** → chama UC-01 → navega para `/perfil`
- **[Voltar]** → retorna ao dashboard

---

### Tela: Perfil (modo edição)

**Rota:** `/perfil`
**Ator:** Usuário autenticado
**Use Cases atendidos:** UC-03, UC-04, UC-05, UC-06, UC-07

#### Wireframe

```
+--------------------------------------------------+
|  [<]  Editar perfil              [Cancelar]      |
+--------------------------------------------------+
|                                                  |
|  DADOS PESSOAIS                                  |
|  ------------------------------------------------|
|  Nome completo                                   |
|  [Maria Silva_________________________]          |
|  Telefone                                        |
|  [(11) 98765-4321___________________]            |
|  Data de nascimento                              |
|  [12/05/1990_________________________]           |
|                                                  |
|  ENDEREÇO                                        |
|  ------------------------------------------------|
|  CEP                                             |
|  [01310-100________] [Buscar]                    |
|  Logradouro                                      |
|  [Av. Paulista______________________]            |
|  Número        Complemento                       |
|  [1000______]   [Apto 42_________]              |
|  Bairro                                          |
|  [Bela Vista_______________________]            |
|  Cidade              Estado                      |
|  [São Paulo______]    [SP_________]              |
|                                                  |
|  LOCALIZAÇÃO                                     |
|  ------------------------------------------------|
|  [Usar minha localização]                       |
|  Latitude              Longitude                  |
|  [-23.5613________]    [-46.6565_______]         |
|                                                  |
|  [              Salvar              ]           |
+--------------------------------------------------+
```

#### Estados da Tela
- **Vazio:** Campos vazios; a validação só é disparada ao tocar em "Salvar"
- **Loading:** Spinner nos botões "Buscar" e "Usar minha localização" durante as requisições
- **Erro de validação:** Mensagem vermelha abaixo do campo inválido; foco no primeiro campo com erro
- **Erro de servidor:** Banner de erro no topo da tela; os dados digitados são preservados
- **Sucesso:** Toast "Perfil atualizado" e retorno ao modo de visualização

#### Componentes
- `ProfileFormComponent` — formulário reativo do perfil
- `ProfileFieldComponent` — input com rótulo e mensagem de erro
- `CepLookupButtonComponent` — ação de busca de endereço por CEP
- `GeolocationButtonComponent` — ação de captura de GPS
- `SaveButtonComponent` — ação de gravação
- `ErrorBannerComponent` — banner de erro de servidor

#### Ações e Navegação
- **[Buscar]** → chama UC-05 → preenche logradouro, bairro, cidade e estado
- **[Usar minha localização]** → chama UC-06 → preenche latitude e longitude
- **[Salvar]** → chama UC-07 (validação) → UC-03/UC-04 (persistência) → confirmação e retorno à visualização
- **[Cancelar]** → descarta as alterações e volta ao modo de visualização
