import React, { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContextData';
import { useLocation } from 'react-router-dom';

export const ThemeProvider = ({ children }) => {
    const location = useLocation();

    // Check localStorage or system preference
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('site-theme');
        if (savedTheme) return savedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        localStorage.setItem('site-theme', theme);

        // List of routes where dark mode should NOT be applied
        const publicRoutes = ['/', '/public', '/admin/auth', '/student/auth', '/parent/auth'];
        const isPublicRoute = publicRoutes.some(route =>
            route === '/' ? location.pathname === '/' : location.pathname.startsWith(route)
        );

        // Apply class to body only if theme is dark and NOT a public route
        if (theme === 'dark' && !isPublicRoute) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [theme, location.pathname]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};


