import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../Services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Ao iniciar, verifica se existe token e tenta recuperar o usuário
        const loadUser = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    // Chamada ao backend para validar token e pegar dados do usuário
                    // Nota: O backend precisa ter o endpoint /auth/me/ configurado corretamente
                    const response = await api.get('/auth/me/');
                    setUser(response.data.user || response.data);
                } catch (error) {
                    console.error("Erro ao carregar sessão:", error);
                    logout();
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const login = async (email, senha, tipo_usuario) => {
        try {
            const response = await api.post('/auth/login/', {
                email,
                senha,
                tipo_usuario
            });

            const { access, refresh, user } = response.data;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user_type', tipo_usuario);

            setUser(user);
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                message: error.response?.data?.error || "Falha na autenticação"
            };
        }
    };

    const logout = async () => {
        try {
            // Tenta notificar o backend sobre o logout (opcional, mas bom para histórico)
            const userType = localStorage.getItem('user_type');
            if (user && userType) {
                await api.post('/auth/logout/', {
                    user_id: user.id,
                    user_type: userType
                });
            }
        } catch (error) {
            // Ignora erro no logout
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_type');
            setUser(null);
            // Redirecionamento pode ser feito aqui ou no componente
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
