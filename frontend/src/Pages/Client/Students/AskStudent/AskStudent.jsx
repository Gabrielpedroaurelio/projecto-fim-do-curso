import React from 'react';
import style from './AskStudent.module.css';
import { Link } from 'react-router-dom'
import MenuNavBarCliente from '../../../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente'
const AskStudent = () => {


  return (
    <>
    <MenuNavBarCliente user={'student'}></MenuNavBarCliente>
  
    </>
  );
};

export default AskStudent;