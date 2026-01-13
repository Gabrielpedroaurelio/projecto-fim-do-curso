import { useState } from 'react'
import style from './Histories.module.css'
import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import Header from '../../../Components/Elements/Header/Header'
import '../../../assets/style/global.style.css'
import { FaMagnifyingGlass, FaLaptop, FaMobileScreenButton, FaGlobe } from 'react-icons/fa6'
import { BsDot } from 'react-icons/bs'

// Mock data for login history
const historyData = [
    { id: 1, user: "Gabriel Aurelio", role: "Admin", entry: "2026-01-13 08:30:45", exit: "Sessão Ativa", ip: "192.168.1.45", device: "Desktop (Windows)", browser: "Chrome 120.0" },
    { id: 2, user: "Aguinaldo Arnaldo", role: "Secretário", entry: "2026-01-13 07:15:20", exit: "2026-01-13 10:20:11", ip: "102.165.4.12", device: "Desktop (macOS)", browser: "Safari 17.2" },
    { id: 3, user: "Leonel Antonio", role: "Admin", entry: "2026-01-12 14:00:00", exit: "2026-01-12 18:45:30", ip: "192.168.1.10", device: "Mobile (Android)", browser: "Firefox Mobile" },
    { id: 4, user: "Ernesto Buka", role: "Secretário", entry: "2026-01-12 09:00:15", exit: "2026-01-12 12:30:00", ip: "197.231.5.88", device: "Desktop (Linux)", browser: "Edge 119.0" },
    { id: 5, user: "Maria João", role: "Gestora", entry: "2026-01-11 08:00:00", exit: "2026-01-11 17:00:00", ip: "192.168.1.15", device: "Desktop (Windows)", browser: "Chrome 120.0" },
]

export default function Histories() {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredData = historyData.filter(item =>
        item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ip.includes(searchTerm)
    )

    const getDeviceIcon = (device) => {
        if (device.toLowerCase().includes('mobile')) return <FaMobileScreenButton />;
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
                                    placeholder="Pesquisar por usuário, cargo ou IP..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className={style.TableWrapper}>
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
                                    {filteredData.length > 0 ? (
                                        filteredData.map((item) => (
                                            <tr key={item.id}>
                                                <td>
                                                    <div className={style.UserCell}>
                                                        <div className={style.Avatar}>
                                                            {item.user.split(' ').map(n => n[0]).join('')}
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
                                                Nenhum registo encontrado para "{searchTerm}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination footer - simplified for UI mockup */}
                        <div className={style.TableFooter}>
                            <span>Mostrando {filteredData.length} registos</span>
                            <div className={style.Pagination}>
                                <button disabled>Anterior</button>
                                <button className={style.ActivePage}>1</button>
                                <button disabled>Próxima</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

