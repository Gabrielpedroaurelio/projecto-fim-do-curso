import React, { useEffect, useState } from 'react';
import style from './DocumentsCliente.module.css';
import '../../../../assets/style/global.style.css'
import MenuNavBarCliente from '../../../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente'
import Header from '../../../../Components/Elements/Header/Header'
import { RiFileList3Line, RiDownload2Line, RiEyeLine } from 'react-icons/ri';
import { useAuth } from '../../../../Context/AuthContext';
import api from '../../../../Services/api';

const DocumentsCliente = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Filtra apenas solicitações com status que permitem download (pagas/processadas)
        const statusFilter = 'pago,disponivel,aguardando_assinatura,impresso';
        const response = await api.get(`/solicitacoes/minhas/?id_aluno=${user.id}&status_solicitacao__in=${statusFilter}`);
        setDocuments(response.data.results || response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar documentos:", error);
        setLoading(false);
      }
    };
    if (user?.id) fetchDocuments();
  }, [user, shouldRefresh]);

  const handleRequestComplete = () => {
    setShowRequestForm(false);
    setShouldRefresh(prev => !prev);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'disponivel': return 'statusReady';
      case 'pendente': return 'statusPending';
      case 'rejeitado': return 'statusRejected';
      case 'pago': return 'statusProcessing';
      case 'aguardando_assinatura': return 'statusProcessing';
      case 'impresso': return 'statusProcessing';
      default: return 'statusPending';
    }
  };

  const handlePrintRUP = async (id) => {
    try {
      const response = await api.get(`/solicitacoes/${id}/imprimir_rup/`);
      if (response.data.download_url) {
        // Força o download do PDF em vez de abrir em nova aba
        const link = document.createElement('a');
        link.href = response.data.download_url;
        link.download = `RUP_Solicitacao_${id}.pdf`; // Nome do arquivo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert("Erro ao obterURL do RUP.");
      }
    } catch (error) {
      console.error("Erro ao imprimir RUP", error);
      alert("Não foi possível gerar o RUP.");
    }
  };

  return (
    <div className='containelGeralclient'>
      <MenuNavBarCliente user={'student'} />
      <main className='containelMainclient'>
        <Header text1="Estudante" text2="Meus Documentos" />
        <div className={style.container}>

          {showRequestForm ? (
            <div className={style.requestSection}>
              <button className={style.backBtn} onClick={() => setShowRequestForm(false)}>
                &larr; Voltar para Meus Documentos
              </button>
              <div className={style.formWrapper}>
                <h2>Nova Solicitação de Documento</h2>
                <SolicitacaoFlow
                  userType="aluno"
                  fixedStudent={user} // Passa o próprio aluno como fixo
                  onComplete={handleRequestComplete}
                />
              </div>
            </div>
          ) : (
            <>
              <header className={style.header}>
                <div>
                  <h1>Meus Documentos</h1>
                  <p>Gerencie suas solicitações e baixe documentos oficiais.</p>
                </div>

              </header>

              <div className={style.tableContainer}>
                <table className={style.table}>
                  <thead>
                    <tr>
                      <th>Tipo de Documento</th>
                      <th>Data</th>
                      <th>Status</th>
                      <th>Expiração RUP</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="5">Carregando seus documentos...</td></tr>
                    ) : documents.length > 0 ? (
                      documents.map((doc) => (
                        <tr key={doc.id_solicitacao}>
                          <td>
                            <div className="flex items-center gap-2">
                              <RiFileList3Line className="text-emerald-500" />
                              {doc.tipo_documento}
                            </div>
                          </td>
                          <td>{new Date(doc.data_solicitacao).toLocaleDateString()}</td>
                          <td>
                            <span className={`${style.statusBadge} ${style[getStatusColor(doc.status_solicitacao)]}`}>
                              {doc.status_solicitacao}
                            </span>
                          </td>
                          <td>
                            {doc.data_expiracao_rup ? new Date(doc.data_expiracao_rup).toLocaleDateString() : '-'}
                          </td>
                          <td>
                            <div className="flex gap-2">
                              {/* Lógica de botões baseada no status */}
                              {doc.status_solicitacao === 'disponivel' && (
                                <button className={style.actionBtn} title="Baixar" onClick={() => window.open(`http://localhost:8000/media/${doc.caminho_pdf}`, '_blank')}>
                                  <RiDownload2Line />
                                </button>
                              )}
                              {doc.status_solicitacao === 'pendente' && (
                                <button
                                  className={style.payBtn}
                                  title="Baixar RUP"
                                  onClick={() => handlePrintRUP(doc.id_solicitacao)}
                                >
                                  Baixar RUP
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="5" className={style.emptyState}>Nenhuma solicitação encontrada.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default DocumentsCliente;
