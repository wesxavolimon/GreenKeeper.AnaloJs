# Visão do Produto — GreenKeeper

O **GreenKeeper** é um PWA mobile-only para cuidado de plantas domésticas, construído em **AnalogJS (Angular 22 + Vite)** e publicado como site estático no **Netlify**. Exclusivo para celular — desktop e tablet veem apenas uma Tela Informativa.

## O que o app faz

- Cadastra plantas por ambiente (casa/área) com apelido, espécie, foto e notas
- Identifica espécies por foto (câmera ou galeria)
- Registra cuidados: rega, adubação e poda, com recálculo automático da próxima data
- Exibe tarefas diárias agrupadas por Hoje, Amanhã e Esta semana
- Mostra clima local (temperatura e precipitação) com base na localização do usuário
- Gera alertas: rega atrasada, temperatura crítica fora da faixa da espécie, nova planta, cuidado concluído
- Permite convidar um familiar por email para ver e editar (provisoriamente) as plantas, com aprovação pelo dono

## Stack

- **Frontend:** AnalogJS, Angular 22, TypeScript, Tailwind CSS
- **Autenticação:** Auth0 (login com Google)
- **Banco de dados:** Supabase/PostgreSQL (develop e production)
- **Testes:** Vitest + v8 (100% de cobertura obrigatória)
- **E2E/Prints:** Playwright em Docker
- **Deploy:** Netlify (site estático)

## Público-alvo

Pessoas com plantas domésticas que querem organizar cuidados por ambiente, incluindo usuários que compartilham o acesso com um familiar.

## Regras de negócio principais

- Usuário vê apenas suas próprias plantas (isolamento por conta Google)
- Planta morta não aparece em tarefas ativas
- Registro de cuidado recalcula a próxima data automaticamente
- Temperatura fora da faixa da espécie gera alerta térmico
- Familiar vinculado não edita nem exclui casas e áreas — apenas plantas
- Alterações de planta por familiar são provisórias até o dono aprovar ou recusar

_Last updated: 2026-11-19_