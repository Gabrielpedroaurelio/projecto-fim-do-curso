import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apis.models.documentos import SolicitacaoDocumento

# Ver os últimos 5
solicitacoes = SolicitacaoDocumento.objects.all().order_by('-data_solicitacao')[:5]
print("Recent Solicitations:")
for s in solicitacoes:
    print(f"ID: {s.id_solicitacao} | Tipo: {s.tipo_documento} | Status: {s.status_solicitacao} | Arquivo: {s.caminho_arquivo}")
