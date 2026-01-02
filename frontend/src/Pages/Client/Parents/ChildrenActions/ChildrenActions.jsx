import React from 'react';
import style from './ChildrenActions.module.css';

// padrão para todas as paginas
import '../../../../assets/style/global.style.css'
import MenuNavBarCliente from '../../../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente'
import Header from '../../../../Components/Elements/Header/Header'
import { RiUser3Line } from 'react-icons/ri';

const solicitationHistory = [
  { id: 1, type: 'Declaração de Matrícula', date: '20 nov 2023', status: 'Concluído', color: 'statusReady' },
  { id: 2, type: 'Certificado de Notas', date: '05 dez 2023', status: 'Em Processamento', color: 'statusPending' },
  { id: 3, type: 'Pedido de Reunião', date: '12 dez 2023', status: 'Agendado', color: 'statusReady' },
];

const ChildrenActions = () => {
  return (
    <div className='containelGeralclient'>
      <MenuNavBarCliente user={'parent'} />
      <main className='containelMainclient'>
        <Header text1="Perfil do Educando" text2="Histórico e Ações" />

        <div className={style.detailsContainer}>
          <div className={style.childHeader}>
            <div className={style.avatarLarge}>
              <RiUser3Line />
            </div>
            <div className={style.headerInfo}>
              <h1>Ana Bela Gabriel</h1>
              <p>10ª Classe - Turma A | Matrícula nº 14205</p>
            </div>
          </div>

          <div className={style.historySection}>
            <h2>Histórico de Solicitações e Movimentos</h2>
            <div className={style.tableContainer}>
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
                  {solicitationHistory.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.type}</strong></td>
                      <td>{item.date}</td>
                      <td>
                        <span className={`${style.statusBadge} ${style[item.color]}`}>
                          {item.status}
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChildrenActions;