import style from './Certificado.module.css'
import MenuNavBarAdmin from '../../../Components/Utils/MenuNavBarAdmin/MenuNavBarAdmin'
import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import Header from '../../../Components/Elements/Header/Header'
export default function Certificado() {
    return (
        <div className={style.ContainerGeneral}>
            <NavBarMenu />
            <main className={style.ContainerMain}>
                <Header  text1={"Documentos"} text2={"Certificado"}/>

            </main>

        </div>
    )
}