import Cards from "../../../Components/Elements/Cards/Cards";
import Header from "../../../Components/Elements/Header/Header";
import MenuNavBarAdmin from "../../../Components/Utils/MenuNavBarAdmin/MenuNavBarAdmin";

import style from './Dashboards.module.css'
/* 
Importação dos icons */
import { FaUserTie, FaUserGraduate, FaUserGroup, FaRegMoneyBill1, FaFile } from 'react-icons/fa6'
import { AiOutlineFilePdf, AiOutlineFileExcel, AiOutlineFileWord } from 'react-icons/ai'
import { MdRequestPage } from 'react-icons/md'
const datas = {
    title: '',
    resume: '',
    currently: {
        data_resume: '',
        linkToResume: '',

    },

}
export default function Dashboards() {
    return (
        < >

            <MenuNavBarAdmin />
            <main className={style.Container} >
                <Header titlepage={"Dashbords"} />
                <div className={style.ContainerContent}>
                    <div className={style.Content}>
                        <h2>Gerenciamento Certificado!</h2>
                        <span>Informações gerais do sistema</span>
                    </div>
                    <div className={style.cardExportData}>
                        <span>Exportar como</span>
                        <div>
                            <button><AiOutlineFilePdf size={20} /> PDF</button>
                            <button><AiOutlineFileWord size={20} /> Word</button>
                            <button><AiOutlineFileExcel size={20} />Excel</button>
                        </div>
                    </div>
                </div>
                <div className={style.Cards}>
                    <Cards datas={{
                        title: 'Declarações Solicitadas',
                        resume: 8.456,
                        currently: {
                            data_resume: '+83 550',
                            linkToResume: 'linktopages',

                        },

                    }} />
                    <Cards datas={{
                        title: 'Declarações Entregues',
                        resume: 8.456,
                        currently: {
                            data_resume: 83550,
                            linkToResume: 'linktopages',

                        },

                    }} />
                    <Cards datas={{
                        title: 'Novas Solicitações',
                        resume: 8.456,
                        currently: {
                            data_resume: 83550,
                            linkToResume: 'linktopages',

                        },

                    }} />
                    <Cards datas={{
                        title: 'Receita Total do Ano',
                        resume: 8.456,
                        currently: {
                            data_resume: 83550,
                            linkToResume: 'linktopages',

                        },

                    }} />

                </div>
                <div className={style.Charts}>
                    <div className={style.CardChart}>
                        <h3>Arrecadação Mensal com Declarações</h3>
                        <h2>189.400,00Kz</h2>
                        <div className={style.chart}></div>
                    </div>
                    <div className={style.CardChart}>
                        <h3>Desempenho Operacional</h3>
                        <div className={style.chart}></div>
                    </div>
                </div>
                <div className={style.ContainerActivityRecents}>
                    <h2>Actividades Recentes</h2>
                    <div className={style.tableactividade}>
                        <div className={style.header}>
                            <span>Usuário</span>
                            <span>Tipo de Documento</span>
                            <span>Status</span>
                            <span>Data de Solicitação</span>
                            <span>Valor Pago</span>
                        </div>
                        <div className={style.bodytable}>
                            <div>
                                <span>Gabriel Pedro</span>
                                <span>Declaração de Matricula</span>
                                <span>Concluido</span>
                                <span>2025-12-09</span>
                                <span>2.000,00 Kz</span>
                            </div>
                            <div>
                                <span>Helena Da Cruz</span>
                                <span>Declaração da 10º Classe</span>
                                <span>Pendente</span>
                                <span>2025-12-12</span>
                                <span>4.000,00 Kz</span>
                            </div>
                            <div>
                                <span>Shelcia Domingos</span>
                                <span>Certificado de Conclusão</span>
                                <span>Concluido</span>
                                <span>2025-12-09</span>
                                <span>8.000,00 Kz</span>
                            </div>
                            <div>
                                <span>Raul</span>
                                <span>Boletim do III Trimeste</span>
                                <span>Concluido</span>
                                <span>2025-12-09</span>
                                <span>500,00 Kz</span>
                            </div>
                            <div>
                                <span>Gabriel Pedro</span>
                                <span>Declaração de Matricula</span>
                                <span>Concluido</span>
                                <span>2025-12-09</span>
                                <span>2.000,00 Kz</span>
                            </div>
                            <div>
                                <span>Helena Da Cruz</span>
                                <span>Declaração da 10º Classe</span>
                                <span>Pendente</span>
                                <span>2025-12-12</span>
                                <span>4.000,00 Kz</span>
                            </div>
                            <div>
                                <span>Shelcia Domingos</span>
                                <span>Certificado de Conclusão</span>
                                <span>Concluido</span>
                                <span>2025-12-09</span>
                                <span>8.000,00 Kz</span>
                            </div>
                            <div>
                                <span>Raul</span>
                                <span>Boletim do III Trimeste</span>
                                <span>Concluido</span>
                                <span>2025-12-09</span>
                                <span>500,00 Kz</span>
                            </div>

                        </div>
                    </div>

                </div>
            </main>



        </>
    )
}
