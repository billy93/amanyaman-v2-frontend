import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import LayoutDashboard from './components/LayoutDashboard'
import {ROLES} from './configRoles'
import Public from './components/Public'
import Login from './features/auth/Login'
import LoginTraveller from './features/auth/Login-traveller'
import Welcome from './features/auth/Welcome'
import RequireAuth from './features/auth/RequireAuth'
import PolicyList from './features/dashboard/policy/policy'
import ClaimList from './features/dashboard/claim/claim'
import CreateClaim from './features/dashboard/claim/createClaim'
import CreateClaimPage from './features/dashboard/claim/createClaimpage/createClaimMenu'
import Reporting from './features/dashboard/reporting/reporting'
import ClaimEmergency from './features/dashboard/claim/claimEmergency/emergency'
import ForgotPass from './features/auth/forgotPassword'
import QuotaSearch from './features/dashboard/quota-search/quotaSearch'
import Product from './features/dashboard/product/product'
import MasterUser from './features/dashboard/masterUser/masterUser'
import MasterProduct from './features/dashboard/masterProduct/masterProduct'
import PolicyDetails from './features/dashboard/policy/policyDetail'
import CreateProduct from './features/dashboard/masterProduct/createProduct'
import CreateUser from './features/dashboard/masterUser/createUser'
import DetailMasterUser from './features/dashboard/masterUser/detailMasterUser'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Login />} />
        <Route path="forgot-password" element={<ForgotPass />} />
      </Route>
      
        <Route path="/create-quota" exact element={<LayoutDashboard allowedRoles={['ROLE_ADMIN']}/>}>
          <Route path="search" element={<QuotaSearch />} />
        </Route>
        <Route path="/policies" exact element={<LayoutDashboard allowedRoles={['ROLE_SALES']}/>}>
          <Route path="list" element={<PolicyList />} />
          <Route path="policy-detail" element={<PolicyDetails />} />
        </Route>
        <Route path="/master-data" exact element={<LayoutDashboard allowedRoles={['ROLE_ADMIN']}/>}>
          <Route path="master-user" element={<MasterUser />} />
          <Route path="create-user" element={<CreateUser />} />
          <Route path="detail-user/:id" element={<DetailMasterUser />} />
        </Route>
        <Route path="/master-data" exact element={<LayoutDashboard allowedRoles={[ 'ROLE_ADMIN']}/>}>
          <Route path="master-products" element={<MasterProduct />} />
          <Route path="create-product" element={<CreateProduct />} />
        </Route>
        <Route path="/claim" exact element={<LayoutDashboard />}>
          <Route path="list" element={<ClaimList />} />
          <Route path="create/non/step1" element={<CreateClaim />} />
          <Route path="create" element={<CreateClaimPage />} />
          <Route path="emergency" element={<ClaimEmergency />} />
        </Route>
        <Route path="/reporting" exact element={<LayoutDashboard />}>
          <Route path="list" element={<Reporting />} />
        </Route>
        <Route path="/products" exact element={<LayoutDashboard allowedRoles={['ROLE_SALE', 'ROLES_ADMIN']}/>}>
          <Route path="list" element={<Product />} />
        </Route>
    </Routes>
  )
}

export default App;
