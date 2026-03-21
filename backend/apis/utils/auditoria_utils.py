from django.utils import timezone
from apis.models import Historico

def registrar_evento(request, tipo_accao, dados_anteriores=None, dados_novos=None, aluno=None):
    """
    Registra um evento de auditoria no sistema.
    
    Args:
        request: O objeto request do Django (para capturar o usuário)
        tipo_accao: String descrevendo a ação (ex: 'LOGIN', 'UPDATE_CONFIG', 'BACKUP')
        dados_anteriores: Dicionário com estados anteriores (opcional)
        dados_novos: Dicionário com novos estados (opcional)
        aluno: Instância do aluno se for ação relacionada a aluno (opcional)
    """
    user = getattr(request, 'user', None)
    id_funcionario = None
    id_aluno = None
    
    # Identificar o usuário que realizou a ação
    if user:
        from apis.models import Funcionario, Aluno
        if isinstance(user, Funcionario):
            id_funcionario = user
        elif isinstance(user, Aluno):
            id_aluno = user
            
    Historico.objects.create(
        id_funcionario=id_funcionario,
        id_aluno=aluno or id_aluno, # Permite passar um aluno alvo ou o aluno logado
        tipo_accao=tipo_accao,
        dados_anteriores=dados_anteriores,
        dados_novos=dados_novos
    )
