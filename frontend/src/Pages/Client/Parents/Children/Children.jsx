import React from 'react';
import style from './Children.module.css';

// padrão para todas as paginas
import '../../../../assets/style/global.style.css'
import { Link } from 'react-router-dom'
import MenuNavBarCliente from '../../../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente'
import Header from '../../../../Components/Elements/Header/Header'
import { RiUser3Line, RiEyeLine, RiArrowRightSLine } from 'react-icons/ri'

const childrenData = [
  {
    id: 1,
    name: "Ana Bela Gabriel",
    grade: "10ª Classe",
    turma: "A",
    media: 15.4,
    frequencia: "92%",
    status: "Ativo"
  },
  {
    id: 2,
    name: "João Pedro Gabriel",
    grade: "8ª Classe",
    turma: "B",
    media: 14.2,
    frequencia: "85%",
    status: "Ativo"
  }
];

const Children = () => {
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
            {childrenData.map((child) => (
              <Link to="/parent/actionstudent" key={child.id} className={style.childCard}>
                <div className={style.avatar}>
                  <RiUser3Line />
                </div>

                <div className={style.info}>
                  <h3>{child.name}</h3>
                  <p>{child.grade} - Turma {child.turma}</p>
                </div>

                <div className={style.stats}>
                  <div className={style.statItem}>
                    <span className={style.statValue}>{child.media}</span>
                    <span className={style.statLabel}>Média</span>
                  </div>
                  <div className={style.statItem}>
                    <span className={style.statValue}>{child.frequencia}</span>
                    <span className={style.statLabel}>Presença</span>
                  </div>
                  <div className={style.statItem}>
                    <span className={style.statValue}>{child.status}</span>
                    <span className={style.statLabel}>Status</span>
                  </div>
                </div>

                <div className={style.actions}>
                  <button className={style.btnAction}>
                    Ver Detalhes <RiArrowRightSLine />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Children;