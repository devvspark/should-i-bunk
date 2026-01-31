import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import EditSubject from "./pages/subjects/EditSubject";
import SubjectDetail from "./pages/subjects/SubjectDetail";
import AddSubject from "./pages/subjects/AddSubject";
import SubjectsList from "./pages/subjects/SubjectList";
import Profile from "./pages/Profile";
import Timetable from "./pages/Timetable";
import {Toaster} from "react-hot-toast";
export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/profile" element={<Profile />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/subjects/add" element={<AddSubject />} />
        <Route path="/subjects" element={<SubjectsList />} />
        <Route path="/subjects/edit/:id" element={<EditSubject />} />
        <Route path="/subjects/:id" element={<SubjectDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
