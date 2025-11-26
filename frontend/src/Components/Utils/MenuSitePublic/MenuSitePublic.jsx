import { MdMenu, MdHome, MdSchool, MdLogin } from 'react-icons/md'
import { FaUser} from 'react-icons/fa6'
import favicon from '../../../assets/images/favicon.ico'
import styles from './MenuSitePublic.module.css'
import { Link } from 'react-router-dom'
export default function MenuSitePublic() {
    const usuarioLogado=false// so para teste
    return (
        <>
            <header className={styles.headerMenu}>
                <div className={styles.logo}>
                    <img src={favicon} alt="" width={40} />
                </div>
                <div className={styles.menu}>
                   
                    <nav>
                        <span className={styles.linkNormal}>
                            <Link to="/public/site" >
                                <MdHome size={20} />
                                <span>Home</span>
                            </Link>
                        </span>
                        <span className={styles.linkNormal}>
                            <Link to="/public/library" >
                                <MdSchool size={20} />
                                <span>Biblioteca</span>
                            </Link>
                        </span>
                      
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
                      

                    </nav>
                </div>
            </header>


        </>
    )
}