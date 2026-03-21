import { useState, useEffect } from 'react'
import style from './Histories.module.css'
import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import Header from '../../../Components/Elements/Header/Header'
import '../../../assets/style/global.style.css'
import { 
    FaMagnifyingGlass, 
    FaLaptop, 
    FaMobileScreenButton, 
    FaGlobe,
    FaShieldHalved,
    FaClockRotateLeft
} from 'react-icons/fa6'
import { BsDot } from 'react-icons/bs'
import api from '../../../Services/api'
import Loading from '../../../Components/Elements/Loading/Loading'

export default function Histories() {
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState('logins') // 'logins' ou 'acoes'
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [selectedLog, setSelectedLog] = useState(null)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true)
            try {
                const endpoint = activeTab === 'logins' ? 'historico-login/' : 'historico/'
                const response = await api.get(endpoint, {
                    params: {
                        page: currentPage,
                        search: searchTerm
                    }
                })

                const data = response.data.results || []
                setTotalCount(response.data.count || data.length)

                if (activeTab === 'logins') {
                    setHistory(data.map(item => ({
                        id: item.id_historico_login,
                        user: item.usuario_nome,
                        role: item.usuario_tipo,
                        entry: new Date(item.hora_entrada).toLocaleString(),
                        exit: item.hora_saida ? new Date(item.hora_saida).toLocaleString() : "Sessão Ativa",
                        ip: item.ip_usuario,
                        device: item.dispositivo || "Desktop",
                        browser: item.navegador || "Chrome",
                        img_path: item.usuario_img
                    })))
                } else {
                    setHistory(data.map(item => ({
                        id: item.id_historico,
                        user: item.usuario_nome,
                        role: item.usuario_tipo,
                        entry: new Date(item.data_hora).toLocaleString(),
                        action: item.tipo_accao || "ACAO_DESCONHECIDA",
                        details: item.dados_novos,
                        img_path: item.usuario_img
                    })))
                }
            } catch (error) {
                console.error("Erro ao carregar histórico:", error)
                setHistory([])
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [currentPage, searchTerm, activeTab])

    const totalPages = Math.ceil(totalCount / 10)

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }

    const getDeviceIcon = (device) => {
        if (device && device.toLowerCase().includes('mobile')) return <FaMobileScreenButton />;
        return <FaLaptop />;
    }

    return (
        <div className="ContainerGeneral">
            <NavBarMenu />
            <main className="ContainerMain">
                <Header text1={"Segurança"} text2={"Auditoria do Sistema"} onSearch={setSearchTerm} />

                <div className={style.HistoryContainer}>
                    {/* Tabs Section */}
                    <div className={style.TabsMenu}>
                        <button 
                            className={activeTab === 'logins' ? style.ActiveTab : ''} 
                            onClick={() => {setActiveTab('logins'); setCurrentPage(1)}}
                        >
                            <FaClockRotateLeft /> Histórico de Logins
                        </button>
                        <button 
                            className={activeTab === 'acoes' ? style.ActiveTab : ''} 
                            onClick={() => {setActiveTab('acoes'); setCurrentPage(1)}}
                        >
                            <FaShieldHalved /> Ações do Sistema
                        </button>
                    </div>

                    <div className={style.TableCard}>
                        {/* Table Header Controls */}
                        <div className={style.CardHeader}>
                            <div className={style.HeaderLeft}>
                                <h3>{activeTab === 'logins' ? 'Registos de Acesso' : 'Log de Auditoria'}</h3>
                                <p>{activeTab === 'logins' ? 'Monitorize quem entrou no sistema e quando.' : 'Rastreie alterações sensíveis em dados e configurações.'}</p>
                            </div>
                            <div className={style.SearchBox}>
                                <FaMagnifyingGlass />
                                <input
                                    type="text"
                                    placeholder="Pesquisar..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className={style.TableWrapper}>
                            {loading ? (
                                <div className={style.LoadingOverlay}>
                                    <Loading />
                                </div>
                            ) : (
                                <table className={style.Table}>
                                    <thead>
                                        {activeTab === 'logins' ? (
                                            <tr>
                                                <th>Usuário</th>
                                                <th>Entrada</th>
                                                <th>Saída</th>
                                                <th>Endereço IP</th>
                                                <th>Dispositivo</th>
                                                <th>Navegador</th>
                                            </tr>
                                        ) : (
                                            <tr>
                                                <th>Usuário</th>
                                                <th>Ação Realizada</th>
                                                <th>Data/Hora</th>
                                                <th>Detalhes</th>
                                            </tr>
                                        )}
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
                                                    
                                                    {activeTab === 'logins' ? (
                                                        <>
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
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td>
                                                                <span className={`${style.BadgeAction} ${style[item.action]}`}>
                                                                    {item.action?.replace(/_/g, ' ') || 'Ação'}
                                                                </span>
                                                            </td>
                                                            <td>{item.entry}</td>
                                                            <td>
                                                                <button 
                                                                    className={style.BtnDetails}
                                                                    onClick={() => {
                                                                        setSelectedLog(item);
                                                                        setShowModal(true);
                                                                    }}
                                                                >
                                                                    Ver Detalhes
                                                                </button>
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={activeTab === 'logins' ? "6" : "4"} className={style.EmptyState}>
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

            {/* Modal de Detalhes da Auditoria */}
            {showModal && selectedLog && (
                <div className={style.ModalOverlay} onClick={() => setShowModal(false)}>
                    <div className={style.ModalContent} onClick={e => e.stopPropagation()}>
                        <div className={style.ModalHeader}>
                            <h3>
                                <FaShieldHalved /> 
                                Detalhes da Ação: {selectedLog.action?.replace(/_/g, ' ')}
                            </h3>
                            <button className={style.CloseBtn} onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <div className={style.ModalBody}>
                            <div className={style.DetailGroup}>
                                <div className={style.DetailField}>
                                    <span className={style.FieldLabel}>Usuário</span>
                                    <div className={style.FieldValue}>{selectedLog.user} ({selectedLog.role})</div>
                                </div>
                                <div className={style.DetailField}>
                                    <span className={style.FieldLabel}>Data e Hora</span>
                                    <div className={style.FieldValue}>{selectedLog.entry}</div>
                                </div>
                                <div className={style.DetailField}>
                                    <span className={style.FieldLabel}>Dados Alterados</span>
                                    <div className={style.FieldValue}>
                                        {selectedLog.details ? (
                                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                                                {JSON.stringify(selectedLog.details, null, 2)}
                                            </pre>
                                        ) : (
                                            "Nenhum detalhe adicional disponível."
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
