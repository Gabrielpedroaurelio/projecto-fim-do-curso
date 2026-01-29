import { useState, useEffect } from 'react'
import style from './Histories.module.css'
import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import Header from '../../../Components/Elements/Header/Header'
import '../../../assets/style/global.style.css'
import { FaMagnifyingGlass, FaLaptop, FaMobileScreenButton, FaGlobe } from 'react-icons/fa6'
import { BsDot } from 'react-icons/bs'
import api from '../../../Services/api'
import Loading from '../../../Components/Elements/Loading/Loading'

export default function Histories() {
    const [searchTerm, setSearchTerm] = useState('')
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true)
            try {
                const response = await api.get('historico-login/', {
                    params: {
                        page: currentPage,
                        search: searchTerm
                    }
                })

                const data = response.data.results || []
                setTotalCount(response.data.count || data.length)

                setHistory(data.map(item => ({
                    id: item.id_historico_login,
                    user: item.usuario_nome,
                    role: item.usuario_tipo,
                    entry: new Date(item.hora_entrada).toLocaleString(),
                    exit: item.hora_saida ? new Date(item.hora_saida).toLocaleString() : "Sessão Ativa",
                    ip: item.ip_usuario,
                    device: item.dispositivo || "Desktop (Windows)",
                    browser: item.navegador || "Chrome",
                    img_path: item.usuario_img
                })))
            } catch (error) {
                console.error("Erro ao carregar histórico:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [currentPage, searchTerm])

    const totalPages = Math.ceil(totalCount / 10)

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1) // Reset to first page on search
    }

    const getDeviceIcon = (device) => {
        if (device && device.toLowerCase().includes('mobile')) return <FaMobileScreenButton />;
        return <FaLaptop />;
    }

    return (
        <div className="ContainerGeneral">
            <NavBarMenu />
            <main className="ContainerMain">
                <Header text1={"Segurança"} text2={"Histórico de Logins"} onSearch={setSearchTerm} />

                <div className={style.HistoryContainer}>
                    <div className={style.TableCard}>
                        {/* Table Header Controls */}
                        <div className={style.CardHeader}>
                            <div className={style.HeaderLeft}>
                                <h3>Registos de Atividade</h3>
                                <p>Monitorize acessos e sessões no sistema</p>
                            </div>
                            <div className={style.SearchBox}>
                                <FaMagnifyingGlass />
                                <input
                                    type="text"
                                    placeholder="Pesquisar por usuário ou IP..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className={style.TableWrapper}>
                            {loading ? (
                                <div className="loading p-10 text-center"><Loading/></div>
                            ) : (
                                <table className={style.Table}>
                                    <thead>
                                        <tr>
                                            <th>Usuário</th>
                                            <th>Entrada</th>
                                            <th>Saída</th>
                                            <th>Endereço IP</th>
                                            <th>Dispositivo</th>
                                            <th>Navegador</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.length > 0 ? (
                                            history.map((item) => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <div className={style.UserCell}>
                                                            <div className={style.Avatar}>
                                                                {item.img_path ? (
                                                                    <img src={item.img_path} alt={item.user} />
                                                                ) : (
                                                                    item.user?.split(' ').map(n => n[0]).join('')
                                                                )}
                                                            </div>
                                                            <div className={style.UserInfo}>
                                                                <span className={style.UserName}>{item.user}</span>
                                                                <span className={style.UserRole}>{item.role}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{item.entry}</td>
                                                    <td>
                                                        {item.exit === "Sessão Ativa" ? (
                                                            <span className={style.StatusActive}>
                                                                <BsDot /> Sessão Ativa
                                                            </span>
                                                        ) : item.exit}
                                                    </td>
                                                    <td>
                                                        <code className={style.IpCode}>{item.ip}</code>
                                                    </td>
                                                    <td>
                                                        <div className={style.DeviceCell}>
                                                            {getDeviceIcon(item.device)}
                                                            <span>{item.device}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={style.BrowserCell}>
                                                            <FaGlobe />
                                                            <span>{item.browser}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className={style.EmptyState}>
                                                    Nenhum registo encontrado.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Pagination footer */}
                        <div className={style.TableFooter}>
                            <span>Mostrando {history.length} de {totalCount} registos</span>
                            <div className={style.Pagination}>
                                <button
                                    disabled={currentPage === 1 || loading}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                >
                                    Anterior
                                </button>
                                <button className={style.ActivePage}>{currentPage}</button>
                                <button
                                    disabled={currentPage >= totalPages || loading}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                >
                                    Próxima
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

