import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from apis.models import Aluno, SolicitacaoDocumento, Fatura, Funcionario, Notificacao
from apis.services.document_service import DocumentService
from django.utils import timezone

def test_notification_flow():
    print("=" * 50)
    print("🚀 TESTANDO FLUXO DE NOTIFICAÇÃO DE DOCUMENTOS")
    print("=" * 50)

    try:
        # 1. Obter dados base
        aluno = Aluno.objects.first()
        funcionario = Funcionario.objects.first()
        
        if not aluno or not funcionario:
            print("❌ Erro: Preciso de pelo menos um aluno e um funcionário no banco para o teste.")
            return

        print(f" usando Aluno: {aluno.nome_completo}")
        print(f" usando Funcionario: {funcionario.nome_completo}")

        # 2. Criar Solicitação
        print("\n[1/3] Criando solicitação...")
        solicitacao, fatura = DocumentService.criar_solicitacao(
            aluno_id=aluno.id_aluno,
            tipo_documento="DECLARAÇÃO_MATRICULA",
            canal_pagamento="fisico_rup"
        )
        print(f"  ✅ Solicitação {solicitacao.id_solicitacao} criada.")

        # 3. Confirmar Pagamento (Isso deve gerar PDF + Notificação)
        print("\n[2/3] Confirmando pagamento e gerando documento...")
        caminho_pdf = DocumentService.confirmar_pagamento_funcionario(
            solicitacao_id=solicitacao.id_solicitacao,
            funcionario_id=funcionario.id_funcionario
        )
        
        if caminho_pdf:
            print(f"  ✅ PDF gerado em: {caminho_pdf}")
        else:
            print("  ❌ Falha ao gerar PDF.")
            return

        # 4. Verificar se a notificação foi criada
        print("\n[3/3] Verificando notificações no banco...")
        notifica = Notificacao.objects.filter(id_aluno=aluno).first()
        
        if notifica and "Documento Disponível" in notifica.titulo:
            print(f"  ✅ NOTIFICAÇÃO ENCONTRADA!")
            print(f"     Título: {notifica.titulo}")
            print(f"     Mensagem: {notifica.mensagem}")
        else:
            print("  ❌ Notificação não encontrada no banco de dados.")

    except Exception as e:
        print(f"  ❌ Erro durante o teste: {e}")
        import traceback
        traceback.print_exc()

    print("\n" + "=" * 50)
    print("✨ TESTE CONCLUÍDO")
    print("=" * 50)

if __name__ == "__main__":
    test_notification_flow()
