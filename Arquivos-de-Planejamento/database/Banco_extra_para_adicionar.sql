create table if not exists MatrizCurricular (
    id_matriz_curricular serial primary key,
    id_classe int references class(id_classe) on delete cascade,
    id_curso int references curso(id_curso) on delete cascade,
)
create table MatrizcurricularDisciplina(
    id_matriz_curricular_disciplina serial primary key,
    id_disciplina int references disciplina(id_disciplina),
    id_matriz_curricular int references MatrizCurricular(id_matriz_curricular)
);
alter table turma add column id_matriz_curricular  int references MatrizCurricular(id_matriz_curricular);
create table nota(
    id_nota serial primary key,
    id_aluno int references aluno(id_aluno),
    nota number(3,1) not null,
    data_lancamento TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

)