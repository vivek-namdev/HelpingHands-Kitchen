import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import DonorRegister from "./pages/DonorRegister.jsx";
import CreateDonation from "./pages/CreateDonation.jsx";
import Donations from "./pages/Donations.jsx";
import NGORegister from "./pages/NGORegister.jsx";
import NGOs from "./pages/NGOs.jsx";
import Claims from "./pages/Claims.jsx";
import DAOutput from "./pages/daOutput.jsx";
import Landing from "./pages/Landing.jsx";

import DonorLogin from "./pages/auth/DonorLogin.jsx";
import DonorRegisterAuth from "./pages/auth/DonorRegister.jsx";

import NGOLogin from "./pages/auth/NGOLogin.jsx";
import NGORegisterAuth from "./pages/auth/NGORegister.jsx";

import AdminLogin from "./pages/auth/AdminLogin.jsx";
import AdminRegister from "./pages/auth/AdminRegister.jsx";

function App() {
  return (
    <Routes>
      {/* ==================================================
          PUBLIC ROUTES
      ================================================== */}

      <Route path="/landing" element={<Landing />} />

      <Route path="/login/donor" element={<DonorLogin />} />

      <Route path="/register/donor" element={<DonorRegisterAuth />} />

      <Route path="/login/ngo" element={<NGOLogin />} />

      <Route path="/register/ngo" element={<NGORegisterAuth />} />

      <Route path="/login/admin" element={<AdminLogin />} />

      <Route path="/register/admin" element={<AdminRegister />} />

      {/* ==================================================
          PROTECTED ROUTES
      ================================================== */}

      <Route element={<Layout />}>
        {/* Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["donor", "ngo", "admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Donor Registration */}
        <Route
          path="/donor/register"
          element={
            <ProtectedRoute allowedRoles={["donor", "admin"]}>
              <DonorRegister />
            </ProtectedRoute>
          }
        />

        {/* Create Donation */}
        <Route
          path="/donation/create"
          element={
            <ProtectedRoute allowedRoles={["donor", "admin"]}>
              <CreateDonation />
            </ProtectedRoute>
          }
        />

        {/* Donations */}
        <Route
          path="/donations"
          element={
            <ProtectedRoute allowedRoles={["donor", "ngo", "admin"]}>
              <Donations />
            </ProtectedRoute>
          }
        />

        {/* NGO Registration */}
        <Route
          path="/ngo/register"
          element={
            <ProtectedRoute allowedRoles={["ngo", "admin"]}>
              <NGORegister />
            </ProtectedRoute>
          }
        />

        {/* NGOs */}
        <Route
          path="/ngos"
          element={
            <ProtectedRoute allowedRoles={["ngo", "admin"]}>
              <NGOs />
            </ProtectedRoute>
          }
        />

        {/* Claims */}
        <Route
          path="/claims"
          element={
            <ProtectedRoute allowedRoles={["ngo", "admin"]}>
              <Claims />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* DA Output */}
      <Route
        path="/da-output"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DAOutput />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
