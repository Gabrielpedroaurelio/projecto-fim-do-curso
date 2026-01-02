import React from 'react';
import style from './SolicitacaoParent.module.css';

// padrão para todas as paginas
import '../../../../assets/style/global.style.css'
import { Link } from 'react-router-dom'
import MenuNavBarCliente from '../../../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente'
import Cards from '../../../../Components/Elements/Cards/Cards'

const Solicitacao = () => {


  return (
    < div className='containelGeralclient'>
      <MenuNavBarCliente user={'parent'}></MenuNavBarCliente>
      <main className='containelMainclient'>
       

      </main>
    </div>
  );
};

export default Solicitacao;