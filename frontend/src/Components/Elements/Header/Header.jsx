import { useState, useEffect, useRef } from 'react'
import {
    RiSearchLine,
    RiNotification3Line,
    RiSunLine,
    RiMoonLine,
    RiMenu4Line,
    RiCloseLine,
    RiCheckLine,
    RiErrorWarningLine,
    RiUserLine,
    RiSettings4Line,
    RiLogoutBoxRLine,
} from "react-icons/ri";

import style from './Header.module.css'
import { useAuth } from '../../../Context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Header({ text1, text2, onSearch }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [showProfileDropdown, setShowProfileDropdown] = useState(false)
    const notificationRef = useRef(null)
    const profileRef = useRef(null)

    // Notifications mockup
    const notifications = [
        { id: 1, type: 'success', title: 'Backup concluído', time: 'Há 5 min', description: 'O backup do sistema foi realizado com sucesso.' },
        { id: 2, type: 'warning', title: 'Nova solicitação', time: 'Há 12 min', description: 'Gabriel Aurelio solicitou um certificado.' },
        { id: 3, type: 'info', title: 'Acesso detectado', time: 'Há 1 hora', description: 'Novo login do IP 192.168.1.45 detected.' },
    ]

    // Load theme preference on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme')
        const prefersDark = savedTheme === 'dark'
        setIsDarkMode(prefersDark)
        if (prefersDark) {
            document.body.classList.add('dark-mode')
        } else {
            document.body.classList.remove('dark-mode')
        }
    }, [])

    // Click outside to close tabs
    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false)
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // Sync body class with sidebar state
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.classList.add('sidebar-open')
        } else {
            document.body.classList.remove('sidebar-open')
        }
        return () => {
            document.body.classList.remove('sidebar-open')
        }
    }, [isSidebarOpen])

    const toggleTheme = () => {
        const newTheme = !isDarkMode
        setIsDarkMode(newTheme)
        if (newTheme) {
            document.body.classList.add('dark-mode')
            localStorage.setItem('theme', 'dark')
        } else {
            document.body.classList.remove('dark-mode')
            localStorage.setItem('theme', 'light')
        }
    }

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const userRoleDisplay = {
        'funcionario': 'Funcionário',
        'aluno': 'Aluno',
        'encarregado': 'Encarregado'
    };

    const getInitials = (name) => {
        if (!name) return '??';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <header className={style.Header}>
            <div className={style.HeaderLeftMobile}>
                <button
                    className={style.MenuToggle}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? <RiCloseLine /> : <RiMenu4Line />}
                </button>
                <div className={style.Breadcrumbs}>
                    {text1} / <span>{text2}</span>
                </div>
            </div>

            <div className={style.HeaderActions}>
                <div className={style.SearchBar}>
                    <RiSearchLine />
                    <input
                        type="text"
                        placeholder="Pesquisar..."
                        onChange={(e) => onSearch && onSearch(e.target.value)}
                    />
                </div>
                <div className={style.ActionIcons}>
                    <button className={style.IconButton} onClick={toggleTheme} title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}>
                        {isDarkMode ? <RiSunLine /> : <RiMoonLine />}
                    </button>

                    <div className={style.NotificationWrapper} ref={notificationRef}>
                        <button
                            className={`${style.IconButton} ${showNotifications ? style.Active : ''}`}
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <RiNotification3Line />
                            <span className={style.Badge}></span>
                        </button>

                        {showNotifications && (
                            <div className={style.NotificationDropdown}>
                                <div className={style.DropdownHeader}>
                                    <h3>Notificações</h3>
                                    <span>Marcar como lidas</span>
                                </div>
                                <div className={style.NotificationList}>
                                    {notifications.map(notif => (
                                        <div key={notif.id} className={style.NotificationItem}>
                                            <div className={`${style.NotifIcon} ${style[notif.type]}`}>
                                                {notif.type === 'success' ? <RiCheckLine /> : <RiErrorWarningLine />}
                                            </div>
                                            <div className={style.NotifContent}>
                                                <h4>{notif.title}</h4>
                                                <p>{notif.description}</p>
                                                <span className={style.NotifTime}>{notif.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={style.DropdownFooter}>
                                    Ver todas as notificações
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className={style.ProfileWrapper} ref={profileRef}>
                    <div
                        className={`${style.UserProfileHeader} ${showProfileDropdown ? style.Active : ''}`}
                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    >
                        <div className={style.AvatarSmall}>
                            {user?.img_path ? (
                                <img src={user.img_path} alt="Avatar" className={style.AvatarImage} />
                            ) : (
                                getInitials(user?.nome)
                            )}
                        </div>
                        <div className={style.InfoSmall}>
                            <h4>{user?.nome || 'Usuário'}</h4>
                            <span>{userRoleDisplay[user?.tipo] || 'Membro'}</span>
                        </div>
                    </div>

                    {showProfileDropdown && (
                        <div className={style.ProfileDropdown}>
                            <div className={style.ProfileHeader}>
                                <div className={style.AvatarLarge}>
                                    {user?.img_path ? (
                                        <img src={user.img_path} alt="Avatar" className={style.AvatarImageLarge} />
                                    ) : (
                                        getInitials(user?.nome)
                                    )}
                                </div>
                                <div className={style.ProfileInfo}>
                                    <h4>{user?.nome || 'Usuário'}</h4>
                                    <span>{user?.email || 'email@exemplo.com'}</span>
                                </div>
                            </div>
                            <div className={style.ProfileMenu}>
                                <Link to="/profile" className={style.MenuItem} onClick={() => setShowProfileDropdown(false)}>
                                    <RiUserLine />
                                    <span>Meu Perfil</span>
                                </Link>
                                <button className={style.MenuItem}>
                                    <RiSettings4Line />
                                    <span>Configurações</span>
                                </button>
                                <hr className={style.Divider} />
                                <button className={`${style.MenuItem} ${style.Logout}`} onClick={handleLogout}>
                                    <RiLogoutBoxRLine />
                                    <span>Sair da Conta</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
