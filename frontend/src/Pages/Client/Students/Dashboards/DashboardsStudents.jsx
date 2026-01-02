import React from 'react';
import style from './DashboardsStudents.module.css';
import '../../../../assets/style/global.style.css'
import MenuNavBarCliente from '../../../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente'
import Header from '../../../../Components/Elements/Header/Header'
import Cards from '../../../../Components/Elements/Cards/Cards'
import { RiBillLine, RiCalendarCheckLine, RiBookOpenLine, RiNotification3Line } from 'react-icons/ri'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import CardsDocments from '../../../../Components/Elements/CardsDocuments/CardsDocuments';

const performanceData = [
  { subject: 'Matemática', value: 14, fullMark: 20 },
  { subject: 'Português', value: 16, fullMark: 20 },
  { subject: 'TLP', value: 18, fullMark: 20 },
  { subject: 'TREI', value: 15, fullMark: 20 },
  { subject: 'Inglês', value: 17, fullMark: 20 },
  { subject: 'Física', value: 12, fullMark: 20 },
];

const attendanceData = [
  { name: 'Seg', status: 100 },
  { name: 'Ter', status: 80 },
  { name: 'Qua', status: 100 },
  { name: 'Qui', status: 90 },
  { name: 'Sex', status: 100 },
];

const DashboardsStudents = () => {
  return (
    <div className='containelGeralclient'>
      <MenuNavBarCliente user={'student'} />
      <main className='containelMainclient'>
        <Header text1="Estudante" text2="Dashboard" />
        <div className={style.dashboardContainer}>
          <header className={style.welcomeSection}>
            <h1>Bem-vindo de volta, Gabriel! 👋</h1>
            <p>Seu progresso acadêmico está excelente hoje.</p>
          </header>

          <div className={style.gridCards}>
            <Cards
              icon={<RiBillLine />}
              title="Solicitações"
              value="3 Ativas"
              value_percentual={12}
            />
            <Cards
              icon={<RiBookOpenLine />}
              title="Média Geral"
              value="15.4"
              value_percentual={5.2}
            />
            <Cards
              icon={<RiCalendarCheckLine />}
              title="Presença"
              value="94%"
              value_percentual={2.1}
            />
            <Cards
              icon={<RiNotification3Line />}
              title="Notificações"
              value="5 Novas"
              value_percentual={10}
            />
          </div>

          <div className={style.chartsGrid}>
            <div className={style.cardChart}>
              <div className={style.sectionHeader}>
                <h2>Frequência Semanal</h2>
              </div>
              <div className={style.chartContainer}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}% `} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-soft)'
                      }}
                      itemStyle={{ color: 'var(--text-main)' }}
                      cursor={{ fill: 'var(--bg-page)', opacity: 0.4 }}
                    />
                    <Bar dataKey="status" fill="var(--green-primay)" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={style.cardChart}>
              <div className={style.sectionHeader}>
                <h2>Desempenho por Disciplina</h2>
              </div>
              <div className={style.chartContainer}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                    <PolarGrid stroke="var(--border-color)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 20]} tick={false} axisLine={false} />
                    <Radar
                      name="Nota"
                      dataKey="value"
                      stroke="var(--green-primay)"
                      fill="var(--green-primay)"
                      fillOpacity={0.6}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <section className={style.cardDocuments}>
            <div className={style.sectionHeader}>
              <h2>Acesso Rápido</h2>
            </div>
            <div className={style.gridCards}>
              <CardsDocments text="Declaração" icon={<RiBillLine />} url="/student/ask" />
              <CardsDocments text="Certificado" icon={<RiBillLine />} url="/student/ask" />
              <CardsDocments text="Boletim" icon={<RiBillLine />} url="/student/document" />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardsStudents;
