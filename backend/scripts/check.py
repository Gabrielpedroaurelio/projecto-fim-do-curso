import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apis.models import Documento

docs = Documento.objects.all().order_by('-id_documento')[:5]
for d in docs:
    print(f"ID: {d.id_documento} | UUID: {d.uuid_documento} | COD_SEGURANCA: {d.codigo_seguranca}")
