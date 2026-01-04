import { useState, useEffect } from 'react'
import {
    RiSearchLine,
    RiNotification3Line,
    RiSunLine,
    RiMoonLine,
    RiMenu4Line,
    RiCloseLine
} from "react-icons/ri";

import style from './Header.module.css'

export default function Header({ text1, text2 }) {
    const [isDarkMode, setIsDarkMode] = useState(false)

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

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // Sync body class with sidebar state
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.classList.add('sidebar-open')
        } else {
            document.body.classList.remove('sidebar-open')
        }
    }, [isSidebarOpen])

    // Toggle theme function
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
                    <input type="text" placeholder="Pesquisar..." />
                </div>
                <div className={style.ActionIcons}>
                    <button className={style.IconButton} onClick={toggleTheme} title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}>
                        {isDarkMode ? <RiSunLine /> : <RiMoonLine />}
                    </button>
                    <button className={style.IconButton}><RiNotification3Line /></button>
                </div>
                <div className={style.UserProfileHeader}>
                    <div className={style.AvatarSmall}>GP</div>
                    <div className={style.InfoSmall}>
                        <h4>Gabriel Pedro</h4>
                        <span>Admin</span>
                    </div>
                </div>
            </div>
        </header>
    )
}