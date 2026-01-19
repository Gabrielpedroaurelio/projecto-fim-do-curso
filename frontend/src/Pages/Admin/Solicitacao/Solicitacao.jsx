import { useState, useEffect } from 'react'
import style from './Solicitacao.module.css'
import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import Header from '../../../Components/Elements/Header/Header'
import '../../../assets/style/global.style.css'
import { FaMagnifyingGlass, FaPencil, FaTrash, FaDownload, FaEye } from 'react-icons/fa6'
import { IoFilterSharp } from 'react-icons/io5'
import api from '../../../Services/api'
import SolicitacaoFlow from '../../../Components/Features/Documents/SolicitacaoFlow' // Importar Flow

export default function Solicitacao() {
    console.log("Solicitacao Page Loaded (Admin)");
    const [activeTab, setActiveTab] = useState('boletim')
    const [searchTerm, setSearchTerm] = useState('')
    const [filterDays, setFilterDays] = useState(30)
    const [solicitacoes, setSolicitacoes] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)

    const fetchSolicitacoes = async () => {
        console.log("Fetching solicitações...");
        try {
            const response = await api.get('solicitacoes/')
            console.log("API Response:", response);
            console.log("Response data:", response.data);
            const data = response.data.results || response.data
            console.log("Processed data:", data);
            console.log("Data length:", data.length);
            setSolicitacoes(data)
        } catch (error) {
            console.error("Erro ao carregar solicitações:", error)
            console.error("Error details:", error.response?.data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSolicitacoes()
    }, [])

    // Reset page when tab or filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [activeTab, searchTerm, filterDays])

    const [showModal, setShowModal] = useState(false)

    const tabs = [
        { id: 'boletim', label: 'Boletim', icon: '' },
        { id: 'declaracao', label: 'Declaração', icon: '' },
        { id: 'certificado', label: 'Certificado', icon: '' }
    ]

    const handleRequest = () => {
        setShowModal(true)
    }

    const handleCloseModal = (result) => {
        setShowModal(false)
        if (result) {
            // Se houve sucesso, recarregar a lista
            fetchSolicitacoes();
        }
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
            'pago': style.StatusApproved,
            'aprovado': style.StatusApproved,
            'pendente': style.StatusPending,
            'em_processamento': style.StatusProcessing,
            'rejeitado': style.StatusRejected
        }
        return statusClasses[status?.toLowerCase()] || style.StatusDefault
    }

    // Filtering logic
    const filteredData = solicitacoes.filter(item => {
        // Simple type check (can be improved)
        const typeMatch = item.tipo_documento?.toLowerCase().includes(activeTab) ||
            (activeTab === 'declaracao' && item.tipo_documento?.toLowerCase().includes('declaração'));

        const nameMatch = item.aluno_nome?.toLowerCase().includes(searchTerm.toLowerCase())

        // Date filter
        const itemDate = new Date(item.data_solicitacao)
        const diffTime = Math.abs(new Date() - itemDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        const dateMatch = diffDays <= filterDays

        return typeMatch && nameMatch && dateMatch
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
                {loading ? <div className="loading">Carregando...</div> : (

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
                                        + Nova Solicitação (Presencial)
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
                                            <th>Estudante</th>
                                            <th>Documento</th>
                                            <th>Data Solicitação</th>
                                            <th>Status</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.length > 0 ? (
                                            currentData.map((item) => (
                                                <tr key={item.id_solicitacao || item.id}>
                                                    <td>
                                                        <div className={style.StudentCell}>
                                                            <div className={style.Avatar}>
                                                                {item.aluno_img ? (
                                                                    <img src={item.aluno_img} alt={item.aluno_nome} />
                                                                ) : (
                                                                    item.aluno_nome?.split(' ').map(n => n[0]).join('') || 'A'
                                                                )}
                                                            </div>
                                                            <span>{item.aluno_nome}</span>
                                                        </div>
                                                    </td>
                                                    <td>{item.tipo_documento}</td>
                                                    <td>{new Date(item.data_solicitacao).toLocaleDateString()}</td>
                                                    <td>
                                                        <span className={`${style.StatusBadge} ${getStatusBadge(item.status_solicitacao)}`}>
                                                            {item.status_solicitacao}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className={style.ActionButtons}>
                                                            {/* Actions can be enhanced later */}
                                                            <button
                                                                className={style.ViewBtn}
                                                                onClick={() => handleView(item)}
                                                                title="Visualizar"
                                                            >
                                                                <FaEye />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className={style.EmptyState}>
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
                )}

                {/* Modal for New Request with SolicitacaoFlow */}
                {showModal && (
                    <div className={style.ModalOverlay} onClick={() => handleCloseModal(false)}>
                        <div className={style.ModalContent} onClick={(e) => e.stopPropagation()} style={{ width: '800px', maxWidth: '95%' }}>
                            <div className={style.ModalHeader}>
                                <h3>Nova Solicitação (Presencial)</h3>
                                <button className={style.CloseButton} onClick={() => handleCloseModal(false)}>×</button>
                            </div>

                            <div style={{ padding: '20px' }}>
                                <SolicitacaoFlow
                                    userType="funcionario"
                                    onComplete={handleCloseModal}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}