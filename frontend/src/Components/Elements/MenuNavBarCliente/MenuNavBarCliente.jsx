import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'
import favicon from '../../../assets/images/favicon.ico'
import style from './MenuNavBarCliente.module.css'
import BoxMessage from '../../Utils/BoxMessage/BoxMessage';

import { BiDockLeft } from 'react-icons/bi';
import { BsDownload, BsFileEarmarkText, BsFolder, BsHouse, BsPeople, BsChatDots } from 'react-icons/bs'
import { CiFileOn, CiLogout } from 'react-icons/ci'
import { DiAtom } from 'react-icons/di'
import { RiLineChartLine, RiCalendar2Line, RiUserFollowLine, RiHistoryLine } from 'react-icons/ri';

export default function MenuNavBarCliente({ user }) {
    const [toggleMenuNavBar, settoggleMenuNavBar] = useState(false)
    const [toggleBoxMessage, settoggleBoxMessage] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const location = useLocation()

    const isActive = (path) => location.pathname === path ? style.active : ''

    const studentLinks = [
        { to: '/student/dashboard', icon: <BsHouse />, label: 'Dashboards' },
        { to: '/student/grades', icon: <RiLineChartLine />, label: 'Minhas Notas' },
        { to: '/student/schedule', icon: <RiCalendar2Line />, label: 'Horários' },
        { to: '/student/attendance', icon: <RiUserFollowLine />, label: 'Presenças' },
        { to: '/student/ask', icon: <CiFileOn />, label: 'Solicitações' },
        { to: '/student/document', icon: <BsFolder />, label: 'Documentos' },
        { to: '/student/yasmin', icon: <DiAtom />, label: 'Yasmin' },
    ]

    const parentLinks = [
        { to: '/parent/dashboard', icon: <BsHouse />, label: 'Dashboard' },
        { to: '/parent/children', icon: <BsPeople />, label: 'Meus Educandos' },
        { to: '/parent/ask', icon: <BsFileEarmarkText />, label: 'Solicitações' },
        { to: '/parent/document', icon: <BsDownload />, label: 'Documentos' },
        { to: '/parent/yasmin', icon: <BsChatDots />, label: 'Yasmin AI' },
    ];

    const links = user === 'student' ? studentLinks : parentLinks

    return (
        <>
            {toggleBoxMessage && (
                <BoxMessage msm={"Tem Certeza Que Deseja Sair"} setController={settoggleBoxMessage} />
            )}

            <button className={style.mobileToggle} onClick={() => setMobileOpen(!mobileOpen)}>
                <BiDockLeft />
            </button>

            <div className={`${style.containerMenu} ${toggleMenuNavBar ? style.extends : style.shinks} ${mobileOpen ? style.mobileOpen : ''}`}>
                <div className={style.header}>
                    <div className={style.favicon}>
                        <img src={favicon} alt="Logo" />
                        <span className={style.title_favicon}>IPM</span>
                    </div>
                    <div className={style.BtnToggleMenu}>
                        <button onClick={() => settoggleMenuNavBar(!toggleMenuNavBar)}>
                            <BiDockLeft size={25} />
                        </button>
                    </div>
                </div>

                <div className={style.menu}>
                    <h4>{user === 'student' ? 'ESTUDANTE' : 'ENCARREGADO'}</h4>
                    <nav>
                        {links.map((link) => (
                            <Link key={link.to} to={link.to} className={isActive(link.to)}>
                                <span className={style.icon}>{link.icon}</span>
                                <span className={style.txt}>{link.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className={style.usercontroller}>
                    <div>
                        <img src={favicon} alt="Avatar" width={30} />
                    </div>
                    <div>
                        <strong>Gabriel Pedro Aurélio</strong>
                        <span>gabrielpedroaurelio@gmail</span>
                    </div>
                </div>

                <div className={style.menu}>
                    <nav>
                        <Link to={'#'} onClick={(e) => { e.preventDefault(); settoggleBoxMessage(true) }}>
                            <span className={style.icon}>
                                <CiLogout />
                            </span>
                            <span className={style.txt}>Sair</span>
                        </Link>
                    </nav>
                </div>
            </div>
        </>
    )
}
