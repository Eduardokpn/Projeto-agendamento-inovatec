# 📊 Análise do Sistema Atual (Engenharia Reversa da Planilha)

Para construir o novo sistema, é fundamental entender as regras de negócio intrínsecas nas planilhas atuais.

## 1. Estrutura de Horários (Aba Principal)
A planilha é dividida em semanas (ex: Abril 2ª semana, 3ª semana).
* **Grade de Tempo:** Os horários vão das `09:00` às `22:30`, divididos em slots de 30 minutos (09:00, 09:30, 10:00...).
* **Dias da Semana:** Segunda a Sexta-feira.

## 2. Entidades e Colunas do Agendamento
Cada dia da semana possui 5 colunas que formam um agendamento.
* **Preenchido pela Equipe (Docentes/Mentores):**
  1. `Responsável`: Nome do membro da equipe disponível naquele horário (ex: Rafa, Leticia, Larissa).
  2. `Modalidade disponível`: "Online", "Presencial" ou "Presencial ou Online" (Misto).
* **Preenchido pelo Aluno (Obrigatório):**
  3. `Tipo de Atendimento`: Possui 3 opções fixas (Regra de Negócio):
     * *Desempenho no Simulado*
     * *Dúvidas sobre vestibulares e as técnicas de estudo*
     * *Elaboração de cronograma de estudos*
  4. `Especificação`: Campo de texto variável dependendo do Tipo de Atendimento:
     * Se for Simulado: Especificar qual prova.
     * Se for Dúvida: Especificar a universidade/prova (ex: FUVEST, NYU).
     * Se for Cronograma: Especificar o turno (Noturno ou Vespertino).
  5. `Alune/Contato`: Nome e `@` do Telegram ou telefone.

## 3. Regra de Ouro do Agendamento
Os alunos são instruídos a **NÃO** preencher horários em branco. Eles só podem agendar (preencher as colunas 3, 4 e 5) nas linhas onde a equipe já preencheu as colunas 1 e 2 ("Responsável" e "Modalidade").

## 4. O Sistema de Fila (Aba Lista de Espera)
Quando o aluno não encontra horários do "Responsável" na aba principal, ele vai para a "Lista de Espera".
A lista é dividida em dois turnos preferenciais: **Vespertino** e **Noturno**.
Colunas da Lista de Espera:
* `Alune/Contato`: Nome e Telegram.
* `Quantas vezes já foi ao acompanhamento?`: (Número - para definir prioridade).
* `Quando quer?`: (Dias e horários de preferência da pessoa).
* `Quem vai fazer?`: Campo preenchido pela equipe depois, quando "puxam" o aluno da fila para atender.