import { MdMenu, MdHome, MdSchool, MdLogin } from 'react-icons/md'
import { FaUser,FaHouse, FaBook,  FaArrowRightToBracket } from 'react-icons/fa6'

import favicon from '../../../assets/images/favicon.ico'
import styles from './MenuSitePublic.module.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'
export default function MenuSitePublic() {
    const usuarioLogado = false// so para teste
    const [toggleMenu,setToggleMenu]=useState(false)
    return (
        <>
            <header className={styles.headerMenu}>
                <div className={styles.logo}>
                    <div className={styles.img}>
                        <img src={favicon} alt="" width={30} />
                    </div>
              
                    <div className={styles.TitleSchool}>
                        <h1>INSTITUTO POLITÉCNICO <br /> DO MAIOMBE</h1>
                    </div>
                </div>
                <div className={styles.menu}>
                    <div className={styles.btnMenu}> <MdMenu size={40} onClick={()=>setToggleMenu(!toggleMenu)}/></div>
                    <nav className={` ${toggleMenu?styles.menuExpandir:styles.menuEncolher}`}>
                        <Link to="/">
                            <span><FaHouse size={20}/></span>
                            <span className={styles.text}>HOME</span>
                        </Link>
                        <Link to="/public/library">
                            <span><FaBook size={20}/></span>
                            <span className={styles.text}>BIBLIOTECA</span>
                        </Link>
                        {
                        usuarioLogado?(
                       <Link to="">
                            <span><FaUser size={20}/></span>
                            <span className={styles.text}>MINHA CONTA</span>
                        </Link>
                        ):(
                        <Link to="">
                            <span><FaArrowRightToBracket size={20}/></span>
                            <span className={styles.text}>LOGIN</span>
                        </Link>
                        )
                      }
                    </nav>
                </div>
            </header>



        </>
    )
}



/*
 {
                        usuarioLogado?(
                              <span>

                            <Link to="/client/student">
                                <FaUser size={20} />
                                <span>Minha Conta</span>
                            </Link>
                        </span>
                        ):(
                              <span>

                            <Link to="/public/auth">
                                <MdLogin size={20} />
                                <span>Entrar</span>
                            </Link>
                        </span>
                        )
                      }
                      


*/