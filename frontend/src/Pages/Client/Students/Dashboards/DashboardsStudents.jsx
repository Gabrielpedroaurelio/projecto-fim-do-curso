import MenuSitePublic from '../../../../Components/Utils/MenuSitePublic/MenuSitePublic'
import style from './DashboardsStudents.module.css'
export default function DashboardsStudents(){
return(
    <>
    <MenuSitePublic/>
    <main>
        <div className={style.datasUser}>
        <h2>Olá Gabriel Pedro Aurelio</h2>
            <div className={style.card}>
                <div className={style.img}>
                    <img src="" alt="" />
                </div>
                <div className={style.datas}>
                    <h4>Gabriel Pedro</h4>
                    <span>gabrielpedro@gmail.com</span>
                    <p>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsa, accusantium ut. Laudantium non dolor atque doloremque harum.
                    </p>
                </div>
                <div className={style.cardBtnViewPlus}>
                    <button>Ver Perfil Completo</button>
                </div>
            </div>
        </div>
        <div className={style.cards}>
            <div className={style.card}></div>
            <div className={style.card}></div>
            <div className={style.card}></div>
            <div className={style.card}></div>
        </div>
    </main>
    
    </>
)
}