import { Link } from "react-router-dom";
import CardDocuments from "../../../../Components/Elements/CardDocuments/CardDocuments";
import HeaderClient from "../../../../Components/Utils/HeaderClient/HeaderClient";
import MenuClient from "../../../../Components/Utils/MenuClient/MenuClient";
import { BsFolder, BsHouse } from "react-icons/bs";

export default function DocumentsCliente() {

    return (

        <>

            <HeaderClient />
          <MenuClient>
        <Link to="/client/student/">
          <span><BsHouse /></span>
          <span>Dashboads</span>
        </Link>
        <Link to='/client/student/documents/'>
          <span><BsFolder /></span>
          <span>Documentos</span>
        </Link>
      </MenuClient>

        </>
    )


}