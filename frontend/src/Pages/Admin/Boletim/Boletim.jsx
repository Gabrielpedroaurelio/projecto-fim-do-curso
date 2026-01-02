import style from './Boletim.module.css'

import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import Header from '../../../Components/Elements/Header/Header'
export default function Boletim() {
    return (
        <div className={style.ContainerGeneral}>
            <NavBarMenu />
            <main className={style.ContainerMain}>
                <Header text1={"Documentos"} text2={"Boletim"} />

            </main>

        </div>
    )
}