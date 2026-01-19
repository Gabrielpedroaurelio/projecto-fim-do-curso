import React, { useEffect, useState } from 'react';
import style from './ChildrenActions.module.css';

// padrão para todas as paginas
import '../../../../assets/style/global.style.css'
import MenuNavBarCliente from '../../../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente'
import Header from '../../../../Components/Elements/Header/Header'
import { RiUser3Line, RiArrowLeftLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import api from '../../../../Services/api';

const ChildrenActions = () => {
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentData = localStorage.getItem('selectedStudent');
    if (studentData) {
      const parsedStudent = JSON.parse(studentData);
      setChild(parsedStudent);
      fetchHistory(parsedStudent.id_aluno);
    } else {
      navigate('/parent/children');
    }
  }, [navigate]);

  const fetchHistory = async (studentId) => {
    try {
      const response = await api.get(`/solicitacoes/?id_aluno=${studentId}`);
      setHistory(response.data);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'aprovado':
      case 'pago':
      case 'concluido':
        return style.statusReady;
      case 'pendente':
        return style.statusPending;
      case 'rejeitado':
        return style.statusRejected;
      default:
        return style.statusPending;
    }
  };

  if (!child) return null;

  return (
    <div className='containelGeralclient'>
      <MenuNavBarCliente user={'parent'} />
      <main className='containelMainclient'>
        <Header text1="Perfil do Educando" text2="Histórico e Ações" />

        <div className={style.detailsContainer}>
          <div className={style.backNav}>
            <button onClick={() => navigate('/parent/children')} className={style.backBtn}>
              <RiArrowLeftLine /> Voltar para lista
            </button>
          </div>

          <div className={style.childHeader}>
            <div className={style.avatarLarge}>
              {child.img_path ? (
                <img src={child.img_path} alt={child.nome_completo} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <RiUser3Line />
              )}
            </div>
            <div className={style.headerInfo}>
              <h1>{child.nome_completo}</h1>
              <p>{child.classe_nivel}ª Classe - Turma {child.turma_codigo} | Matrícula nº {child.numero_matricula}</p>
            </div>
          </div>

          <div className={style.historySection}>
            <h2>Histórico de Solicitações e Movimentos</h2>
            <div className={style.tableContainer}>
              {loading ? (
                <p>Carregando histórico...</p>
              ) : history.length > 0 ? (
                <table className={style.historyTable}>
                  <thead>
                    <tr>
                      <th>Ref./Tipo</th>
                      <th>Data de Pedido</th>
                      <th>Estado Atual</th>
                      <th>Acção</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id_solicitacao}>
                        <td><strong>{item.tipo_documento}</strong></td>
                        <td>{new Date(item.data_solicitacao).toLocaleDateString('pt-BR')}</td>
                        <td>
                          <span className={`${style.statusBadge} ${getStatusClass(item.status_solicitacao)}`}>
                            {item.status_solicitacao}
                          </span>
                        </td>
                        <td>
                          <button className="text-emerald-500 font-semibold hover:underline">
                            Ver Detalhes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className={style.emptyMsg}>Nenhuma solicitação encontrada para este educando.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChildrenActions;
