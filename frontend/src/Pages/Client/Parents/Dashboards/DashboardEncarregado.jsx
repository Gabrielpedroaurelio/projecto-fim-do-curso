import React from 'react';
import style from './DashboardEncarregado.module.css';
import HeaderClient from '../../../../Components/Utils/HeaderClient/HeaderClient';

import { Link } from 'react-router-dom'
import MenuClient from '../../../../Components/Utils/MenuClient/MenuClient';

import { BiDockLeft, BiDockRight, BiHistory, BiLogIn, BiLogOut, BiHomeAlt2 } from 'react-icons/bi';
import { BsFolder, BsFolder2Open, BsHouse, BsLayoutSidebar, BsPeople } from 'react-icons/bs'
import { CiSettings, CiFileOn, CiLogout } from 'react-icons/ci'
import { DiAtom } from 'react-icons/di'
import { FaFile, FaCodePullRequest } from 'react-icons/fa6';

const DashboardsEncarregado = () => {


  return (
    <div className={style.ContainerDashboardAluno}>
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

    </div>
  );
};

export default DashboardsEncarregado;