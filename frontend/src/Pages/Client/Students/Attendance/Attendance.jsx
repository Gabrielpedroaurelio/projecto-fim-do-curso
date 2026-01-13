import React from 'react';
import style from './Attendance.module.css';
import '../../../../assets/style/global.style.css'
import MenuNavBarCliente from '../../../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente'
import Header from '../../../../Components/Elements/Header/Header'
import { RiUserFollowLine, RiUserUnfollowLine, RiInformationLine } from 'react-icons/ri';

const attendanceStats = [
    { subject: 'Matemática', total: 40, present: 38, absent: 2, percent: 95 },
    { subject: 'TLP', total: 45, present: 45, absent: 0, percent: 100 },
    { subject: 'Física', total: 36, present: 30, absent: 6, percent: 83 },
    { subject: 'Inglês', total: 30, present: 29, absent: 1, percent: 96 },
    { subject: 'Química', total: 30, present: 28, absent: 2, percent: 93 },
];

const Attendance = () => {
    return (
        <div className='containelGeralclient'>
            <MenuNavBarCliente user={'student'} />
            <main className='containelMainclient'>
                <Header text1="Estudante" text2="Presenças" />
                <div className={style.container}>
                    <header className={style.header}>
                        <h1>Controle de Presenças</h1>
                        <p>Monitore sua frequência escolar em cada disciplina.</p>
                    </header>

                    <div className={style.grid}>
                        {attendanceStats.map((item, index) => (
                            <div key={index} className={style.attendanceCard}>
                                <div className={style.cardHeader}>
                                    <h3>{item.subject}</h3>
                                    <span className={item.percent >= 90 ? style.badgeSuccess : style.badgeWarning}>
                                        {item.percent}%
                                    </span>
                                </div>

                                <div className={style.progressBarContainer}>
                                    <div
                                        className={style.progressBar}
                                        style={{ width: `${item.percent}%`, backgroundColor: item.percent >= 90 ? '#0ea5e9' : '#f59e0b' }}
                                    ></div>
                                </div>

                                <div className={style.cardDetails}>
                                    <div className={style.detailItem}>
                                        <RiUserFollowLine className={style.iconSuccess} />
                                        <span>{item.present} Presenças</span>
                                    </div>
                                    <div className={style.detailItem}>
                                        <RiUserUnfollowLine className={style.iconDanger} />
                                        <span>{item.absent} Faltas</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={style.alertSection}>
                        <RiInformationLine />
                        <p>Lembre-se: A frequência mínima exigida para aprovação é de <strong>75%</strong> por disciplina.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Attendance;
