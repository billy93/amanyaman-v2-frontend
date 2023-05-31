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
import TravelAgent from './features/dashboard/travelAgent/travelAgent'
import SystemParams from './features/dashboard/systemParameters/systemParameters'
import CreateSystemParams from './features/dashboard/systemParameters/createParams'
import EditSystemParams from './features/dashboard/systemParameters/editParams'
import DetailSystemParams from './features/dashboard/systemParameters/detailSystemParams'
import CreateTravelAgent from './features/dashboard/travelAgent/createTravelAgent'
import DetailTravelAgent from './features/dashboard/travelAgent/detailTravelAgent'
import EditUser from './features/dashboard/masterUser/editUser'
import EditAgent from './features/dashboard/travelAgent/editAgent'
import ProductPrice from './features/dashboard/productPrice/productPrice'
import Dashboards from './features/dashboard/dashboards/dashboard'
import CreateProductPrice from './features/dashboard/productPrice/createProductPrice'
import DetailMasterUser from './features/dashboard/masterUser/detailMasterUser'
import ResetPassword from './features/auth/confirmResetPassword'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Login />} />
        <Route path="forgot-password" element={<ForgotPass />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>
      
        <Route path="/create-quota" exact element={<LayoutDashboard allowedRoles={['ROLE_ADMIN']}/>}>
          <Route path="search" element={<QuotaSearch />} />
        </Route>
        <Route path="/dashboard" exact element={<LayoutDashboard allowedRoles={['ROLE_ADMIN']}/>}>
          <Route path='chart' element={<Dashboards />} />
        </Route>
        <Route path="/policies" exact element={<LayoutDashboard allowedRoles={['ROLE_ADMIN']} />}>
          <Route path="list" element={<PolicyList />} />
          <Route path="policy-detail" element={<PolicyDetails />} />
        </Route>
        <Route path="/master-data" exact element={<LayoutDashboard allowedRoles={['ROLE_ADMIN']}/>}>
          <Route path="master-user" element={<MasterUser />} />
          <Route path="create-user" element={<CreateUser />} />
          <Route path="edit-user/:id" element={<EditUser />} />
          <Route path="detail-user/:id" element={<DetailMasterUser />} />
        </Route>
        <Route path="/master-data" exact element={<LayoutDashboard allowedRoles={[ 'ROLE_ADMIN']}/>}>
          <Route path="master-products" element={<MasterProduct />} />
          <Route path="create-product" element={<CreateProduct />} />
          <Route path="create-product-price" element={<CreateProductPrice />} />
          <Route path="product-price" element={<ProductPrice allowedRoles={[ 'ROLE_ADMIN']}/>} />
          <Route path="travel-agent" element={<TravelAgent />} allowedRoles={[ 'ROLE_ADMIN']}/>
          <Route path="system-params" element={<SystemParams />} allowedRoles={[ 'ROLE_ADMIN']}/>
          <Route path="create-system-params" element={<CreateSystemParams />} allowedRoles={[ 'ROLE_ADMIN']}/>
          <Route path="detail-system-params/:id" element={<DetailSystemParams />} allowedRoles={[ 'ROLE_ADMIN']}/>
          <Route path="edit-system-params/:id" element={<EditSystemParams />} allowedRoles={[ 'ROLE_ADMIN']}/>
          <Route path="create-agent" element={<CreateTravelAgent />} allowedRoles={[ 'ROLE_ADMIN']}/>
          <Route path="edit-agent/:id" element={<EditAgent />} allowedRoles={[ 'ROLE_ADMIN']}/>
          <Route path="detail-agent/:id" element={<DetailTravelAgent />} allowedRoles={[ 'ROLE_ADMIN']}/>
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
