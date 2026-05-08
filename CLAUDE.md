# Agendamentos CPE - InovaTec 26.1

Sistema de agendamento do Planejamento Estratégico do cursinho CPE/USP, substituindo uma planilha manual por uma solução web + bot Telegram.

## Contexto do Projeto

**Organização:** InovaTec / CPE USP  
**Formato:** Trabalho em trio  
**Entrega:** Documentação no Notion + links da aplicação  

O sistema resolve a gestão de atendimentos individuais de orientação de estudos ("Planejamento Estratégico"), onde alunos agendam horários com docentes/mentores.

## Regras de Negócio Críticas

### Disponibilidade
- Docentes cadastram disponibilidade por dia da semana + horário (recorrente)
- Uma disponibilidade só é bloqueada se o docente adicionar uma exceção pontual para aquela data
- **Não criar agendamentos recorrentes no banco** — usar a disponibilidade + exceções como fonte da verdade

### Agendamentos
- Alunos só podem agendar no **mês atual** (sem acesso a meses futuros)
- Slots disponíveis: 09h–22h30, intervalos de 30 minutos, segunda a sexta
- Um aluno só pode agendar onde o docente já declarou disponibilidade

### Tipos de Atendimento (fixos)
1. Desempenho no Simulado → especificar qual prova
2. Dúvidas sobre vestibulares e técnicas de estudo → especificar universidade/prova (ex: FUVEST)
3. Elaboração de cronograma de estudos → especificar turno (Noturno ou Vespertino)
4. Outros -> Especificar

### Modalidade
Cada slot tem modalidade: Online, Presencial ou Misto (Presencial ou Online)

## Telas e Áreas

### Área do Docente
- **Cadastro de Disponibilidade** — dias da semana + horários recorrentes (base: `cadastro-disponibilidade-docente.html`)
- **Calendário/Gestão da Agenda** (`gestao-agenda-docente.html`) — visão geral dos agendamentos, excluir agendamento, criar agendamento pontual
- **Dashboard** — estatísticas e próximos agendamentos

### Área do Aluno
- **Dashboard e Calendário** — visão do mês atual, próximos agendamentos, acesso rápido
- **Tela de Agendamento** — fazer agendamentos (base: `agendamento-usuario.html`), restrito ao mês atual

### Área do Admin
- **Dashboard** — todos os agendamentos, filtros por aluno/data/docente, geração de relatórios
- **Cadastro** — cadastro de alunos e professores

## Funcionalidades Adicionais
- Bot Telegram para lembretes de agendamentos
- Gestão de faltas, cancelamentos, férias e feriados
- Sistema de notificações internas

## Arquivos de Referência
- [planejamento.md](planejamento.md) — decisões de arquitetura e telas
- [projeto_desafio_inovatec.md](projeto_desafio_inovatec.md) — enunciado do desafio
- [analise_planilha_agendamento.md](analise_planilha_agendamento.md) — engenharia reversa da planilha atual
- [cadastro-disponibilidade-docente.html](cadastro-disponibilidade-docente.html) — protótipo HTML da tela de disponibilidade
- [gestao-agenda-docente.html](gestao-agenda-docente.html) — protótipo HTML do calendário do docente
- [agendamento-usuario.html](agendamento-usuario.html) — protótipo HTML da tela de agendamento do aluno
