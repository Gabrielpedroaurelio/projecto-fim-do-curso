import React, { useEffect, useState } from 'react';
import style from './Documentos.module.css';

// padrão para todas as paginas
import '../../../../assets/style/global.style.css'
import MenuNavBarCliente from '../../../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente'
import Header from '../../../../Components/Elements/Header/Header'
import { RiFileList3Line, RiDownloadLine, RiEyeLine } from 'react-icons/ri';
import { useAuth } from '../../../../Context/AuthContext';
import api from '../../../../Services/api';
import Loading from '../../../../Components/Elements/Loading/Loading';

const Documentos = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        if (user?.id) {
          const response = await api.get(`/documentos/para_encarregado/?id_encarregado=${user.id}`);
          setDocuments(response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar documentos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [user]);

  const handleDownload = (doc) => {
    if (doc.caminho_pdf) {
      window.open(`http://localhost:8000${doc.caminho_pdf}`, '_blank');
    } else {
      alert("Arquivo PDF não disponível.");
    }
  };

  return (
    <div className='containelGeralclient'>
      <MenuNavBarCliente user={'parent'} />
      <main className='containelMainclient'>
        <Header text1="Documentos" text2="Repositório Oficial" />

        <div className={style.container}>
          <header className={style.header}>
            <h1>Gestão de Documentos</h1>
            <p>Aceda e faça o download de documentos oficiais, boletins de notas e certificados de todos os seus educandos.</p>
          </header>

          <div className={style.tableContainer}>
            {loading ? (
              <p><Loading/></p>
            ) : documents.length > 0 ? (
              <table className={style.table}>
                <thead>
                  <tr>
                    <th>Educando</th>
                    <th>Designação do Documento</th>
                    <th>Emissão</th>
                    <th>Estado</th>
                    <th>Operações</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id_documento}>
                      <td><strong>{doc.aluno_nome || 'Aluno'}</strong></td>
                      <td>
                        <div className="flex items-center gap-3">
                          <RiFileList3Line className="text-emerald-500 text-xl" />
                          <span>{doc.tipo_documento}</span>
                        </div>
                      </td>
                      <td>{new Date(doc.data_emissao).toLocaleDateString()}</td>
                      <td>
                        <span className={`${style.statusBadge} ${style.statusReady}`}>
                          <span className="w-2 h-2 rounded-full bg-current mr-2 opacity-50" />
                          Pronto
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className={`${style.actionBtn} ${style.viewBtn} `} title="Visualizar" onClick={() => handleDownload(doc)}>
                            <RiEyeLine />
                          </button>
                          <button className={style.actionBtn} title="Baixar" onClick={() => handleDownload(doc)}>
                            <RiDownloadLine />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Nenhum documento disponível para download.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Documentos;

