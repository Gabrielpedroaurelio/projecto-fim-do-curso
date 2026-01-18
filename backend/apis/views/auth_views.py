from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from apis.models import Funcionario, Aluno, Encarregado, HistoricoLogin


def get_client_ip(request):
    """Obtém o IP do cliente"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def get_user_agent_info(request):
    """Extrai informações detalhadas do User-Agent utilizando a biblioteca user_agents"""
    from user_agents import parse
    ua_string = request.META.get('HTTP_USER_AGENT', '')
    user_agent = parse(ua_string)
    
    # Determinar tipo de dispositivo
    if user_agent.is_mobile:
        dispositivo = "Mobile"
    elif user_agent.is_tablet:
        dispositivo = "Tablet"
    elif user_agent.is_pc:
        dispositivo = "Desktop"
    else:
        dispositivo = "Desconhecido"

    # Capturar Navegador e SO
    navegador = f"{user_agent.browser.family} {user_agent.browser.version_string}"
    so = f"{user_agent.os.family} {user_agent.os.version_string}"
    
    return {
        'dispositivo': dispositivo,
        'navegador': f"{navegador} ({so})"
    }


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Endpoint de login para Funcionários, Alunos e Encarregados
    
    Body:
    {
        "email": "usuario@exemplo.com",
        "senha": "senha123",
        "tipo_usuario": "funcionario" | "aluno" | "encarregado"
    }
    """
    email = request.data.get('email')
    senha = request.data.get('senha')
    tipo_usuario = request.data.get('tipo_usuario', 'funcionario')
    
    if not email or not senha:
        return Response(
            {'error': 'Email e senha são obrigatórios'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = None
    user_data = {}
    
    try:
        # Buscar usuário baseado no tipo
        if tipo_usuario == 'funcionario':
            user = Funcionario.objects.get(email=email)
            if check_password(senha, user.senha_hash):
                user_data = {
                    'id': user.id_funcionario,
                    'tipo': 'funcionario',
                    'nome': user.nome_completo,
                    'email': user.email,
                    'cargo': user.id_cargo.nome_cargo if user.id_cargo else None,
                    'status': user.status_funcionario,
                    'img_path': request.build_absolute_uri(user.img_path.url) if user.img_path else None
                }
                # Atualizar status online
                user.is_online = True
                user.save()
            else:
                return Response(
                    {'error': 'Senha incorreta'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
        elif tipo_usuario == 'aluno':
            user = Aluno.objects.get(email=email)
            if check_password(senha, user.senha_hash):
                user_data = {
                    'id': user.id_aluno,
                    'tipo': 'aluno',
                    'nome': user.nome_completo,
                    'email': user.email,
                    'numero_matricula': user.numero_matricula,
                    'turma': user.id_turma.codigo_turma if user.id_turma else None,
                    'status': user.status_aluno,
                    'img_path': request.build_absolute_uri(user.img_path.url) if user.img_path else None
                }
                # Atualizar status online
                user.is_online = True
                user.save()
            else:
                return Response(
                    {'error': 'Senha incorreta'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
        elif tipo_usuario == 'encarregado':
            user = Encarregado.objects.get(email=email)
            if check_password(senha, user.senha_hash):
                user_data = {
                    'id': user.id_encarregado,
                    'tipo': 'encarregado',
                    'nome': user.nome_completo,
                    'email': user.email,
                    'img_path': request.build_absolute_uri(user.img_path.url) if user.img_path else None
                }
                # Atualizar status online
                user.is_online = True
                user.save()
            else:
                return Response(
                    {'error': 'Senha incorreta'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        else:
            return Response(
                {'error': 'Tipo de usuário inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Gerar tokens JWT
        refresh = RefreshToken()
        refresh['user_id'] = user_data['id']
        refresh['user_type'] = user_data['tipo']
        
        # Registrar histórico de login
        user_agent_info = get_user_agent_info(request)
        historico_data = {
            'ip_usuario': get_client_ip(request),
            'dispositivo': user_agent_info['dispositivo'],
            'navegador': user_agent_info['navegador']
        }
        
        if tipo_usuario == 'funcionario':
            historico_data['id_funcionario'] = user
        elif tipo_usuario == 'aluno':
            historico_data['id_aluno'] = user
        elif tipo_usuario == 'encarregado':
            historico_data['id_encarregado'] = user
        
        HistoricoLogin.objects.create(**historico_data)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': user_data
        }, status=status.HTTP_200_OK)
        
    except (Funcionario.DoesNotExist, Aluno.DoesNotExist, Encarregado.DoesNotExist):
        return Response(
            {'error': 'Usuário não encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'Erro no login: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def logout_view(request):
    """
    Endpoint de logout
    
    Body:
    {
        "user_id": 1,
        "user_type": "funcionario" | "aluno" | "encarregado"
    }
    """
    user_id = request.data.get('user_id')
    user_type = request.data.get('user_type')
    
    try:
        # Atualizar status online
        if user_type == 'funcionario':
            user = Funcionario.objects.get(id_funcionario=user_id)
            user.is_online = False
            user.save()
        elif user_type == 'aluno':
            user = Aluno.objects.get(id_aluno=user_id)
            user.is_online = False
            user.save()
        elif user_type == 'encarregado':
            user = Encarregado.objects.get(id_encarregado=user_id)
            user.is_online = False
            user.save()
        
        # Atualizar histórico de login (hora de saída)
        from django.utils import timezone
        historico = HistoricoLogin.objects.filter(
            **{f'id_{user_type}': user},
            hora_saida__isnull=True
        ).order_by('-hora_entrada').first()
        
        if historico:
            historico.hora_saida = timezone.now()
            historico.save()
        
        return Response(
            {'message': 'Logout realizado com sucesso'},
            status=status.HTTP_200_OK
        )
        
    except Exception as e:
        return Response(
            {'error': f'Erro no logout: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def me_view(request):
    """
    Retorna informações do usuário autenticado baseado no Token JWT
    """
    from rest_framework_simplejwt.authentication import JWTAuthentication
    from rest_framework.exceptions import AuthenticationFailed
    
    try:
        # Autenticar manualmente o token
        jwt_auth = JWTAuthentication()
        user_auth_tuple = jwt_auth.authenticate(request)
        
        if user_auth_tuple is None:
            return Response(
                {'error': 'Token inválido ou não fornecido'},
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        # O user retornado pelo JWTAuthentication já é o objeto do modelo (AuthUser ou Custom)
        # Mas como não usamos o Auth User padrão do Django para tudo, precisamos verificar
        # o payload do token para saber quem é (aluno, funcionario, etc)
        
        # O payload está no segundo elemento da tupla (token)
        token = user_auth_tuple[1]
        user_id = token.payload.get('user_id')
        user_type = token.payload.get('user_type')
        
        user_data = {}
        
        if user_type == 'funcionario':
            user = Funcionario.objects.get(id_funcionario=user_id)
            user_data = {
                'id': user.id_funcionario,
                'tipo': 'funcionario',
                'nome': user.nome_completo,
                'email': user.email,
                'cargo': user.id_cargo.nome_cargo if user.id_cargo else None,
                'status': user.status_funcionario,
                'img_path': request.build_absolute_uri(user.img_path.url) if user.img_path else None,
                'is_online': True
            }
        elif user_type == 'aluno':
            user = Aluno.objects.get(id_aluno=user_id)
            user_data = {
                'id': user.id_aluno,
                'tipo': 'aluno',
                'nome': user.nome_completo,
                'email': user.email,
                'numero_matricula': user.numero_matricula,
                'turma': user.id_turma.codigo_turma if user.id_turma else None,
                'status': user.status_aluno,
                'img_path': request.build_absolute_uri(user.img_path.url) if user.img_path else None,
                'is_online': True
            }
        elif user_type == 'encarregado':
            user = Encarregado.objects.get(id_encarregado=user_id)
            user_data = {
                'id': user.id_encarregado,
                'tipo': 'encarregado',
                'nome': user.nome_completo,
                'email': user.email,
                'img_path': request.build_absolute_uri(user.img_path.url) if user.img_path else None,
                'is_online': True
            }
            
        return Response({
            'user': user_data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Erro ao obter dados do usuário: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
@api_view(['PATCH', 'POST'])
def update_profile_view(request):
    """
    Atualiza informações do perfil e foto do usuário autenticado
    """
    from rest_framework_simplejwt.authentication import JWTAuthentication
    
    try:
        jwt_auth = JWTAuthentication()
        user_auth_tuple = jwt_auth.authenticate(request)
        
        if user_auth_tuple is None:
            return Response({'error': 'Não autorizado'}, status=status.HTTP_401_UNAUTHORIZED)
            
        token = user_auth_tuple[1]
        user_id = token.payload.get('user_id')
        user_type = token.payload.get('user_type')
        
        user = None
        if user_type == 'funcionario':
            user = Funcionario.objects.get(id_funcionario=user_id)
        elif user_type == 'aluno':
            user = Aluno.objects.get(id_aluno=user_id)
        elif user_type == 'encarregado':
            user = Encarregado.objects.get(id_encarregado=user_id)
            
        if not user:
            return Response({'error': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # Atualizar campos
        if 'nome' in request.data:
            user.nome_completo = request.data['nome']
        if 'email' in request.data:
            user.email = request.data['email']
        if 'img_path' in request.FILES:
            user.img_path = request.FILES['img_path']
        if 'telefone' in request.data:
            user.telefone = request.data['telefone']
            
        user.save()
        
        # Retornar dados atualizados
        user_data = {
            'id': user_id,
            'tipo': user_type,
            'nome': user.nome_completo,
            'email': user.email,
            'img_path': request.build_absolute_uri(user.img_path.url) if user.img_path else None
        }
        
        return Response({'user': user_data, 'message': 'Perfil atualizado com sucesso'})
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def change_password_view(request):
    """
    Altera a senha do usuário autenticado
    """
    from rest_framework_simplejwt.authentication import JWTAuthentication
    from django.contrib.auth.hashers import check_password, make_password
    
    try:
        jwt_auth = JWTAuthentication()
        user_auth_tuple = jwt_auth.authenticate(request)
        
        if user_auth_tuple is None:
            return Response({'error': 'Não autorizado'}, status=status.HTTP_401_UNAUTHORIZED)
            
        token = user_auth_tuple[1]
        user_id = token.payload.get('user_id')
        user_type = token.payload.get('user_type')
        
        senha_atual = request.data.get('senha_atual')
        nova_senha = request.data.get('nova_senha')
        
        if not senha_atual or not nova_senha:
            return Response({'error': 'Senha atual e nova senha são obrigatórias'}, status=status.HTTP_400_BAD_REQUEST)
            
        user = None
        if user_type == 'funcionario':
            user = Funcionario.objects.get(id_funcionario=user_id)
        elif user_type == 'aluno':
            user = Aluno.objects.get(id_aluno=user_id)
        elif user_type == 'encarregado':
            user = Encarregado.objects.get(id_encarregado=user_id)
            
        if not user:
            return Response({'error': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)
            
        if not check_password(senha_atual, user.senha_hash):
            return Response({'error': 'Senha atual incorreta'}, status=status.HTTP_400_BAD_REQUEST)
            
        user.senha_hash = make_password(nova_senha)
        user.save()
        
        return Response({'message': 'Senha alterada com sucesso'})
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
