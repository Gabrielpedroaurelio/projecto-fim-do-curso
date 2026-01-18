from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('apis', '0003_alter_sala_img_path'),
    ]

    operations = [
        migrations.CreateModel(
            name='ConfiguracaoSistema',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('criado_em', models.DateTimeField(auto_now_add=True, verbose_name='Criado em')),
                ('atualizado_em', models.DateTimeField(auto_now=True, verbose_name='Atualizado em')),
                ('nome_instituicao', models.CharField(max_length=200, verbose_name='Nome da Instituição')),
                ('nif', models.CharField(blank=True, max_length=50, null=True, verbose_name='NIF')),
                ('endereco', models.CharField(blank=True, max_length=255, null=True, verbose_name='Endereço')),
                ('telefone', models.CharField(blank=True, max_length=50, null=True, verbose_name='Telefone')),
                ('email_oficial', models.EmailField(blank=True, max_length=254, null=True, verbose_name='Email Oficial')),
                ('logo', models.ImageField(blank=True, null=True, upload_to='config/logos/', verbose_name='Logo')),
                ('backup_automatico', models.BooleanField(default=True, verbose_name='Backup Automático')),
                ('frequencia_backup', models.CharField(default='diario', max_length=50, verbose_name='Frequência de Backup')),
            ],
            options={
                'verbose_name': 'Configuração do Sistema',
                'verbose_name_plural': 'Configurações do Sistema',
                'db_table': 'configuracao_sistema',
            },
        ),
        migrations.AddField(
            model_name='livro',
            name='img_path',
            field=models.ImageField(blank=True, null=True, upload_to='image/biblioteca/capas/', verbose_name='Capa do Livro'),
        ),
        migrations.CreateModel(
            name='Notificacao',
            fields=[
                ('id_notificacao', models.AutoField(primary_key=True, serialize=False)),
                ('titulo', models.CharField(max_length=200, verbose_name='Título')),
                ('mensagem', models.TextField(verbose_name='Mensagem')),
                ('tipo', models.CharField(choices=[('info', 'Informação'), ('success', 'Sucesso'), ('warning', 'Aviso'), ('error', 'Erro')], default='info', max_length=10, verbose_name='Tipo')),
                ('lida', models.BooleanField(default=False, verbose_name='Lida')),
                ('data_criacao', models.DateTimeField(auto_now_add=True, verbose_name='Data de Criação')),
                ('id_aluno', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='notificacoes', to='apis.aluno')),
                ('id_encarregado', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='notificacoes', to='apis.encarregado')),
                ('id_funcionario', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='notificacoes', to='apis.funcionario')),
            ],
            options={
                'verbose_name': 'Notificação',
                'verbose_name_plural': 'Notificações',
                'db_table': 'notificacao',
                'ordering': ['-data_criacao'],
            },
        ),
    ]
