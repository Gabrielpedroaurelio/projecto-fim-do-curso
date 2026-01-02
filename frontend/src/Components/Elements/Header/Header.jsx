import { useState, useEffect } from 'react'
import {
    FaUserGraduate,
    FaFileInvoice,
    FaSpinner,
    FaCircleCheck,
    FaMagnifyingGlass,
    FaBell,
    FaRegMoon,
    FaSun,
    FaGear
} from 'react-icons/fa6';
import { BiSolidDashboard } from "react-icons/bi";
import { BsBoxSeam, BsCart3 } from "react-icons/bs";
import { FiMessageSquare, FiTrendingUp } from "react-icons/fi";
import { RiBillLine } from "react-icons/ri";

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
            <div className={style.Breadcrumbs}>
                {text1} / <span>{text2}</span>
            </div>

            <div className={style.HeaderActions}>
                <div className={style.SearchBar}>
                    <FaMagnifyingGlass />
                    <input type="text" placeholder="Pesquisar..." />
                </div>
                <div className={style.ActionIcons}>
                    <button className={style.IconButton} onClick={toggleTheme} title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}>
                        {isDarkMode ? <FaSun /> : <FaRegMoon />}
                    </button>
                    <button className={style.IconButton}><FaBell /></button>
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