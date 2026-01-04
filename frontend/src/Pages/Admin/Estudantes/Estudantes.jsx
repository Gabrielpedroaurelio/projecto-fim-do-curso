import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu'
import DataTable from '../../../Components/Elements/DataTable/DataTable'
import '../../../assets/style/global.style.css'

// Sample data - replace with real data from API
const studentsData = [
    {
        name: "Eleanor Pena",
        initials: "EP",
        roll: "#01",
        address: "TA-107 Newyork",
        class: "01",
        dob: "02/05/2001",
        phone: "+123 6988567"
    },
    {
        name: "Jessia Rose",
        initials: "JR",
        roll: "#10",
        address: "TA-107 Newyork",
        class: "02",
        dob: "03/04/2000",
        phone: "+123 8988569"
    },
    {
        name: "Jenny Wilson",
        initials: "JW",
        roll: "#04",
        address: "Australia, Sydney",
        class: "01",
        dob: "12/05/2001",
        phone: "+123 7988566"
    },
    {
        name: "Guy Hawkins",
        initials: "GH",
        roll: "#03",
        address: "Australia, Sydney",
        class: "02",
        dob: "03/05/2001",
        phone: "+123 5988565"
    },
    {
        name: "Jacob Jones",
        initials: "JJ",
        roll: "#15",
        address: "Australia, Sydney",
        class: "04",
        dob: "12/05/2001",
        phone: "+123 9988568"
    },
    {
        name: "Jane Cooper",
        initials: "JC",
        roll: "#01",
        address: "Australia, Sydney",
        class: "04",
        dob: "12/03/2001",
        phone: "+123 6988566"
    },
    {
        name: "Floyd Miles",
        initials: "FM",
        roll: "#11",
        address: "TA-107 Newyork",
        class: "01",
        dob: "03/05/2002",
        phone: "+123 5988569"
    },
];

const columns = [
    { label: "Students Name", key: "name" },
    { label: "Roll", key: "roll" },
    { label: "Address", key: "address" },
    { label: "Class", key: "class" },
    { label: "Phone", key: "phone" },
    { label: "Estado", key: "status" },
];

export default function Estudantes() {
    const handleAdd = () => {
        console.log("Add student clicked");
        // Implement add student logic
    };


    return (
        <div className="ContainerGeneral">
            <NavBarMenu />
            <main className="ContainerMain">
                <DataTable
                    title="Students List"
                    data={studentsData.map(s => ({
                        ...s,
                        status: Math.random() > 0.5 ? 'online' : 'offline',
                        lastSeen: 'Há 5 minutos'
                    }))}
                    columns={columns}
                    onAdd={handleAdd}
                    searchPlaceholder="Search by name or roll"
                />
            </main>
        </div>
    )
}

