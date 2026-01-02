import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import DataTable from '../../../Components/Elements/DataTable/DataTable'
import '../../../assets/style/global.style.css'

// Sample data - replace with real data from API
const employeesData = [
    {
        name: "Carlos Silva",
        initials: "CS",
        roll: "#E01",
        address: "Luanda, Angola",
        class: "Professor",
        dob: "15/03/1985",
        phone: "+244 923456789"
    },
    {
        name: "Maria Santos",
        initials: "MS",
        roll: "#E02",
        address: "Luanda, Angola",
        class: "Secretária",
        dob: "22/07/1990",
        phone: "+244 934567890"
    },
    {
        name: "João Pedro",
        initials: "JP",
        roll: "#E03",
        address: "Benguela, Angola",
        class: "Professor",
        dob: "10/11/1988",
        phone: "+244 945678901"
    },
    {
        name: "Ana Costa",
        initials: "AC",
        roll: "#E04",
        address: "Huambo, Angola",
        class: "Coordenadora",
        dob: "05/09/1982",
        phone: "+244 956789012"
    },
    {
        name: "Pedro Mendes",
        initials: "PM",
        roll: "#E05",
        address: "Luanda, Angola",
        class: "Professor",
        dob: "18/12/1987",
        phone: "+244 967890123"
    },
];

const columns = [
    { label: "Nome do Funcionário", key: "name" },
    { label: "ID", key: "roll" },
    { label: "Endereço", key: "address" },
    { label: "Cargo", key: "class" },
    { label: "Data de Nascimento", key: "dob" },
    { label: "Telefone", key: "phone" },
];

export default function Funcionario() {
    const handleAdd = () => {
        console.log("Add employee clicked");
        // Implement add employee logic
    };

    const handleEdit = (employee) => {
        console.log("Edit employee:", employee);
        // Implement edit employee logic
    };

    const handleDelete = (employee) => {
        console.log("Delete employee:", employee);
        // Implement delete employee logic
    };

    return (
        <div className="ContainerGeneral">
            <NavBarMenu />
            <main className="ContainerMain">
                <DataTable
                    title="Funcionários List"
                    data={employeesData}
                    columns={columns}
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    searchPlaceholder="Pesquisar por nome ou ID"
                />
            </main>
        </div>
    )
}

