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
    FaTrash
} from 'react-icons/fa6'

export default function Settings() {
    const { user, setUser } = useAuth()
    const [activeTab, setActiveTab] = useState('profile')
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

    useEffect(() => {
        fetchConfig()
        fetchBackups()
    }, [])

    const fetchConfig = async () => {
        try {
            const response = await api.get('configuracao-sistema/')
            const data = response.data.results || response.data
            if (data.length > 0) {
                setConfig(data[0])
            }
        } catch (error) {
            console.error("Erro ao carregar configurações:", error)
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

    const handleSaveConfig = async () => {
        setLoading(true)
        try {
            if (config?.id_configuracao) {
                await api.patch(`configuracao-sistema/${config.id_configuracao}/`, config)
            } else {
                const response = await api.post('configuracao-sistema/', config)
                setConfig(response.data)
            }
            alert('Configurações da instituição salvas!')
        } catch (error) {
            console.error("Erro ao salvar configurações:", error)
        } finally {
            setLoading(false)
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
        { id: 'profile', label: 'Meu Perfil', icon: <FaUser /> },
        { id: 'general', label: 'Instituição', icon: <FaBuilding /> },
        { id: 'backup', label: 'Backup', icon: <FaDatabase /> },
        { id: 'security', label: 'Segurança', icon: <FaShieldHalved /> },
    ]

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
                                            onChange={(e) => setProfileData({ ...profileData, nome: e.target.value })}
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
                                            value={passwords.senha_atual}
                                            onChange={(e) => setPasswords({ ...passwords, senha_atual: e.target.value })}
                                        />
                                    </div>
                                    <div className={style.InputGroup}>
                                        <label>Nova Senha</label>
                                        <input
                                            type="password"
                                            value={passwords.nova_senha}
                                            onChange={(e) => setPasswords({ ...passwords, nova_senha: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className={style.ToggleGroup}>
                                    <label className={style.ToggleLabel}>
                                        <span>Autenticação em duas etapas (2FA)</span>
                                        <input type="checkbox" defaultChecked />
                                    </label>
                                    <p className={style.HelperText}>Aumenta a segurança exigindo código via email.</p>
                                </div>
                                <button
                                    className={style.SaveButton}
                                    onClick={handleChangePassword}
                                    disabled={loading}
                                >
                                    {loading ? 'Salvando...' : 'Atualizar Segurança'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

