import style from './Dashboards.module.css'
import '../../../assets/style/global.style.css'
import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import Header from '../../../Components/Elements/Header/Header'
import Cards from '../../../Components/Elements/Cards/Cards'
import { FaCircleCheck, FaFileInvoice, FaMagnifyingGlass, FaUserGraduate } from 'react-icons/fa6'
import { RiBillLine } from 'react-icons/ri'

// IMPORTAÇ~OES PARA OS GRAFICOS

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

/*
DADOS FICTICIOS PARA OS GRAFICOS
*/

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
const activities_recently = [
    {
        id: 1,
        Nome: "Gabriel Aurelio",
        Curso: "Informatica de Gestão",
        Descrição: "Solicitação",
        TIPO: "Declaração",
        Data: "2026-01-05",
        Status: "Concluido",

    },
    {
        id: 2,
        Nome: "Aguinaldo Arnaldo",
        Curso: "Informatica de Gestao",
        Descrição: "Solicitação",
        TIPO: "Declaração",
        Data: "2026-01-05",
        Status: "Concluid",

    },
    {
        id: 3,
        Nome: "Leonel Antonio",
        Curso: "Informatica",
        Descrição: "Solicitação",
        TIPO: "Declaração",
        Data: "2026-01-05",
        Status: "Concluido",

    },
    {
        id: 4,
        Nome: "Ernesto Buka",
        Curso: "Informatica",
        Descrição: "Solicitação",
        TIPO: "Declaração",
        Data: "2026-01-05",
        Status: "Concluido",

    },
]
// FIM DOS DADOS PARA O GRAFICO
export default function Dashboards() {
    return (
        <div className={'ContainerGeneral'}>
            <NavBarMenu />
            <main className={'ContainerMain'}>
                <Header text1={"Resumo"} text2={"Dashboard"} />
                <div className={style.GridCards}>
                    <Cards icon={<FaFileInvoice />} title={"Total Solicitações"} value={"8,456"} value_percentual={22.2} />
                    <Cards icon={<FaCircleCheck />} value_percentual={"104.5"} title={"Declarações Emitidas"} value={"4,450"} />
                    <Cards icon={<FaUserGraduate />} title={"Novos Alunos"} value_percentual={12.3} value={"34,567"} />
                    <Cards icon={<RiBillLine />} title={"Receita Total"} value={"Kz 80,768"} value_percentual={14.8} />
                </div>
                <div className={style.ChartsRow}>
                    <div className={style.RevenueChart}>
                        <div className={style.ChartHeader}>
                            <div>
                                <h3>Crescimento da Receita</h3>
                                <h2>Kz 189,400.00</h2>
                            </div>
                            <div className={style.DateTabs}>
                                <button className={style.Active}>Semanal</button>
                                <button>Mensal</button>
                                <button>Anual</button>
                            </div>
                        </div>
                        <div className="h-[150px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val) => `${val / 1000}k`} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        fill="url(#colorRevenue)"
                                        radius={[4, 4, 0, 0]}
                                        barSize={20}
                                        animationDuration={1500}
                                    />
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#0ea5e9" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.6} />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className={style.PerformanceChart}>
                        <div className={style.ChartHeader}>
                            <h3>Desempenho Operacional</h3>
                        </div>
                        <div className="h-[150px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart outerRadius={60} data={performanceData}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="transparent" />
                                    <Radar
                                        name="Desempenho"
                                        dataKey="A"
                                        stroke="#0ea5e9"
                                        strokeWidth={2}
                                        fill="#0ea5e9"
                                        fillOpacity={0.2}
                                    />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className={style.RecentActivity}>
                    <div className={style.TableHeaderAction}>
                        <h3>Atividades Recentes</h3>
                        <div className={style.SearchBarSmall}>
                            <FaMagnifyingGlass />
                            <input type="text" placeholder="Pesquisar..." />
                        </div>
                    </div>

                    <div className={style.TableContainer}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Curso</th>
                                    <th>Descrição </th>
                                    <th>Tipo Documento</th>
                                    <th>Data</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>


                                {
                                    activities_recently.map((activity) => (
                                        <tr key={activity.id}>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                                    <span>{activity.Nome}</span>
                                                </div>
                                            </td>
                                            <td>{activity.Curso}</td>
                                            <td>{activity.Descrição}</td>
                                            <td>{activity.TIPO}</td>
                                            <td>2025-09-02</td>
                                            <td><span className={style.StatusBadgeBlue}>{activity.Status}</span></td>
                                        </tr>

                                    ))
                                }


                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

        </div>
    )
}