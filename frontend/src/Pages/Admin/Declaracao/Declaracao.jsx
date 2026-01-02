import style from './Declaracao.module.css'
import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import Header from '../../../Components/Elements/Header/Header'
import '../../../assets/style/global.style.css'
export default function Declaracao() {
    return (
        <div className={style.ContainerGeneral}>
            <NavBarMenu />
            <main className={style.ContainerMain}>
                <Header text1={"Documentos"} text2={"Declarações"} />

            </main>

        </div>
    )
}