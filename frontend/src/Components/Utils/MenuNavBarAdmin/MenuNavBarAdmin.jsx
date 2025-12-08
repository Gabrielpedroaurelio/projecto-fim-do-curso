import { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom'
import favicon from '../../../assets/images/favicon.ico'
import style from './MenuNavBarAdmin.module.css'
import BoxMessage from '../BoxMessage/BoxMessage';

import { BiDockLeft, BiDockRight, BiHistory, BiLogIn, BiLogOut, BiHomeAlt2 } from 'react-icons/bi';
import { BsFolder, BsFolder2Open, BsHouse, BsLayoutSidebar, BsPeople } from 'react-icons/bs'
import { CiSettings, CiFileOn, CiLogout } from 'react-icons/ci'
import { DiAtom } from 'react-icons/di'
import { FaFile, FaCodePullRequest } from 'react-icons/fa6';

export default function MenuNavBarAdmin() {
    const [toggleMenuNavBar, settoggleMenuNavBar] = useState(false)
    const [toggleBoxMessage, settoggleBoxMessage] = useState(false)
  
    return (
        <>
        {
            toggleBoxMessage&&(
                <BoxMessage msm={"Tem Certeza Que Deseja Sair"} setController={settoggleBoxMessage}/>
            )
        }
            <div className={style.containerMenu+ ` ${toggleMenuNavBar?style.extends:style.shinks}`}>
                <div className={style.header}>
                    <div className={style.favicon}>
                        <img src={favicon} alt="" width={40} />
                        <span className={style.title_favicon}>IPM</span>
                    </div>
                    <div className={style.BtnToggleMenu}>
                        <button onClick={()=>settoggleMenuNavBar(!toggleMenuNavBar)}>
                            <BiDockLeft size={25}/>
                        </button>
                    </div>
                </div>
                <div className={style.menu}>
                    <h4>Menu</h4>
                    <nav>
                        <Link to={'/admin/dashboards'}>
                            <span className={style.icon}>
                                <BsHouse />
                         
                            </span>
                            <span className={style.txt}>Dashboards</span>
                        </Link>
                        <Link to={''}>
                            <span className={style.icon}>
                                <CiFileOn/>
                            </span>
                            <span className={style.txt}>Solicitações</span>
                        </Link>
                        <Link to={''}>
                            <span className={style.icon}>
                                <DiAtom />
                            </span>
                            <span className={style.txt}>Yasmin</span>
                        </Link>
                        <Link to={'/admin/documents'}>
                            <span className={style.icon}>
                                <BsFolder />
                            </span>
                            <span className={style.txt}>Documentos</span>
                        </Link>
                        <Link to={''}>
                            <span className={style.icon}>
                                <BsPeople />
                            </span>
                            <span className={style.txt}>Usuarios</span>
                        </Link>
                        <Link to={''}>
                            <span className={style.icon}>
                                <BiHistory />
                            </span>
                            <span className={style.txt}>Histórico</span>
                        </Link>
                        <Link to={''}>
                            <span className={style.icon}>
                                <CiSettings />
                            </span>
                            <span className={style.txt}>Definições</span>
                        </Link>

                    </nav>
                </div>
                <div className={style.usercontroller}>
                    <div>
                        <img src={favicon} alt="" width={30} />
                    </div>
                    <div>
                        <strong>Gabriel Pedro Aurélio</strong>
                        <span>gabrielpedroaurelio@gmail</span>
                    </div>
                </div>
                <div className={style.menu}>
                  <nav>
                      <Link to={''} onClick={()=>settoggleBoxMessage((prev)=>prev=!prev)}>
                        <span className={style.icon}>
                            <CiLogout/>
                        </span>
                        <span className={style.txt}>Sair</span>
                    </Link>
                  </nav>
                </div>
            </div>

        </>
    )
}