import React from 'react';
import style from './DashboardEncarregado.module.css';
import HeaderClient from '../../../../Components/Utils/HeaderClient/HeaderClient';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Link } from 'react-router-dom'
import MenuClient from '../../../../Components/Utils/MenuClient/MenuClient';

import { BiDockLeft, BiDockRight, BiHistory, BiLogIn, BiLogOut, BiHomeAlt2 } from 'react-icons/bi';
import { BsFolder, BsFolder2Open, BsHouse, BsLayoutSidebar, BsPeople } from 'react-icons/bs'
import { CiSettings, CiFileOn, CiLogout } from 'react-icons/ci'
import { DiAtom } from 'react-icons/di'
import { FaFile, FaCodePullRequest } from 'react-icons/fa6';
 
const DashboardsEncarregado = () => {


  return (
    <div className={style.ContainerDashboardEncarregados}>
      <HeaderClient />
      <MenuClient>
        <Link href="">
          <span><BsHouse /></span>
          <span>Dashboads</span>
        </Link>
        <Link href="">
          <span><BsFolder /></span>
          <span>Documentos</span>
        </Link>
        <Link href="">
          <span><BsPeople /></span>
          <span>Meus Educandos</span>
        </Link>
      </MenuClient>
      <main className={style.containerGeneral}>
        <div>
          <div className={style.charts}>
            <h1>Visão Geral</h1>
            <div className={style.chart}>

            </div>
          </div>
          <div className={style.mychildren}>
            <h1>Meus Educandos</h1>
            <div className={style.gridChildren}>
 

            </div>
          </div>
          <div className={style.recentactivity}>
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardsEncarregado;