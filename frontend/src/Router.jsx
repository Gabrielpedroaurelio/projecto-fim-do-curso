import { BrowserRouter as BRouter, Route, Routes } from 'react-router-dom'
// importing of views for routers
import MainSite from './Pages/Public/Site/MainSite'
import Dashboards from './Pages/Admin/Dashboards/Dashboards'
import AuthParent from './Pages/Client/Parents/AuthParent'
import AuthStudent from './Pages/Client/Students/AuthStudent'
import AuthAdmin from './Pages/Admin/Auth/AuthAdmin'
import LIbrary from './Pages/Public/LIbrary/LIbrary'
// estudantes
import DashboardsStudents from './Pages/Client/Students/Dashboards/DashboardsStudents'
import DocumentsCliente from './Pages/Client/Students/DocumentsCliente/DocumentsCliente'
import AskStudent from './Pages/Client/Students/AskStudent/AskStudent'
import Grades from './Pages/Client/Students/Grades/Grades'
import Schedule from './Pages/Client/Students/Schedule/Schedule'
import Attendance from './Pages/Client/Students/Attendance/Attendance'
import Settings from './Pages/Admin/Settings/Settings'
import Accounts from './Pages/Admin/Accounts/Accounts'
import Histories from './Pages/Admin/Histories/Histories'
// parent
import Children from './Pages/Client/Parents/Children/Children'
import ChildrenActions from './Pages/Client/Parents/ChildrenActions/ChildrenActions'
import DashboardEncarregado from './Pages/Client/Parents/Dashboards/DashboardEncarregado'
import Documentos from './Pages/Client/Parents/Documentos/Documentos'
import SolicitacaoParent from './Pages/Client/Parents/SolicitacaoParent/SolicitacaoParent'
//import Asks from './Pages/Admin'
import Encarregado from './Pages/Admin/Encarregado/Encarregado'
import Estudantes from './Pages/Admin/Estudantes/Estudantes'
import Funcionario from './Pages/Admin/Funcionario/Funcionario'
import Solicitacao from './Pages/Admin/Solicitacao/Solicitacao'
import LibraryAdmin from './Pages/Admin/Library/Library'
// documents
import Certificado from './Pages/Admin/Certificado/Certificado'
import Boletim from './Pages/Admin/Boletim/Boletim'
import Declaracao from './Pages/Admin/Declaracao/Declaracao'
import YasminChat from './Pages/YasminAI/YasminChat'

const Routers = () => {
    return (
        <>
            <BRouter>
                <Routes>
                    {/***ADMINSTRADOR** */}
                    <Route path='/admin/dashboard' element={<Dashboards />}></Route>{/* done dashboards */}
                    <Route path='/admin/' element={<Dashboards />}></Route>{/*dashboards done*/}
                    <Route path='/admin/funcionario' element={<Funcionario />}></Route>{/* lista do funcionario das instituicao */}
                    <Route path='/admin/student' element={<Estudantes />}></Route>{/*lista de alunos  */}
                    <Route path='/admin/parent' element={<Encarregado />}></Route>{/* lista parente */}
                    <Route path='/admin/declaracao' element={<Declaracao />}></Route>{/* dashboards e geraçao de declaração*/}
                    <Route path='/admin/certificado' element={<Certificado />}></Route>{/* dashboards e geração de certificado*/}
                    <Route path='/admin/boletim' element={<Boletim />}></Route>{/* dashboards e geração de boletim*/}
                    <Route path='/admin/ask' element={<Solicitacao />}></Route>{/* lista solicitações*/}
                    <Route path='/admin/library' element={<LibraryAdmin />}></Route>{/* biblioteca admin */}
                    <Route path='/admin/history' element={<Histories />}></Route>{/* lista de login*/}
                    <Route path='/admin/setting' element={<Settings />}></Route>{/* */}
                    <Route path='/admin/auth' element={<AuthAdmin />}></Route>{/*  */}
                    <Route path='/agent/account' element={<Accounts />}></Route>{/* */}
                    <Route path='/admin/yasmin' element={<YasminChat />}></Route>{/* Yasmin Admin */}
                    <Route path='/agent/yasmin' element={<YasminChat />}></Route>{/* Backward compat if needed */}

                    {/***ALUNO** */}{/* */}
                    <Route path='/student/dashboard' element={<DashboardsStudents />}></Route>{/* */}
                    <Route path='/student/document' element={<DocumentsCliente />}></Route>{/* */}
                    <Route path='/student/ask' element={<AskStudent />}></Route>{/* */}
                    <Route path='/student/grades' element={<Grades />}></Route>{/* */}
                    <Route path='/student/schedule' element={<Schedule />}></Route>{/* */}
                    <Route path='/student/attendance' element={<Attendance />}></Route>{/* */}
                    <Route path='/student/auth' element={<AuthStudent />}></Route>{/* */}
                    <Route path='/student/yasmin' element={<YasminChat />}></Route>{/* Yasmin Student */}

                    {/***ENCARREGADO** */}{/* */}
                    <Route path='/parent/dashboard' element={<DashboardEncarregado />}></Route>{/* */}
                    <Route path='/parent/children' element={<Children />}></Route>{/* */}
                    <Route path='/parent/ask' element={<SolicitacaoParent />}></Route>{/* */}
                    <Route path='/parent/document' element={<Documentos />}></Route>{/* */}
                    <Route path='/parent/actionstudent' element={<ChildrenActions />}></Route>{/* */}
                    <Route path='/parent/auth' element={<AuthParent />}></Route>{/* */}
                    <Route path='/parent/yasmin' element={<YasminChat />}></Route>{/* Yasmin Parent */}
                    {/***PUBLICO** */}{/* */}
                    <Route path='/' index element={<MainSite />}></Route>{/* */}
                    <Route path='/public/site' element={<MainSite />}></Route>{/* */}
                    <Route path='/public/library' element={<LIbrary />}></Route>{/* */}
                    <Route path='/public/library/buy' element={"/public/library/buy"}></Route>{/* */}


                </Routes>
            </BRouter>
        </>
    )
}
export default Routers