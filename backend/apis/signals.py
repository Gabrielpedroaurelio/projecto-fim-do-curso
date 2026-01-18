from django.db.models.signals import post_save
from django.dispatch import receiver
from apis.models.documentos import SolicitacaoDocumento
from apis.models.avaliacoes import Nota
from apis.models.financeiro import Pagamento
from apis.models.auditoria import Notificacao
from apis.models.usuarios import Funcionario

@receiver(post_save, sender=SolicitacaoDocumento)
def notify_solicitacao_status(sender, instance, created, **kwargs):
    """Notifica o status da solicitação de documento"""
    if created:
        # Notificar o aluno/encarregado que a solicitação foi recebida
        if instance.id_aluno:
            Notificacao.objects.create(
                titulo="Solicitação Recebida",
                mensagem=f"Sua solicitação de {instance.tipo_documento} foi recebida e está em processamento.",
                tipo='info',
                id_aluno=instance.id_aluno
            )
        elif instance.id_encarregado:
            Notificacao.objects.create(
                titulo="Solicitação Recebida",
                mensagem=f"A solicitação de {instance.tipo_documento} para seu educando foi recebida.",
                tipo='info',
                id_encarregado=instance.id_encarregado
            )
        
        # Opcional: Notificar funcionários da secretaria
        # Por simplicidade, vamos pular ou notificar todos os admins
    else:
        # Se o status mudou para aprovado ou rejeitado
        if instance.status_solicitacao == 'aprovado':
            Notificacao.objects.create(
                titulo="Solicitação Aprovada",
                mensagem=f"Sua solicitação de {instance.tipo_documento} foi aprovada!",
                tipo='success',
                id_aluno=instance.id_aluno,
                id_encarregado=instance.id_encarregado
            )
        elif instance.status_solicitacao == 'rejeitado':
            Notificacao.objects.create(
                titulo="Solicitação Rejeitada",
                mensagem=f"Sua solicitação de {instance.tipo_documento} foi rejeitada. Verifique os detalhes.",
                tipo='error',
                id_aluno=instance.id_aluno,
                id_encarregado=instance.id_encarregado
            )

@receiver(post_save, sender=Nota)
def notify_nova_nota(sender, instance, created, **kwargs):
    """Notifica quando uma nova nota é lançada ou alterada"""
    if created or instance.id_aluno:
        msg = f"Uma nova nota ({instance.valor}) foi lançada para {instance.id_disciplina.nome_disciplina}."
        
        # Notificar Aluno
        Notificacao.objects.create(
            titulo="Nova Nota Lançada",
            mensagem=msg,
            tipo='info',
            id_aluno=instance.id_aluno
        )
        
        # Notificar Encarregado (se existir vínculo)
        encarregados = instance.id_aluno.encarregados.all()
        for enc in encarregados:
            Notificacao.objects.create(
                titulo="Nota lançada para Educando",
                mensagem=f"Foi lançada uma nota para {instance.id_aluno.nome_completo}: {instance.valor} em {instance.id_disciplina.nome_disciplina}.",
                tipo='info',
                id_encarregado=enc
            )

@receiver(post_save, sender=Pagamento)
def notify_pagamento_confirmado(sender, instance, created, **kwargs):
    """Notifica sobre a confirmação de pagamento"""
    if created:
        fatura = instance.id_fatura
        if fatura.id_aluno:
            msg = f"Seu pagamento de {instance.valor_pago} Kz para '{fatura.descricao}' foi confirmado."
            Notificacao.objects.create(
                titulo="Pagamento Confirmado",
                mensagem=msg,
                tipo='success',
                id_aluno=fatura.id_aluno
            )
            
            # Notificar Encarregados
            for enc in fatura.id_aluno.encarregados.all():
                Notificacao.objects.create(
                    titulo="Pagamento de Educando Confirmado",
                    mensagem=f"O pagamento de {fatura.id_aluno.nome_completo} ({instance.valor_pago} Kz) foi processado com sucesso.",
                    tipo='success',
                    id_encarregado=enc
                )
