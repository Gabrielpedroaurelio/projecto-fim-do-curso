import { Link } from 'react-router-dom'
import style from './CardsDocuments.module.css'
export default function CardsDocments({ icon, text, url }) {
    return (
        <>
            <Link to={url} className={style.cardDocument}>
                {icon}
                <h3>{text}</h3>
                <button>Solicitar</button>
            </Link>
        </>
    )

}