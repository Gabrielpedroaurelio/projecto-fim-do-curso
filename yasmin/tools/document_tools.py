from langchain.tools import tool
from fpdf import FPDF
import os
from datetime import datetime

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'SISTEMA DE GESTÃO ESCOLAR - DECLARAÇÃO OFICIAL', 0, 1, 'C')
        self.ln(10)

@tool
def generate_declaration_pdf(nome: str, curso: str, ano: str, matricula: str) -> str:
    """
    Gera um arquivo PDF de declaração para um aluno.
    Retorna o caminho do arquivo gerado.
    """
    try:
        pdf = PDF()
        pdf.add_page()
        pdf.set_font('Arial', '', 12)
        
        texto = f"""
        Declaramos para os devidos efeitos que o(a) aluno(a) {nome}, 
        regularmente matriculado(a) sob o número {matricula}, no curso de {curso}, 
        frequenta atualmente o {ano} ano neste estabelecimento de ensino.
        
        A presente declaração é emitida por solicitação do interessado aos {datetime.now().strftime('%d/%m/%Y')}.
        """
        
        pdf.multi_cell(0, 10, texto)
        
        output_dir = "yasmin_output"
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        filename = f"{output_dir}/declaracao_{matricula}.pdf"
        pdf.output(filename)
        
        return f"Documento gerado com sucesso: {filename}"
    except Exception as e:
        return f"Erro ao gerar PDF: {str(e)}"
