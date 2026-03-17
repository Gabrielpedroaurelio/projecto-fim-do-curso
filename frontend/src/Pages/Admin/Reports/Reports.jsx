
import React, { useState, useEffect, useMemo } from 'react';
import style from './Reports.module.css';
import { 
    HiOutlineClipboardList, 
    HiOutlineUsers, 
    HiOutlineTrendingUp, 
    HiOutlineShieldCheck, 
    HiOutlineSearch,
    HiOutlineFilter,
    HiOutlineDownload
} from 'react-icons/hi';
import { FaFilePdf, FaFileCsv } from 'react-icons/fa';
import api from '../../../Services/api';
import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu';
import Header from '../../../Components/Elements/Header/Header';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const insignia = "/src/assets/images/angola.png"; 

const Reports = () => {
    const [activeTab, setActiveTab] = useState('solicitacoes');
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Filtros
    const [filters, setFilters] = useState({
        status: '',
        start_date: '',
        end_date: '',
        mes: new Date().getMonth() + 1,
        ano: new Date().getFullYear(),
        tipo_auditoria: 'historico',
        classe: '',
        turma: '',
        cargo: ''
    });

    // Metadados e Configuração
    const [metadata, setMetadata] = useState({
        classes: [],
        turmas: [],
        cargos: []
    });
    const [systemConfig, setSystemConfig] = useState(null);

    const tabs = [
        { id: 'solicitacoes', label: 'Solicitações', icon: <HiOutlineClipboardList /> },
        { id: 'alunos', label: 'Alunos', icon: <HiOutlineUsers /> },
        { id: 'funcionarios', label: 'Funcionários', icon: <HiOutlineUsers /> },
        { id: 'auditoria', label: 'Auditoria & Logins', icon: <HiOutlineShieldCheck /> },
    ];

    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const [classesRes, turmasRes, cargosRes, configRes] = await Promise.all([
                    api.get('/classes/'),
                    api.get('/turmas/'),
                    api.get('/cargos/'),
                    api.get('/reports/config/')
                ]);
                setMetadata({
                    classes: classesRes.data.results || classesRes.data,
                    turmas: turmasRes.data.results || turmasRes.data,
                    cargos: cargosRes.data.results || cargosRes.data
                });
                setSystemConfig(configRes.data);
            } catch (err) {
                console.error("Erro ao carregar metadados", err);
            }
        };
        fetchMeta();
    }, []);

    // Busca de dados brutos (DUMP completo do backend)
    useEffect(() => {
        const fetchTabData = async () => {
            setLoading(true);
            try {
                let endpoint = '';
                switch(activeTab) {
                    case 'solicitacoes': endpoint = '/reports/data/solicitacoes/'; break;
                    case 'alunos': endpoint = '/reports/data/alunos/'; break;
                    case 'funcionarios': endpoint = '/reports/data/funcionarios/'; break;
                    case 'auditoria': endpoint = '/reports/data/auditoria/'; break;
                    default: endpoint = '/reports/data/solicitacoes/';
                }
                const response = await api.get(endpoint);
                setRawData(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
                setRawData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTabData();
    }, [activeTab]);

    // Lógica de filtragem LOCAL (Frontend)
    const filteredData = useMemo(() => {
        return rawData.filter(item => {
            // Filtro por termo de busca geral
            const stringified = JSON.stringify(item).toLowerCase();
            if (searchTerm && !stringified.includes(searchTerm.toLowerCase())) return false;

            // Filtros específicos por Tab
            if (activeTab === 'solicitacoes') {
                if (filters.status && item.status_solicitacao !== filters.status) return false;
                if (filters.start_date && new Date(item.data_solicitacao) < new Date(filters.start_date)) return false;
                if (filters.end_date && new Date(item.data_solicitacao) > new Date(filters.end_date)) return false;
            }

            if (activeTab === 'alunos') {
                if (filters.classe && item.id_turma?.id_classe !== parseInt(filters.classe)) return false;
                if (filters.turma && item.id_turma?.id_turma !== parseInt(filters.turma)) return false;
            }

            if (activeTab === 'funcionarios') {
                if (filters.cargo && item.id_cargo?.id_cargo !== parseInt(filters.cargo)) return false;
            }

            return true;
        });
    }, [rawData, searchTerm, filters, activeTab]);

    // Geração de PDF no CLIENTE via jsPDF
    const generatePDF = () => {
        const doc = new jsPDF();
        const tabTitle = tabs.find(t => t.id === activeTab).label;
        
        // Cabeçalho Oficial
        doc.setFontSize(10);
        doc.text("REPÚBLICA DE ANGOLA", 105, 15, { align: "center" });
        doc.text("MINISTÉRIO DA EDUCAÇÃO", 105, 20, { align: "center" });
        doc.text("INSTITUTO POLITÉCNICO MAIOMBE", 105, 25, { align: "center" });
        
        doc.setFontSize(14);
        doc.text(`RELATÓRIO DE ${tabTitle.toUpperCase()}`, 105, 40, { align: "center" });
        
        doc.setFontSize(9);
        doc.text(`Data de Emissão: ${new Date().toLocaleString()}`, 15, 50);
        doc.text(`Total de Registos: ${filteredData.length}`, 195, 50, { align: "right" });

        // Mapear dados para a tabela do PDF
        let columns = [];
        let rows = [];

        if (activeTab === 'solicitacoes') {
            columns = ["ID", "Aluno", "Documento", "Data", "Status", "Valor"];
            rows = filteredData.map(s => [s.id_solicitacao, s.aluno_nome, s.tipo_documento, new Date(s.data_solicitacao).toLocaleDateString(), s.status_solicitacao, `${s.valor_rupe} AKZ`]);
        } else if (activeTab === 'alunos') {
            columns = ["Nome", "Gênero", "BI", "Turma", "Curso"];
            rows = filteredData.map(a => [a.nome_completo, a.genero, a.numero_bi, a.id_turma?.codigo_turma || '-', a.id_turma?.id_curso?.nome_curso || '-']);
        } else if (activeTab === 'funcionarios') {
            columns = ["Nome", "Cargo", "Telefone", "Status"];
            rows = filteredData.map(f => [f.nome_completo, f.id_cargo?.nome_cargo || '-', f.telefone, f.status_funcionario]);
        } else {
            columns = Object.keys(filteredData[0] || {}).slice(0, 6);
            rows = filteredData.map(item => Object.values(item).slice(0, 6));
        }

        doc.autoTable({
            startY: 55,
            head: [columns],
            body: rows,
            theme: 'striped',
            headStyles: { fillStyle: '#2563eb' }
        });

        doc.save(`relatorio_${activeTab}_${new Date().getTime()}.pdf`);
    };

    const generateCSV = () => {
        if (filteredData.length === 0) return;
        const headers = Object.keys(filteredData[0]);
        const csvContent = [
            headers.join(','),
            ...filteredData.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `relatorio_${activeTab}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={'ContainerGeneral'}>
            <NavBarMenu />
            <main className={'ContainerMain'}>
                <Header text1={"Administração"} text2={"Relatórios Inteligentes"} onSearch={setSearchTerm} />
                
                <div className={style.ReportsContainer}>
                    {/* Navegação por Tabs */}
                    <div className={style.TabsContainer}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`${style.TabButton} ${activeTab === tab.id ? style.ActiveTab : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Filtros Inteligentes (Locais) */}
                    <div className={`${style.FiltersSection} glass-panel`}>
                        <div className={style.FilterGroup}>
                            <label><HiOutlineSearch /> Pesquisa Rápida</label>
                            <input 
                                type="text" 
                                placeholder="Filtrar em real-time..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                        </div>

                        {activeTab === 'solicitacoes' && (
                            <>
                                <div className={style.FilterGroup}>
                                    <label>Status</label>
                                    <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
                                        <option value="">Todos os Estados</option>
                                        <option value="pendente">Pendente</option>
                                        <option value="pago">Pago</option>
                                        <option value="disponivel">Disponível</option>
                                    </select>
                                </div>
                                <div className={style.FilterGroup}>
                                    <label>Desde</label>
                                    <input type="date" value={filters.start_date} onChange={(e) => setFilters({...filters, start_date: e.target.value})} />
                                </div>
                            </>
                        )}

                        {activeTab === 'alunos' && (
                            <>
                                <div className={style.FilterGroup}>
                                    <label>Filtro por Classe</label>
                                    <select value={filters.classe} onChange={(e) => setFilters({...filters, classe: e.target.value})}>
                                        <option value="">Todas as Classes</option>
                                        {metadata.classes.map(c => <option key={c.id_classe} value={c.id_classe}>{c.nivel}ª Classe</option>)}
                                    </select>
                                </div>
                            </>
                        )}

                        {activeTab === 'funcionarios' && (
                            <div className={style.FilterGroup}>
                                <label>Filtrar por Cargo</label>
                                <select value={filters.cargo} onChange={(e) => setFilters({...filters, cargo: e.target.value})}>
                                    <option value="">Todos os Cargos</option>
                                    {metadata.cargos.map(c => <option key={c.id_cargo} value={c.id_cargo}>{c.nome_cargo}</option>)}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Acções de Exportação */}
                    <div className={style.ActionsRow}>
                        <div className={style.StatsInfo}>
                            Exibindo <strong>{filteredData.length}</strong> de {rawData.length} registos
                        </div>
                        <div className={style.ButtonsGap}>
                            <button className={`${style.BtnExport} ${style.BtnPdf}`} onClick={generatePDF}>
                                <FaFilePdf /> Exportar PDF
                            </button>
                            <button className={`${style.BtnExport} ${style.BtnCsv}`} onClick={generateCSV}>
                                <FaFileCsv /> Exportar CSV
                            </button>
                        </div>
                    </div>

                    {/* Previsualização Dinâmica */}
                    <div className={style.PreviewSection}>
                        {loading ? (
                            <div className={style.SkeletonLoader}>
                                <div className={style.SkeletonCircle}></div>
                                <p>Sincronizando dados com o servidor...</p>
                            </div>
                        ) : (
                            <div className={style.PaperWrapper}>
                                <div className={style.Paper}>
                                    <div className={style.InsígniaHeader}>
                                        <img src={insignia} className={style.InsígniaImg} alt="Angola" />
                                        <p>Relatório Institucional</p>
                                        <span className={style.PaperBadge}>R-00{tabs.findIndex(t => t.id === activeTab) + 1}</span>
                                    </div>

                                    <div className={style.ReportTitle}>
                                        {tabs.find(t => t.id === activeTab).label}
                                    </div>

                                    <div className={style.TableContainer}>
                                        <table className={style.PreviewTable}>
                                            <thead>
                                                <tr>
                                                    {activeTab === 'solicitacoes' && <><th>ID</th><th>Aluno</th><th>Tipo</th><th>Data</th><th>Status</th></>}
                                                    {activeTab === 'alunos' && <><th>Nome</th><th>Turma</th><th>BI</th></>}
                                                    {activeTab === 'funcionarios' && <><th>Nome</th><th>Cargo</th><th>Telefone</th></>}
                                                    {activeTab === 'auditoria' && <><th>Ação</th><th>Usuário</th><th>Data</th></>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredData.slice(0, 15).map((item, i) => (
                                                    <tr key={i}>
                                                        {activeTab === 'solicitacoes' && (
                                                            <>
                                                                <td>#{item.id_solicitacao}</td>
                                                                <td>{item.aluno_nome}</td>
                                                                <td>{item.tipo_documento}</td>
                                                                <td>{new Date(item.data_solicitacao).toLocaleDateString()}</td>
                                                                <td><span className={style.Badge}>{item.status_solicitacao}</span></td>
                                                            </>
                                                        )}
                                                        {activeTab === 'alunos' && (
                                                            <>
                                                                <td className={style.BoldText}>{item.nome_completo}</td>
                                                                <td>{item.id_turma?.codigo_turma || '-'}</td>
                                                                <td>{item.numero_bi}</td>
                                                            </>
                                                        )}
                                                        {activeTab === 'funcionarios' && (
                                                            <>
                                                                <td className={style.BoldText}>{item.nome_completo}</td>
                                                                <td>{item.id_cargo?.nome_cargo || '-'}</td>
                                                                <td>{item.telefone}</td>
                                                            </>
                                                        )}
                                                        {activeTab === 'auditoria' && (
                                                            <>
                                                                <td>{item.tipo_accao}</td>
                                                                <td>{item.usuario_nome}</td>
                                                                <td>{new Date(item.data_hora).toLocaleString()}</td>
                                                            </>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {filteredData.length > 15 && (
                                            <div className={style.TruncatedNote}>
                                                ... e mais {filteredData.length - 15} itens. (O PDF completo conterá todos os dados)
                                            </div>
                                        )}
                                        {filteredData.length === 0 && <div className={style.EmptyState}>Nenhum dado corresponde aos filtros atuais.</div>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Reports;
