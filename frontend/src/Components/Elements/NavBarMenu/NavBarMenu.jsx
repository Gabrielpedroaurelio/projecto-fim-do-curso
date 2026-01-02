
import style from './NavBarMenu.module.css'
import {
    FaUserGraduate,
    FaAtom,

    FaFile,
} from 'react-icons/fa6';
import { Link } from 'react-router-dom'
import { BsCart3, BsFolder, BsHouse, BsPeople } from "react-icons/bs";
import { FiTrendingUp } from "react-icons/fi";
import { RiBillLine } from "react-icons/ri";
import { CiFileOn, CiSettings } from 'react-icons/ci';

export default function NavBarMenu() {


    return (
        <>
            <aside className={style.Sidebar}>
                <div className={style.Logo}>
                    <div className={style.LogoIcon}><FaAtom /></div>
                    <h2>Gestão Escolar</h2>
                </div>

                <div className={style.MenuSection}>
                    <h3>Menu</h3>
                    <ul>
                        <li className={style.Active}>
                            <Link to={"/admin/dashboard"}>
                                <BsHouse />
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={"/admin/ask"}>
                                <BsCart3 />
                                <span>Solicitações</span>
                                <span className={style.Badge}>435</span>
                            </Link>
                        </li>
                        <li>
                            <Link>
                                <BsFolder />
                                <span>Biblioteca</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={"/agent/yasmin"}>
                                <FiTrendingUp />
                                <span>Yasmin</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/admin/funcionario'}>
                                <span className={style.icon}>
                                    <BsPeople />
                                </span>
                                <span className={style.txt}>Funcionarios</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/admin/parent'}>
                                <span className={style.icon}>
                                    <BsPeople />
                                </span>
                                <span className={style.txt}>Encarregados</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={"/admin/student"}>
                                <FaUserGraduate />
                                <span>Alunos</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className={style.MenuSection}>
                    <h3>Documentos</h3>
                    <ul>
                        <li>
                            <Link to={"/admin/declaracao"}>
                                <FaFile /> Declarações
                            </Link>
                        </li>
                        <li>
                            <Link to={"/admin/boletim"}>
                                <CiFileOn /> Boletins
                            </Link>
                        </li>
                        <li>
                            <Link to={"/admin/certificado"}>
                                <RiBillLine /> Certificados
                            </Link>
                        </li>


                    </ul>
                </div>

                <div className={style.MenuSection}>
                    <ul>
                        <li>
                            <Link to={"/admin/setting"}>
                                <CiSettings /> Configurações
                            </Link>
                        </li>

                    </ul >
                </div >
                <div className={style.UserProfileMini}>
                    <div className={style.Avatar}>GP</div>
                    <div className={style.Info}>
                        <h4>Gabriel Pedro</h4>
                        <span>admin@escola.com</span>
                    </div>
                </div>
            </aside >


        </>
    )
}