import React from 'react';
import style from './Schedule.module.css';
import '../../../../assets/style/global.style.css'
import MenuNavBarCliente from '../../../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente'
import Header from '../../../../Components/Elements/Header/Header'
import { RiCalendar2Line, RiTimeLine, RiMapPin2Line } from 'react-icons/ri';

const scheduleData = [
    { time: '08:00 - 08:50', mon: 'Matemática', tue: 'Física', wed: 'TLP', thu: 'Português', fri: 'Inglês' },
    { time: '08:55 - 09:45', mon: 'Matemática', tue: 'Física', wed: 'TLP', thu: 'Português', fri: 'Inglês' },
    { time: '10:00 - 10:50', mon: 'Português', tue: 'Inglês', wed: 'TREI', thu: 'Física', fri: 'Matemática' },
    { time: '10:55 - 11:45', mon: 'Português', tue: 'Inglês', wed: 'TREI', thu: 'Física', fri: 'Matemática' },
    { time: '12:00 - 12:50', mon: 'Química', tue: 'TLP', wed: 'Matemática', thu: 'TREI', fri: 'Química' },
];

const Schedule = () => {
    return (
        <div className='containelGeralclient'>
            <MenuNavBarCliente user={'student'} />
            <main className='containelMainclient'>
                <Header text1="Estudante" text2="Horários" />
                <div className={style.container}>
                    <header className={style.header}>
                        <h1>Meu Horário Semanal</h1>
                        <p>Confira a programação das suas aulas para a semana atual.</p>
                    </header>

                    <div className={style.scheduleWrapper}>
                        <div className={style.grid}>
                            <div className={style.headerRow}>
                                <div className={style.timeCol}><RiTimeLine /> Horário</div>
                                <div>Segunda</div>
                                <div>Terça</div>
                                <div>Quarta</div>
                                <div>Quinta</div>
                                <div>Sexta</div>
                            </div>
                            {scheduleData.map((row, i) => (
                                <div key={i} className={style.row}>
                                    <div className={style.timeCell}>{row.time}</div>
                                    <div className={style.subjectCell}><span>{row.mon}</span></div>
                                    <div className={style.subjectCell}><span>{row.tue}</span></div>
                                    <div className={style.subjectCell}><span>{row.wed}</span></div>
                                    <div className={style.subjectCell}><span>{row.thu}</span></div>
                                    <div className={style.subjectCell}><span>{row.fri}</span></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={style.infoSection}>
                        <div className={style.infoCard}>
                            <RiMapPin2Line />
                            <div>
                                <h4>Localização</h4>
                                <p>Bloco B - Sala 12</p>
                            </div>
                        </div>
                        <div className={style.infoCard}>
                            <RiCalendar2Line />
                            <div>
                                <h4>Semana Acadêmica</h4>
                                <p>Semana 12 (Trimester 2)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Schedule;
