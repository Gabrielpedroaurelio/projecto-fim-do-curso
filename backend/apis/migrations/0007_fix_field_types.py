# Generated manually - Fix field types

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apis', '0006_alter_solicitacaodocumento_caminho_arquivo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pagamento',
            name='comprovante_path',
            field=models.FileField(
                blank=True,
                null=True,
                upload_to='comprovantes/',
                verbose_name='Comprovante'
            ),
        ),
        migrations.AlterField(
            model_name='aluno',
            name='telefone',
            field=models.CharField(max_length=20, verbose_name='Telefone'),
        ),
    ]
