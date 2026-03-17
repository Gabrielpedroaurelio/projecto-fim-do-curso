import { useState, useEffect } from 'react'
import style from './Settings.module.css'
import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import Header from '../../../Components/Elements/Header/Header'
import '../../../assets/style/global.style.css'
import { useAuth } from '../../../Context/AuthContext'
import api from '../../../Services/api'
import {
    FaBuilding,
    FaDatabase,
    FaShieldHalved,
    FaCloudArrowDown,
    FaClockRotateLeft,
    FaUser,
    FaTrash,
    FaPalette,
    FaListCheck,
    FaBell,
    FaMoon,
    FaSun,
    FaPlus,
    FaRotate,
    FaXmark,
    FaCircleInfo
} from 'react-icons/fa6'

export default function Settings() {
    const { user, setUser } = useAuth()
    const [activeTab, setActiveTab] = useState('backup')
    const [isBackingUp, setIsBackingUp] = useState(false)
    const [backupProgress, setBackupProgress] = useState(0)
    const [backups, setBackups] = useState([])
    const [config, setConfig] = useState(null)
    const [profileData, setProfileData] = useState({
        nome: user?.nome || '',
        email: user?.email || '',
        telefone: user?.telefone || ''
    })
    const [loading, setLoading] = useState(false)
    const [auditLogs, setAuditLogs] = useState([])
    const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains('dark-mode'))
    const [currentColor, setCurrentColor] = useState(localStorage.getItem('primary-color') || '#0ea5e9')

    const palettes = [
        { id: 'sky', color: '#0ea5e9' },
        { id: 'indigo', color: '#6366f1' },
        { id: 'emerald', color: '#10b981' },
        { id: 'amber', color: '#f59e0b' },
        { id: 'rose', color: '#ef4444' },
    ]

    useEffect(() => {
        fetchConfig()
        fetchBackups()
        
        // Aplicar a cor salva no início
        const savedColor = localStorage.getItem('primary-color')
        if (savedColor) {
            applyColor(savedColor)
        }
    }, [])

    const applyColor = (color) => {
        // Aplicar no html e body para garantir que sobreponha variáveis do modo escuro
        const targets = [document.documentElement, document.body]
        targets.forEach(el => {
            el.style.setProperty('--primary', color)
            el.style.setProperty('--accent-indigo', color)
            el.style.setProperty('--text-primary', color)
            el.style.setProperty('--primary-soft', `${color}15`)
        })
    }

    const handleColorChange = (color) => {
        setCurrentColor(color)
        localStorage.setItem('primary-color', color)
        applyColor(color)
    }

    useEffect(() => {
        if (activeTab === 'audit') {
            fetchAuditLogs()
        }
    }, [activeTab])

    const fetchConfig = async () => {
        try {
            const response = await api.get('configuracao-sistema/')
            const data = response.data.results || response.data
            if (data && data.length > 0) {
                setConfig(data[0])
            }
        } catch (error) {
            console.error("Erro ao carregar configurações:", error)
        }
    }

    const fetchAuditLogs = async () => {
        try {
            const response = await api.get('historicos/')
            setAuditLogs(response.data.results || response.data)
        } catch (error) {
            console.error("Erro ao carregar logs:", error)
        }
    }

    const fetchBackups = async () => {
        try {
            const response = await api.get('backups/')
            setBackups(response.data)
        } catch (error) {
            console.error("Erro ao carregar backups:", error)
        }
    }

    const handleUpdateProfile = async () => {
        setLoading(true)
        try {
            const response = await api.post('auth/update-profile/', profileData)
            setUser(response.data.user)
            alert('Perfil atualizado com sucesso!')
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error)
            alert('Erro ao atualizar perfil.')
        } finally {
            setLoading(false)
        }
    }

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append('img_path', file)

        setLoading(true)
        try {
            const response = await api.post('auth/update-profile/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setUser(response.data.user)
            alert('Foto atualizada com sucesso!')
        } catch (error) {
            console.error("Erro ao carregar foto:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogoChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append('logo', file)

        setLoading(true)
        try {
            const configId = config?.id
            if (configId) {
                const response = await api.patch(`configuracao-sistema/${configId}/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                setConfig(response.data)
                alert('Logótipo atualizado!')
            }
        } catch (error) {
            console.error("Erro ao carregar logótipo:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSaveConfig = async () => {
        setLoading(true)
        try {
            const configId = config?.id
            if (configId) {
                await api.patch(`configuracao-sistema/${configId}/`, config)
            } else {
                const response = await api.post('configuracao-sistema/', config)
                setConfig(response.data)
            }
            alert('Configurações da instituição salvas!')
        } catch (error) {
            console.error("Erro ao salvar configurações:", error)
            alert('Erro ao guardar as configurações da instituição.')
        } finally {
            setLoading(false)
        }
    }

    const toggleTheme = () => {
        const newMode = !isDarkMode
        setIsDarkMode(newMode)
        if (newMode) {
            document.body.classList.add('dark-mode')
            localStorage.setItem('theme', 'dark')
        } else {
            document.body.classList.remove('dark-mode')
            localStorage.setItem('theme', 'light')
        }
    }

    const handleRunBackup = async () => {
        setIsBackingUp(true)
        setBackupProgress(30)
        try {
            await api.post('backups/run_backup/')
            setBackupProgress(100)
            setTimeout(() => {
                setIsBackingUp(false)
                fetchBackups()
            }, 1000)
        } catch (error) {
            console.error("Erro ao realizar backup:", error)
            setIsBackingUp(false)
            alert('Erro ao realizar backup.')
        }
    }

    const handleDeleteBackup = async (filename) => {
        if (!window.confirm('Tem certeza que deseja eliminar este backup?')) return
        try {
            await api.delete(`backups/delete_backup/?filename=${filename}`)
            fetchBackups()
        } catch (error) {
            console.error("Erro ao eliminar backup:", error)
        }
    }

    const handleRestoreBackup = async (filename) => {
        if (!window.confirm(`Tem certeza que deseja restaurar o sistema usando o backup "${filename}"? Esta ação irá sobrepor os dados atuais.`)) return
        
        setIsBackingUp(true)
        setBackupProgress(50)
        try {
            await api.post('backups/restore_backup/', { filename })
            setBackupProgress(100)
            alert('Sistema restaurado com sucesso! Recarregue a página para ver as alterações.')
        } catch (error) {
            console.error("Erro ao restaurar backup:", error)
            alert(error.response?.data?.error || 'Erro ao restaurar backup.')
        } finally {
            setIsBackingUp(false)
            setBackupProgress(0)
        }
    }

    const handleUploadRestore = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (!window.confirm('Tem certeza que deseja restaurar o sistema a partir deste ficheiro externo?')) return

        const formData = new FormData()
        formData.append('file', file)

        setIsBackingUp(true)
        setBackupProgress(40)
        try {
            await api.post('backups/upload_restore/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setBackupProgress(100)
            alert('Sistema restaurado com sucesso a partir do ficheiro enviado!')
            fetchBackups()
        } catch (error) {
            console.error("Erro no upload/restauro:", error)
            alert(error.response?.data?.error || 'Erro ao processar o restauro.')
        } finally {
            setIsBackingUp(false)
            setBackupProgress(0)
        }
    }


    const [passwords, setPasswords] = useState({
        senha_atual: '',
        nova_senha: ''
    })

    const handleChangePassword = async () => {
        if (!passwords.senha_atual || !passwords.nova_senha) {
            alert('Por favor, preencha ambas as senhas.')
            return
        }
        setLoading(true)
        try {
            await api.post('auth/change-password/', passwords)
            alert('Senha alterada com sucesso!')
            setPasswords({ senha_atual: '', nova_senha: '' })
        } catch (error) {
            console.error("Erro ao alterar senha:", error)
            alert(error.response?.data?.error || 'Erro ao alterar senha.')
        } finally {
            setLoading(false)
        }
    }

    const tabs = [
        { id: 'backup', label: 'Backup', icon: <FaDatabase /> },
        { id: 'appearance', label: 'Aparência', icon: <FaPalette /> },
        { id: 'audit', label: 'Auditoria', icon: <FaListCheck /> },
        { id: 'security', label: 'Segurança', icon: <FaShieldHalved /> },
        { id: 'notifications', label: 'Notificações', icon: <FaBell /> },
        { id: 'general', label: 'Instituição', icon: <FaBuilding /> },
        { id: 'profile', label: 'Meu Perfil', icon: <FaUser /> },
    ]

    const getActionStyle = (action) => {
        const type = action?.toLowerCase() || ''
        if (type.includes('cria') || type.includes('adiciona')) 
            return { icon: <FaPlus />, class: style.BadgeSuccess, label: 'Criação' }
        if (type.includes('edita') || type.includes('altera') || type.includes('atualiza')) 
            return { icon: <FaRotate />, class: style.BadgeWarning, label: 'Edição' }
        if (type.includes('elimina') || type.includes('remove') || type.includes('apaga')) 
            return { icon: <FaXmark />, class: style.BadgeDanger, label: 'Eliminação' }
        return { icon: <FaCircleInfo />, class: style.BadgeInfo, label: action }
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
                        {activeTab === 'profile' && (
                            <div className={style.SettingSection}>
                                <div className={style.SectionHeader}>
                                    <h3>Informações de Perfil</h3>
                                    <p>Gerencie suas informações pessoais e de contato</p>
                                </div>
                                <div className={style.ProfileUpload}>
                                    <div className={style.AvatarLarge}>
                                        {user?.img_path ? (
                                            <img src={user.img_path} alt={user.nome} />
                                        ) : (
                                            <span>{user?.nome?.split(' ').map(n => n[0]).join('')}</span>
                                        )}
                                    </div>
                                    <div className={style.PhotoActions}>
                                        <input
                                            type="file"
                                            id="photo-upload"
                                            style={{ display: 'none' }}
                                            onChange={handlePhotoChange}
                                        />
                                        <label htmlFor="photo-upload" className={style.ChangePhotoBtn}>
                                            Alterar Foto
                                        </label>
                                    </div>
                                </div>
                                <div className={style.FormGrid}>
                                    <div className={style.InputGroup}>
                                        <label>Nome Completo</label>
                                        <input
                                            type="text"
                                            value={profileData.nome}
                                            disabled
                                            title="O nome só pode ser alterado pela administração"
                                        />
                                    </div>
                                    <div className={style.InputGroup}>
                                        <label>Endereço de Email</label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className={style.InputGroup}>
                                        <label>Telefone</label>
                                        <input
                                            type="text"
                                            value={profileData.telefone}
                                            onChange={(e) => setProfileData({ ...profileData, telefone: e.target.value })}
                                        />
                                    </div>
                                    <div className={style.InputGroup}>
                                        <label>Cargo / Função</label>
                                        <input type="text" value={user?.cargo || user?.tipo} disabled />
                                    </div>
                                </div>
                                <button
                                    className={style.SaveButton}
                                    onClick={handleUpdateProfile}
                                    disabled={loading}
                                >
                                    {loading ? 'Salvando...' : 'Atualizar Perfil'}
                                </button>
                            </div>
                        )}

                        {activeTab === 'general' && (
                            <div className={style.SettingSection}>
                                <div className={style.SectionHeader}>
                                    <h3>Informações da Instituição</h3>
                                    <p>Dados que aparecerão nos documentos emitidos</p>
                                </div>
                                
                                <div className={style.LogoUploadSection}>
                                    <div className={style.LogoPreview}>
                                        {config?.logo ? (
                                            <img src={config.logo} alt="Logo Instituição" />
                                        ) : (
                                            <FaBuilding />
                                        )}
                                    </div>
                                    <div className={style.LogoInfo}>
                                        <h4>Logótipo Oficial</h4>
                                        <p>PNG recomendado para fundos transparentes (Max 2MB)</p>
                                        <input
                                            type="file"
                                            id="logo-upload"
                                            style={{ display: 'none' }}
                                            onChange={handleLogoChange}
                                        />
                                        <label htmlFor="logo-upload" className={style.UploadSmallBtn}>
                                            Substituir Logo
                                        </label>
                                    </div>
                                </div>

                                <div className={style.FormGrid}>
                                    <div className={style.InputGroup}>
                                        <label>Nome da Escola</label>
                                        <input
                                            type="text"
                                            value={config?.nome_instituicao || ''}
                                            onChange={(e) => setConfig({ ...config, nome_instituicao: e.target.value })}
                                        />
                                    </div>
                                    <div className={style.InputGroup}>
                                        <label>NIF / Identificação</label>
                                        <input
                                            type="text"
                                            value={config?.nif || ''}
                                            onChange={(e) => setConfig({ ...config, nif: e.target.value })}
                                        />
                                    </div>
                                    <div className={style.InputGroup}>
                                        <label>Endereço</label>
                                        <input
                                            type="text"
                                            value={config?.endereco || ''}
                                            onChange={(e) => setConfig({ ...config, endereco: e.target.value })}
                                        />
                                    </div>
                                    <div className={style.InputGroup}>
                                        <label>Telefone</label>
                                        <input
                                            type="text"
                                            value={config?.telefone || ''}
                                            onChange={(e) => setConfig({ ...config, telefone: e.target.value })}
                                        />
                                    </div>
                                    <div className={style.InputGroupFull}>
                                        <label>Email Oficial</label>
                                        <input
                                            type="email"
                                            value={config?.email_oficial || ''}
                                            onChange={(e) => setConfig({ ...config, email_oficial: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <button 
                                    className={style.SaveButton}
                                    onClick={handleSaveConfig}
                                    disabled={loading}
                                >
                                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                                </button>
                            </div>
                        )}

                        {activeTab === 'appearance' && (
                            <div className={style.SettingSection}>
                                <div className={style.SectionHeader}>
                                    <h3>Aparência e Personalização</h3>
                                    <p>Ajuste a interface do sistema ao seu gosto</p>
                                </div>

                                <div className={style.ThemeSelectors}>
                                    <div 
                                        className={`${style.ThemeCard} ${!isDarkMode ? style.ActiveTheme : ''}`}
                                        onClick={() => isDarkMode && toggleTheme()}
                                    >
                                        <div className={style.ThemePreviewLight}>
                                            <FaSun />
                                        </div>
                                        <span>Modo Claro</span>
                                    </div>
                                    <div 
                                        className={`${style.ThemeCard} ${isDarkMode ? style.ActiveTheme : ''}`}
                                        onClick={() => !isDarkMode && toggleTheme()}
                                    >
                                        <div className={style.ThemePreviewDark}>
                                            <FaMoon />
                                        </div>
                                        <span>Modo Escuro</span>
                                    </div>
                                </div>

                                <div className={style.ColorPaletteList}>
                                    <h4>Esquema de Cores</h4>
                                    <div className={style.ColorsGrid}>
                                        {palettes.map(p => (
                                            <div 
                                                key={p.id}
                                                className={`${style.ColorSwatch} ${currentColor === p.color ? style.ActiveSwatch : ''}`} 
                                                style={{ backgroundColor: p.color }}
                                                onClick={() => handleColorChange(p.color)}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
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
                                            <span>
                                                {backups.length > 0
                                                    ? `Último backup realizado: ${new Date(backups[0].created_at).toLocaleString()}`
                                                    : 'Nenhum backup realizado ainda.'}
                                            </span>
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

                                <div className={style.ExternalRestoreBox}>
                                    <div>
                                        <h4>Restauração Externa</h4>
                                        <p>Carregue um ficheiro SQL de backup para restaurar</p>
                                    </div>
                                    <input
                                        type="file"
                                        id="restore-upload"
                                        accept=".sql"
                                        style={{ display: 'none' }}
                                        onChange={handleUploadRestore}
                                    />
                                    <label htmlFor="restore-upload" className={style.UploadRestoreBtn}>
                                        Carregar e Restaurar
                                    </label>
                                </div>


                                {isBackingUp && (
                                    <div className={style.ProgressBarContainer}>
                                        <div className={style.ProgressBar} style={{ width: `${backupProgress}%` }}></div>
                                    </div>
                                )}

                                <div className={style.HistoryList}>
                                    <h4>Histórico de Backups</h4>
                                    {backups.map((bkp, index) => (
                                        <div key={index} className={style.HistoryItem}>
                                            <FaClockRotateLeft />
                                            <div className={style.HistoryDetails}>
                                                <p>{bkp.filename}</p>
                                                <span>{(bkp.size / 1024 / 1024).toFixed(2)} MB • {new Date(bkp.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div className={style.BackupActions}>
                                                <button
                                                    className={style.RestoreLink}
                                                    onClick={() => handleRestoreBackup(bkp.filename)}
                                                >
                                                    Restaurar
                                                </button>
                                                <button
                                                    className={style.DownloadLink}
                                                    onClick={() => window.open(bkp.url, '_blank')}
                                                >
                                                    Download
                                                </button>
                                                <button
                                                    className={style.DeleteLink}
                                                    onClick={() => handleDeleteBackup(bkp.filename)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>

                                        </div>
                                    ))}
                                    {backups.length === 0 && (
                                        <p className={style.EmptyState}>Nenhum backup encontrado.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'audit' && (
                            <div className={style.SettingSection}>
                                <div className={style.SectionHeader}>
                                    <h3>Logs de Auditoria</h3>
                                    <p>Monitorização das últimas ações realizadas no sistema</p>
                                </div>
                                <div className={style.LogsTableContainer}>
                                    <table className={style.LogsTable}>
                                        <thead>
                                            <tr>
                                                <th>Data e Hora</th>
                                                <th>Utilizador</th>
                                                <th>Operação</th>
                                                <th>Descrição da Atividade</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {auditLogs.map((log, i) => {
                                                const actionStyle = getActionStyle(log.tipo_accao)
                                                return (
                                                    <tr key={i}>
                                                        <td className={style.DateCol}>
                                                            {new Date(log.data_hora).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </td>
                                                        <td className={style.UserCol}>
                                                            <div className={style.UserInfo}>
                                                                <span className={style.UserInitial}>{(log.funcionario_nome || "S")[0]}</span>
                                                                {log.funcionario_nome || log.aluno_nome || "Sistema"}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className={`${style.ActionBadge} ${actionStyle.class}`}>
                                                                {actionStyle.icon} {actionStyle.label}
                                                            </span>
                                                        </td>
                                                        <td className={style.DetailsCell}>
                                                            {log.detalhes || `Realizada operação de ${log.tipo_accao.toLowerCase()} no módulo de gestão.`}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                    {auditLogs.length === 0 && <p className={style.EmptyState}>Nenhum log disponível.</p>}
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
                                        <input
                                            type="password"
                                            placeholder="Digite sua senha atual"
                                            value={passwords.senha_atual}
                                            onChange={(e) => setPasswords({ ...passwords, senha_atual: e.target.value })}
                                        />
                                    </div>
                                    <div className={style.InputGroup}>
                                        <label>Nova Senha</label>
                                        <input
                                            type="password"
                                            placeholder="Mínimo 8 caracteres"
                                            value={passwords.nova_senha}
                                            onChange={(e) => setPasswords({ ...passwords, nova_senha: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className={style.SecurityInfoCards}>
                                    <div className={style.SecurityCard}>
                                        <h4>Segurança da Conta</h4>
                                        <p>Mantenha sua senha segura e não a compartilhe com terceiros. Recomendamos trocar a senha a cada 90 dias.</p>
                                    </div>

                                    <div className={style.ToggleGroup}>
                                        <label className={style.ToggleLabel}>
                                            <span>Autenticação em duas etapas (2FA)</span>
                                            <input type="checkbox" defaultChecked />
                                        </label>
                                        <p className={style.HelperText}>Aumenta a segurança exigindo um código de verificação enviado ao seu email em cada novo login.</p>
                                    </div>

                                    <div className={style.SessionsInfo}>
                                        <h4>Sessões Ativas</h4>
                                        <p>Você está atualmente conectado como <strong>{user?.nome}</strong> ({user?.tipo}).</p>
                                    </div>
                                </div>

                                <button
                                    className={style.SaveButton}
                                    onClick={handleChangePassword}
                                    disabled={loading}
                                >
                                    {loading ? 'Processando...' : 'Atualizar Segurança'}
                                </button>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className={style.SettingSection}>
                                <div className={style.SectionHeader}>
                                    <h3>Notificações e Alertas</h3>
                                    <p>Escolha como deseja ser avisado sobre eventos importantes</p>
                                </div>
                                <div className={style.NotificationList}>
                                    <div className={style.ToggleItem}>
                                        <div className={style.ToggleLabel}>
                                            <h4>Alertas Académicos</h4>
                                            <p>Receber notificações sobre novas notas e faltas.</p>
                                        </div>
                                        <input type="checkbox" defaultChecked />
                                    </div>
                                    <div className={style.ToggleItem}>
                                        <div className={style.ToggleLabel}>
                                            <h4>Alertas Financeiros</h4>
                                            <p>Avisar sobre pagamentos recebidos ou faturas expiradas.</p>
                                        </div>
                                        <input type="checkbox" defaultChecked />
                                    </div>
                                    <div className={style.ToggleItem}>
                                        <div className={style.ToggleLabel}>
                                            <h4>Notificações por Email</h4>
                                            <p>Enviar resumo semanal de atividades para o email oficial.</p>
                                        </div>
                                        <input type="checkbox" />
                                    </div>
                                </div>
                                <button className={style.SaveButton}>Guardar Preferências</button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

