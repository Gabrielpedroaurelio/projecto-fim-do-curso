import { useState } from 'react'
import { FaPlus, FaSearch, FaBook, FaUser, FaBuilding, FaHashtag, FaCalendarAlt } from 'react-icons/fa'
import { RiCloseFill } from 'react-icons/ri'
import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import Header from '../../../Components/Elements/Header/Header'
import style from './Library.module.css'

export default function Library() {
    const [showModal, setShowModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Mock initial data - using useFetch for real integration later
    const [books, setBooks] = useState([
        { id: 1, title: 'Dom Casmurro', author: 'Machado de Assis', category: 'Clássico', isbn: '978-85', year: '1899', stock: 5, cover: 'https://images-na.ssl-images-amazon.com/images/I/81aY1lxkS9L.jpg' },
        { id: 2, title: 'O Alquimista', author: 'Paulo Coelho', category: 'Ficção', isbn: '978-00', year: '1988', stock: 12, cover: 'https://images-na.ssl-images-amazon.com/images/I/51Z0nLAfLmL.jpg' },
        { id: 3, title: '1984', author: 'George Orwell', category: 'Distopia', isbn: '978-04', year: '1949', stock: 8, cover: 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0caL.jpg' },
    ])

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: '',
        isbn: '',
        year: '',
        stock: '',
        description: '',
        cover: null
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, cover: e.target.files[0] }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const data = new FormData()
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key])
            })

            // Simulated API call (already prepared for fetch as requested)
            // const response = await createRecord('/api/books', data)

            // For demo purposes, add to local state
            const newBook = {
                id: books.length + 1,
                ...formData,
                cover: formData.cover ? URL.createObjectURL(formData.cover) : 'https://via.placeholder.com/150',
                stock: parseInt(formData.stock)
            }

            setBooks([newBook, ...books])
            setShowModal(false)
            setFormData({ title: '', author: '', category: '', isbn: '', year: '', stock: '', description: '', cover: null })
            alert('Livro registado com sucesso!')
        } catch (error) {
            console.error('Erro ao registar livro:', error)
            alert('Erro ao registar livro. Tente novamente.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="ContainerGeneral">
            <NavBarMenu />
            <main className="ContainerMain">
                <Header text1="Admin" text2="Biblioteca" />

                <div className={style.LibraryHeader}>
                    <div className={style.SearchBox}>
                        <FaSearch className={style.SearchIcon} />
                        <input
                            type="text"
                            placeholder="Pesquisar livros ou autores..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className={style.AddButton} onClick={() => setShowModal(true)}>
                        <FaPlus /> Adicionar Livro
                    </button>
                </div>

                <div className={style.BookGrid}>
                    {filteredBooks.map(book => (
                        <div key={book.id} className={style.BookCard}>
                            <div className={style.BookCover}>
                                <img src={book.cover} alt={book.title} />
                                <div className={style.BookBadge}>{book.category}</div>
                            </div>
                            <div className={style.BookInfo}>
                                <h3>{book.title}</h3>
                                <p className={style.Author}>{book.author}</p>
                                <div className={style.BookMeta}>
                                    <span><FaCalendarAlt /> {book.year}</span>
                                    <span>Stock: {book.stock}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

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
                                            name="title"
                                            required
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Ex: Dom Casmurro"
                                        />
                                    </div>
                                    <div className={style.InputGroup}>
                                        <label><FaUser /> Autor</label>
                                        <input
                                            name="author"
                                            required
                                            value={formData.author}
                                            onChange={handleInputChange}
                                            placeholder="Ex: Machado de Assis"
                                        />
                                    </div>
                                    <div className={style.InputGroup}>
                                        <label><FaBuilding /> Categoria</label>
                                        <select name="category" value={formData.category} onChange={handleInputChange}>
                                            <option value="">Selecionar Categoria</option>
                                            <option value="Ficção">Ficção</option>
                                            <option value="Não-Ficção">Não-Ficção</option>
                                            <option value="Clássico">Clássico</option>
                                            <option value="Científico">Científico</option>
                                            <option value="História">História</option>
                                        </select>
                                    </div>
                                    <div className={style.InputGroup}>
                                        <label><FaHashtag /> ISBN</label>
                                        <input
                                            name="isbn"
                                            value={formData.isbn}
                                            onChange={handleInputChange}
                                            placeholder="Ex: 978-00-..."
                                        />
                                    </div>
                                    <div className={style.InputGroupSplit}>
                                        <div className={style.InputGroup}>
                                            <label>Ano</label>
                                            <input
                                                type="number"
                                                name="year"
                                                value={formData.year}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className={style.InputGroup}>
                                            <label>Stock</label>
                                            <input
                                                type="number"
                                                name="stock"
                                                required
                                                value={formData.stock}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className={style.InputGroupFull}>
                                        <label>Capa do Livro</label>
                                        <input type="file" accept="image/*" onChange={handleFileChange} />
                                    </div>
                                    <div className={style.InputGroupFull}>
                                        <label>Descrição</label>
                                        <textarea
                                            name="description"
                                            rows="3"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                        ></textarea>
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
