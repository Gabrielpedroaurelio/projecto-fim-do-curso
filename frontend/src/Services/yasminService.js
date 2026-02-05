import axios from 'axios';

const YASMIN_API_URL = 'http://localhost:8001';

const yasminApi = axios.create({
    baseURL: YASMIN_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const yasminService = {
    /**
     * Envia uma mensagem para a Yasmin IA
     * @param {string} message - A mensagem do usuário
     * @param {string} role - O papel do usuário (student, admin, parent)
     * @param {string} userId - ID do usuário (opcional)
     * @param {string} userToken - Token JWT do usuário logado (opcional)
     * @returns {Promise<Object>} - Resposta da IA e histórico
     */
    sendMessage: async (message, role = 'student', userId = null, userToken = null) => {
        try {
            const response = await yasminApi.post('/chat', {
                message,
                role,
                user_id: userId,
                user_token: userToken
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao comunicar com Yasmin:', error);
            throw error;
        }
    },

    /**
     * Verifica o status da Yasmin
     */
    checkStatus: async () => {
        try {
            const response = await yasminApi.get('/');
            return response.data;
        } catch (error) {
            return { status: 'offline', action: error };
        }
    }
};

export default yasminService;
