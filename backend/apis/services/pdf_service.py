import os
from io import BytesIO
from django.conf import settings
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.utils import timezone

class PDFService:
    """
    Serviço para geração de documentos PDF a partir de templates HTML
    """
    
    @staticmethod
    def render_to_pdf(template_src, context_dict={}):
        """
        Renderiza um template HTML para um arquivo binário PDF em memória
        """
        template = get_template(template_src)
        html = template.render(context_dict)
        result = BytesIO()
        
        # Função para resolver caminhos de recursos (imagens, css) no PDF
        def link_callback(uri, rel):
            """
            Converte URIs de arquivos estáticos/mídia em caminhos absolutos do sistema
            """
            # Caminho absoluto para arquivos estáticos e media
            sUrl = settings.STATIC_URL
            sRoot = str(settings.STATIC_ROOT) if settings.STATIC_ROOT else ''
            mUrl = settings.MEDIA_URL
            mRoot = str(settings.MEDIA_ROOT) if settings.MEDIA_ROOT else ''

            if uri.startswith(mUrl):
                path = os.path.join(mRoot, uri.replace(mUrl, ""))
            elif uri.startswith(sUrl):
                path = os.path.join(sRoot, uri.replace(sUrl, ""))
                if not os.path.isfile(path):
                    # Fallback para STATICFILES_DIRS em desenvolvimento
                    for static_dir in settings.STATICFILES_DIRS:
                         # static_dir pode ser Path object
                         s_dir = str(static_dir)
                         possible_path = os.path.join(s_dir, uri.replace(sUrl, ""))
                         if os.path.isfile(possible_path):
                             path = possible_path
                             break
            else:
                return uri

            # Se ainda não encontrou, tenta caminho absoluto local se não for url remota
            if not os.path.isfile(path) and not uri.startswith('http'):
                 path = os.path.join(str(settings.BASE_DIR), uri.lstrip('/'))

            if not os.path.isfile(path):
                # print(f"DEBUG PDF: Arquivo não encontrado: {path} (URI: {uri})")
                return uri
            return str(path)

        pdf = pisa.pisaDocument(BytesIO(html.encode("UTF-8")), result, link_callback=link_callback)
        
        if not pdf.err:
            return result.getvalue()
            
        error_msg = f"Erro na geração do PDF: {pdf.err} errors. Log: {pdf.log}"
        print(error_msg)
        raise Exception(error_msg)

    @staticmethod
    def save_pdf(pdf_content, filename, sub_dir='documentos'):
        """
        Salva o conteúdo binário do PDF no diretório de mídia
        """
        dir_path = os.path.join(settings.MEDIA_ROOT, sub_dir)
        if not os.path.exists(dir_path):
            os.makedirs(dir_path)
            
        file_path = os.path.join(dir_path, filename)
        with open(file_path, 'wb') as f:
            f.write(pdf_content)
            
        # Retorna o caminho relativo para salvar no banco de dados
        return os.path.join(sub_dir, filename)
