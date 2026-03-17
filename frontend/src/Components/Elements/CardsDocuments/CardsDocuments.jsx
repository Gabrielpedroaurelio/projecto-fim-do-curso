import { Link } from 'react-router-dom'
import style from './CardsDocuments.module.css'
export default function CardsDocments({ icon, text, url,text_display }) {
    return (
        <>
            <Link to={url} className={`${style.cardDocument} glass-card`}>
                {icon}
                <h3 className="text-gradient">{text}</h3>
                <button>{text_display || "Solicitar"}</button>
            </Link>
        </>
    )

}