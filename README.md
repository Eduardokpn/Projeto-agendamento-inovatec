# Agendamentos CPE — InovaTec 26.1

Protótipos HTML do sistema de agendamento do Planejamento Estratégico do cursinho CPE/USP. Substitui uma planilha manual por uma solução web + bot Telegram.

---

## Arquivos de Protótipo

### Área do Aluno

| Arquivo | O que faz |
|---|---|
| `dashboard-aluno.html` | Página inicial do aluno. Exibe cards de resumo (próximos agendamentos, realizados no mês, horas de orientação), lista de próximos atendimentos com botão de cancelar, histórico dos já realizados, mini calendário de Abril com marcações por dia e CTA para agendar. |
| `agendamento-usuario.html` | Tela de agendamento. Mostra a grade semanal (Seg–Sex) com slots disponíveis dos docentes. Dias passados aparecem acinzentados; hoje é destacado em azul. Clicar em "Agendar" abre um modal onde o aluno escolhe o tipo de atendimento (Simulado, Vestibulares, Cronograma ou Outros), preenche a especificação correspondente e confirma o Telegram. Inclui preview da próxima semana e modal de lista de espera. |

### Área do Docente

| Arquivo | O que faz |
|---|---|
| `dashboard-docente.html` | Página inicial do docente. Exibe stats do mês (agendamentos, horas, slots vagos, faltas), lista dos próximos atendimentos com link direto para a agenda, painel de ações rápidas e card com a disponibilidade semanal ativa. |
| `gestao-agenda-docente.html` | Calendário mensal completo do docente. Cada dia exibe os agendamentos confirmados e slots vagos. Ao clicar em um dia, o painel inferior lista os detalhes com opções de cancelar via ícone de lixeira ou entrar em contato pelo Telegram. Botão "+" abre modal para adicionar horário pontual com data, hora e modalidade. |
| `cadastro-disponibilidade-docente.html` | Formulário de configuração de disponibilidade recorrente. O docente marca os dias da semana, define os horários (09h–22h30 em intervalos de 30 min) e a modalidade (Online, Presencial ou Misto) de cada slot. |

### Área do Admin

| Arquivo | O que faz |
|---|---|
| `dashboard-admin.html` | Painel de controle geral. Exibe stats globais (total de agendamentos, alunos atendidos, taxa de presença, cancelamentos/faltas), tabela completa de agendamentos com filtros por aluno, docente e status, painéis laterais de distribuição por tipo de atendimento, por docente e por modalidade, lista de espera e botão de exportar relatório. |
| `cadastro-admin.html` | Tela de cadastro com abas Alunos e Docentes. Cada aba tem um formulário de adição (nome, e-mail, Telegram, turno/papel) com validação, e uma lista buscável dos cadastrados com ações de editar e desativar. |

---

## Documentação de Referência

| Arquivo | Conteúdo |
|---|---|
| `planejamento.md` | Decisões de arquitetura, lista de telas e funcionalidades planejadas. |
| `projeto_desafio_inovatec.md` | Enunciado original do desafio InovaTec. |
| `analise_planilha_agendamento.md` | Engenharia reversa da planilha atual: estrutura de horários, colunas, regras de negócio e sistema de fila de espera. |

---

## Regras de Negócio Principais

- **Disponibilidade recorrente:** docentes cadastram disponibilidade por dia da semana; uma data só fica bloqueada se o docente registrar uma exceção pontual.
- **Restrição de mês:** alunos só podem agendar no mês atual.
- **Slots:** segunda a sexta, 09h–22h30, intervalos de 30 minutos.
- **Tipos de atendimento:** Desempenho no Simulado, Dúvidas sobre Vestibulares, Elaboração de Cronograma de Estudos, Outros — cada um com especificação própria.
- **Notificações:** lembretes via bot Telegram no dia anterior ao atendimento.
"# projeto-agendamento-inovatec" 
"# Projeto-agendamento-inovatec" 
