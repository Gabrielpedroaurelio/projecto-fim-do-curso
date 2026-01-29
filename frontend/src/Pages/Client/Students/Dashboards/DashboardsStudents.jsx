import React, { useEffect, useState } from 'react';
import style from './DashboardsStudents.module.css';
import '../../../../assets/style/global.style.css'
import MenuNavBarCliente from '../../../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente'
import Header from '../../../../Components/Elements/Header/Header'
import Cards from '../../../../Components/Elements/Cards/Cards'
import { RiFileList3Line, RiBookOpenLine, RiCalendarEventLine, RiNotification3Line, RiShieldUserLine, RiArticleLine, RiPieChartLine, RiLineChartLine } from 'react-icons/ri'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import CardsDocments from '../../../../Components/Elements/CardsDocuments/CardsDocuments';
import { useAuth } from '../../../../Context/AuthContext';
import api from '../../../../Services/api';

const DashboardsStudents = () => {
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState({
    media_geral: 0,
    presenca_percentual: 0,
    total_faltas: 0,
    notas_por_disciplina: []
  });
  const [documentsStats, setDocumentsStats] = useState({
    boletim: 0,
    declaracao: 0,
    certificado: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [boletimResponse, documentsResponse] = await Promise.all([
          api.get(`/alunos/${user.id}/boletim/`),
          api.get(`/solicitacoes/?id_aluno=${user.id}&status=PAGO`)
        ]);

        setStats(boletimResponse.data);

        // Contar documentos por tipo
        const docs = documentsResponse.data.results || documentsResponse.data || [];
        const counts = {
          boletim: docs.filter(d => d.tipo_documento === 'BOLETIM').length,
          declaracao: docs.filter(d => d.tipo_documento.includes('DECLARAÇÃO') || d.tipo_documento.includes('DECLARACAO')).length,
          certificado: docs.filter(d => d.tipo_documento === 'CERTIFICADO').length
        };
        setDocumentsStats(counts);

        setIsLoaded(true);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
        setIsLoaded(true);
      }
    };
    if (user?.id) fetchData();
  }, [user]);

  // Map backend notes to evolution chart
  const performanceData = stats.notas_por_disciplina.length > 0
    ? stats.notas_por_disciplina.map(n => ({ month: n.disciplina.substring(0, 3), grade: n.media_final_valor }))
    : [
      { month: 'Jan', grade: 0 },
      { month: 'Fev', grade: 0 },
      { month: 'Mar', grade: 0 },
      { month: 'Abr', grade: 0 },
    ];

  const attendanceData = [
    { name: 'Total', status: stats.presenca_percentual },
    { name: 'Meta', status: 75 },
    { name: 'Hist.', status: 90 },
  ];

  return (
    <div className='containelGeralclient'>
      <MenuNavBarCliente user={'student'} />
      <main className='containelMainclient'>
        <Header text1="Estudante" text2="Dashboard" />
        <div className={`${style.dashboardContainer} ${isLoaded ? style.loaded : ''}`}>
          <header className={style.welcomeSection}>
            <h1>Bem-vindo de volta, {user?.nome || 'Estudante'}</h1>
            <p>Acompanhe seu progresso acadêmico.</p>
          </header>

          <div className={style.scrollWrapper}>
            <div className={style.gridCards}>
              <Cards
                icon={<RiLineChartLine size={30} />}
                title="Média Geral"
                value={stats.media_geral.toString()}
                value_percentual={(stats.media_geral >= 10 ? 5 : -2) + "%"}
              />
              <Cards
                icon={<RiPieChartLine size={30} />}
                title="Presença Total"
                value={`${stats.presenca_percentual}%`}
                value_percentual={(stats.presenca_percentual >= 75 ? 2.1 : -4.5) + "%"}
              />
              <Cards
                icon={<RiArticleLine size={30} />}
                title="Faltas Acumuladas"
                value={`${stats.total_faltas} Faltas`}
                value_percentual={(0) + '%'}
              />
              <Cards
                icon={<RiFileList3Line size={30} />}
                title="Status Geral"
                value={stats.media_geral >= 10 ? "Aprovado" : "Em Risco"}
                value_percentual={stats.media_geral + "%"}
              />
            </div>
          </div>

          <div className={style.chartsGrid}>
            <div className={style.cardChart}>
              <div className={style.sectionHeader}>
                <h2>Evolução Acadêmica</h2>
              </div>
              <div className={style.chartContainer}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorGrade" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 20]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-soft)'
                      }}
                    />
                    <Area type="monotone" dataKey="grade" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorGrade)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={style.cardChart}>
              <div className={style.sectionHeader}>
                <h2>Documentos Gerados</h2>
              </div>
              <div className={style.chartContainer}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Boletins', value: documentsStats.boletim, color: '#0ea5e9' },
                        { name: 'Declarações', value: documentsStats.declaracao, color: '#8b5cf6' },
                        { name: 'Certificados', value: documentsStats.certificado, color: '#10b981' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, value }) => value > 0 ? `${value}` : ''}
                      labelLine={false}
                    >
                      {[
                        { name: 'Boletins', value: documentsStats.boletim, color: '#0ea5e9' },
                        { name: 'Declarações', value: documentsStats.declaracao, color: '#8b5cf6' },
                        { name: 'Certificados', value: documentsStats.certificado, color: '#10b981' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-soft)',
                        padding: '8px 12px'
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      formatter={(value) => <span style={{ fontSize: '12px', color: 'var(--text-main)' }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <section className={style.quickAccessSection}>
            <div className={style.sectionHeader}>
              <h2>Acesso Rápido</h2>
            </div>
            <div className={style.quickAccessGrid}>
              <div className={style.revealItem}>
                <CardsDocments text="Solicitações" icon={<RiFileList3Line size={50} />} url="/student/ask" />
              </div>
              <div className={style.revealItem}>
                <CardsDocments text="Notas e Avaliações" icon={<RiShieldUserLine size={50} />} url="/student/grades" />
              </div>
              <div className={style.revealItem}>
                <CardsDocments text="Documentos" icon={<RiCalendarEventLine size={50} />} url="/student/document" />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardsStudents;
