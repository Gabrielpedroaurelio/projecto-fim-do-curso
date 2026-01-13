from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from apis.models import HistoricoLogin
from apis.serializers.auditoria_serializers import HistoricoLoginSerializer


class HistoricoLoginViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para HistoricoLogin"""
    queryset = HistoricoLogin.objects.select_related(
        'id_funcionario', 'id_aluno', 'id_encarregado'
    ).all()
    serializer_class = HistoricoLoginSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = [
        'id_funcionario__nome_completo', 
        'id_aluno__nome_completo', 
        'id_encarregado__nome_completo',
        'ip_usuario'
    ]
    ordering_fields = ['hora_entrada', 'hora_saida']
    ordering = ['-hora_entrada']
