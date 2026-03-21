import { MEDIA_URL } from '../Services/api';

/**
 * Normaliza caminhos de arquivos vindo do backend para URLs completas
 * @param {string} path - Caminho relativo ou absoluto
 * @returns {string} - URL completa para o recurso
 */
export const getMediaUrl = (path) => {
    if (!path) return '';
    
    // Se já for uma URL completa, retorna como está
    if (path.startsWith('http')) return path;
    
    // Limpa prefixos redundantes que o backend às vezes envia
    const cleanPath = path.replace(/^\/media\//, '').replace(/^media\//, '');
    
    // Garante que o MEDIA_URL termina com barra e o path não começa com barra
    const base = MEDIA_URL.endsWith('/') ? MEDIA_URL : `${MEDIA_URL}/`;
    const relative = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;
    
    return `${base}${relative}`;
};
