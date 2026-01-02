import style from './Solicitacao.module.css'
import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import Header from '../../../Components/Elements/Header/Header'
import '../../../assets/style/global.style.css'

export default function Solicitacao() {
   return (
        <div className="ContainerGeneral">
            <NavBarMenu />
            <main className="ContainerMain">
                <Header  text1={"Usuários"} text2={"Encarregados"}/>

            </main>

        </div>
    )
}

 