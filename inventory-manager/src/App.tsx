import User from "./pages/UserManagement/userManagement";
import Signup from "./pages/SignUp/SignUp";
import Login from "./pages/Login/login";
import AssetManagement from "./pages/AssetManagement/AssetManagement";
import Profile from "./pages/Profile/Profile";
import StockMovement from "./pages/StockMovement/stockMovement";
import Product from "./pages/NewProduct/newProduct";
import MainLayout from "./layout/Mainlayout";
import VendorManagement from "./pages/Vendor/Vendor";
import Orders from "./pages/Orders/Orders";
import Stocks from "./pages/Stocks/Stocks";
import Issuance from "./pages/Issuance/Issuance";
import NewIssuances from "./pages/NewIssuance/NewIssuance";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import PublicRoute from "./components/PublicRoute/PublicRoute";
import PermissionRoute from "./components/ProtectedRoute/PermissionRoute";
import { Permission } from "./auth/permission";

import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NewOrders from "./pages/newOrders/newOrders";
import Dashboard from "./pages/DashBoard/dashboard";

export default function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route
              path="/dashboard"
              element={
                <PermissionRoute permission={Permission.MANAGE_ASSETS}>
                  <Dashboard />
                </PermissionRoute>
              }
            ></Route>
            <Route
              path="/user-management"
              element={
                <PermissionRoute permission={Permission.MANAGE_USERS}>
                  <User />
                </PermissionRoute>
              }
            ></Route>
            <Route
              path="/issuance/issuances"
              element={
                <PermissionRoute permission={Permission.MANAGE_ISSUANCE}>
                  <Issuance />
                </PermissionRoute>
              }
            ></Route>
            <Route
              path="/issuance/issue-item"
              element={
                <PermissionRoute permission={Permission.MANAGE_ISSUANCE}>
                  <NewIssuances />
                </PermissionRoute>
              }
            ></Route>
            <Route
              path="/inventory/asset-management"
              element={
                <PermissionRoute permission={Permission.MANAGE_ASSETS}>
                  <AssetManagement />
                </PermissionRoute>
              }
            ></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route
              path="/supply-management/stock-movement"
              element={
                <PermissionRoute permission={Permission.VIEW_MOVEMENT}>
                  <StockMovement />
                </PermissionRoute>
              }
            />
            <Route
              path="/inventory/new-product"
              element={
                <PermissionRoute permission={Permission.CREATE_ASSETS}>
                  <Product />
                </PermissionRoute>
              }
            />
            <Route
              path="/supply-management/vendor-management"
              element={
                <PermissionRoute permission={Permission.MANAGE_VENDORS}>
                  <VendorManagement />
                </PermissionRoute>
              }
            />
            <Route
              path="/supply-management/orders"
              element={
                <PermissionRoute permission={Permission.MANAGE_ORDERS}>
                  <Orders />
                </PermissionRoute>
              }
            />
            <Route
              path="/supply-management/stocks"
              element={
                <PermissionRoute permission={Permission.MANAGE_STOCKS}>
                  <Stocks />
                </PermissionRoute>
              }
            />
            <Route
              path="/supply-management/new-orders"
              element={
                <PermissionRoute permission={Permission.CREATE_ORDERS}>
                  <NewOrders />
                </PermissionRoute>
              }
            ></Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}
