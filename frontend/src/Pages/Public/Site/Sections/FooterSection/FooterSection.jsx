import style from './FooterSection.module.css';

export default function FooterSection() {
    return (
        <footer className={style.FooterSection}>
            <div className={style.Container}>
                <div className={style.TopRow}>
                    <div className={style.Col}>
                        <h3>IPM. <br />Maiombe</h3>
                        <p className={style.Description}>
                            Excelência no ensino e formação profissional. Preparando o futuro de Angola, hoje.
                        </p>
                        <p className={style.Description}>Tel: +244 912 345 678<br />Email: geral@ipm.edu.ao</p>
                    </div>
 

                    <div className={style.Col}>
                        <h4>Cursos</h4>
                        <ul className={style.LinksList}>
                            <li><a href="#">Informática de Gestão</a></li>
                            <li><a href="#">Contabilidade de Gestão</a></li>
                            <li><a href="#">Gestão Empresarial</a></li>
                            <li><a href="#">Informática</a></li>
                        </ul>
                    </div>
 
                </div>

                <div className={style.BottomRow}>
                    <p>&copy; 2025 Instituto Politécnico do Maiombe. Todos os direitos reservados.</p>
                   
                </div>
            </div>
        </footer>
    );
}
