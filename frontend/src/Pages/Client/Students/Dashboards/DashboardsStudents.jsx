import React from 'react';
import './DashboardsStudents.css';
// Placeholder para ícones (necessário instalar: npm install react-icons)
import { FaUserGraduate, FaChalkboardTeacher, FaUsers, FaDollarSign, FaSearch } from 'react-icons/fa'; 

// --- Componente para o Card de Estatísticas (Stats) ---
const StatCard = ({ title, value, icon, color }) => (
  // Usamos uma variável CSS '--card-color' para definir a cor da borda/ícone
  <div className="stat-card" style={{ '--card-color': color }}>
    <div className="stat-value-container">
      <h3>{title}</h3>
      <p className="stat-value">{value}</p>
    </div>
    <div className="stat-icon-container">
      {icon}
    </div>
  </div>
);

// --- Componente Principal do Dashboard ---
const DashboardsStudents = () => {
  // Dados dos 4 cartões de estatísticas (baseado nas cores da imagem)
  const stats = [
    { title: 'Students', value: '15.00K', icon: <FaUserGraduate size={30} />, color: '#B085F5' }, // Roxo
    { title: 'Teachers', value: '2.00K', icon: <FaChalkboardTeacher size={30} />, color: '#56C5F5' }, // Azul Claro
    { title: 'Parents', value: '5.6K', icon: <FaUsers size={30} />, color: '#FF987A' }, // Laranja
    { title: 'Earnings', value: '$19.3K', icon: <FaDollarSign size={30} />, color: '#66BB6A' }, // Verde
  ];

  return (
    // O container simula o fundo escuro da janela do navegador
    <div className="dashboard-container-wrapper"> 
        <div className="dashboard-container">
            {/* 1. Sidebar (Barra Lateral) */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-logo">IA Academy</div>
                <nav>
                    <ul>
                        <li className="active">Admin</li> {/* Elemento ativo com destaque roxo */}
                        <li>Students</li>
                        <li>Teachers</li>
                        {/* ... outros links ... */}
                    </ul>
                </nav>
            </aside>

            {/* 2. Main Content (Conteúdo Principal) */}
            <main className="dashboard-main">
                {/* Header do Conteúdo Principal */}
                <header className="dashboard-header">
                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input type="text" placeholder="What do you want to find?" />
                    </div>
                    {/* Placeholder para ícones de notificação e perfil */}
                    <div className="user-profile-placeholder">Perfil | Notificações</div>
                </header>

                {/* Dashboard Grid */}
                <section className="dashboard-grid">
                    <h2>Admin Dashboard</h2>

                    {/* Linha dos Cartões de Estatísticas */}
                    <div className="stats-row">
                        {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                        ))}
                    </div>

                    {/* Área dos Gráficos e Listas (Placeholders) */}
                    <div className="main-widgets-area">
                        <div className="chart-and-donut">
                            <div className="widget chart-result">
                                <h3>All Exam Result</h3>
                                <p>Gráfico de Barras (Placeholder)</p>
                            </div>
                            <div className="widget star-students">
                                <h3>Star Students</h3>
                                <p>Tabela de Alunos (Placeholder)</p>
                            </div>
                        </div>

                        <div className="list-widgets">
                            <div className="widget donut-chart">
                                <h3>Students</h3>
                                <p>Gráfico Donut (Placeholder)</p>
                            </div>
                            <div className="widget exam-results">
                                <h3>All Exam Results</h3>
                                <p>Lista de Resultados (Placeholder)</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    </div>
  );
};

export default DashboardsStudents;