import React from 'react';
import style from './Documentos.module.css';

// padrão para todas as paginas
import '../../../../assets/style/global.style.css'
import MenuNavBarCliente from '../../../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente'
import Header from '../../../../Components/Elements/Header/Header'
import { RiFileList3Line, RiDownloadLine, RiEyeLine } from 'react-icons/ri';

const parentDocuments = [
  { id: 1, type: 'Declaração de Matrícula', child: 'Ana Bela Gabriel', date: '2023-11-20', status: 'Pronto', color: 'statusReady' },
  { id: 2, type: 'Boletim do 1º Trimestre', child: 'João Pedro Gabriel', date: '2023-11-15', status: 'Pronto', color: 'statusReady' },
  { id: 3, type: 'Certificado de Notas', child: 'Ana Bela Gabriel', date: '2023-12-05', status: 'Pendente', color: 'statusPending' },
];

const Documentos = () => {
  return (
    <div className='containelGeralclient'>
      <MenuNavBarCliente user={'parent'} />
      <main className='containelMainclient'>
        <Header text1="Documentos" text2="Repositório Oficial" />

        <div className={style.container}>
          <header className={style.header}>
            <h1>Gestão Documental 📂</h1>
            <p>Aceda e faça o download de documentos oficiais, boletins de notas e certificados de todos os seus educandos.</p>
          </header>

          <div className={style.tableContainer}>
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
                {parentDocuments.map((doc) => (
                  <tr key={doc.id}>
                    <td><strong>{doc.child}</strong></td>
                    <td>
                      <div className="flex items-center gap-3">
                        <RiFileList3Line className="text-emerald-500 text-xl" />
                        <span>{doc.type}</span>
                      </div>
                    </td>
                    <td>{doc.date}</td>
                    <td>
                      <span className={`${style.statusBadge} ${style[doc.color]}`}>
                        <span className="w-2 h-2 rounded-full bg-current mr-2 opacity-50" />
                        {doc.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className={`${style.actionBtn} ${style.viewBtn} `} title="Visualizar">
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

export default Documentos;