import { useState } from 'react'
import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import DataTable from '../../../Components/Elements/DataTable/DataTable'
import Header from '../../../Components/Elements/Header/Header'
import '../../../assets/style/global.style.css'

// Sample data - replace with real data from API
const employeesData = [
    { name: "Carlos Silva", initials: "CS", roll: "#E01", address: "Luanda, Angola", class: "Professor", dob: "15/03/1985", phone: "+244 923456789" },
    { name: "Maria Santos", initials: "MS", roll: "#E02", address: "Luanda, Angola", class: "Secretária", dob: "22/07/1990", phone: "+244 934567890" },
    { name: "João Pedro", initials: "JP", roll: "#E03", address: "Benguela, Angola", class: "Professor", dob: "10/11/1988", phone: "+244 945678901" },
    { name: "Ana Costa", initials: "AC", roll: "#E04", address: "Huambo, Angola", class: "Coordenadora", dob: "05/09/1982", phone: "+244 956789012" },
    { name: "Pedro Mendes", initials: "PM", roll: "#E05", address: "Luanda, Angola", class: "Professor", dob: "18/12/1987", phone: "+244 967890123" },
];

const columns = [
    { label: "Nome do Funcionário", key: "name" },
    { label: "ID", key: "roll" },
    { label: "Endereço", key: "address" },
    { label: "Cargo", key: "class" },
    { label: "Telefone", key: "phone" },
    { label: "Estado", key: "status" },
];

export default function Funcionario() {
    const [searchTerm, setSearchTerm] = useState('')

    const handleAdd = () => {
        console.log("Add employee clicked");
    };

    return (
        <div className="ContainerGeneral">
            <NavBarMenu />
            <main className="ContainerMain">
                <Header text1={"Recursos Humanos"} text2={"Lista de Funcionários"} onSearch={setSearchTerm} />
                <DataTable
                    title="Lista de Funcionários"
                    externalSearchTerm={searchTerm}
                    data={employeesData.map(e => ({
                        ...e,
                        status: Math.random() > 0.5 ? 'online' : 'offline',
                        lastSeen: 'Há 2 horas'
                    }))}
                    columns={columns}
                    onAdd={handleAdd}
                    searchPlaceholder="Pesquisar por nome ou ID"
                />
            </main>
        </div>
    )
}

