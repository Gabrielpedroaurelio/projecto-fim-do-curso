import { Link } from "react-router-dom";
import { MdBook, MdDownload, MdChevronRight } from "react-icons/md";
import { FaEye, FaDownload, FaBook, FaCartPlus } from 'react-icons/fa6'
import MenuSitePublic from "../../../Components/Utils/MenuSitePublic/MenuSitePublic";
import SearchBar from "../../../Components/Utils/SearchBar/SearchBar";
import BookCard from "../../../Components/Utils/BookCard/BookCard";
import style from './LIbrary.module.css';
import { useState, useMemo } from "react";
import AuroraBackground from "../Site/AuroraBackground";

const initialBooks = [
  { id: 1, title: 'PostgreSQL Notes', author: 'Gabriel Aurélio', category: 'Tecnologia', recommended: true, excerpt: 'Notas e dicas práticas sobre PostgreSQL.', cover: 'https://picsum.photos/seed/postgres/600/800', pdf: '../../../assets/uploads/books/PostgreSQLNotesForProfessionals.pdf' },
  { id: 2, title: 'Intro to Algorithms', author: 'Cormen', category: 'Tecnologia', recommended: true, excerpt: 'Algoritmos clássicos e estruturas de dados.', cover: 'https://picsum.photos/seed/algorithms/600/800' },
  { id: 3, title: 'Fantasy Tales', author: 'A. Writer', category: 'Fantasia', recommended: false, cover: 'https://picsum.photos/seed/fantasy/600/800' },
  { id: 4, title: 'Teaching Methods', author: 'Prof. Silva', category: 'Educação', recommended: false, cover: 'https://picsum.photos/seed/teaching/600/800' },
  { id: 5, title: 'World Geography', author: 'Geo Author', category: 'Geografia', recommended: true, cover: 'https://picsum.photos/seed/geography/600/800' },
  { id: 6, title: 'CSS Secrets', author: 'Lea Verou', category: 'Tecnologia', recommended: false, cover: 'https://picsum.photos/seed/css/600/800' },
  { id: 7, title: 'Learning React', author: 'React Team', category: 'Tecnologia', recommended: true, cover: 'https://picsum.photos/seed/react/600/800' },
  { id: 8, title: 'Modern Physics', author: 'Phys Author', category: 'Educação', recommended: false, cover: 'https://picsum.photos/seed/physics/600/800' },
  { id: 9, title: 'Mountains & Rivers', author: 'Geo Author', category: 'Geografia', recommended: true, cover: 'https://picsum.photos/seed/mountains/600/800' }
]

const allCategories = ['Todas', 'Tecnologia', 'Fantasia', 'Educação', 'Geografia']

export default function LIbrary() {
  const [category, setCategory] = useState('Todas')
  const [books] = useState(initialBooks)


  const recommended = useMemo(() => books.filter(b => b.recommended), [books])
  const filtered = useMemo(() => category === 'Todas' ? books : books.filter(b => b.category === category), [books, category])

  function handleView(book) {
    // placeholder: open or preview
    console.log('view', book.title)
  }

  function handleAdd(book) {
    console.log('add', book.title)
  }

  return (
    <AuroraBackground>
      <main className={style.body}>
        <MenuSitePublic />

        <div className="relative z-10 w-full flex flex-col">


          {/* Recommended Books - Full Width */}
          <section className={style.recommendedBooks}>
          {/* Search Bar - Centered */}
          <div className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto w-full pt-8">
            <SearchBar />
          </div>
            <div className={style.sectionHeader}>
              <h3>Livros Recomendados</h3>
            </div>
            <div className={style.listEBooksRecommendedBooks}>
              <div className={style.resourceGrid}>
                {recommended.map(book => (
                  <BookCard key={book.id} book={book} onView={handleView} onAdd={handleAdd} />
                ))}
              </div>
            </div>
          </section>

          {/* Categories - Centered */}
          <div className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto w-full pb-10">
            <section className={style.BooksByCategory}>
              <div>
                <h3>Categorias</h3>
                <div className={style.containerCategory}>
                  {allCategories.map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)} className={`${cat === category ? style.is_selected : ''}`}>{cat}</button>
                  ))}
                </div>

                <div className={style.listEBooks}>
                  {filtered.map(book => (
                    <BookCard key={book.id} book={book} onView={handleView} onAdd={handleAdd} />
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </AuroraBackground>
  )
}