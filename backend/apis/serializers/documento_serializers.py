from rest_framework import serializers
from apis.models import Documento, SolicitacaoDocumento


class DocumentoSerializer(serializers.ModelSerializer):
    """Serializer para Documento"""
    aluno_nome = serializers.CharField(source='id_aluno.nome_completo', read_only=True)
    criado_por_nome = serializers.CharField(source='criado_por.nome_completo', read_only=True)
    
    class Meta:
        model = Documento
        fields = [
            'id_documento', 'id_aluno', 'aluno_nome', 'tipo_documento',
            'caminho_pdf', 'uuid_documento',
            'criado_por', 'criado_por_nome', 'data_emissao'
        ]
        read_only_fields = ['id_documento', 'uuid_documento', 'data_emissao']


class DocumentoListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de Documentos"""
    aluno_nome = serializers.CharField(source='id_aluno.nome_completo', read_only=True)
    aluno_img = serializers.SerializerMethodField()
    classe = serializers.CharField(source='id_aluno.id_turma.id_classe.nivel', read_only=True)
    curso = serializers.CharField(source='id_aluno.id_turma.id_curso.nome_curso', read_only=True)
    
    class Meta:
        model = Documento
        fields = [
            'id_documento', 'tipo_documento', 'aluno_nome', 'aluno_img', 
            'classe', 'curso', 'caminho_pdf', 'uuid_documento', 'data_emissao'
        ]

    def get_aluno_img(self, obj):
        request = self.context.get('request')
        if obj.id_aluno and obj.id_aluno.img_path:
            if request:
                return request.build_absolute_uri(obj.id_aluno.img_path.url)
            return obj.id_aluno.img_path.url
        return None


class SolicitacaoDocumentoSerializer(serializers.ModelSerializer):
    """Serializer para SolicitacaoDocumento"""
    aluno_nome = serializers.CharField(source='id_aluno.nome_completo', read_only=True)
    encarregado_nome = serializers.CharField(source='id_encarregado.nome_completo', read_only=True)
    funcionario_nome = serializers.CharField(source='id_funcionario.nome_completo', read_only=True)
    
    class Meta:
        model = SolicitacaoDocumento
        fields = [
            'id_solicitacao', 'id_aluno', 'aluno_nome', 'id_encarregado', 'encarregado_nome',
            'id_funcionario', 'funcionario_nome', 'tipo_documento', 'status_solicitacao',
            'canal_pagamento_rup', 'data_expiracao_rup',
            'caminho_arquivo', 'uuid_documento', 'data_solicitacao', 'data_aprovacao'
        ]
        read_only_fields = ['id_solicitacao', 'data_solicitacao', 'data_aprovacao', 'data_expiracao_rup']


class SolicitacaoDocumentoListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de Solicitações"""
    aluno_nome = serializers.CharField(source='id_aluno.nome_completo', read_only=True)
    aluno_img = serializers.SerializerMethodField()
    
    class Meta:
        model = SolicitacaoDocumento
        fields = [
            'id_solicitacao', 'tipo_documento', 'aluno_nome', 'aluno_img',
            'status_solicitacao', 'data_solicitacao'
        ]

    def get_aluno_img(self, obj):
        request = self.context.get('request')
        if obj.id_aluno and obj.id_aluno.img_path:
            if request:
                return request.build_absolute_uri(obj.id_aluno.img_path.url)
            return obj.id_aluno.img_path.url
        return None


class SolicitacaoDocumentoAprovarSerializer(serializers.Serializer):
    """Serializer para aprovar solicitação"""
    id_funcionario = serializers.IntegerField()
    observacao = serializers.CharField(required=False, allow_blank=True)


class SolicitacaoDocumentoRejeitarSerializer(serializers.Serializer):
    """Serializer para rejeitar solicitação"""
    id_funcionario = serializers.IntegerField()
    motivo = serializers.CharField(required=True)
