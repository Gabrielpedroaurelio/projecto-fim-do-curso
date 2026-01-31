
import style from './Cards.module.css'

export default function Cards({ icon, value, title, value_percentual }) {
    return (

        <div className={`${style.StatCard} glass-card`}>
            <div className={style.CardHeader}>
                <span className="text-gradient">{title}</span>
                {icon}
            </div>
            <h2>{value}</h2>
            <div className={style.TrendUp}>
                <span>{value_percentual}</span> vs mês passado
            </div>
        </div>

    )
}
