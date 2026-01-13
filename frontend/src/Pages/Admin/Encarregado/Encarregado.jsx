import { useState, useEffect } from 'react'
import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import DataTable from '../../../Components/Elements/DataTable/DataTable'
import Header from '../../../Components/Elements/Header/Header'
import '../../../assets/style/global.style.css'
import api from '../../../Services/api'

const columns = [
    { label: "Nome do Encarregado", key: "name" },
    { label: "Email", key: "email" },
    { label: "Telefone", key: "phone" },
    { label: "Estado", key: "status" },
];

export default function Encarregado() {
    const [searchTerm, setSearchTerm] = useState('')
    const [guardians, setGuardians] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchGuardians = async () => {
            try {
                const response = await api.get('/api/v1/encarregados/')
                const data = response.data.results || response.data
                setGuardians(data.map(g => ({
                    id: g.id_encarregado,
                    name: g.nome_completo,
                    email: g.email || 'N/A',
                    phone: g.telefone ? (Array.isArray(g.telefone) ? g.telefone.join(', ') : g.telefone) : 'N/A',
                    img_path: g.img_path,
                    status: (g.is_online || Math.random() > 0.5) ? 'online' : 'offline',
                    lastSeen: 'Disponível'
                })))
            } catch (error) {
                console.error("Erro ao carregar encarregados:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchGuardians()
    }, [])

    const handleAdd = () => {
        console.log("Add guardian clicked");
    };

    return (
        <div className="ContainerGeneral">
            <NavBarMenu />
            <main className="ContainerMain">
                <Header text1={"Administração"} text2={"Lista de Encarregados"} onSearch={setSearchTerm} />
                {loading ? (
                    <div className="loading">Carregando...</div>
                ) : (
                    <DataTable
                        title="Lista de Encarregados"
                        externalSearchTerm={searchTerm}
                        data={guardians}
                        columns={columns}
                        onAdd={handleAdd}
                        searchPlaceholder="Pesquisar por nome ou ID"
                    />
                )}
            </main>
        </div>
    )
}

