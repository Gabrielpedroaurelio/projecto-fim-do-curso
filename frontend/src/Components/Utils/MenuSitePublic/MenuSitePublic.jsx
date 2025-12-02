import { MdMenu, MdHome, MdSchool, MdLogin } from 'react-icons/md'
import { FaUser } from 'react-icons/fa6'
import favicon from '../../../assets/images/favicon.ico'
import styles from './MenuSitePublic.module.css'
import { Link } from 'react-router-dom'
export default function MenuSitePublic() {
    const usuarioLogado = true// so para teste
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
                    <div className={styles.btn}></div>
                    <nav>
                        <a href="">
                            <span><MdHome/></span>
                            <span className={styles.text}>HOME</span>
                        </a>
                        <a href="">
                            <span><MdSchool/></span>
                            <span className={styles.text}>BIBLIOTECA</span>
                        </a>
                        {
                        usuarioLogado?(
                       <a href="">
                            <span><FaUser/></span>
                            <span className={styles.text}>MINHA CONTA</span>
                        </a>
                        ):(
                        <a href="">
                            <span><MdLogin/></span>
                            <span className={styles.text}>LOGIN</span>
                        </a>
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