import axios from 'axios';

/**
 * Instância do Axios para a API do Backend (Django)
 * A baseURL deve apontar para o endpoint /api/v1/ do Django
 * Em desenvolvimento, geralmente é http://localhost:8000/api/v1/
 */
const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1/',
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Interceptor para adicionar o token JWT em cada requisição
 */
api.interceptors.request.use(
    (config) => {
        // Tenta obter o token do localStorage
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Interceptor para lidar com erros de resposta
 * Especialmente erro 401 (Não autorizado), que pode indicar token expirado
 */
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Se o erro for 401 e não for uma tentativa de refresh (para evitar loop infinito)
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            // TODO: Implementar lógica de Refresh Token aqui se necessário
            // Por enquanto, apenas redireciona para login ou limpa o storage
            // console.warn("Sessão expirada ou token inválido.");

            // Opcional: Limpar dados se o token for inválido
            // localStorage.removeItem('access_token');
            // localStorage.removeItem('refresh_token');
            // window.location.href = '/public/site';
        }

        // Retorna o erro para ser tratado no componente/serviço
        return Promise.reject(error);
    }
);

export default api;
