import { useState } from 'react'
import style from './Settings.module.css'
import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import Header from '../../../Components/Elements/Header/Header'
import '../../../assets/style/global.style.css'
import {
    FaBuilding,
    FaDatabase,
    FaShieldHalved,
    FaServer,
    FaCloudArrowDown,
    FaClockRotateLeft,
    FaCircleCheck,
    FaTriangleExclamation
} from 'react-icons/fa6'

export default function Settings() {
    const [activeTab, setActiveTab] = useState('general')
    const [isBackingUp, setIsBackingUp] = useState(false)
    const [backupProgress, setBackupProgress] = useState(0)

    const tabs = [
        { id: 'general', label: 'Informações', icon: <FaBuilding /> },
        { id: 'backup', label: 'Backup & Dados', icon: <FaDatabase /> },
        { id: 'security', label: 'Segurança', icon: <FaShieldHalved /> },
        { id: 'system', label: 'Sistema', icon: <FaServer /> }
    ]

    const handleRunBackup = () => {
        setIsBackingUp(true)
        setBackupProgress(0)

        let progress = 0
        const interval = setInterval(() => {
            progress += 10
            setBackupProgress(progress)
            if (progress >= 100) {
                clearInterval(interval)
                setTimeout(() => setIsBackingUp(false), 1000)
            }
        }, 300)
    }

    return (
        <div className="ContainerGeneral">
            <NavBarMenu />
            <main className="ContainerMain">
                <Header text1={"Configurações"} text2={"Gestão do Sistema"} />

                <div className={style.SettingsContainer}>
                    {/* Sidebar Tabs */}
                    <div className={style.SideNav}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`${style.NavButton} ${activeTab === tab.id ? style.NavActive : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className={style.NavIcon}>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className={style.ContentArea}>
                        {activeTab === 'general' && (
                            <div className={style.SettingSection}>
                                <div className={style.SectionHeader}>
                                    <h3>Informações da Instituição</h3>
                                    <p>Dados que aparecerão nos documentos emitidos</p>
                                </div>
                                <div className={style.FormGrid}>
                                    <div className={style.InputGroup}>
                                        <label>Nome da Escola</label>
                                        <input type="text" defaultValue="Colégio Exemplo" />
                                    </div>
                                    <div className={style.InputGroup}>
                                        <label>NIF / Identificação</label>
                                        <input type="text" defaultValue="5401234567" />
                                    </div>
                                    <div className={style.InputGroup}>
                                        <label>Endereço</label>
                                        <input type="text" defaultValue="Rua Principal, Luanda" />
                                    </div>
                                    <div className={style.InputGroup}>
                                        <label>Telefone</label>
                                        <input type="text" defaultValue="+244 9XX XXX XXX" />
                                    </div>
                                    <div className={style.InputGroupFull}>
                                        <label>Email Oficial</label>
                                        <input type="email" defaultValue="contato@escola.ao" />
                                    </div>
                                </div>
                                <button className={style.SaveButton}>Salvar Alterações</button>
                            </div>
                        )}

                        {activeTab === 'backup' && (
                            <div className={style.SettingSection}>
                                <div className={style.SectionHeader}>
                                    <h3>Backup e Segurança de Dados</h3>
                                    <p>Garanta a integridade das informações do colégio</p>
                                </div>

                                <div className={style.BackupCard}>
                                    <div className={style.BackupInfo}>
                                        <FaCloudArrowDown className={style.BackupIconLarge} />
                                        <div>
                                            <h4>Backup Completo da Base de Dados</h4>
                                            <span>Último backup realizado: Hoje, 08:30 AM</span>
                                        </div>
                                    </div>
                                    <button
                                        className={style.RunBackupBtn}
                                        onClick={handleRunBackup}
                                        disabled={isBackingUp}
                                    >
                                        {isBackingUp ? `Processando... ${backupProgress}%` : 'Realizar Backup Agora'}
                                    </button>
                                </div>

                                {isBackingUp && (
                                    <div className={style.ProgressBarContainer}>
                                        <div className={style.ProgressBar} style={{ width: `${backupProgress}%` }}></div>
                                    </div>
                                )}

                                <div className={style.HistoryList}>
                                    <h4>Histórico Recente</h4>
                                    <div className={style.HistoryItem}>
                                        <FaClockRotateLeft />
                                        <div className={style.HistoryDetails}>
                                            <p>backup_full_2026-01-12.sql</p>
                                            <span>Realizado por Admin • 45MB</span>
                                        </div>
                                        <button className={style.DownloadLink}>Download</button>
                                    </div>
                                    <div className={style.HistoryItem}>
                                        <FaClockRotateLeft />
                                        <div className={style.HistoryDetails}>
                                            <p>backup_full_2026-01-11.sql</p>
                                            <span>Realizado automaticamente • 44.8MB</span>
                                        </div>
                                        <button className={style.DownloadLink}>Download</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className={style.SettingSection}>
                                <div className={style.SectionHeader}>
                                    <h3>Configurações de Segurança</h3>
                                    <p>Proteja o acesso administrativo ao sistema</p>
                                </div>
                                <div className={style.FormGrid}>
                                    <div className={style.InputGroup}>
                                        <label>Senha Atual</label>
                                        <input type="password" />
                                    </div>
                                    <div className={style.InputGroup}>
                                        <label>Nova Senha</label>
                                        <input type="password" />
                                    </div>
                                </div>
                                <div className={style.ToggleGroup}>
                                    <label className={style.ToggleLabel}>
                                        <span>Autenticação em duas etapas (2FA)</span>
                                        <input type="checkbox" defaultChecked />
                                    </label>
                                    <p className={style.HelperText}>Aumenta a segurança exigindo código via email.</p>
                                </div>
                                <button className={style.SaveButton}>Atualizar Segurança</button>
                            </div>
                        )}

                        {activeTab === 'system' && (
                            <div className={style.SettingSection}>
                                <div className={style.SectionHeader}>
                                    <h3>Status do Sistema</h3>
                                    <p>Informações técnicas e recursos</p>
                                </div>

                                <div className={style.StatusGrid}>
                                    <div className={style.StatusCard}>
                                        <div className={style.StatusValue}>
                                            <FaCircleCheck className={style.SuccessIcon} />
                                            <span>Servidor Online</span>
                                        </div>
                                        <p>Tempo de atividade: 12 dias, 4 horas</p>
                                    </div>
                                    <div className={style.StatusCard}>
                                        <div className={style.StatusValue}>
                                            <FaServer className={style.InfoIcon} />
                                            <span>Armazenamento</span>
                                        </div>
                                        <p>1.2 GB / 5 GB Utilizados (24%)</p>
                                    </div>
                                    <div className={style.StatusCard}>
                                        <div className={style.StatusValue}>
                                            <FaTriangleExclamation className={style.WarningIcon} />
                                            <span>Carga da CPU</span>
                                        </div>
                                        <p>Oscilando em 15% - 22%</p>
                                    </div>
                                </div>

                                <div className={style.SystemInfo}>
                                    <div className={style.InfoRow}>
                                        <span>Versão do Software:</span>
                                        <strong>v2.4.0-stable</strong>
                                    </div>
                                    <div className={style.InfoRow}>
                                        <span>Ambiente:</span>
                                        <strong>Produção (WAMP64)</strong>
                                    </div>
                                    <div className={style.InfoRow}>
                                        <span>Banco de Dados:</span>
                                        <strong>MySQL 8.0.x</strong>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

