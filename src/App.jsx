import { Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin"
import Dashboard from "./pages/Dashboard"
import RegisterPage from "./pages/Register"
import ProtectedRoute from "./routes/ProtectedRoute";
import Landingpage from "./pages/Landingpage";
const App = () => {
  return (
    <Routes>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/admin" element={<AdminLogin/>}/>
        <Route path="/" element={<Landingpage/>}/>
        <Route path="/dashboard" element={
         <ProtectedRoute>
           <Dashboard/>
         </ProtectedRoute>
          }/>
    </Routes>
  )
}

export default App