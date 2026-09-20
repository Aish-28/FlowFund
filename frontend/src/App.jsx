import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Registration from "./pages/auth/Registration";
import Home from "./pages/landing/Home";
import AdminLogin from "./pages/auth/AdminLogin";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/register" element={<Registration/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/admin/login" element={<AdminLogin/>}></Route>
        <Route path="/freelancer-dashboard" element={<ProtectedRoute allowedRole="FREELANCER">
            <FreelancerDashboard />
        </ProtectedRoute>}/>
        <Route path="/client-dashboard" element={<ProtectedRoute allowedRole="CLIENT">
            <ClientDashboard />
        </ProtectedRoute>}/>
        <Route path="/admin-dashboard" element={<ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
        </ProtectedRoute>}/>

      </Routes>
    </BrowserRouter>

    // <Registration/>
  );
}

export default App;