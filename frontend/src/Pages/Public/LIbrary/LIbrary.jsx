import { Link } from "react-router-dom";

import { MdBook, MdDownload, MdChevronRight } from "react-icons/md";
import { FaEye, FaDownload, FaBook, FaCartPlus } from 'react-icons/fa6'
import MenuSitePublic from "../../../Components/Utils/MenuSitePublic/MenuSitePublic";
import PostgreSQLNotesForProfessionals from '../../../assets/uploads/books/PostgreSQLNotesForProfessionals.pdf'
import SearchBar from "../../../Components/Utils/SearchBar/SearchBar";
import style from './LIbrary.module.css';
import { useState } from "react";
export default function LIbrary() {
    const UserLogado = { BooksBought: { isBoght: true } }// codigo para verificar se o usuario comprou o livro ou nao
    const lista = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const [stateCategoria, setStateCategoria] = useState('Todas')
    function handleStateCategoria(categoria){
        setStateCategoria((prev)=>prev=categoria)
    }
    const categorias = [
        {
            id: 1,
            categoria: 'Todas'
        },
        {
            id: 2,
            categoria: 'Tecnologia'
        },
        {
            id: 3,
            categoria: 'Fantasia'
        },
        {
            id: 4,
            categoria: 'Educação'
        },
        {
            id: 5,
            categoria: 'Geografia'
        }
    ]

    return (
        <>
            <main className={style.body}>
                <MenuSitePublic></MenuSitePublic>
                <SearchBar />
                <section className={style.recommendedBooks}>
                    <div>
                        <h3>Livros Recomendados</h3>

                    </div>
                    <div className={style.listEBooksRecommendedBooks}>
                        <div className={style.resourceGrid}>

                            {
                                lista.map((item) => (
                                    <div className={style.resourceCard} key={item} data-title="${livro.title_book}}">
                                        <div className={style.resourceImage}>
                                            <object data={PostgreSQLNotesForProfessionals} type="">
                                            </object>
                                            <div className={style.mirror}>

                                            </div>
                                        </div>
                                        <div className={style.resourceInfo}>
                                            <h3 className={style.resourceTitle}>Html5 & Css3</h3>
                                            <p className={style.resourceAuthor}>Gabriel Aurélio </p>
                                            <div className={style.resourceFooter}>
                                                <div className={style.resourceType}>Livro</div>
                                                <div className={style.resourceActions}>
                                                    {UserLogado.BooksBought.isBoght && (
                                                        <a href=""><FaEye size={15} /></a>

                                                    )}
                                                    <a href=""><FaCartPlus /></a>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                </section>
                <section className={style.BooksByCategory}>
                    <div>
                        <h3>Categorias</h3>
                        <div className={style.containerCategory}>
                            {
                                categorias.map((categoria) => (
                                    <button key={categoria.id}
                                        onClick={(event)=>handleStateCategoria(event.target.innerHTML)}
                                        className={`${categoria.categoria===stateCategoria?style.is_selected:''}`}
                                    >{categoria.categoria}</button>
                                ))
                            }

                        </div>
                        <div className={style.listEBooks}>
                            {
                                lista.map((item) => (
                                    <div className={style.resourceCard} key={item} data-title="${livro.title_book}}">
                                        <div className={style.resourceImage}>
                                            <object data={PostgreSQLNotesForProfessionals} type="">
                                            </object>
                                            <div className={style.mirror}>

                                            </div>
                                        </div>
                                        <div className={style.resourceInfo}>
                                            <h3 className={style.resourceTitle}>Html5 & Css3</h3>
                                            <p className={style.resourceAuthor}>{stateCategoria} </p>
                                            <div className={style.resourceFooter}>
                                                <div className={style.resourceType}>Livro</div>
                                                <div className={style.resourceActions}>
                                                    {UserLogado.BooksBought.isBoght && (
                                                        <a href=""><FaEye size={15} /></a>

                                                    )}
                                                    <a href=""><FaCartPlus /></a>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                </section>

            </main>
        </>
    )
}