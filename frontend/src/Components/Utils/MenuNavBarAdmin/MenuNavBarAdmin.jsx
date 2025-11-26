import { useReducer, useState } from 'react';
import { Link } from 'react-router-dom'
import favicon from '../../../assets/images/favicon.ico'
import style from './MenuNavBarAdmin.module.css'
import BoxMessage from '../BoxMessage/BoxMessage';
import { MdChevronRight, MdChevronLeft, MdSettings, MdHistory, MdLogout, MdOutlineRequestPage, MdOutlineDescription, MdOutlineGroup, MdOutlineChatBubbleOutline, MdOutlineInsertChartOutlined } from "react-icons/md";
export default function MenuNavBarAdmin() {
    const [toggleMenuNavBar, settoggleMenuNavBar] = useState(false)
    const [toggleBoxMessage, settoggleBoxMessage] = useState(false)
    
    return (
        <>
        {
            toggleBoxMessage&&(

                <BoxMessage msm={'Tem certeza que deseja sair?'} setController={settoggleBoxMessage}/>
            )
        }
            <div className={style.NavMenu + ` ${toggleMenuNavBar ? style.NavMenuExtends : ''}`}>
                <div className={style.headerNavMenu}>
                    <div className={style.faviconInstitute}>
                        <div className={style.img}>
                            <img src={favicon} alt="" width={40} />
                        </div>
                    </div>
                    <div className={style.btnExtends}>
                        <button onClick={() => settoggleMenuNavBar((prev) => prev = !toggleMenuNavBar)}>
                            {
                                toggleMenuNavBar ? (
                                    <MdChevronLeft size={25} />
                                ) : (
                                    <MdChevronRight size={25} />
                                )
                            }
                        </button>
                    </div>
                </div>
                <span className={style.separatorMenu}>Main</span>

                <div className={style.bodyNavMenu}>
                    <Link to="">
                        <MdOutlineInsertChartOutlined size={20} />
                        <span className={style.text}>Dashboards</span>
                    </Link>
                    <Link to="">
                        <MdOutlineGroup size={20} />
                        <span className={style.text}>Usuarios</span>
                    </Link>
                    <Link to="">
                        <MdOutlineRequestPage size={20} />
                        <span className={style.text}>Solicitações</span>
                    </Link>
                    <Link to="">
                        <MdOutlineChatBubbleOutline size={20} />
                        <span className={style.text}>Yasmin</span>
                    </Link>
                    <Link to="">
                        <MdOutlineDescription size={20} />
                        <span className={style.text}>Documentos</span>
                    </Link>
                    <Link to="">
                        <MdHistory size={20} />
                        <span className={style.text}>Históricos</span>
                    </Link>
                    <Link to="">
                        <MdSettings size={20} />
                        <span className={style.text}>Definições</span>
                    </Link>

                </div>
                <div className={style.footerNavMenu}>
                    <Link to="">
                        <div className={style.img}>
                            <img src={favicon} alt="" width={30} />
                        </div>
                        <div className={style.datasUserLogined}>
                            <span>Gabriel Pedro Aurelio</span>
                            <span>gabrielpedroaurelio@gmail.com</span>
                        </div>
                    </Link>
                    <Link  onClick={()=>settoggleBoxMessage((prev)=>prev=!prev)}>
                        <MdLogout />
                        <span className={style.text}>Sair</span>
                    </Link>
                </div>
            </div>


        </>
    )
}