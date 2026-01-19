from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('apis', '0004_manual_update'),
    ]

    operations = [
        migrations.AddField(
            model_name='solicitacaodocumento',
            name='canal_pagamento_rup',
            field=models.CharField(blank=True, choices=[('express', 'Multicaixa Express'), ('fisico_rup', 'Impressão de RUP (Físico)')], max_length=20, null=True, verbose_name='Canal de Pagamento'),
        ),
        migrations.AddField(
            model_name='solicitacaodocumento',
            name='data_expiracao_rup',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Expiração do RUP'),
        ),
        migrations.AddField(
            model_name='solicitacaodocumento',
            name='caminho_arquivo',
            field=models.TextField(blank=True, null=True, verbose_name='Arquivo Gerado'),
        ),
        migrations.AddField(
            model_name='solicitacaodocumento',
            name='uuid_documento',
            field=models.UUIDField(blank=True, null=True, verbose_name='UUID do Documento'),
        ),
        migrations.AddField(
            model_name='solicitacaodocumento',
            name='data_aprovacao',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Data de Aprovação'),
        ),
        migrations.AlterField(
            model_name='solicitacaodocumento',
            name='status_solicitacao',
            field=models.CharField(choices=[('pendente', 'Pendente (Aguardando RUP)'), ('pago', 'Pago (Confirmado)'), ('aguardando_assinatura', 'Aguardando Assinatura'), ('impresso', 'Impresso (Físico)'), ('disponivel', 'Disponível para Levantamento'), ('rejeitado', 'Rejeitado')], default='pendente', max_length=30, verbose_name='Status'),
        ),
    ]
