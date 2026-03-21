from apis.models.auditoria import Notificacao
from django.core.mail import EmailMessage
from django.conf import settings
import os

class NotificationService:
    """
    Serviço centralizado para gestão de notificações no sistema.
    """

    @staticmethod
    def notify_user(titulo, mensagem, tipo='info', id_funcionario=None, id_aluno=None, id_encarregado=None):
        """
        Cria uma notificação para um usuário específico no banco de dados.
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
            print(f"Erro ao criar notificação: {e}")
            return None

    @staticmethod
    def send_email_notification(destinatario, assunto, mensagem, arquivo_anexo=None):
        """
        Envia um email com o documento em anexo se fornecido.
        """
        if not destinatario:
            return False
            
        try:
            email = EmailMessage(
                assunto,
                mensagem,
                settings.DEFAULT_FROM_EMAIL,
                [destinatario]
            )
            
            if arquivo_anexo:
                # O caminho no banco é relativo ao MEDIA_ROOT
                full_path = os.path.join(settings.MEDIA_ROOT, str(arquivo_anexo))
                if os.path.exists(full_path):
                    with open(full_path, 'rb') as f:
                        email.attach(
                            os.path.basename(full_path),
                            f.read(),
                            'application/pdf'
                        )
                else:
                    print(f"Aviso: Arquivo de anexo não encontrado em {full_path}")
            
            email.send(fail_silently=False)
            return True
        except Exception as e:
            print(f"Erro ao enviar email para {destinatario}: {e}")
            return False

    @staticmethod
    def notify_document_available(solicitacao):
        """
        Notifica o aluno e o encarregado que um documento está disponível via DB e E-mail.
        """
        titulo = "Documento Disponível"
        mensagem = f"O seu documento '{solicitacao.tipo_documento}' já está disponível para visualização e download."
        
        # 1. Notificação no Banco (Aluno)
        NotificationService.notify_user(
            titulo=titulo,
            mensagem=mensagem,
            tipo='success',
            id_aluno=solicitacao.id_aluno_id
        )
        
        # 2. Email Aluno
        if solicitacao.id_aluno and solicitacao.id_aluno.email:
            assunto_email = f"Instituto Politécnico de Maiombe: Seu documento {solicitacao.tipo_documento} está pronto"
            corpo_email = f"Olá {solicitacao.id_aluno.nome_completo},\n\nO seu documento foi gerado e agora está disponível no Portal do Aluno.\n\nAnexamos uma via original protegida para sua conveniência.\n\nAtenciosamente,\nSecretaria do Instituto Politécnico de Maiombe"
            NotificationService.send_email_notification(
                solicitacao.id_aluno.email,
                assunto_email,
                corpo_email,
                arquivo_anexo=solicitacao.caminho_arquivo
            )
        
        # 3. Notificação no Banco (Encarregado)
        if solicitacao.id_encarregado_id:
            NotificationService.notify_user(
                titulo=titulo,
                mensagem=mensagem,
                tipo='success',
                id_encarregado=solicitacao.id_encarregado_id
            )
            
            # 4. Email Encarregado
            if solicitacao.id_encarregado and solicitacao.id_encarregado.email:
                dest_encarregado = solicitacao.id_encarregado.email
                assunto_email = f"Instituto Politécnico de Maiombe: Documento de {solicitacao.id_aluno.nome_completo} disponível"
                corpo_email = f"Prezado Encarregado,\n\nO documento '{solicitacao.tipo_documento}' solicitado para o aluno {solicitacao.id_aluno.nome_completo} está pronto.\n\nSeguimos anexando a via original.\n\nAtenciosamente,\nSecretaria Escolar"
                NotificationService.send_email_notification(
                    dest_encarregado,
                    assunto_email,
                    corpo_email,
                    arquivo_anexo=solicitacao.caminho_arquivo
                )
