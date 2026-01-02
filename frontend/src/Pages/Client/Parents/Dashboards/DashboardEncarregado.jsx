import React from 'react';
import style from './DashboardEncarregado.module.css';

// padrão para todas as paginas
import '../../../../assets/style/global.style.css'
import { Link } from 'react-router-dom'
import MenuNavBarCliente from '../../../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente'
import Cards from '../../../../Components/Elements/Cards/Cards'

const DashboardEncarregado = () => {


  return (
    < div className='containelGeralclient'>
      <MenuNavBarCliente user={'parent'}></MenuNavBarCliente>
      <main className='containelMainclient'>
       

      </main>
    </div>
  );
};

export default DashboardEncarregado;