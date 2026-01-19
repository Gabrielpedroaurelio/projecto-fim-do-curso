# Generated manually - Change caminho_arquivo to FileField

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apis', '0005_update_solicitacao_documento'),
    ]

    operations = [
        migrations.AlterField(
            model_name='solicitacaodocumento',
            name='caminho_arquivo',
            field=models.FileField(
                blank=True,
                null=True,
                upload_to='documentos/',
                verbose_name='Arquivo Gerado (PDF)'
            ),
        ),
    ]
