from django.db import models

# Create your models here.
class RoomModel(models.Model):
    number_room =models.IntegerField( verbose_name="Número da Sala")
    capacity_room=models.IntegerField(verbose_name="Capacidade de Alunos")
    def __str__(self):
        return '{} {}'.format(self.number_room,self.capacity_room)
    pass
"""
CREATE TABLE IF NOT EXISTS sala (
    id_sala SERIAL PRIMARY KEY,                       -- Identificador único da sala
    numero_sala SMALLINT NOT NULL,                    -- Número da sala
    capacidade_alunos INT NOT NULL,                   -- Capacidade máxima de alunos
    img_path TEXT[],                                   -- Imagens da sala (array de paths)
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP  -- Data de criação
);
CREATE TABLE IF NOT EXISTS classe (
    id_classe SERIAL PRIMARY KEY,                     -- Identificador único da classe
    nivel SMALLINT NOT NULL,                          -- Ex: 10, 11, 12
    descricao VARCHAR(80)                              -- Descrição opcional da classe
);
CREATE TABLE IF NOT EXISTS cargo (
    id_cargo SERIAL PRIMARY KEY,                      -- ID do cargo
    nome_cargo VARCHAR(100) NOT NULL                  -- Nome do cargo (ex: Professor, Diretor)
);
CREATE TABLE IF NOT EXISTS categoria (
    id_categoria SERIAL PRIMARY KEY,
    nome_categoria VARCHAR(100) NOT NULL
);
"""