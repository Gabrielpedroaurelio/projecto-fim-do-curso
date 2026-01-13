import { useState } from 'react'
import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import DataTable from '../../../Components/Elements/DataTable/DataTable'
import Header from '../../../Components/Elements/Header/Header'
import '../../../assets/style/global.style.css'

// Sample data - would normally come from the API
const turmasData = [
    {
        id_turma: 1,
        codigo_turma: "2IN10M26",
        curso_nome: "Informática de Gestão",
        classe_nivel: 10,
        periodo_nome: "Manhã",
        ano: "2026",
        sala_numero: 2,
        responsavel_nome: "Carlos Silva"
    },
    {
        id_turma: 2,
        codigo_turma: "4CT11T26",
        curso_nome: "Contabilidade de Gestão",
        classe_nivel: 11,
        periodo_nome: "Tarde",
        ano: "2026",
        sala_numero: 4,
        responsavel_nome: "Maria Santos"
    },
    {
        id_turma: 3,
        codigo_turma: "1GE12M26",
        curso_nome: "Gestão Empresarial",
        classe_nivel: 12,
        periodo_nome: "Manhã",
        ano: "2026",
        sala_numero: 1,
        responsavel_nome: "João Pedro"
    },
];

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

    const handleAdd = () => {
        console.log("Add turma clicked");
    };

    const handleEdit = (item) => {
        console.log("Edit turma:", item);
    };

    const handleDelete = (item) => {
        console.log("Delete turma:", item);
    };

    return (
        <div className="ContainerGeneral">
            <NavBarMenu />
            <main className="ContainerMain">
                <Header text1={"Acadêmico"} text2={"Gestão de Turmas"} onSearch={setSearchTerm} />
                <DataTable
                    title="Listagem de Turmas"
                    externalSearchTerm={searchTerm}
                    data={turmasData}
                    columns={columns}
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    searchPlaceholder="Pesquisar por código ou curso..."
                />
            </main>
        </div>
    )
}
