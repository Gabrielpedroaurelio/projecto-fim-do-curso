import React, { useState, useEffect } from 'react';
import style from './AskStudent.module.css';
import '../../../../assets/style/global.style.css'
import MenuNavBarCliente from '../../../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente'
import Header from '../../../../Components/Elements/Header/Header'
import { useAuth } from '../../../../Context/AuthContext';
import SolicitacaoFlow from '../../../../Components/Features/Documents/SolicitacaoFlow';
import api from '../../../../Services/api';

const AskStudent = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        // Buscar dados completos do aluno
        const response = await api.get(`/alunos/${user.id}/`);
        setStudentData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do aluno:", error);
        // Fallback para dados do contexto
        setStudentData(user);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  if (loading) {
    return (
      <div className='containelGeralclient'>
        <MenuNavBarCliente user={'student'} />
        <main className='containelMainclient'>
          <Header text1="Estudante" text2="Nova Solicitação" />
          <div className={style.container}>
            <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className='containelGeralclient'>
      <MenuNavBarCliente user={'student'} />
      <main className='containelMainclient'>
        <Header text1="Estudante" text2="Nova Solicitação" />
        <div className={style.container}>
          <header className={style.header}>
            <h1>Solicitar Novo Documento</h1>
            <p>Selecione o documento desejado e descreva o motivo da solicitação.</p>
          </header>

          <div className={style.formContainer}>
            <SolicitacaoFlow
              userType="aluno"
              fixedStudent={studentData}
              onComplete={() => console.log("Solicitação completada")}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AskStudent;
