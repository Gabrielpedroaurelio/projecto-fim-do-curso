import React, { useEffect, useState } from 'react';
import style from './DashboardEncarregado.module.css';
import '../../../../assets/style/global.style.css'
import MenuNavBarCliente from '../../../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente'
import Header from '../../../../Components/Elements/Header/Header'
import Cards from '../../../../Components/Elements/Cards/Cards'
import CardsDocments from '../../../../Components/Elements/CardsDocuments/CardsDocuments';
import { RiUser3Line, RiBillLine, RiCalendarCheckLine, RiNotification3Line, RiFileList3Line, RiBarChartFill } from 'react-icons/ri'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { useAuth } from '../../../../Context/AuthContext';
import api from '../../../../Services/api';

const DashboardEncarregado = () => {
  const { user } = useAuth();
  const [educandos, setEducandos] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const [educandosRes, performanceRes] = await Promise.all([
            api.get(`/encarregados/${user.id}/educandos/`),
            api.get(`/encarregados/${user.id}/rendimento_educandos/`)
          ]);
          setEducandos(educandosRes.data);
          setPerformance(performanceRes.data);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className='containelGeralclient'>
      <MenuNavBarCliente user={'parent'} />
      <main className='containelMainclient'>
        <Header text1="Dashboard" text2="Visão Geral" />

        <div className={style.dashboardContainer}>
          <header className={style.welcomeSection}>
            <h1>Bem-vindo, Sr(a). {user?.nome?.split(' ')[0] || 'Encarregado'}</h1>
            <p>Acompanhe o percurso académico e os rendimentos dos seus educandos de forma centralizada.</p>
          </header>

          <div className={style.gridCards}>
            <Cards
              icon={<RiUser3Line />}
              title="Educandos Ativos"
              value={loading ? "..." : `${String(educandos.length).padStart(2, '0')} Alunos`}
              value_percentual={0}
            />
            <Cards
              icon={<RiBarChartFill />}
              title="Média do Grupo"
              value={loading ? "..." : (performance.reduce((acc, curr) => acc + curr.media, 0) / (performance.length || 1)).toFixed(1)}
              value_percentual={0}
            />
            <Cards
              icon={<RiNotification3Line />}
              title="Notificações"
              value="03 Novas"
              value_percentual={15}
            />
          </div>

          <div className={style.chartsGrid}>
            <div className={style.cardChart}>
              <div className={style.sectionHeader}>
                <h2>Comparação de Rendimento entre Educandos</h2>
                <p>Média geral de aproveitamento acadêmico por aluno.</p>
              </div>
              <div className={style.chartContainer}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="nome" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 20]} />
                    <Tooltip
                      cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                      contentStyle={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-soft)'
                      }}
                    />
                    <Bar dataKey="media" radius={[6, 6, 0, 0]} barSize={40}>
                      {performance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <section className={style.cardDocuments}>
            <div className={style.sectionHeader}>
              <h2>Acesso Rápido a Serviços</h2>
            </div>
            <div className={style.gridCardsComp}>
              <CardsDocments text="Solicitar Documento" icon={<RiBillLine />} url="/parent/ask" />
              <CardsDocments text="Lista de Educandos" icon={<RiUser3Line />} url="/parent/children" />
              <CardsDocments text="Repositório Digital" icon={<RiFileList3Line />} url="/parent/document" />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardEncarregado;


