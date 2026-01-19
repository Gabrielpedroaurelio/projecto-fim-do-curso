import { Link } from "react-router-dom";
import { MdBook, MdDownload, MdChevronRight } from "react-icons/md";
import { FaEye, FaDownload, FaBook, FaCartPlus } from 'react-icons/fa6'
import MenuSitePublic from "../../../Components/Utils/MenuSitePublic/MenuSitePublic";
import SearchBar from "../../../Components/Utils/SearchBar/SearchBar";
import BookCard from "../../../Components/Utils/BookCard/BookCard";
import style from './LIbrary.module.css';
import { useState, useMemo, useEffect } from "react";
import AuroraBackground from "../Site/AuroraBackground";
//import api from "../../../Services/api"; // Removed to avoid token issues
import axios from 'axios';

// Instance for public requests without Auth Token
const publicApi = axios.create({
  baseURL: 'http://localhost:8000/api/v1/',
});

export default function LIbrary() {
  const [category, setCategory] = useState({ id: 'Todas', nome: 'Todas' });
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([{ id: 'Todas', nome: 'Todas' }]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, catsRes] = await Promise.all([
          publicApi.get('/livros/'),
          publicApi.get('/categorias/')
        ]);

        setBooks(booksRes.data.results || booksRes.data);

        const backendCats = catsRes.data.results || catsRes.data;
        setCategories([
          { id: 'Todas', nome: 'Todas' },
          ...backendCats.map(c => ({ id: c.id_categoria, nome: c.nome_categoria }))
        ]);
      } catch (error) {
        console.error("Erro ao carregar dados da biblioteca:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const recommended = useMemo(() => books.filter(b => b.recomendado), [books]);

  const filtered = useMemo(() => {
    if (category.id === 'Todas') return books;
    return books.filter(b => b.categoria_nome === category.nome);
  }, [books, category]);

  function handleView(book) {
    if (book.caminho_arquivo) {
      window.open(book.caminho_arquivo, '_blank');
    }
  }

  function handleAdd(book) {
    if (book.caminho_arquivo) {
      const link = document.createElement('a');
      link.href = book.caminho_arquivo;
      link.download = `${book.titulo}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Helper function to map backend book to BookCard props
  const mapBook = (b) => ({
    id: b.id_livro,
    title: b.titulo,
    author: b.editora || 'Editora não informada',
    category: b.categoria_nome,
    recommended: b.recomendado,
    cover: b.img_path,
    pdf: b.caminho_arquivo,
    excerpt: b.excerpt || 'Resumo não disponível.'
  });

  return (
    <AuroraBackground>
      <main className={style.body}>
        <MenuSitePublic />

        <div className="relative z-10 w-full flex flex-col">
          {/* Recommended Books - Full Width */}
          <section className={style.recommendedBooks}>
            <div className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto w-full pt-8">
              <SearchBar />
            </div>
            <div className={style.sectionHeader}>
              <h3>Livros Recomendados</h3>
            </div>
            <div className={style.listEBooksRecommendedBooks}>
              <div className={style.resourceGrid}>
                {loading ? (
                  <p>Carregando livros...</p>
                ) : recommended.length > 0 ? (
                  recommended.map(book => (
                    <BookCard key={book.id_livro} book={mapBook(book)} onView={handleView} onAdd={handleAdd} />
                  ))
                ) : (
                  <p>Nenhum livro recomendado no momento.</p>
                )}
              </div>
            </div>
          </section>

          {/* Categories - Centered */}
          <div className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto w-full pb-10">
            <section className={style.BooksByCategory}>
              <div>
                <h3>Categorias</h3>
                <div className={style.containerCategory}>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat)}
                      className={`${cat.id === category.id ? style.is_selected : ''}`}
                    >
                      {cat.nome}
                    </button>
                  ))}
                </div>

                <div className={style.listEBooks}>
                  {loading ? (
                    <p>Carregando...</p>
                  ) : filtered.length > 0 ? (
                    filtered.map(book => (
                      <BookCard key={book.id_livro} book={mapBook(book)} onView={handleView} onAdd={handleAdd} />
                    ))
                  ) : (
                    <p>Nenhum livro encontrado nesta categoria.</p>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </AuroraBackground>
  )
}
