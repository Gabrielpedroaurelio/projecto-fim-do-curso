import { useState, useEffect } from 'react'
import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import DataTable from '../../../Components/Elements/DataTable/DataTable'
import Header from '../../../Components/Elements/Header/Header'
import '../../../assets/style/global.style.css'
import api from '../../../Services/api'

const columns = [
    { label: "Código", key: "codigo_turma" },
    { label: "Curso", key: "curso_nome" },
    { label: "Classe", key: "classe_nivel" },
    { label: "Período", key: "periodo_nome" },
    { label: "Ano", key: "ano" },
    { label: "Sala", key: "sala_numero" },
    { label: "Coordenador", key: "responsavel_nome" },
];

export default function Turmas() {
    const [searchTerm, setSearchTerm] = useState('')
    const [turmas, setTurmas] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTurmas = async () => {
            try {
                const response = await api.get('turmas/')
                const data = response.data.results || response.data
                setTurmas(data)
            } catch (error) {
                console.error("Erro ao carregar turmas:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchTurmas()
    }, [])

    const handleAdd = () => {
        console.log("Add turma clicked");
    };

   /* const handleEdit = (item) => {
        console.log("Edit turma:", item);
    };

    const handleDelete = (item) => {
        console.log("Delete turma:", item);
    };
*/
    return (
        <div className="ContainerGeneral">
            <NavBarMenu />
            <main className="ContainerMain">
                <Header text1={"Acadêmico"} text2={"Gestão de Turmas"} onSearch={setSearchTerm} />
                {loading ? (
                    <div className="loading">Carregando...</div>
                ) : (
                    <DataTable
                        title="Listagem de Turmas"
                        externalSearchTerm={searchTerm}
                        data={turmas}
                        columns={columns}
                        onAdd={handleAdd}
                       /* onEdit={handleEdit}
                        onDelete={handleDelete}*/
                        searchPlaceholder="Pesquisar por código ou curso..."
                    />
                )}
            </main>
        </div>
    )
}
