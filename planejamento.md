# Visão Geral
Nesse projeto, teremos um site + um bot no telegram para lembrar os usuários. As referências sobre as instruções do projeto estão no arquivo projeto_desafio_inovatec.md e a planilha que fazia, de forma ineficaz o que esse projeto faz, é explicada no arquivo analise_planilha_agendamentos.md

## Áreas e Páginas Principais
Definimos que o projeto terá as seguintes telas:
**ÁREA DO DOCENTE**
- Cadastro da Disponibilidade do Docente: Similar ao que está no html com o mesmo nome, tela na qual o docente poderá inserir sua disponibilidade de acordo com os dias da semana e os horários. 
- Calendário do Docente (gestao-agenda-docente): É a tela da visão geral do docente em relação aos seus agendamentos. Lá ele vai poder excluir um agendamento ou criar algum agendamento pontual
- Dashboard do docente - Apenas estatísticas e os próximos agendamentos

*IMPORTANTE*: O ideal seria não precisar de um agendamento no banco e sim utilizar o banco para as restrições. Por exemplo, se um docente marca que pode atender todas as segundas às 9h, o sistema só não vai mostrar que ele tem essa disponibilidade se ele adicionar que naquele dia ele não vai poder.

**ÁREA DO ALUNO**
- Dashboard e Calendário do Aluno: Visão geral do mês atual, destacando os próximos agendamentos feitos pelo aluno e permitindo um acesso rápido à área de agendamentos.
- Tela de Agendamentos: Similar à agendamento-usuario.html, tela em que o aluno faz seus agendamentos

*IMPORTANTE*: O ideal seria o aluno só poder fazer agendamentos para o mês atual, então ele não teria acesso aos meses posteriores.

**ÁREA DO ADMIN**
- Dashboard: Visão geral de todos os agendamentos, filtros por alunos, por datas ou por docentes e geração de relatórios
- Tela de Cadastro: Cadastro dos alunos e professores

## Funcionalidades Principais
Através do sistema, será possível agendar e gerenciar todos os agendamentos que o usuário tenha (independentemente de seus tipos). Além disso, o sistema deve estar adaptado para lidar com faltas, cancelamentos, férias e feriados. Pode haver um sistema de notificações internas também.

**Notificações**
As notificações estarão presentes no sistema e no bot do telegrma. Tipos de notificações:
- Lembrete e Confirmação de Agendamento (no começo do dia anterior ao agendamento)
- Solcitar Cancelamento
- Justificar Ausência - Caso não tenha avisado antes
- Avisos Gerais
