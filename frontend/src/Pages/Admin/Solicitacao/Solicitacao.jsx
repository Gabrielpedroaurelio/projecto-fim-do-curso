import { useState, useEffect } from 'react'
import style from './Solicitacao.module.css'
import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import Header from '../../../Components/Elements/Header/Header'
import '../../../assets/style/global.style.css'
import { FaMagnifyingGlass, FaPencil, FaTrash, FaDownload, FaEye } from 'react-icons/fa6'
import { IoFilterSharp } from 'react-icons/io5'

// Sample data for requests
const requestsData = {
    boletim: [
        { id: 1, student: "Eleanor Pena", class: "10ª Classe", date: "2024-01-15", status: "Aprovado", format: "PDF" },
        { id: 2, student: "Jessica Rose", class: "11ª Classe", date: "2024-01-14", status: "Pendente", format: "PDF" },
        { id: 3, student: "Jenny Wilson", class: "9ª Classe", date: "2024-01-13", status: "Aprovado", format: "Impresso" },
    ],
    declaracao: [
        { id: 1, student: "Guy Hawkins", type: "Matrícula", date: "2024-01-16", status: "Aprovado", format: "PDF" },
        { id: 2, student: "Jacob Jones", type: "Frequência", date: "2024-01-15", status: "Pendente", format: "PDF" },
    ],
    certificado: [
        { id: 1, student: "Jane Cooper", course: "12ª Classe", date: "2024-01-10", status: "Aprovado", year: "2023" },
        { id: 2, student: "Floyd Miles", course: "11ª Classe", date: "2024-01-09", status: "Em Processamento", year: "2023" },
    ]
}

export default function Solicitacao() {
    const [activeTab, setActiveTab] = useState('boletim')
    const [searchTerm, setSearchTerm] = useState('')
    const [filterDays, setFilterDays] = useState(30)

    // Reset page when tab or filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [activeTab, searchTerm, filterDays])
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        tipoDocumento: '',
        bilheteAluno: '',
        classe: '',
        curso: '',
        ano: new Date().getFullYear().toString()
    })

    const tabs = [
        { id: 'boletim', label: 'Boletim', icon: '' },
        { id: 'declaracao', label: 'Declaração', icon: '' },
        { id: 'certificado', label: 'Certificado', icon: '' }
    ]

    const handleRequest = () => {
        setFormData({
            tipoDocumento: activeTab,
            bilheteAluno: '',
            classe: '',
            curso: '',
            ano: new Date().getFullYear().toString()
        })
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmitRequest = (e) => {
        e.preventDefault()
        console.log('Nova solicitação:', formData)
        // Aqui você adicionaria a lógica para enviar para o backend
        setShowModal(false)
    }


    const handleView = (item) => {
        console.log('Visualizar:', item)
    }

    const handleDownload = (item) => {
        console.log('Download:', item)
    }

    const handleDelete = (item) => {
        console.log('Eliminar:', item)
    }

    const getStatusBadge = (status) => {
        const statusClasses = {
            'Aprovado': style.StatusApproved,
            'Pendente': style.StatusPending,
            'Em Processamento': style.StatusProcessing,
            'Rejeitado': style.StatusRejected
        }
        return statusClasses[status] || style.StatusDefault
    }

    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)

    // Generate large mock data if needed
    const generateMockData = (baseData, count) => {
        const result = []
        for (let i = 0; i < count; i++) {
            const item = baseData[i % baseData.length]
            // Randomize dates within last 90 days
            const date = new Date()
            date.setDate(date.getDate() - Math.floor(Math.random() * 95))
            result.push({
                ...item,
                id: i + 1,
                date: date.toISOString().split('T')[0],
                student: `${item.student} ${i + 1}`
            })
        }
        return result
    }

    const currentTabBaseData = requestsData[activeTab] || []
    const expandedData = generateMockData(currentTabBaseData, 200)

    // Filtering logic
    const filteredData = expandedData.filter(item => {
        const matchesSearch = item.student.toLowerCase().includes(searchTerm.toLowerCase())

        const itemDate = new Date(item.date)
        const diffTime = Math.abs(new Date() - itemDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        const matchesFilter = diffDays <= filterDays

        return matchesSearch && matchesFilter
    })

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    return (
        <div className="ContainerGeneral">
            <NavBarMenu />
            <main className="ContainerMain">
                <Header text1={"Documentos"} text2={"Solicitações"} onSearch={setSearchTerm} />

                <div className={style.SolicitacaoContainer}>
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

                    {/* Content Card */}
                    <div className={style.ContentCard}>
                        {/* Header Controls */}
                        <div className={style.CardHeader}>
                            <div className={style.HeaderLeft}>
                                <h3>Solicitações de {tabs.find(t => t.id === activeTab)?.label}</h3>
                                <p className={style.Subtitle}>Gerir e acompanhar solicitações de documentos</p>
                            </div>
                            <div className={style.HeaderActions}>
                                <button className={style.RequestButton} onClick={handleRequest}>
                                    + Nova Solicitação
                                </button>
                            </div>
                        </div>

                        {/* Search and Filter */}
                        <div className={style.TableControls}>
                            <div className={style.SearchBox}>
                                <FaMagnifyingGlass />
                                <input
                                    type="text"
                                    placeholder="Pesquisar por nome do aluno..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className={style.FilterDropdown}>
                                <IoFilterSharp />
                                <select value={filterDays} onChange={(e) => setFilterDays(e.target.value)}>
                                    <option value={7}>Últimos 7 dias</option>
                                    <option value={30}>Últimos 30 dias</option>
                                    <option value={90}>Últimos 90 dias</option>
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className={style.TableWrapper}>
                            <table className={style.Table}>
                                <thead>
                                    <tr>
                                        <th>

                                        </th>
                                        <th>Estudante</th>
                                        {activeTab === 'boletim' && <th>Classe</th>}
                                        {activeTab === 'declaracao' && <th>Tipo</th>}
                                        {activeTab === 'certificado' && <th>Curso</th>}
                                        <th>Data Solicitação</th>
                                        <th>Status</th>
                                        {activeTab === 'boletim' && <th>Formato</th>}
                                        {activeTab === 'certificado' && <th>Ano</th>}
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.length > 0 ? (
                                        currentData.map((item) => (
                                            <tr key={item.id}>
                                                <td>

                                                </td>
                                                <td>
                                                    <div className={style.StudentCell}>
                                                        <div className={style.Avatar}>
                                                            {item.student.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <span>{item.student}</span>
                                                    </div>
                                                </td>
                                                {activeTab === 'boletim' && <td>{item.class}</td>}
                                                {activeTab === 'declaracao' && <td>{item.type}</td>}
                                                {activeTab === 'certificado' && <td>{item.course}</td>}
                                                <td>{item.date}</td>
                                                <td>
                                                    <span className={`${style.StatusBadge} ${getStatusBadge(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                {activeTab === 'boletim' && <td>{item.format}</td>}
                                                {activeTab === 'certificado' && <td>{item.year}</td>}
                                                <td>
                                                    <div className={style.ActionButtons}>
                                                        <button
                                                            className={style.ViewBtn}
                                                            onClick={() => handleView(item)}
                                                            title="Visualizar"
                                                        >
                                                            <FaEye />
                                                        </button>
                                                        <button
                                                            className={style.DownloadBtn}
                                                            onClick={() => handleDownload(item)}
                                                            title="Download"
                                                        >
                                                            <FaDownload />
                                                        </button>
                                                        <button
                                                            className={style.DeleteBtn}
                                                            onClick={() => handleDelete(item)}
                                                            title="Eliminar"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className={style.EmptyState}>
                                                <div className={style.EmptyStateContent}>
                                                    <span className={style.EmptyIcon}>📭</span>
                                                    <p>Nenhuma solicitação encontrada</p>
                                                    <button className={style.EmptyActionBtn} onClick={handleRequest}>
                                                        Criar primeira solicitação
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className={style.TableFooter}>
                            <div className={style.Pagination}>
                                <button
                                    className={style.PageArrow}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    ‹
                                </button>
                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                    let pageNum = currentPage <= 3 ? i + 1 :
                                        currentPage >= totalPages - 2 ? totalPages - 4 + i :
                                            currentPage - 2 + i;
                                    if (pageNum < 1) pageNum = i + 1;
                                    if (pageNum > totalPages) return null;

                                    return (
                                        <button
                                            key={i}
                                            className={currentPage === pageNum ? style.ActivePage : ''}
                                            onClick={() => handlePageChange(pageNum)}
                                        >
                                            {pageNum}
                                        </button>
                                    )
                                })}
                                <button
                                    className={style.PageArrow}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    ›
                                </button>
                            </div>
                            <div className={style.ResultsInfo}>
                                Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredData.length)} de {filteredData.length} resultados
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal for New Request */}
                {showModal && (
                    <div className={style.ModalOverlay} onClick={handleCloseModal}>
                        <div className={style.ModalContent} onClick={(e) => e.stopPropagation()}>
                            <div className={style.ModalHeader}>
                                <h3>Nova Solicitação de Documento</h3>
                                <button className={style.CloseButton} onClick={handleCloseModal}>×</button>
                            </div>

                            <form onSubmit={handleSubmitRequest} className={style.ModalForm}>
                                <div className={style.FormGroup}>
                                    <label htmlFor="tipoDocumento">Tipo de Documento *</label>
                                    <select
                                        id="tipoDocumento"
                                        name="tipoDocumento"
                                        value={formData.tipoDocumento}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Selecione o tipo</option>
                                        <option value="boletim">Boletim</option>
                                        <option value="declaracao">Declaração</option>
                                        <option value="certificado">Certificado</option>
                                    </select>
                                </div>

                                <div className={style.FormGroup}>
                                    <label htmlFor="bilheteAluno">Bilhete do Aluno *</label>
                                    <input
                                        type="text"
                                        id="bilheteAluno"
                                        name="bilheteAluno"
                                        value={formData.bilheteAluno}
                                        onChange={handleInputChange}
                                        placeholder="Digite o número do bilhete"
                                        required
                                    />
                                </div>

                                <div className={style.FormRow}>
                                    <div className={style.FormGroup}>
                                        <label htmlFor="classe">Classe *</label>
                                        <select
                                            id="classe"
                                            name="classe"
                                            value={formData.classe}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Selecione</option>

                                            <option value="10ª Classe">10ª Classe</option>
                                            <option value="11ª Classe">11ª Classe</option>
                                            <option value="12ª Classe">12ª Classe</option>
                                            <option value="13ª Classe">13ª Classe</option>
                                        </select>
                                    </div>

                                    <div className={style.FormGroup}>
                                        <label htmlFor="curso">Curso *</label>
                                        <select
                                            id="curso"
                                            name="curso"
                                            value={formData.curso}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Selecione</option>
                                            <option value="Informática de Gestão">Informática de Gestão</option>
                                            <option value="Contabilidade de Gestão">Contabilidade de Gestão</option>
                                            <option value="Gestão Empresarial">Gestão Empresarial</option>
                                            <option value="Informática">Informática</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={style.FormGroup}>
                                    <label htmlFor="ano">Ano Letivo *</label>
                                    <input
                                        type="number"
                                        id="ano"
                                        name="ano"
                                        value={formData.ano}
                                        onChange={handleInputChange}
                                        min="2020"
                                        max="2030"
                                        required
                                    />
                                </div>

                                <div className={style.ModalActions}>
                                    <button type="button" className={style.CancelButton} onClick={handleCloseModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className={style.SubmitButton}>
                                        Solicitar Documento
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
} 