import os
import uuid
from datetime import datetime
from django.utils.text import slugify

def upload_to_custom(instance, filename):
    """
    Função utilitária para renomear e organizar arquivos enviados.
    Padrão: caminho/ano/mes/dia/uuid_nome.ext
    """
    # Obter a extensão do arquivo
    ext = filename.split('.')[-1]
    # Extrair o nome base sem extensão
    name = ".".join(filename.split('.')[:-1])
    
    # Gerar um nome único: UUID + nome original limpo
    unique_name = f"{uuid.uuid4().hex}_{slugify(name)}.{ext}"
    
    # Obter o nome da classe do modelo (para organizar em pastas)
    model_name = instance.__class__.__name__.lower()
    
    # Organizar por data
    agora = datetime.now()
    date_path = agora.strftime("%Y/%m/%d")
    
    # Retornar o caminho final
    return os.path.join('uploads', model_name, date_path, unique_name)
