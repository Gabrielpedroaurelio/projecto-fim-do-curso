from django.db.models.signals import post_save

from django.dispatch import receiver

from apis.models.documentos import SolicitacaoDocumento, HistoricoTurmaAluno

from apis.models.avaliacoes import Nota

from apis.models.financeiro import Pagamento

from apis.models.auditoria import Notificacao

from apis.models.usuarios import Funcionario

from apis.models.alunos import Aluno
from apis.utils.auditoria_utils import registrar_evento



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

        # Se o status mudou

        if instance.status_solicitacao == 'pago':

            # Notificar Diretor (Simplificado: Notificar todos os admins ou funcionário específico)

            Notificacao.objects.create(

                titulo="RUP Pago - Documento Pendente",

                mensagem=f"O pagamento para {instance.tipo_documento} de {instance.id_aluno.nome_completo} foi confirmado. O documento pode ser gerado.",

                tipo='info',

                # Idealmente vincular a um perfil de Diretor/Secretaria. 

                # Como não temos Diretor model explícito aqui, deixamos sem destinatário específico ou criamos logica futura.

                # Para MVP, vamos assumir que o admin vê todas ou notificamos um funcionario padrão se existir.

            )

            

        elif instance.status_solicitacao == 'aguardando_assinatura':

             Notificacao.objects.create(

                titulo="Documento Aguardando Assinatura",

                mensagem=f"O documento de {instance.id_aluno.nome_completo} foi gerado e aguarda sua assinatura digital.",

                tipo='warning',

                # id_funcionario=Diretor

            )

            

        elif instance.status_solicitacao == 'disponivel':

            msg = f"Seu documento ({instance.tipo_documento}) já está assinado e disponível para levantamento/download."

            if instance.id_aluno:

                Notificacao.objects.create(

                    titulo="Documento Disponível",

                    mensagem=msg,

                    tipo='success',

                    id_aluno=instance.id_aluno

                )

            if instance.id_encarregado:

                # Se foi solicitado pelo encarregado ou se notificamos sempre

                Notificacao.objects.create(

                    titulo="Documento Disponível",

                    mensagem=msg,

                    tipo='success',

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

        msg = f"Uma nova nota ({instance.valor}) foi lançada para {instance.id_disciplina.nome}."

        

        # Notificar Aluno

        Notificacao.objects.create(

            titulo="Nova Nota Lançada",

            mensagem=msg,

            tipo='info',

            id_aluno=instance.id_aluno

        )

        

        # Notificar Encarregado (se existir vínculo)

        from apis.models.alunos import AlunoEncarregado

        encarregado_relations = AlunoEncarregado.objects.filter(id_aluno=instance.id_aluno).select_related('id_encarregado')

        for rel in encarregado_relations:

            Notificacao.objects.create(

                titulo="Nota lançada para Educando",

                mensagem=f"Foi lançada uma nota para {instance.id_aluno.nome_completo}: {instance.valor} em {instance.id_disciplina.nome}.",

                tipo='info',

                id_encarregado=rel.id_encarregado

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

            from apis.models.alunos import AlunoEncarregado

            encarregado_relations = AlunoEncarregado.objects.filter(id_aluno=fatura.id_aluno).select_related('id_encarregado')

            for rel in encarregado_relations:

                Notificacao.objects.create(

                    titulo="Pagamento de Educando Confirmado",

                    mensagem=f"O pagamento de {fatura.id_aluno.nome_completo} ({instance.valor_pago} Kz) foi processado com sucesso.",

                    tipo='success',

                    id_encarregado=rel.id_encarregado

                )



@receiver(post_save, sender=Aluno)

def salvar_historico_turma_aluno(sender, instance, created, **kwargs):

    """

    Salva histórico de turma do aluno sempre que o aluno for associado a uma turma

    """

    from apis.models.documentos import salvar_historico_turma_aluno

    

    # Se o aluno está sendo associado a uma turma E tem id_turma

    if hasattr(instance, 'id_turma') and instance.id_turma:

        try:

            salvar_historico_turma_aluno(instance, instance.id_turma)

        except Exception as e:

            # Logar erro mas não quebrar a operação

            import logging

            logger = logging.getLogger(__name__)

            logger.error(f"Erro ao salvar histórico da turma: {str(e)}")

    

    # Se o aluno está sendo ATIVADO (mudou de status)

    elif hasattr(instance, 'status_aluno') and instance.status_aluno == 'Activo':

        # Buscar primeira turma ativa

        from apis.models.academico import Turma

        turma_ativa = Turma.objects.filter(id_aluno=instance).first()

        if turma_ativa:

            try:

                salvar_historico_turma_aluno(instance, turma_ativa)

            except Exception as e:

                import logging

                logger = logging.getLogger(__name__)

                logger.error(f"Erro ao salvar histórico da turma ativa: {str(e)}")


@receiver(post_save, sender=Aluno)
def audit_aluno_save(sender, instance, created, **kwargs):
    """Grava auditoria de Aluno"""
    # Nota: Em sinais, não temos o request facilmente sem usar middleware 
    # ou passar manualmente. Para contornar, podemos gravar como 'Sistema'
    # ou tentar capturar se o request estiver disponível via thread locals (arrojado).
    # Por agora, gravamos como acção do sistema se o request não for passado.
    if created:
        registrar_evento(None, 'CRIOU_ALUNO', dados_novos={'nome': instance.nome_completo}, aluno=instance)

@receiver(post_save, sender=Funcionario)
def audit_funcionario_save(sender, instance, created, **kwargs):
    """Grava auditoria de Funcionário"""
    if created:
        registrar_evento(None, 'CRIOU_FUNCIONARIO', dados_novos={'nome': instance.nome_completo})

