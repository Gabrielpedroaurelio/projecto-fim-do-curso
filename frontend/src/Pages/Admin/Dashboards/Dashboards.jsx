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
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Loading from '../../../Components/Elements/Loading/Loading'

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
                        <Loading />
                    </div>
                </main>
            </div>
        )
    }

    if (!stats) return null
    // Destructuring new data keys
    const { kpis, requests_comparison_data, engagement_data, recent_activities } = stats

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
                        value_percentual={(kpis.percentuais.solicitacoes) + "%"}
                    />
                    <Cards
                        icon={<FaCircleCheck size={40} />}
                        title={"Declarações Emitidas"}
                        value={kpis.declaracoes_emitidas.toLocaleString()}
                        value_percentual={(kpis.percentuais.declaracoes) + "%"}
                    />
                    <Cards
                        icon={<FaUserGraduate size={40} />}
                        title={"Alunos"}
                        value={kpis.novos_alunos.toLocaleString()}
                        value_percentual={(kpis.percentuais.alunos) + "%"}
                    />
                    <Cards
                        icon={<RiBillLine size={40} />}
                        title={"Receita Total"}
                        value={`Kz ${kpis.receita_total.toLocaleString()}`}
                        value_percentual={(kpis.percentuais.receita) + "%"}
                    />
                </div>
                <div className={style.ChartsRow}>
                    {/* Gráfico 1: Comparação de Solicitações (AreaChart) */}
                    <div className={style.RevenueChart}>
                        <div className={style.ChartHeader}>
                            <div>
                                <h3>Comparação de Solicitações</h3>
                                <p className="text-sm text-gray-500">Por tipo de documento (6 meses)</p>
                            </div>
                        </div>
                        <div className="h-[250px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={requests_comparison_data}>
                                    <defs>
                                        <linearGradient id="colorDecl" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorCert" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorBol" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ stroke: 'var(--border-color)', strokeWidth: 1 }}
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: '1px solid var(--border-color)',
                                            backgroundColor: 'var(--bg-card)',
                                            color: 'var(--text-main)',
                                            boxShadow: 'var(--shadow-hover)'
                                        }}
                                    />
                                    <Legend iconType="circle" />
                                    <Area
                                        type="monotone"
                                        dataKey="Declaracao"
                                        name="Declaração"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorDecl)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="Certificado"
                                        name="Certificado"
                                        stroke="#f97316"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorCert)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="Boletim"
                                        name="Boletim"
                                        stroke="#22c55e"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorBol)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Gráfico 2: Engajamento de Usuários (AreaChart) */}
                    <div className={style.PerformanceChart}>
                        <div className={style.ChartHeader}>
                            <h3>Engajamento de Usuários</h3>
                        </div>
                        <div className="h-[250px] w-full flex items-center justify-center mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={engagement_data}>
                                    <defs>
                                        <linearGradient id="colorAlunos" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorFuncs" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorEncs" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" hide />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: '1px solid var(--border-color)',
                                            backgroundColor: 'var(--bg-card)',
                                            color: 'var(--text-main)',
                                        }}
                                    />
                                    <Area type="monotone" dataKey="Alunos" stackId="1" stroke="#8884d8" fill="url(#colorAlunos)" />
                                    <Area type="monotone" dataKey="Funcionarios" stackId="1" stroke="#82ca9d" fill="url(#colorFuncs)" />
                                    <Area type="monotone" dataKey="Encarregados" stackId="1" stroke="#ffc658" fill="url(#colorEncs)" />
                                </AreaChart>
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
