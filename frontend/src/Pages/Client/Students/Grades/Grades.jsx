import React from 'react';
import style from './Grades.module.css';
import '../../../../assets/style/global.style.css'
import MenuNavBarCliente from '../../../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente'
import Header from '../../../../Components/Elements/Header/Header'
import { RiLineChartLine, RiArrowUpSLine, RiArrowDownSLine, RiMedalLine, RiExpandDiagonalLine } from 'react-icons/ri';

const gradesData = [
    { subject: 'Matemática', q1: 15, q2: 14, q3: 16, avg: 15.0, status: 'Aprovado' },
    { subject: 'Língua Portuguesa', q1: 12, q2: 15, q3: 14, avg: 13.7, status: 'Aprovado' },
    { subject: 'Física', q1: 10, q2: 12, q3: 11, avg: 11.0, status: 'Aprovado' },
    { subject: 'Química', q1: 14, q2: 13, q3: 15, avg: 14.0, status: 'Aprovado' },
    { subject: 'TLP', q1: 18, q2: 19, q3: 18, avg: 18.3, status: 'Excelente' },
    { subject: 'TREI', q1: 16, q2: 15, q3: 17, avg: 16.0, status: 'Bom' },
    { subject: 'Inglês', q1: 17, q2: 18, q3: 17, avg: 17.3, status: 'Excelente' },
];

const Grades = () => {
    return (
        <div className='containelGeralclient'>
            <MenuNavBarCliente user={'student'} />
            <main className='containelMainclient'>
                <Header text1="Estudante" text2="Minhas Notas" />
                <div className={style.container}>
                    <header className={style.header}>
                        <h1>Minhas Notas</h1>
                        <p>Acompanhe seu desempenho acadêmico detalhado por disciplina.</p>
                    </header>

                    <div className={style.statsGrid}>
                        <div className={style.statCard}>
                            <div className={style.statHeader}>
                                <span className={style.statLabel}>Média Geral</span>
                                <RiLineChartLine />
                            </div>
                            <div className={style.statValue}>15.4</div>
                            <span className={`${style.statChange} ${style.positive}`}>
                                <RiArrowUpSLine /> +0.5 este trimestre
                            </span>
                        </div>
                        <div className={style.statCard}>
                            <div className={style.statHeader}>
                                <span className={style.statLabel}>Melhor Disciplina</span>
                                <RiMedalLine />
                            </div>
                            <div className={style.statValue}>TLP</div>
                            <span className={style.subjectBadge}>18.3 / 20</span>
                        </div>
                        <div className={style.statCard}>
                            <div className={style.statHeader}>
                                <span className={style.statLabel}>Status Acadêmico</span>
                                <RiExpandDiagonalLine />
                            </div>
                            <div className={`${style.statValue} ${style.statusOk}`}>Ótimo</div>
                            <span className={style.statSubtext}>Reserva: 100%</span>
                        </div>
                    </div>

                    <div className={style.tableWrapper}>
                        <table className={style.table}>
                            <thead>
                                <tr>
                                    <th>Disciplina</th>
                                    <th>1º Trimestre</th>
                                    <th>2º Trimestre</th>
                                    <th>3º Trimestre</th>
                                    <th>Média Final</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gradesData.map((item, index) => (
                                    <tr key={index}>
                                        <td className={style.subjectName}>{item.subject}</td>
                                        <td>{item.q1}</td>
                                        <td>{item.q2}</td>
                                        <td>{item.q3}</td>
                                        <td className={style.gradeAvg}>{item.avg}</td>
                                        <td>
                                            <span className={`${style.badge} ${item.status === 'Excelente' ? style.excellent : style.approved}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Grades;
