import { Link } from "react-router-dom"
import style from './Cards.module.css'
import { BsArrowRight } from "react-icons/bs"
import { BiTrendingUp}from 'react-icons/bi'
export default function Cards({ datas }) {
    return (
        <>
            <div className={style.card}>
                <div className={style.title}>
                    {
                        datas.title && (
                            <h3>{datas.title}</h3>
                        )
                    }
                </div>
                <div className={style.resume}>
                    {
                        datas.resume && (
                            <h2>{datas.resume}</h2>
                        )
                    }
                </div>
                <div className={style.currently}>
                    {
                        datas.currently && (
                            <div>
                                <span>
                                    {
                                        datas.currently.data_resume && (
                                            <span className={style.addrecent}>{datas.currently.data_resume} <BiTrendingUp /> </span>
                                        )
                                    }
                                </span>
                                <span>
                                    {
                                        datas.currently.linkToResume && (
                                            <Link to={`${datas.currently.linkToResume}`}>
                                                 <BsArrowRight/>
                                            </Link>
                                        )
                                    }
                                </span>
                            </div>

                        )
                    }
                </div>
            </div>
        </>
    )
}
