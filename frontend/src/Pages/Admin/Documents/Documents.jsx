import style from './Documents.module.css'
import MenuNavBarAdmin from '../../../Components/Utils/MenuNavBarAdmin/MenuNavBarAdmin'
import Header from '../../../Components/Elements/Header/Header'
export default function Documents() {
    return (
        <>
            <MenuNavBarAdmin />
            <main className={style.Container} >
                <Header titlepage={"Documentos/Overview"} />
                <div className={style.HeaderContainer}>
                    <h1>Documentos Disponiveis</h1>
                    <div className={style.CardDocuments}>

                    </div>
                </div>
            </main>
        </>
    )
}