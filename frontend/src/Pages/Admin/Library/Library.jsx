import { useState, useEffect } from 'react'
import { FaPlus, FaSearch, FaBook, FaUser, FaBuilding, FaHashtag, FaCalendarAlt } from 'react-icons/fa'
import { RiCloseFill } from 'react-icons/ri'
import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import Header from '../../../Components/Elements/Header/Header'
import style from './Library.module.css'
import api from '../../../Services/api'
import Loading from '../../../Components/Elements/Loading/Loading'

export default function Library() {
    const [showModal, setShowModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [books, setBooks] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    const [formData, setFormData] = useState({
        titulo: '',
        editora: '',
        id_categoria: '',
        caminho_arquivo: null,
        img_path: null
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [booksRes, catsRes] = await Promise.all([
                    api.get('livros/'),
                    api.get('categorias/')
                ])
                setBooks(booksRes.data.results || booksRes.data)
                setCategories(catsRes.data.results || catsRes.data)
            } catch (error) {
                console.error("Erro ao carregar dados da biblioteca:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: name === 'id_categoria' ? parseInt(value) : value }))
    }

    const handleFileChange = (e, field) => {
        setFormData(prev => ({ ...prev, [field]: e.target.files[0] }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const data = new FormData()
            data.append('titulo', formData.titulo)
            data.append('editora', formData.editora)
            data.append('id_categoria', formData.id_categoria)
            if (formData.caminho_arquivo) data.append('caminho_arquivo', formData.caminho_arquivo)
            if (formData.img_path) data.append('img_path', formData.img_path)

            const response = await api.post('livros/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            setBooks([response.data, ...books])
            setShowModal(false)
            setFormData({ titulo: '', editora: '', id_categoria: '', caminho_arquivo: null, img_path: null })
            alert('Livro registado com sucesso!')
        } catch (error) {
            console.error('Erro ao registar livro:', error)
            alert('Erro ao registar livro. Verifique os campos e tente novamente.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredBooks = books.filter(book =>
        book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.editora && book.editora.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div className="ContainerGeneral">
            <NavBarMenu />
            <main className="ContainerMain">
                <Header text1="Admin" text2="Biblioteca" onSearch={setSearchTerm} />

                <div className={style.LibraryHeader}>
                    <div className={style.SearchBox}>
                        <FaSearch className={style.SearchIcon} />
                        <input
                            type="text"
                            placeholder="Pesquisar livros ou editoras..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className={style.AddButton} onClick={() => setShowModal(true)}>
                        <FaPlus /> Adicionar Livro
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-20">
                        <p><Loading/></p>
                    </div>
                ) : (
                    <div className={style.BookGrid}>
                        {filteredBooks.map(book => (
                            <div key={book.id_livro} className={style.BookCard}>
                                <div className={style.BookCover}>
                                    {book.img_path ? (
                                        <img src={book.img_path} alt={book.titulo} />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <FaBook size={40} className="text-gray-300" />
                                        </div>
                                    )}
                                    <div className={style.BookBadge}>{book.categoria_nome || 'Sem Categoria'}</div>
                                </div>
                                <div className={style.BookInfo}>
                                    <h3>{book.titulo}</h3>
                                    <p className={style.Author}>{book.editora || 'Editora N/A'}</p>
                                    <div className={style.BookMeta}>
                                        <span><FaCalendarAlt /> {new Date(book.data_upload).getFullYear()}</span>
                                        <a href={book.caminho_arquivo} download={book.titulo} target="_blank" rel="noopener noreferrer" className="text-primary text-sm font-medium">Ver PDF</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredBooks.length === 0 && (
                            <div className="col-span-full text-center p-10 text-gray-400">
                                Nenhum livro encontrado.
                            </div>
                        )}
                    </div>
                )}

                {showModal && (
                    <div className={style.ModalOverlay}>
                        <div className={style.ModalContent}>
                            <div className={style.ModalHeader}>
                                <h2>Registar Novo Livro</h2>
                                <button className={style.CloseBtn} onClick={() => setShowModal(false)}>
                                    <RiCloseFill />
                                </button>
                            </div>
                            <form className={style.BookForm} onSubmit={handleSubmit}>
                                <div className={style.FormGrid}>
                                    <div className={style.InputGroup}>
                                        <label><FaBook /> Título do Livro</label>
                                        <input
                                            name="titulo"
                                            required
                                            value={formData.titulo}
                                            onChange={handleInputChange}
                                            placeholder="Ex: Dom Casmurro"
                                        />
                                    </div>
                                    <div className={style.InputGroup}>
                                        <label><FaUser /> Editora</label>
                                        <input
                                            name="editora"
                                            value={formData.editora}
                                            onChange={handleInputChange}
                                            placeholder="Ex: Editora Abril"
                                        />
                                    </div>
                                    <div className={style.InputGroup}>
                                        <label><FaBuilding /> Categoria</label>
                                        <select
                                            name="id_categoria"
                                            required
                                            value={formData.id_categoria}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Selecionar Categoria</option>
                                            {categories.map(cat => (
                                                <option key={cat.id_categoria} value={cat.id_categoria}>
                                                    {cat.nome_categoria}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className={style.InputGroupFull}>
                                        <label>Arquivo PDF (Obrigatório)</label>
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            required
                                            onChange={(e) => handleFileChange(e, 'caminho_arquivo')}
                                        />
                                    </div>
                                    <div className={style.InputGroupFull}>
                                        <label>Capa do Livro (Opcional)</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'img_path')}
                                        />
                                    </div>
                                </div>
                                <div className={style.FormActions}>
                                    <button type="button" className={style.CancelBtn} onClick={() => setShowModal(false)}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className={style.SubmitBtn} disabled={isSubmitting}>
                                        {isSubmitting ? 'A processar...' : 'Registar Livro'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
