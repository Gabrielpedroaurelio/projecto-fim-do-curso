import {MdClose } from 'react-icons/md'
import { FaUser } from 'react-icons/fa6'
import favicon from '../../../assets/images/favicon.ico'
import { BsHouse,BsFolder, BsMenuButton } from 'react-icons/bs'
import { CiLogin } from 'react-icons/ci' 
import {CgMenuRight} from 'react-icons/cg'
import styles from './MenuSitePublic.module.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'
 

export default function MenuSitePublic() {
    const usuarioLogado = false
    const [toggleMenu, setToggleMenu] = useState(false)
   

    return (
        <header className={`${styles.headerMenu} ${toggleMenu ? styles.menuExpandir : ''}`}>
            <div className={styles.logo}>
                <div className={styles.img}>
                    <img src={favicon} alt="Logo" />
                </div>
                <div className={styles.TitleSchool}>
                    <h1>INSTITUTO POLITÉCNICO <br /> DO MAIOMBE</h1>
                </div>
            </div>

            <div className={styles.menu}>
                <div className={styles.btnMenu} onClick={() => setToggleMenu(!toggleMenu)}>
                    <CgMenuRight size={32} />
                </div>

                <nav className={styles.nav}>
                    <span className={styles.btnClose} onClick={() => setToggleMenu(!toggleMenu)}>
                        <MdClose size={32}/>
                    </span>
                    <Link to="/public/site" className={styles.navLink}>
                        <BsHouse size={20} />
                        <span>HOME</span>
                    </Link>

                    <Link to="/public/library" className={styles.navLink}>
                        <BsFolder size={20} />
                        <span>BIBLIOTECA</span>
                    </Link>

                    {usuarioLogado ? (
                        <Link to="#" className={styles.navLink}>
                            <FaUser size={20} />
                            <span>MINHA CONTA</span>
                        </Link>
                    ) : (
                        <Link to="/public/auth" className={styles.navLink}>
                            <CiLogin size={20} />
                            <span>LOGIN</span>
                        </Link>
                    )}

                </nav>
            </div>
        </header>
    )
}