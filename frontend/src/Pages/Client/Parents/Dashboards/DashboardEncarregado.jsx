import React, { useEffect, useState } from 'react';
import style from './DashboardEncarregado.module.css';

// padrão para todas as paginas
import '../../../../assets/style/global.style.css'
import MenuNavBarCliente from '../../../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente'
import Header from '../../../../Components/Elements/Header/Header'
import Cards from '../../../../Components/Elements/Cards/Cards'
import CardsDocments from '../../../../Components/Elements/CardsDocuments/CardsDocuments';
import { RiUser3Line, RiBillLine, RiCalendarCheckLine, RiNotification3Line, RiFileList3Line } from 'react-icons/ri'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useAuth } from '../../../../Context/AuthContext';
import api from '../../../../Services/api';

const childrenPerformance = [
  { name: 'Jan', media: 14.5 },
  { name: 'Fev', media: 15.2 },
  { name: 'Mar', media: 15.8 },
  { name: 'Abr', media: 16.1 },
  { name: 'Mai', media: 16.5 },
  { name: 'Jun', media: 17.2 },
];

const DashboardEncarregado = () => {
  const { user } = useAuth();
  const [educandos, setEducandos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducandos = async () => {
      try {
        if (user?.id) {
          const response = await api.get(`/encarregados/${user.id}/educandos/`);
          setEducandos(response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar educandos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEducandos();
  }, [user]);

  return (
    <div className='containelGeralclient'>
      <MenuNavBarCliente user={'parent'} />
      <main className='containelMainclient'>
        <Header text1="Dashboard" text2="Visão Geral" />

        <div className={style.dashboardContainer}>
          <header className={style.welcomeSection}>
            <h1>Bem-vindo, Sr(a). {user?.nome?.split(' ')[0] || 'Encarregado'}</h1>
            <p>Acompanhe o percurso académico e as notificações dos seus educandos de forma centralizada.</p>
          </header>

          <div className={style.gridCards}>
            <Cards
              icon={<RiUser3Line />}
              title="Educandos Ativos"
              value={loading ? "..." : `${String(educandos.length).padStart(2, '0')} Alunos`}
              value_percentual={0}
            />
            <Cards
              icon={<RiCalendarCheckLine />}
              title="Assiduidade Média"
              value="94.2%"
              value_percentual={2.1}
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
                <h2>Evolução Académica Global</h2>
              </div>
              <div className={style.chartContainer}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={childrenPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} domain={[10, 20]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="media"
                      stroke="var(--green-primay)"
                      strokeWidth={2}
                      dot={{ fill: 'var(--green-primay)', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <section className={style.cardDocuments}>
            <div className={style.sectionHeader}>
              <h2>Acesso Rápido a Serviços</h2>
            </div>
            <div className={style.gridCards}>
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


