import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import DataTable from '../../../Components/Elements/DataTable/DataTable'
import '../../../assets/style/global.style.css'

// Sample data - replace with real data from API
const guardiansData = [
    {
        name: "António Manuel",
        initials: "AM",
        roll: "#P01",
        address: "Luanda, Talatona",
        class: "Pai",
        dob: "20/05/1975",
        phone: "+244 912345678"
    },
    {
        name: "Isabel Fernandes",
        initials: "IF",
        roll: "#P02",
        address: "Luanda, Viana",
        class: "Mãe",
        dob: "14/08/1980",
        phone: "+244 923456789"
    },
    {
        name: "Francisco Neto",
        initials: "FN",
        roll: "#P03",
        address: "Benguela, Centro",
        class: "Pai",
        dob: "30/01/1978",
        phone: "+244 934567890"
    },
    {
        name: "Beatriz Alves",
        initials: "BA",
        roll: "#P04",
        address: "Huambo, Cidade Alta",
        class: "Mãe",
        dob: "12/11/1983",
        phone: "+244 945678901"
    },
    {
        name: "Miguel Rodrigues",
        initials: "MR",
        roll: "#P05",
        address: "Luanda, Kilamba",
        class: "Tutor",
        dob: "25/06/1972",
        phone: "+244 956789012"
    },
    {
        name: "Sofia Carvalho",
        initials: "SC",
        roll: "#P06",
        address: "Luanda, Morro Bento",
        class: "Mãe",
        dob: "08/03/1985",
        phone: "+244 967890123"
    },
];

const columns = [
    { label: "Nome do Encarregado", key: "name" },
    { label: "ID", key: "roll" },
    { label: "Endereço", key: "address" },
    { label: "Relação", key: "class" },
    { label: "Telefone", key: "phone" },
    { label: "Estado", key: "status" },
];

export default function Encarregado() {
    const handleAdd = () => {
        console.log("Add guardian clicked");
        // Implement add guardian logic
    };


    return (
        <div className="ContainerGeneral">
            <NavBarMenu />
            <main className="ContainerMain">
                <DataTable
                    title="Lista de Encarregados"
                    data={guardiansData.map(g => ({
                        ...g,
                        status: Math.random() > 0.5 ? 'online' : 'offline',
                        lastSeen: 'Ontem às 18:00'
                    }))}
                    columns={columns}
                    onAdd={handleAdd}
                    searchPlaceholder="Pesquisar por nome ou ID"
                />
            </main>
        </div>
    )
}

