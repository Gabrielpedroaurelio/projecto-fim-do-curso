
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import style from './Dashboards.module.css';
import {
    FaUserGraduate,
    FaFileInvoice,
    FaSpinner,
    FaCircleCheck,
    FaMagnifyingGlass,
    FaBell,
    FaRegMoon,
    FaGear
} from 'react-icons/fa6';
import { BiSolidDashboard } from "react-icons/bi";
import { BsBoxSeam, BsCart3 } from "react-icons/bs";
import { FiMessageSquare, FiTrendingUp } from "react-icons/fi";
import { RiBillLine } from "react-icons/ri";

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
        <div className={style.DashboardContainer}>
            {/* Sidebar Section */}
            <aside className={style.Sidebar}>
                <div className={style.Logo}>
                    <div className={style.LogoIcon}>+</div>
                    <h2>Gestão Escolar</h2>
                </div>

                <div className={style.MenuSection}>
                    <h3>Menu</h3>
                    <ul>
                        <li className={style.Active}>
                            <BiSolidDashboard />
                            <span>Visão Geral</span>
                        </li>
                        <li>
                            <BsCart3 />
                            <span>Solicitações</span>
                        </li>
                        <li>
                            <FiMessageSquare />
                            <span>Mensagens</span>
                            <span className={style.Badge}>1</span>
                        </li>
                        <li>
                            <FiTrendingUp />
                            <span>Relatórios</span>
                        </li>
                        <li>
                            <RiBillLine />
                            <span>Pagamentos</span>
                        </li>
                        <li>
                            <FaUserGraduate />
                            <span>Alunos</span>
                        </li>
                    </ul>
                </div>

                <div className={style.MenuSection}>
                    <h3>Canais</h3>
                    <ul>
                        <li><BsBoxSeam /> Integrações</li>
                        <li><FaFileInvoice /> Documentos</li>
                        <li><FaCircleCheck /> Descontos</li>
                    </ul>
                </div>

                <div className={style.MenuSection}>
                    <ul>
                        <li><FaGear /> Configurações</li>
                        <li> Ajuda</li>
                        <li> Ferramentas</li>
                    </ul>
                </div>
                <div className={style.UserProfileMini}>
                    <div className={style.Avatar}>GP</div>
                    <div className={style.Info}>
                        <h4>Gabriel Pedro</h4>
                        <span>admin@escola.com</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={style.MainContent}>
                {/* Header */}
                <header className={style.Header}>
                    <div className={style.Breadcrumbs}>
                        Dashboard / <span>Visão Geral</span>
                    </div>

                    <div className={style.HeaderActions}>
                        <div className={style.SearchBar}>
                            <FaMagnifyingGlass />
                            <input type="text" placeholder="Pesquisar..." />
                        </div>
                        <div className={style.ActionIcons}>
                            <button className={style.IconButton}><FaRegMoon /></button>
                            <button className={style.IconButton}><FaBell /></button>
                        </div>
                        <div className={style.UserProfileHeader}>
                            <div className={style.AvatarSmall}>GP</div>
                            <div className={style.InfoSmall}>
                                <h4>Gabriel Pedro</h4>
                                <span>Admin</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Widgets */}
                <div className={style.StatsRow}>
                    <div className={style.HeaderRow}>
                        <div>
                            <h1>Visão Geral das Declarações</h1>
                            <span>Dados atualizados hoje</span>
                        </div>
                        <div className={style.FilterActions}>
                            <button className={style.FilterBtn}>Filtrar</button>
                            <button className={style.ImportBtn}>Exportar</button>
                        </div>
                    </div>

                    <div className={style.GridCards}>
                        <div className={style.StatCard}>
                            <div className={style.CardHeader}>
                                <span>Total Solicitações</span>
                                <FaFileInvoice />
                            </div>
                            <h2>8,456</h2>
                            <div className={style.TrendUp}>
                                <span>+22.2%</span> vs mês passado
                            </div>
                        </div>

                        <div className={style.StatCard}>
                            <div className={style.CardHeader}>
                                <span>Declarações Emitidas</span>
                                <FaCircleCheck />
                            </div>
                            <h2>4,450</h2>
                            <div className={style.TrendUp}>
                                <span>+104.5%</span> vs mês passado
                            </div>
                        </div>

                        <div className={style.StatCard}>
                            <div className={style.CardHeader}>
                                <span>Novos Alunos</span>
                                <FaUserGraduate />
                            </div>
                            <h2>34,567</h2>
                            <div className={style.TrendUp}>
                                <span>+12.3%</span> vs mês passado
                            </div>
                        </div>

                        <div className={style.StatCard}>
                            <div className={style.CardHeader}>
                                <span>Receita Total</span>
                                <RiBillLine />
                            </div>
                            <h2>Kz 80,768</h2>
                            <div className={style.TrendUp}>
                                <span>+14.8%</span> vs mês passado
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
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
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val) => `${val / 1000}k`} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 4, 4]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className={style.PerformanceChart}>
                        <div className={style.ChartHeader}>
                            <h3>Desempenho Operacional</h3>
                        </div>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart outerRadius={90} data={performanceData}>
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

                {/* Recent Activity Table */}
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
                                    <th>Escola/Curso</th>
                                    <th>Origem</th>
                                    <th>Localização</th>
                                    <th>Data</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                            <span>Martinho Pedro</span>
                                        </div>
                                    </td>
                                    <td>Ciências Físicas</td>
                                    <td>Sistema</td>
                                    <td>Luanda</td>
                                    <td>2025-09-02</td>
                                    <td><span className={style.StatusBadgeBlue}>Novo Aluno</span></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                            <span>Emília Dinis</span>
                                        </div>
                                    </td>
                                    <td>Informática</td>
                                    <td>Secretaria</td>
                                    <td>Benguela</td>
                                    <td>2025-08-10</td>
                                    <td><span className={style.StatusBadgeGreen}>Matriculado</span></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                            <span>João da Silva</span>
                                        </div>
                                    </td>
                                    <td>Jurídicas</td>
                                    <td>Online</td>
                                    <td>Huíla</td>
                                    <td>2025-08-10</td>
                                    <td><span className={style.StatusBadgeGreen}>Deferido</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
