import {BrowserRouter as BRouter, Route,Routes} from 'react-router-dom'
// importing of views for routers
import MainSite from './Pages/Public/Site/MainSite'
import Dashboards from './Pages/Admin/Dashboards/Dashboards'
import AuthAdmin from './Pages/Admin/Auth/AuthAdmin'
import DashboardsStudents from './Pages/Client/Students/Dashboards/DashboardsStudents'
import LIbrary from './Pages/Public/LIbrary/LIbrary'
import AuthPublic from './Pages/Public/AuthPublic/AuthPublic'
import DashboardEncarregado from './Pages/Client/Parents/Dashboards/DashboardEncarregado'
const Routers=()=>{
    return (
        <>
            <BRouter>
                <Routes>       
                {/**
                 * Router for admin side
                 */}
                 <Route  path='/admin/dashboards'exact element={<Dashboards/>}/>
                 <Route  path='/admin/users'exact element={''}/>
                 <Route  path='/admin/asks'exact element={''}/>
                 <Route  path='/admin/auth'exact element={<AuthAdmin/>}/>
                 <Route  path='/admin/history'exact element={''}/>
                 <Route  path='/admin/account'exact element={''}/>
                 <Route  path='/admin/documents'exact element={''}/>

                {/**
                 * Router for clients site
                 */}
                 <Route  path='/client/student'exact element={<DashboardsStudents/>}/>
                 <Route  path='/client/student'exact element={<DashboardsStudents/>}/>
                 <Route  path='/client/parents'exact element={<DashboardEncarregado/>}/>
                 
                {/**
                 * Router for public
                 */}
                 <Route index path=''exact element={<MainSite/>}/>
                 <Route index path='/public/site'exact element={<MainSite/>}/>
                 <Route  path='/public/library'exact element={<LIbrary/>}/>
                 <Route  path='/public/auth'exact element={<AuthPublic/>}/>
             
                </Routes>
            </BRouter>
        </>
    )
}
export default Routers