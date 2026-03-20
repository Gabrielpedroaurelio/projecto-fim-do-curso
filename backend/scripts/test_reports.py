import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apis.models import Funcionario, Historico

try:
    f = Funcionario.objects.select_related('id_pessoa').first()
    if f:
        print("FUNCIONARIO NOME:", f.id_pessoa.nome_completo)
except Exception as e:
    print("ERRO FUNCIONARIO:", e)

try:
    h = Historico.objects.first()
    if h:
        print("HISTORICO:", h.id_funcionario.nome_completo if h.id_funcionario else 'Sistema')
except Exception as e:
    print("ERRO HISTORICO:", e)
