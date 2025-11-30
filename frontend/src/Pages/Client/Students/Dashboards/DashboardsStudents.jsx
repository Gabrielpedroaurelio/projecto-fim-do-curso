import React from 'react';
import style from './DashboardsStudents.module.css';
import HeaderClient from '../../../../Components/Utils/HeaderClient/HeaderClient';
import MenuClient from '../../../../Components/Utils/MenuClient/MenuClient';

const DashboardsStudents = () => {


    return (
      <div className={style.ContainerDashboardAluno}>
        <HeaderClient />
        <MenuClient/>

      </div>
    );
};

export default DashboardsStudents;