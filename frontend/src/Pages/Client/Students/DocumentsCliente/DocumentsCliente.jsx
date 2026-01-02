import React from 'react';
import style from './DocumentsCliente.module.css';
import '../../../../assets/style/global.style.css'
import MenuNavBarCliente from '../../../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente'
import Header from '../../../../Components/Elements/Header/Header'
import { RiFileList3Line, RiDownloadLine, RiEyeLine } from 'react-icons/ri';

const dummyDocuments = [
  { id: 1, type: 'Declaração de Matrícula', date: '2023-11-20', status: 'Pronto', color: 'statusReady' },
  { id: 2, type: 'Boletim do 1º Trimestre', date: '2023-10-15', status: 'Pendente', color: 'statusPending' },
  { id: 3, type: 'Certificado de Conclusão', date: '2023-12-01', status: 'Rejeitado', color: 'statusRejected' },
];

const DocumentsCliente = () => {
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
                {dummyDocuments.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <RiFileList3Line className="text-emerald-500" />
                        {doc.type}
                      </div>
                    </td>
                    <td>{doc.date}</td>
                    <td>
                      <span className={`${style.statusBadge} ${style[doc.color]}`}>
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
                            <RiDownloadLine />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentsCliente;