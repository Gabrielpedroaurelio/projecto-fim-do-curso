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

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Re-using the same endpoint as Parents but filtered for this student
        const response = await api.get(`/solicitacaodocumento/minhas/?id_aluno=${user.id}`);
        setDocuments(response.data.results || response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar documentos:", error);
        setLoading(false);
      }
    };
    if (user?.id) fetchDocuments();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pronto': return 'statusReady';
      case 'Pendente': return 'statusPending';
      case 'Rejeitado': return 'statusRejected';
      default: return 'statusPending';
    }
  };

  return (
    <div className='containelGeralclient'>
      <MenuNavBarCliente user={'student'} />
      <main className='containelMainclient'>
        <Header text1="Estudante" text2="Meus Documentos" />
        <div className={style.container}>
          <header className={style.header}>
            <h1>Meus Documentos</h1>
            <p>Abaixo estão as suas solicitações de documentos e o status de cada uma.</p>
          </header>

          <div className={style.tableContainer}>
            <table className={style.table}>
              <thead>
                <tr>
                  <th>Tipo de Documento</th>
                  <th>Data da Solicitação</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4">Carregando seus documentos...</td></tr>
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
                        <span className={`${style.statusBadge} ${style[getStatusColor(doc.status)]}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className={`${style.actionBtn} ${style.viewBtn}`} title="Visualizar">
                            <RiEyeLine />
                          </button>
                          {doc.status === 'Pronto' && (
                            <button className={style.actionBtn} title="Baixar">
                              <RiDownload2Line />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4">Você ainda não possui solicitações de documentos.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentsCliente;
