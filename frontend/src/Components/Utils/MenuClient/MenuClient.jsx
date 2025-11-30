import style from './MenuClient.module.css'
import {Link} from 'react-router-dom'
export default function MenuClient({...itens}){
    return(
        <nav className={style.NavBarMenuClient}>
        <Link href="">
            <span>Icon</span>
            <span>Name</span>
        </Link>
        </nav>
    )
}