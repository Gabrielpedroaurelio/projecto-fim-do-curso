from apis.models.auditoria import Notificacao
from apis.models.usuarios import Funcionario, Encarregado
from apis.models.alunos import Aluno

class NotificationService:
    """
    Serviço centralizado para gestão de notificações no sistema.
    """

    @staticmethod
    def notify_user(titulo, mensagem, tipo='info', id_funcionario=None, id_aluno=None, id_encarregado=None):
        """
        Cria uma notificação para um usuário específico.
        """
        try:
            notificacao = Notificacao.objects.create(
                titulo=titulo,
                mensagem=mensagem,
                tipo=tipo,
                id_funcionario_id=id_funcionario,
                id_aluno_id=id_aluno,
                id_encarregado_id=id_encarregado
            )
            return notificacao
        except Exception as e:
            # Em serviços de notificação, falhas silenciosas ou logadas são preferíveis 
            # para não travar o fluxo principal de negócio (ex: pagamento).
            print(f"Erro ao criar notificação: {e}")
            return None

    @staticmethod
    def notify_document_available(solicitacao):
        """
        Notifica o aluno e o encarregado que um documento está disponível.
        """
        titulo = "Documento Disponível"
        mensagem = f"O seu documento '{solicitacao.tipo_documento}' já está disponível para visualização e download."
        
        # Notificar Aluno
        NotificationService.notify_user(
            titulo=titulo,
            mensagem=mensagem,
            tipo='success',
            id_aluno=solicitacao.id_aluno_id
        )
        
        # Notificar Encarregado (se houver)
        if solicitacao.id_encarregado_id:
            NotificationService.notify_user(
                titulo=titulo,
                mensagem=mensagem,
                tipo='success',
                id_encarregado=solicitacao.id_encarregado_id
            )
