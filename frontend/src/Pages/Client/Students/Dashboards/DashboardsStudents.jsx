import React from 'react';
import style from './DashboardsStudents.module.css';
import HeaderClient from '../../../../Components/Utils/HeaderClient/HeaderClient';

import { Link } from 'react-router-dom'
import MenuClient from '../../../../Components/Utils/MenuClient/MenuClient';

import { BiDockLeft, BiDetail, BiReceipt, BiFile, BiFileBlank, BiDockRight, BiHistory, BiLogIn, BiLogOut, BiHomeAlt2 } from 'react-icons/bi';
import { BsFolder, BsFolder2Open, BsHouse, BsLayoutSidebar, BsPeople } from 'react-icons/bs'
import { CiSettings, CiFileOn, CiLogout } from 'react-icons/ci'
import { DiAtom } from 'react-icons/di'
import { FaFile, FaCodePullRequest } from 'react-icons/fa6';
const notas = [
  {
    "subject": "Matematica",
    'nota': 15.5
  },
  {
    "subject": "Portugues",
    'nota': 14.5
  },
  {
    "subject": "Inglês",
    'nota': 12.5
  },
  {
    "subject": "Física",
    'nota': 19.5 
  },
]
const DashboardsStudents = () => {


  return (
    <div className={style.ContainerDashboardAluno}>
      <HeaderClient />
      <MenuClient>
        <Link to="/">
          <span><BsHouse /></span>
          <span>Dashboads</span>
        </Link>
        <Link to='documents/'>
          <span><BsFolder /></span>
          <span>Documentos</span>
        </Link>
      </MenuClient>
      <div className={style.containerGeneral}>
        <div>
          <div >
            <h1>SOLICITAR DOCUMENTOS</h1>
            <div className={style.cardsDocumentos}>
              <Link>
                <span className={style.icon}>< BiReceipt size={40} /></span>
                <span>Declarações</span>
              </Link>
              <Link>
                <span className={style.icon}>
                  <BiFileBlank size={40} />
                </span>
                <span>Certificados</span>
              </Link>
              <Link>
                <span className={style.icon}>
                  <BiFile size={40} />
                </span>
                <span>Boletins</span>
              </Link>
            </div>
          </div>
          <div>
            <h3>MINHAS NOTAS RECENTES</h3>
            <div className={style.tableNotas}>
              <div className={style.header}>
                <span>Disciplina</span>
                <span>Avaliação</span>
              </div>
              <div className={style.body}>
                {
                  notas.map((nota) => (
                    <div className={style.DataNota} key={nota.subject}>
                      <span>{nota.subject}</span>
                      <span>{nota.nota} Valores</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          <div className={style.cardNoticiasRecentes}>
            <h3>AVISOS IMPORTANTES</h3>
              <ul>
                <li>Reunião na proxima semana</li>
                <li>Provas Começam em 10/12/2025</li>
              </ul>
          </div>
          <div>
            <h3>PROGRESSO GERAL</h3>
                <h1>[Espaco para Grafico de compração entre as disciplinas]</h1>
          </div>
          <div>
            <h3>TOTAL DOCUMENTOS</h3>

          </div>
        </div>
      </div>



    </div>
  );
};

export default DashboardsStudents;