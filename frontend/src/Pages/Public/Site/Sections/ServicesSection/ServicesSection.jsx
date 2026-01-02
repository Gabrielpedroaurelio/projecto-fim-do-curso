import style from './ServicesSection.module.css';
import { FaComputer, FaCalculator, FaUsers, FaArrowRight } from "react-icons/fa6";
import { BsGraphUpArrow } from "react-icons/bs";

export default function ServicesSection() {
    return (
        <section className={style.ServicesSection}>
            <div className={style.Container}>
                <div className={style.Header}>
                    <span className={style.SubTitle}>Nossos Cursos</span>
                    <h2 className={style.Title}>Formação Profissional de Excelência</h2>
                </div>

                <div className={style.Grid}>
                    <div className={style.Card}>
                        <div className={style.IconBox}>
                            <FaComputer />
                        </div>
                        <h3>Informática de Gestão</h3>
                        <p>Domine o planeamento, arquitetura desenvolvimento e administração de sistemas e a gestão de TI com foco empresarial.</p>
              
                    </div>

                    <div className={style.Card}>
                        <div className={style.IconBox}>
                            <BsGraphUpArrow />
                        </div>
                        <h3>Gestão Empresarial</h3>
                        <p>Desenvolva visão estratégica para liderar negócios e otimizar processos.</p>
                    
                    </div>

                    <div className={style.Card}>
                        <div className={style.IconBox}>
                            <FaCalculator />
                        </div>
                        <h3>Contabilidade de Gestão</h3>
                        <p>Especialize-se em análise financeira, custos e tomada de decisão contábil.</p>
                     
                    </div>

                    <div className={style.Card}>
                        <div className={style.IconBox}>
                            <FaUsers />
                        </div>
                        <h3>Informática</h3>
                        <p>Fundamentos sólidos de tecnologia, programação e suporte técnico.</p>
                      
                    </div>
                </div>
            </div>
        </section>
    );
}
