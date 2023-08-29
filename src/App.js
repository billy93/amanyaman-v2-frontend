import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LayoutDashboard from './components/LayoutDashboard';
import Login from './features/auth/Login';
import PolicyList from './features/dashboard/policy/policy';
import Reporting from './features/dashboard/reporting/reporting';
import ForgotPass from './features/auth/forgotPassword';
import QuotaSearch from './features/dashboard/quota-search/mainQuotSearch';
import QuotaSearchId from './features/dashboard/quota-search/quotaSearchById';
import Product from './features/dashboard/product/product';
import MasterUser from './features/dashboard/masterUser/masterUser';
import MasterProduct from './features/dashboard/masterProduct/masterProduct';
import PolicyDetails from './features/dashboard/policy/policyDetail';
import CreateUser from './features/dashboard/masterUser/createUser';
import TravelAgent from './features/dashboard/travelAgent/travelAgent';
import SystemParams from './features/dashboard/systemParameters/systemParameters';
import CreateSystemParams from './features/dashboard/systemParameters/createParams';
import EditSystemParams from './features/dashboard/systemParameters/editParams';
import DetailSystemParams from './features/dashboard/systemParameters/detailSystemParams';
import CreateTravelAgent from './features/dashboard/travelAgent/createTravelAgent';
import DetailTravelAgent from './features/dashboard/travelAgent/detailTravelAgent';
import EditUser from './features/dashboard/masterUser/editUser';
import EditAgent from './features/dashboard/travelAgent/editAgent';
import ProductPrice from './features/dashboard/productPrice/productPrice';
import ListCountry from './features/dashboard/country/listCountry';
import ListCity from './features/dashboard/city/listCity';
import ListArea from './features/dashboard/area/listArea';
import ListVariants from './features/dashboard/varian/systemParameters';
import ListGroupArea from './features/dashboard/group-area/listArea';
import Dashboards from './features/dashboard/dashboards/dashboard';
import CreateProductPrice from './features/dashboard/productPrice/createProductPrice';
import DetailMasterUser from './features/dashboard/masterUser/detailMasterUser';
import ResetPassword from './features/auth/confirmResetPassword';
import DocumentType from './features/dashboard/documentType/documenType';
import PlanType from './features/dashboard/planType/planType';
import BandType from './features/dashboard/bandType/bandTypes';
import TravellerType from './features/dashboard/travellerType/travellerTypes';
// import CreateProducts from './features/dashboard/masterProduct/createProducts';
import CreateMasterProduct from './features/dashboard/masterProduct/createProducts';
import EditProducts from './features/dashboard/masterProduct/editProduct';
import DetailProductPrice from './features/dashboard/productPrice/detailProductPrice';
import DetailMasterProduct from './features/dashboard/masterProduct/detailMasterProduct';
import PaymentSuccess from './features/dashboard/paymentSuccess/paymentSuccess';
import PaymentLoader from './components/loaderComponent';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Login />} />
        <Route path="forgot-password" element={<ForgotPass />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>

      <Route
        path="/create-quota"
        exact
        element={<LayoutDashboard allowedRoles={['ROLE_TRAVEL_AGENT']} />}
      >
        <Route path="search" element={<QuotaSearch />} />
        <Route path="search/:id" element={<QuotaSearchId />} />
      </Route>
      <Route
        path="/dashboard"
        exact
        element={<LayoutDashboard allowedRoles={['ROLE_TRAVEL_AGENT']} />}
      >
        <Route path="chart" element={<Dashboards />} />
      </Route>
      <Route
        path="/payment"
        exact
        element={<LayoutDashboard allowedRoles={['ROLE_TRAVEL_AGENT']} />}
      >
        <Route path="success/:id" element={<PaymentSuccess />} />
        <Route path="payment-confirmation" element={<PaymentLoader />} />
      </Route>
      <Route
        path="/policies"
        exact
        element={
          <LayoutDashboard
            allowedRoles={[
              'ROLE_TRAVEL_AGENT',
              'ROLE_TRAVEL_AGENT',
              'ROLE_FINANCE',
              'ROLE_IBS',
              'ROLE_MANAGEMENT',
              'ROLE_CALL_CENTER',
              'ROLE_OPERATION_MANAGER',
              'ROLE_BUSINESS_EXECUTIVE',
              'ROLE_FINANCE_STAFF',
            ]}
          />
        }
      >
        <Route path="list" element={<PolicyList />} />
        <Route path="policy-detail" element={<PolicyDetails />} />
      </Route>
      <Route
        path="/master-data"
        exact
        element={<LayoutDashboard allowedRoles={['ROLE_ADMIN']} />}
      >
        <Route path="master-user" element={<MasterUser />} />
        <Route path="create-user" element={<CreateUser />} />
        <Route path="edit-user/:id" element={<EditUser />} />
        <Route path="detail-user/:id" element={<DetailMasterUser />} />
      </Route>
      <Route
        path="/master-data"
        exact
        element={
          <LayoutDashboard
            allowedRoles={['ROLE_ADMIN', 'ROLE_IBS', 'ROLE_OPERATION_MANAGER']}
          />
        }
      >
        <Route path="master-products" element={<MasterProduct />} />
        <Route path="create-product-price" element={<CreateProductPrice />} />
        <Route
          path="detail-product-price/:id"
          element={<DetailProductPrice />}
        />
        <Route
          path="detail-master-product/:id"
          element={<DetailMasterProduct />}
        />
        <Route
          path="product-price"
          element={<ProductPrice allowedRoles={['ROLE_ADMIN']} />}
        />
        <Route
          path="travel-agent"
          element={<TravelAgent />}
          allowedRoles={['ROLE_ADMIN']}
        />
        <Route
          path="system-params"
          element={<SystemParams />}
          allowedRoles={['ROLE_ADMIN']}
        />
        <Route
          path="create-system-params"
          element={<CreateSystemParams />}
          allowedRoles={['ROLE_ADMIN']}
        />
        <Route
          path="detail-system-params/:id"
          element={<DetailSystemParams />}
          allowedRoles={['ROLE_ADMIN']}
        />
        <Route
          path="edit-system-params/:id"
          element={<EditSystemParams />}
          allowedRoles={['ROLE_ADMIN']}
        />
        <Route
          path="create-agent"
          element={<CreateTravelAgent />}
          allowedRoles={['ROLE_ADMIN']}
        />
        <Route
          path="edit-agent/:id"
          element={<EditAgent />}
          allowedRoles={['ROLE_ADMIN']}
        />
        <Route
          path="detail-agent/:id"
          element={<DetailTravelAgent />}
          allowedRoles={['ROLE_ADMIN']}
        />
        <Route
          path="list-country"
          element={<ListCountry />}
          allowedRoles={['ROLE_ADMIN']}
        />
        <Route
          path="list-city"
          element={<ListCity />}
          allowedRoles={['ROLE_ADMIN']}
        />
        <Route
          path="list-area"
          element={<ListArea />}
          allowedRoles={['ROLE_ADMIN']}
        />
        <Route
          path="list-group-area"
          element={<ListGroupArea />}
          allowedRoles={['ROLE_ADMIN']}
        />
        <Route
          path="list-document-type"
          element={<DocumentType />}
          allowedRoles={['ROLE_ADMIN']}
        />
        <Route
          path="list-plan-type"
          element={<PlanType />}
          allowedRoles={['ROLE_ADMIN']}
        />
        <Route
          path="list-band-type"
          element={<BandType />}
          allowedRoles={['ROLE_ADMIN']}
        />
        <Route
          path="list-variant"
          element={<ListVariants />}
          allowedRoles={['ROLE_ADMIN']}
        />
        <Route
          path="list-traveller-type"
          element={<TravellerType />}
          allowedRoles={['ROLE_ADMIN']}
        />
        <Route
          path="edit-master-product/:id"
          element={<EditProducts />}
          allowedRoles={['ROLE_ADMIN']}
        />
        <Route
          path="create-master-product"
          element={<CreateMasterProduct />}
          allowedRoles={['ROLE_ADMIN']}
        />
      </Route>
      <Route
        path="/reporting"
        exact
        element={
          <LayoutDashboard
            allowedRoles={[
              'ROLE_TRAVEL_AGENT',
              'ROLE_FINANCE_STAFF',
              'ROLE_IBS',
              'ROLE_BUSINESS_EXECUTIVE',
              'ROLE_OPERATION_MANAGER',
              'ROLE_CALL_CENTER',
              'ROLE_FINANCE',
              'ROLE_MANAGEMENT',
              'ROLE_ETIQA',
            ]}
          />
        }
      >
        <Route path="list" element={<Reporting />} />
      </Route>
      <Route
        path="/products"
        exact
        element={
          <LayoutDashboard
            allowedRoles={[
              'ROLE_TRAVEL_AGENT',
              'ROLE_MANAGEMENT',
              'ROLE_FINANCE_STAFF',
              'ROLE_CALL_CENTER',
              '',
            ]}
          />
        }
      >
        <Route path="list" element={<Product />} />
      </Route>
    </Routes>
  );
}

export default App;
