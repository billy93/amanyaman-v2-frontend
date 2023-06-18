import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    otherLogin: {
      username: null,
      password: null,
      role: null,
    },
    isAuthenticated: false,
    resetPassword: null,
    userLogin: null,
    tokenAccess: null,
    mainMenu: [
      {
        role: 'ROLE_ADMIN',
        menu: [
          {
            id: '2',
            name: 'Users',
            link: '/master-data/master-user',
            icon: '',
          },
          {
            id: '3',
            name: 'Master Data',
            link: '/master-data/master-products',
            icon: '',
            children: [
              {
                link: '/master-data/master-products',
                name: 'Master Products',
                href: '#',
              },
              {
                link: '/master-data/travel-agent',
                name: 'Travel Agent',
                href: '#',
              },
              {
                link: '/master-data/system-params',
                name: 'System Params',
                href: '#',
              },
              {
                link: '/master-data/product-price',
                name: 'Master Product Price',
                href: '#',
              },
              {
                link: '/master-data/list-country',
                name: 'List Country',
                href: '#',
              },
              {
                link: '/master-data/list-city',
                name: 'List City',
                href: '#',
              },
              {
                link: '/master-data/list-area',
                name: 'List Area',
                href: '#',
              },
              {
                link: '/master-data/list-group-area',
                name: 'List Group Area',
                href: '#',
              },
              {
                link: '/master-data/list-document-type',
                name: 'Document Type List',
                href: '#',
              },
              {
                link: '/master-data/list-plan-type',
                name: 'Plan Type List',
                href: '#',
              },
              {
                link: '/master-data/list-traveller-type',
                name: 'Traveller Type List',
                href: '#',
              },
              {
                link: '/master-data/list-product-code',
                name: 'Product Code List',
                href: '#',
              },
              {
                link: '/master-data/list-variant',
                name: 'Variant List',
                href: '#',
              },
              {
                link: '/master-data/list-band-type',
                name: 'Band Type List',
                href: '#',
              },
            ],
          },
        ],
      },
      {
        role: 'ROLE_TRAVEL_AGENT',
        menu: [
          {
            id: '1',
            name: 'Dashboard',
            link: '/dashboard/chart',
            icon: '',
          },
          {
            id: '2',
            name: 'Policies',
            link: '/policies/list',
            icon: '',
          },
          {
            id: '3',
            name: 'Travel Agent Product List',
            link: '/products/list',
            icon: '',
          },
          {
            id: '4',
            name: 'Travellers',
            link: '/travellers',
            icon: '',
          },
        ],
      },
      {
        role: 'ROLE_MANAGEMENT',
        menu: [
          {
            id: '1',
            name: 'Policies',
            link: '/policies/list',
            icon: '',
          },
          {
            id: '2',
            name: 'Travel Agent Product List',
            link: '/products/list',
            icon: '',
          },
          {
            id: '3',
            name: 'Reporting',
            link: '/reporting/list',
            icon: '',
          },
        ],
      },
      {
        role: 'ROLE_FINANCE',
        menu: [
          {
            id: '1',
            name: 'Policies',
            link: '/policies/list',
            icon: '',
          },
          {
            id: '2',
            name: 'Refund',
            link: '/refund/list',
            icon: '',
          },
          {
            id: '3',
            name: 'Travel Agent',
            link: '/master-data/travel-agent',
            icon: '',
          },
          {
            id: '4',
            name: 'Master Product Price',
            link: '/master-data/product-price',
            icon: '',
          },
        ],
      },
      {
        role: 'ROLE_CALL_CENTER',
        menu: [
          {
            id: '1',
            name: 'Policies',
            link: '/policies/list',
            icon: '',
          },
          {
            id: '2',
            name: 'Travel Agent',
            link: '/product/list',
            icon: '',
          },
          {
            id: '3',
            name: 'Refund',
            link: '/refund/list',
            icon: '',
          },
        ],
      },
      {
        role: 'ROLE_OPERATION_MANAGER',
        menu: [
          {
            id: '1',
            name: 'Policies',
            link: '/policies/list',
            icon: '',
          },
          {
            id: '2',
            name: 'Refund',
            link: '/refund/list',
            icon: '',
          },
          {
            id: '3',
            name: 'Reporting',
            link: '/reporting/list',
            icon: '',
          },
          {
            id: '4',
            name: 'Travel Agent',
            link: '/master-data/travel-agent',
            icon: '',
          },
        ],
      },
      {
        role: 'ROLE_BUSINESS_EXECUTIVE',
        menu: [
          {
            id: '1',
            name: 'Policies',
            link: '/policies/list',
            icon: '',
          },
          {
            id: '2',
            name: 'Travel Agent Product List',
            link: '/product/list',
            icon: '',
          },
          {
            id: '3',
            name: 'Reporting',
            link: '/reporting/list',
            icon: '',
          },
        ],
      },
      {
        role: 'ROLE_MARKETING',
        menu: [
          {
            id: '1',
            name: 'News & Promo',
            link: '/news/list',
            icon: '',
          },
        ],
      },
      {
        role: 'ROLE_ETIQA',
        menu: [
          {
            id: '1',
            name: 'Reporting',
            link: '/reporting/list',
            icon: '',
          },
        ],
      },
      {
        role: 'ROLE_IBS',
        menu: [
          {
            id: '1',
            name: 'Policies',
            link: '/policies/list',
            icon: '',
          },
          {
            id: '2',
            name: 'Reporting',
            link: '/reporting/list',
            icon: '',
          },
          {
            id: '3',
            name: 'Master Data Product Price',
            link: '/master-data/product-price',
            icon: '',
          },
        ],
      },
      {
        role: 'ROLE_FINANCE_STAFF',
        menu: [
          {
            id: '1',
            name: 'Policies',
            link: '/policies/list',
            icon: '',
          },
          {
            id: '2',
            name: 'Travel Agent Product List',
            link: '/product/list',
            icon: '',
          },
          {
            id: '3',
            name: 'Reporting',
            link: '/reporting/list',
            icon: '',
          },
        ],
      },
    ],
    userRole: [
      {
        username: 'admin',
        password: 'abcd1234',
        role: 'admin',
      },
      {
        username: 'bayu',
        password: 'abcd1234',
        role: 'user',
      },
    ],
    traveller: {
      insuredName: null,
      policyNumber: null,
      pasportNumber: null,
    },
  },
  reducers: {
    setCredentials: (state, action) => {
      state.userLogin = action.payload;
    },
    saveToken: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    logOut: (state, action) => {
      state.userLogin = null;
      state.isAuthenticated = false;
    },
    setAuth: (state, action) => {
      console.log('isAuthenticated', action.payload);
      state.isAuthenticated = action.payload;
    },
    resetPassword: (state, action) => {
      state.resetPassword = action.payload;
    },
  },
});

export const { setAuth, saveToken, setCredentials, logOut, resetPassword } =
  authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.otherLogin.username;
export const roleUser = (state) => state.auth.otherLogin.role;
export const selectCurrentToken = (state) => state.auth.otherLogin.password;
export const selectCurrentTraveller = (state) =>
  state.auth.traveller.insuredName;
export const UserRoles = (state) => state.auth.userRole;
export const Menulist = (state) => state.auth.mainMenu;
export const userLoginCurrent = (state) => state.auth.userLogin;
export const tokenLoginCurrent = (state) => state.auth.tokenAccess;
export const userResetPassword = (state) => state.auth.resetPassword;
export const isAuthenticate = (state) => state.auth.isAuthenticated;
