import { BrowserRouter as BRouter, Route, Routes } from 'react-router-dom'
// importing of views for routers
import MainSite from './Pages/Public/Site/MainSite'
import Dashboards from './Pages/Admin/Dashboards/Dashboards'
import Documents from './Pages/Admin/Certificado/Certificado'
import AuthParent from './Pages/Client/Parents/AuthParent'
import AuthStudent from './Pages/Client/Students/AuthStudent'
import AuthAdmin from './Pages/Admin/Auth/AuthAdmin'
import LIbrary from './Pages/Public/LIbrary/LIbrary'
import DashboardsStudents from './Pages/Client/Students/Dashboards/DashboardsStudents'
import DocumentsCliente from './Pages/Client/Students/DocumentsCliente/DocumentsCliente'
import DashboardEncarregado from './Pages/Client/Parents/Dashboards/DashboardEncarregado'
import Settings from './Pages/Admin/Settings/Settings'
import Accounts from './Pages/Admin/Accounts/Accounts'
import Histories from './Pages/Admin/Histories/Histories'



//import Asks from './Pages/Admin'
import Encarregado from './Pages/Admin/Encarregado/Encarregado'
import Estudantes from './Pages/Admin/Estudantes/Estudantes'
import Funcionario from './Pages/Admin/Funcionario/Funcionario'
import Solicitacao from './Pages/Admin/Solicitacao/Solicitacao'
// documents
import Certificado from './Pages/Admin/Certificado/Certificado'
import Boletim from './Pages/Admin/Boletim/Boletim'
import Declaracao from './Pages/Admin/Declaracao/Declaracao'
const Routers = () => {
    return (
        <>
            <BRouter>
                <Routes>
                    {/***ADMINSTRADOR** */}
                    <Route path='/admin/dashboard' element={<Dashboards/>}></Route>{/* done dashboards */}
                    <Route path='/admin/' element={<Dashboards/>}></Route>{/*dashboards done*/}
                    <Route path='/admin/funcionario' element={<Funcionario/>}></Route>{/* lista do funcionario das instituicao */}
                    <Route path='/admin/student' element={<Estudantes/>}></Route>{/*lista de alunos  */}
                    <Route path='/admin/parent' element={<Encarregado/>}></Route>{/* lista parente */}
                    <Route path='/admin/declaracao' element={<Declaracao/>}></Route>{/* dashboards e geraçao de declaração*/}
                    <Route path='/admin/certificado' element={<Certificado/>}></Route>{/* dashboards e geração de certificado*/}
                    <Route path='/admin/boletim' element={<Boletim/>}></Route>{/* dashboards e geração de boletim*/}
                    <Route path='/admin/ask' element={<Solicitacao/>}></Route>{/* lista solicitações*/}
                    <Route path='/admin/history' element={<Histories/>}></Route>{/* lista de login*/}
                    <Route path='/admin/setting' element={<Settings/>}></Route>{/* */}
                    <Route path='/admin/auth' element={<AuthAdmin/>}></Route>{/*  */}
                    <Route path='/agent/account' element={<Accounts/>}></Route>{/* */}
                    <Route path='/agent/yasmin' element={"/agent/yasmin"}></Route>{/* */}
                    {/***ALUNO** */}{/* */}
                    <Route path='/student/dashboard' element={<DashboardsStudents/>}></Route>{/* */}
                    <Route path='/student/document' element={<DocumentsCliente/>}></Route>{/* */}
                    <Route path='/student/ask' element={"/student/library"}></Route>{/* */}
                    <Route path='/student/auth' element={<AuthStudent/>}></Route>{/* */}
                    {/***ENCARREGADO** */}{/* */}
                    <Route path='/parent/dashboard' element={<DashboardEncarregado/>}></Route>{/* */}
                    <Route path='/parent/children' element={"/parent/children"}></Route>{/* */}
                    <Route path='/parent/ask' element={"/parent/ask"}></Route>{/* */}
                    <Route path='/parent/auth' element={<AuthParent/>}></Route>{/* */}
                    {/***PUBLICO** */}{/* */}
                    <Route path='/' index element={<MainSite/>}></Route>{/* */}
                    <Route path='/public/site' element={<MainSite/>}></Route>{/* */} 
                    <Route path='/public/library' element={<LIbrary/>}></Route>{/* */}
                    <Route path='/public/library/buy' element={"/public/library/buy"}></Route>{/* */}


                </Routes>
            </BRouter>
        </>
    )
}
export default Routers