import { useState, useEffect } from 'react'
import style from './Dashboards.module.css'
import '../../../assets/style/global.style.css'
import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import Header from '../../../Components/Elements/Header/Header'
import Cards from '../../../Components/Elements/Cards/Cards'
import { FaCircleCheck, FaFileInvoice, FaMagnifyingGlass, FaUserGraduate } from 'react-icons/fa6'
import { RiBillLine } from 'react-icons/ri'
import api from '../../../Services/api'

// IMPORTAÇÕES PARA OS GRAFICOS
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

export default function Dashboards() {
    const [searchTerm, setSearchTerm] = useState('')
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('dashboard/stats/')
                setStats(response.data)
            } catch (error) {
                console.error("Erro ao carregar dados do dashboard:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) {
        return (
            <div className={'ContainerGeneral'}>
                <NavBarMenu />
                <main className={'ContainerMain'}>
                    <Header text1={"Resumo"} text2={"Dashboard"} onSearch={setSearchTerm} />
                    <div className="flex items-center justify-center h-full">
                        <p>Carregando dados do dashboard...</p>
                    </div>
                </main>
            </div>
        )
    }

    if (!stats) return null
    const { kpis, revenue_data, performance_data, recent_activities } = stats

    const filteredActivities = recent_activities.filter(activity =>
        activity.aluno_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.tipo_documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.status_solicitacao.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className={'ContainerGeneral'}>
            <NavBarMenu />
            <main className={'ContainerMain'}>
                <Header text1={"Resumo"} text2={"Dashboard"} onSearch={setSearchTerm} />
                <div className={style.GridCards}>
                    <Cards
                        icon={<FaFileInvoice size={40} />}
                        title={"Total Solicitações"}
                        value={kpis.total_solicitacoes.toLocaleString()}
                        value_percentual={kpis.percentuais.solicitacoes}
                    />
                    <Cards
                        icon={<FaCircleCheck size={40} />}
                        title={"Declarações Emitidas"}
                        value={kpis.declaracoes_emitidas.toLocaleString()}
                        value_percentual={kpis.percentuais.declaracoes}
                    />
                    <Cards
                        icon={<FaUserGraduate size={40} />}
                        title={"Novos Alunos"}
                        value={kpis.novos_alunos.toLocaleString()}
                        value_percentual={kpis.percentuais.alunos}
                    />
                    <Cards
                        icon={<RiBillLine size={40} />}
                        title={"Receita Total"}
                        value={`Kz ${kpis.receita_total.toLocaleString()}`}
                        value_percentual={kpis.percentuais.receita}
                    />
                </div>
                <div className={style.ChartsRow}>
                    <div className={style.RevenueChart}>
                        <div className={style.ChartHeader}>
                            <div>
                                <h3>Crescimento da Receita</h3>
                                <h2>Kz {kpis.receita_total.toLocaleString()}</h2>
                            </div>
                            <div className={style.DateTabs}>
                                <button className={style.Active}>Mensal</button>
                            </div>
                        </div>
                        <div className="h-[150px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenue_data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickFormatter={(val) => `${val / 1000}k`} />
                                    <Tooltip
                                        cursor={{ fill: 'var(--bg-input)' }}
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: '1px solid var(--border-color)',
                                            backgroundColor: 'var(--bg-card)',
                                            color: 'var(--text-main)',
                                            boxShadow: 'var(--shadow-hover)'
                                        }}
                                        itemStyle={{ color: 'var(--primary)' }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        fill="url(#colorRevenue)"
                                        radius={[6, 6, 0, 0]}
                                        barSize={20}
                                        animationDuration={1500}
                                    />
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                                            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.6} />
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
                                <RadarChart outerRadius={60} data={performance_data}>
                                    <PolarGrid stroke="var(--border-color)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="transparent" />
                                    <Radar
                                        name="Desempenho"
                                        dataKey="A"
                                        stroke="var(--primary)"
                                        strokeWidth={2}
                                        fill="var(--primary)"
                                        fillOpacity={0.2}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: '1px solid var(--border-color)',
                                            backgroundColor: 'var(--bg-card)',
                                            color: 'var(--text-main)'
                                        }}
                                    />
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
                            <input
                                type="text"
                                placeholder="Pesquisar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={style.TableContainer}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Tipo</th>
                                    <th>Data</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredActivities.map((activity) => (
                                    <tr key={activity.id_solicitacao}>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                {activity.aluno_img ? (
                                                    <img src={activity.aluno_img} alt="" className="w-8 h-8 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                        {activity.aluno_nome.charAt(0)}
                                                    </div>
                                                )}
                                                <span>{activity.aluno_nome}</span>
                                            </div>
                                        </td>
                                        <td>{activity.tipo_documento}</td>
                                        <td>{new Date(activity.data_solicitacao).toLocaleDateString()}</td>
                                        <td>
                                            <span className={
                                                activity.status_solicitacao === 'pendente' ? style.StatusBadgeOrange :
                                                    activity.status_solicitacao === 'aprovado' ? style.StatusBadgeGreen :
                                                        activity.status_solicitacao === 'pago' ? style.StatusBadgeBlue :
                                                            style.StatusBadgeRed
                                            }>
                                                {activity.status_solicitacao}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredActivities.length === 0 && (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                                            Nenhum resultado encontrado para "{searchTerm}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}
