import Cards from "../../../Components/Elements/Cards/Cards";
import Header from "../../../Components/Elements/Header/Header";
import MenuNavBarAdmin from "../../../Components/Utils/MenuNavBarAdmin/MenuNavBarAdmin";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import style from './Dashboards.module.css'
/* 
Importação dos icons */
import { FaUserTie, FaUserGraduate, FaUserGroup, FaRegMoneyBill1, FaFile } from 'react-icons/fa6'
import { AiOutlineFilePdf, AiOutlineFileExcel, AiOutlineFileWord } from 'react-icons/ai'
import { MdRequestPage } from 'react-icons/md'
const performanceData = [
    { subject: 'Vendas', A: 120, fullMark: 150 },
    { subject: 'Campanha', A: 98, fullMark: 150 },
    { subject: 'Referral', A: 86, fullMark: 150 },
    { subject: 'Satisfação', A: 99, fullMark: 150 },
    { subject: 'Retenção', A: 85, fullMark: 150 },
    { subject: 'Novos', A: 65, fullMark: 150 },
];
const revenueData = [
    { name: 'Jan', value: 4000 },
    { name: 'Fev', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Abr', value: 2780 },
    { name: 'Mai', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
    { name: 'Ago', value: 4000 },
    { name: 'Set', value: 3000 },
    { name: 'Out', value: 4500 },
    { name: 'Nov', value: 3800 },
    { name: 'Dez', value: 4200 },
];

export default function Dashboards() {
    return (
        < >

            <MenuNavBarAdmin />
            <main className={style.Container} >
                <Header titlepage={"Gerenciamento Certificado!"} />
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
                        <div className={"h-[300px]"}>
                              <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Kz ${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ fill: '#ffffff05' }}
                                />
                                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                    <div className={style.CardChart}>
                        <h3>Desempenho Operacional</h3>
                        <div className={"h-[300px]"}>
                                <ResponsiveContainer width="100%" height="100%">
                            <RadarChart outerRadius={90} data={performanceData}>
                                <PolarGrid stroke="#ffffff20" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="transparent" />
                                <Radar
                                    name="Performance"
                                    dataKey="A"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    fill="#8b5cf6"
                                    fillOpacity={0.3}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className={style.ContainerActivityRecents}>
                    <h2>Atividades Recentes</h2>
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
                                <span className={style.statusConcluido}>Concluido</span>
                                <span>2025-12-09</span>
                                <span>2.000,00 Kz</span>
                            </div>
                            <div>
                                <span>Helena Da Cruz</span>
                                <span>Declaração da 10º Classe</span>
                                <span className={style.statusPendente}>Pendente</span>
                                <span>2025-12-12</span>
                                <span>4.000,00 Kz</span>
                            </div>
                            <div>
                                <span>Shelcia Domingos</span>
                                <span>Certificado de Conclusão</span>
                                <span className={style.statusConcluido}>Concluido</span>
                                <span>2025-12-09</span>
                                <span>8.000,00 Kz</span>
                            </div>
                            <div>
                                <span>Raul</span>
                                <span>Boletim do III Trimeste</span>
                                <span className={style.statusConcluido}>Concluido</span>
                                <span>2025-12-09</span>
                                <span>500,00 Kz</span>
                            </div>
                            <div>
                                <span>Gabriel Pedro</span>
                                <span>Declaração de Matricula</span>
                                <span className={style.statusConcluido}>Concluido</span>
                                <span>2025-12-09</span>
                                <span>2.000,00 Kz</span>
                            </div>
                            <div>
                                <span>Helena Da Cruz</span>
                                <span>Declaração da 10º Classe</span>
                                <span className={style.statusPendente}>Pendente</span>
                                <span>2025-12-12</span>
                                <span>4.000,00 Kz</span>
                            </div>
                            <div>
                                <span>Shelcia Domingos</span>
                                <span>Certificado de Conclusão</span>
                                <span className={style.statusConcluido}>Concluido</span>
                                <span>2025-12-09</span>
                                <span>8.000,00 Kz</span>
                            </div>
                            <div>
                                <span>Raul</span>
                                <span>Boletim do III Trimeste</span>
                                <span className={style.statusConcluido}>Concluido</span>
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
