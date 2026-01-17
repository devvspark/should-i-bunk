import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login"


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
