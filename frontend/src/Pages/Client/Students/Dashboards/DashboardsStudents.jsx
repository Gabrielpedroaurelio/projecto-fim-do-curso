import React from 'react';
import style from './DashboardsStudents.module.css';
import HeaderClient from '../../../../Components/Utils/HeaderClient/HeaderClient';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Link } from 'react-router-dom'
import MenuClient from '../../../../Components/Utils/MenuClient/MenuClient';

import { BiDockLeft, BiDetail, BiReceipt, BiFile, BiFileBlank, BiDockRight, BiHistory, BiLogIn, BiLogOut, BiHomeAlt2, BiTrendingUp, BiTrendingDown } from 'react-icons/bi';
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
    'nota': 4.5
  },
  {
    "subject": "Inglês",
    'nota': 12.5
  },
  {
    "subject": "Física",
    'nota': 19.5
  },
  {
    "subject": "Matematica",
    'nota': 15.5
  },
  {
    "subject": "Portugues",
    'nota': 4.5
  },
  {
    "subject": "Inglês",
    'nota': 12.5
  },
  {
    "subject": "Física",
    'nota': 19.5
  },
  {
    "subject": "Matematica",
    'nota': 15.5
  },
  {
    "subject": "Portugues",
    'nota': 4.5
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
const revenueData = [
  { name: 'Mat', value: 9 },
  { name: 'PT', value: 15 },
  { name: 'TLP', value: 20 },
  { name: 'TREI', value: 19 },
  { name: 'Port', value: 15 },
  { name: 'Ing', value: 18},
  { name: 'Fisica', value: 15 },
  { name: 'Eletro', value: 14 },
  { name: 'BD', value: 20 },
  { name: 'Vida', value: 18 },
  { name: 'Empreend', value: 18 },
  { name: 'FAI', value: 10 },
];
const DashboardsStudents = () => {


  return (
    <div className={style.ContainerDashboardAluno}>
      <HeaderClient />
      <MenuClient>
        <Link to="/client/student/">
          <span><BsHouse /></span>
          <span>Dashboads</span>
        </Link>
        <Link to='/client/student/documents/'>
          <span><BsFolder /></span>
          <span>Documentos</span>
        </Link>
      </MenuClient>
      <div className={style.containerGeneral}>
        <div>

          <div className={style.cardTypeDocuments}>
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
                      {
                        nota.nota >= 10 ? (

                          <span><span className={style.rightvalue}>+{nota.nota} <BiTrendingUp /></span> </span>
                        ) : (
                          <span><span className={style.leftvalue}>-{nota.nota} <BiTrendingDown /></span> </span>

                        )
                      }
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
              <li>Reunião na proxima semana</li>
              <li>Provas Começam em 10/12/2025</li>
              <li>Reunião na proxima semana</li>
              <li>Provas Começam em 10/12/2025</li>
              <li>Reunião na proxima semana</li>
              <li>Provas Começam em 10/12/2025</li>
              <li>Reunião na proxima semana</li>
              <li>Provas Começam em 10/12/2025</li>
              <li>Reunião na proxima semana</li>
              <li>Provas Começam em 10/12/2025</li>
            </ul>
          </div>
          <div>
            <h3>PROGRESSO GERAL</h3>
            <div>
              <div className={"h-[200px]"}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `Nota ${value}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffffff', border: '1px solid #22ff9fff', borderRadius: '8px' }}
                      itemStyle={{ color: '#000000ff' }}
                      cursor={{ fill: '#ffffffff' }}
                    />
                    <Bar dataKey="value" fill="#22ff9fff" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
                
              </div>
            </div>
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