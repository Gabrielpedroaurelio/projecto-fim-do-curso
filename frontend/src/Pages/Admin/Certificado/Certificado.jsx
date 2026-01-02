import { useState } from 'react'
import style from './Certificado.module.css'
import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import Header from '../../../Components/Elements/Header/Header'
import '../../../assets/style/global.style.css'
import { FaCertificate, FaPencilAlt, FaEye, FaDownload, FaCopy, FaTrash } from 'react-icons/fa'

// Sample templates data
const templatesData = [
    { id: 1, name: "Certificado de Conclusão 2024", description: "Modelo oficial para conclusão de curso", lastModified: "2024-01-10", isActive: true },
    { id: 2, name: "Certificado de Participação", description: "Para eventos e workshops", lastModified: "2023-12-15", isActive: false },
    { id: 3, name: "Certificado de Mérito", description: "Reconhecimento de excelência académica", lastModified: "2023-11-20", isActive: false },
]

// Sample generated documents
const documentsData = [
    { id: 1, student: "Eleanor Pena", course: "12ª Classe - Ciências", year: "2023", date: "2024-01-15", status: "Emitido" },
    { id: 2, student: "Jessica Rose", course: "11ª Classe - Letras", year: "2023", date: "2024-01-14", status: "Em Processamento" },
    { id: 3, student: "Jenny Wilson", course: "12ª Classe - Ciências", year: "2023", date: "2024-01-13", status: "Emitido" },
    { id: 4, student: "Guy Hawkins", course: "10ª Classe", year: "2023", date: "2024-01-12", status: "Emitido" },
]

export default function Certificado() {
    const [activeTab, setActiveTab] = useState('modelos')

    const tabs = [
        { id: 'modelos', label: 'Modelos de Certificado', icon: <FaCertificate /> },
        { id: 'documentos', label: 'Certificados Emitidos', icon: <FaCertificate /> }
    ]

    const handleCreateModel = () => {
        console.log('Criar novo modelo de certificado')
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
                <Header text1={"Documentos"} text2={"Certificado"} />

                <div className={style.CertificadoContainer}>
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
                                        <h3>Modelos de Certificado</h3>
                                        <p className={style.Subtitle}>Gerir e personalizar modelos de certificados escolares</p>
                                    </div>
                                    <button className={style.CreateButton} onClick={handleCreateModel}>
                                        + Criar Novo Modelo
                                    </button>
                                </div>

                                {/* Models Grid */}
                                <div className={style.ModelsGrid}>
                                    {templatesData.map(model => (
                                        <div key={model.id} className={style.ModelCard}>
                                            {model.isActive && (
                                                <span className={style.ActiveBadge}>✓ Ativo</span>
                                            )}
                                            <div className={style.ModelIcon}>
                                                <FaCertificate />
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
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Documents Header */}
                                <div className={style.CardHeader}>
                                    <div className={style.HeaderLeft}>
                                        <h3>Certificados Emitidos</h3>
                                        <p className={style.Subtitle}>Visualizar e gerir certificados escolares emitidos</p>
                                    </div>
                                </div>

                                {/* Documents Table */}
                                <div className={style.TableWrapper}>
                                    <table className={style.Table}>
                                        <thead>
                                            <tr>
                                                <th>Estudante</th>
                                                <th>Curso</th>
                                                <th>Ano Letivo</th>
                                                <th>Data de Emissão</th>
                                                <th>Status</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {documentsData.map(doc => (
                                                <tr key={doc.id}>
                                                    <td>
                                                        <div className={style.StudentCell}>
                                                            <div className={style.Avatar}>
                                                                {doc.student.split(' ').map(n => n[0]).join('')}
                                                            </div>
                                                            <span>{doc.student}</span>
                                                        </div>
                                                    </td>
                                                    <td>{doc.course}</td>
                                                    <td>{doc.year}</td>
                                                    <td>{doc.date}</td>
                                                    <td>
                                                        <span className={`${style.StatusBadge} ${doc.status === 'Emitido' ? style.StatusIssued : style.StatusProcessing}`}>
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