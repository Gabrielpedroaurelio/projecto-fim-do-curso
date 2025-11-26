import MenuSitePublic from '../../../Components/Utils/MenuSitePublic/MenuSitePublic'
import style from './MainSite.module.css'
export default function MainSite({ }) {
    return (
        <>
            <MenuSitePublic />
            <div className={style.site}>
            <section className={style.slide}>
                <div>
                    <div className={style.infor}>
                        <h1><span>Aprendizagem. Desenvolvimento</span>
                        <br />
                        Sucesso-</h1>
                        <p>
                            Bem-Vindo Ao Instituito Politécnico do Maiombe
                            lre
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid dolores aperiam sit voluptates.
                        </p>
                        <button>Entrar</button>
                    </div>
                    <div>
                        
                    </div>
                 
                </div>
            
            </section>
            </div>
        </>
    )
}