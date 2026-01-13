import { useState } from 'react'
import style from './Boletim.module.css'
import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import Header from '../../../Components/Elements/Header/Header'
import '../../../assets/style/global.style.css'
import { FaFileAlt, FaPencilAlt, FaEye, FaDownload, FaCopy, FaTrash } from 'react-icons/fa'

// Sample templates data
const templatesData = [
    { id: 1, name: "Modelo Padrão 2024", description: "Modelo oficial do boletim escolar", lastModified: "2024-01-10", isActive: true },
    { id: 2, name: "Modelo Simplificado", description: "Versão reduzida para impressão", lastModified: "2023-12-15", isActive: false },
    { id: 3, name: "Modelo Detalhado", description: "Com notas e observações completas", lastModified: "2023-11-20", isActive: false },
]

// Sample generated documents
const documentsData = [
    { id: 1, student: "Eleanor Pena", class: "10ª Classe", period: "1º Trimestre", date: "2024-01-15", status: "Finalizado" },
    { id: 2, student: "Jessica Rose", class: "11ª Classe", period: "1º Trimestre", date: "2024-01-14", status: "Rascunho" },
    { id: 3, student: "Jenny Wilson", class: "9ª Classe", period: "1º Trimestre", date: "2024-01-13", status: "Finalizado" },
]

export default function Boletim() {
    const [activeTab, setActiveTab] = useState('modelos')
    const [searchTerm, setSearchTerm] = useState('')

    const filteredDocuments = documentsData.filter(doc =>
        doc.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.class.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const filteredTemplates = templatesData.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const tabs = [
        { id: 'modelos', label: 'Modelos de Boletim', icon: <FaFileAlt /> },
        { id: 'documentos', label: 'Boletins Gerados', icon: <FaFileAlt /> }
    ]

    const handleCreateModel = () => {
        console.log('Criar novo modelo de boletim')
    }

    const handleEditModel = (model) => {
        console.log('Editar modelo:', model)
    }

    const handleActivateModel = (model) => {
        console.log('Ativar modelo:', model)
    }

    const handleDuplicateModel = (model) => {
        console.log('Duplicar modelo:', model)
    }

    const handleDeleteModel = (model) => {
        console.log('Eliminar modelo:', model)
    }

    const handleViewDocument = (doc) => {
        console.log('Visualizar documento:', doc)
    }

    const handleDownloadDocument = (doc) => {
        console.log('Download documento:', doc)
    }

    return (
        <div className="ContainerGeneral">
            <NavBarMenu />
            <main className="ContainerMain">
                <Header text1={"Documentos"} text2={"Boletim"} onSearch={setSearchTerm} />

                <div className={style.BoletimContainer}>
                    {/* Tabs Navigation */}
                    <div className={style.TabsContainer}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`${style.TabButton} ${activeTab === tab.id ? style.TabActive : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className={style.TabIcon}>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className={style.ContentCard}>
                        {activeTab === 'modelos' ? (
                            <>
                                {/* Models Header */}
                                <div className={style.CardHeader}>
                                    <div className={style.HeaderLeft}>
                                        <h3>Modelos de Boletim</h3>
                                        <p className={style.Subtitle}>Gerir e personalizar modelos de boletim escolar</p>
                                    </div>
                                    <button className={style.CreateButton} onClick={handleCreateModel}>
                                        + Criar Novo Modelo
                                    </button>
                                </div>

                                {/* Models Grid */}
                                <div className={style.ModelsGrid}>
                                    {filteredTemplates.map(model => (
                                        <div key={model.id} className={style.ModelCard}>
                                            {model.isActive && (
                                                <span className={style.ActiveBadge}>✓ Ativo</span>
                                            )}
                                            <div className={style.ModelIcon}>
                                                <FaFileAlt />
                                            </div>
                                            <h4>{model.name}</h4>
                                            <p>{model.description}</p>
                                            <div className={style.ModelMeta}>
                                                <span>Modificado: {model.lastModified}</span>
                                            </div>
                                            <div className={style.ModelActions}>
                                                <button
                                                    className={style.BtnEdit}
                                                    onClick={() => handleEditModel(model)}
                                                    title="Editar Modelo"
                                                >
                                                    <FaPencilAlt /> Editar
                                                </button>
                                                {!model.isActive && (
                                                    <button
                                                        className={style.BtnActivate}
                                                        onClick={() => handleActivateModel(model)}
                                                        title="Ativar Modelo"
                                                    >
                                                        Ativar
                                                    </button>
                                                )}
                                                <button
                                                    className={style.BtnDuplicate}
                                                    onClick={() => handleDuplicateModel(model)}
                                                    title="Duplicar Modelo"
                                                >
                                                    <FaCopy />
                                                </button>
                                                <button
                                                    className={style.BtnDelete}
                                                    onClick={() => handleDeleteModel(model)}
                                                    title="Eliminar"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredTemplates.length === 0 && (
                                        <p className={style.EmptyState}>Nenhum modelo encontrado para "{searchTerm}"</p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Documents Header */}
                                <div className={style.CardHeader}>
                                    <div className={style.HeaderLeft}>
                                        <h3>Boletins Gerados</h3>
                                        <p className={style.Subtitle}>Visualizar e gerir boletins escolares emitidos</p>
                                    </div>
                                </div>

                                {/* Documents Table */}
                                <div className={style.TableWrapper}>
                                    <table className={style.Table}>
                                        <thead>
                                            <tr>
                                                <th>Estudante</th>
                                                <th>Classe</th>
                                                <th>Período</th>
                                                <th>Data de Emissão</th>
                                                <th>Status</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredDocuments.map(doc => (
                                                <tr key={doc.id}>
                                                    <td>
                                                        <div className={style.StudentCell}>
                                                            <div className={style.Avatar}>
                                                                {doc.student.split(' ').map(n => n[0]).join('')}
                                                            </div>
                                                            <span>{doc.student}</span>
                                                        </div>
                                                    </td>
                                                    <td>{doc.class}</td>
                                                    <td>{doc.period}</td>
                                                    <td>{doc.date}</td>
                                                    <td>
                                                        <span className={`${style.StatusBadge} ${doc.status === 'Finalizado' ? style.StatusFinished : style.StatusDraft}`}>
                                                            {doc.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className={style.ActionButtons}>
                                                            <button
                                                                className={style.ViewBtn}
                                                                onClick={() => handleViewDocument(doc)}
                                                                title="Visualizar"
                                                            >
                                                                <FaEye />
                                                            </button>
                                                            <button
                                                                className={style.DownloadBtn}
                                                                onClick={() => handleDownloadDocument(doc)}
                                                                title="Download"
                                                            >
                                                                <FaDownload />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredDocuments.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className={style.EmptyState}>
                                                        Nenhum boletim encontrado para "{searchTerm}"
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
