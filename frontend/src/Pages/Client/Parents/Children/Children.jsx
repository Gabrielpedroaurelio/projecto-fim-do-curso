import React, { useEffect, useState } from 'react';
import style from './Children.module.css';

// padrão para todas as paginas
import '../../../../assets/style/global.style.css'
import { Link } from 'react-router-dom'
import MenuNavBarCliente from '../../../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente'
import Header from '../../../../Components/Elements/Header/Header'
import { RiUser3Line, RiArrowRightSLine } from 'react-icons/ri'
import { useAuth } from '../../../../Context/AuthContext';
import api from '../../../../Services/api';

const Children = () => {
  const { user } = useAuth();
  const [childrenData, setChildrenData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        if (user?.id) {
          const response = await api.get(`/encarregados/${user.id}/educandos/`);
          setChildrenData(response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar educandos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, [user]);

  return (
    <div className='containelGeralclient'>
      <MenuNavBarCliente user={'parent'} />
      <main className='containelMainclient'>
        <Header text1="Meus Educandos" text2="Gestão de Alunos" />

        <div className={style.childrenContainer}>
          <header className={style.sectionHeader}>
            <h1>Gestão de Educandos 🎓</h1>
            <p>Acompanhe o desempenho individual, assiduidade e situação administrativa de cada um dos seus educandos.</p>
          </header>

          <div className={style.childrenGrid}>
            {loading ? (
              <p>Carregando educandos...</p>
            ) : childrenData.length > 0 ? (
              childrenData.map((child) => (
                <Link to="/parent/actionstudent" key={child.id_aluno} className={style.childCard}>
                  <div className={style.avatar}>
                    {child.img_path ? (
                      <img src={child.img_path} alt={child.nome_completo} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <RiUser3Line />
                    )}
                  </div>

                  <div className={style.info}>
                    <h3>{child.nome_completo}</h3>
                    <p>{child.classe_nivel || 'Classe N/A'} - {child.curso_nome || 'Curso N/A'}</p>
                    <small className="text-gray-400">Turma: {child.turma_codigo || 'N/A'}</small>
                  </div>

                  <div className={style.stats}>
                    <div className={style.statItem}>
                      <span className={style.statValue}>---</span>
                      <span className={style.statLabel}>Média</span>
                    </div>
                    <div className={style.statItem}>
                      <span className={style.statValue}>---</span>
                      <span className={style.statLabel}>Presença</span>
                    </div>
                    <div className={style.statItem}>
                      <span className={`${style.statValue} ${child.status_aluno === 'Activo' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {child.status_aluno}
                      </span>
                      <span className={style.statLabel}>Status</span>
                    </div>
                  </div>

                  <div className={style.actions}>
                    <button className={style.btnAction}>
                      Ver Detalhes <RiArrowRightSLine />
                    </button>
                  </div>
                </Link>
              ))
            ) : (
              <p>Nenhum educando vinculado a este encarregado.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Children;

