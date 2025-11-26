import MenuNavBarAdmin from "../../../Components/Utils/MenuNavBarAdmin/MenuNavBarAdmin";
import SearchBarAdmin from "../../../Components/Utils/SearchBarAdmin/SearchBarAdmin";
import style from './Dashboards.module.css'
/*
Importação dos icons */
import {FaUserTie,FaUserGraduate,FaUserGroup,FaRegMoneyBill1, FaFile} from 'react-icons/fa6'
import {MdRequestPage} from 'react-icons/md'
export default function Dashboards() {
    return (
        < >
   
            <MenuNavBarAdmin />
                <SearchBarAdmin/>
            <main className={style.ContainerGeneral}>
            <h1>Dashboards Administrador</h1>
            <small>Olá! Gabriel Pedro Aurelio</small>
             
                <div className={style.cardsResumes}>
                    <div className={style.cardResume}>
                        <div className={style.content}>
                            <span>Estudantes</span>
                            <h3>2343</h3>
                        </div>
                        <div className={style.icon}>
                            <FaUserGraduate size={40}/>
                        </div>
                    </div>
                    <div className={style.cardResume}>
                        <div className={style.content}>
                            <span>Solicitações</span>
                            <h3>2347</h3>
                        </div>
                        <div className={style.icon}>
                            <MdRequestPage size={40}/>
                        </div>
                    </div>
                    <div className={style.cardResume}>
                        <div className={style.content}>
                            <span>Encarregados</span>
                            <h3>54</h3>
                        </div>
                        <div className={style.icon}>
                            <FaUserGroup size={40}/>
                        </div>
                    </div>
                    <div className={style.cardResume}>
                        <div className={style.content}>
                            <span>Declarações</span>
                            <h3>873</h3>
                        </div>
                        <div className={style.icon}>
                            <FaFile size={40}/>
                        </div>
                    </div>
                </div>
                <div className="CardCharts"></div>
            </main>


        </>
    )
} 