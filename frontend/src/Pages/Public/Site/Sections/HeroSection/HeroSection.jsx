import style from './HeroSection.module.css';
import bgImage from '../../../../../assets/images/glenn-carstens-peters-npxXWgQ33ZQ-unsplash2.jpg'; // Using a school image
import { Link } from 'react-router-dom';

export default function HeroSection() {
    return (
        <section className={style.HeroSection}>
            {/* Separate div for background to allow transform without affecting content */}
            <div
                className={style.HeroBackground}
                style={{ backgroundImage: `url(${bgImage})` }}
            ></div>

            <div className={style.Overlay}></div>

            <div className={style.Container}>
                {/* Left Content */}
                <div className={style.Content}>
                    <h1>Transforme o seu Futuro Profissional Conosco</h1>
                    <p>
                        No Instituto Politécnico do Maiombe, oferecemos excelência educacional
                        com cursos práticos projetados para impulsionar a sua carreira no mercado de trabalho.
                    </p>
             
                </div>

                {/* Right Form 
                <div className={style.FormCard}>
                    <h3>Solicite Informações</h3>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className={style.InputGroup}>
                            <input type="text" placeholder="Nome Completo" />
                        </div>
                        <div className={style.InputGroup}>
                            <input type="email" placeholder="Seu Email" />
                        </div>
                        <div className={style.InputGroup}>
                            <input type="tel" placeholder="Telefone" />
                        </div>
                        <div className={style.InputGroup}>
                            <select>
                                <option>Selecione o Curso</option>
                                <option>Informática de Gestão</option>
                                <option>Contabilidade</option>
                                <option>Gestão de Empresas</option>
                                <option>Informática</option>
                            </select>
                        </div>
                        <button type="submit" className={style.SubmitBtn}>Enviar Solicitação</button>
                    </form>
                </div>
                */}
            </div>
        </section>
    );
}
