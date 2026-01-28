import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  
  const NavItem = ({ icon, label, to }) => {
    const isActive = location.pathname.startsWith(to);

    return (
      <button
        onClick={() => navigate(to)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition
          ${
            isActive
              ? "bg-teal-50 text-teal-700 font-semibold"
              : "text-gray-500 hover:bg-gray-100"
          }`}
      >
        <span className="material-symbols-outlined">{icon}</span>
        <span className="text-sm">{label}</span>
      </button>
    );
  };

  return (
    <aside className="h-screen w-64 border-r bg-white hidden lg:flex flex-col">
      <div className="p-6 flex flex-col h-full">

        {/* LOGO */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 mb-10"
        >
          <div className="bg-teal-600 rounded-xl size-10 flex items-center justify-center text-white">
            <span className="material-symbols-outlined">school</span>
          </div>

          <div>
            <h1 className="text-base font-bold">Should I Bunk?</h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-500">
              Risk Awareness
            </p>
          </div>
        </button>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-1 flex-1">
          <NavItem icon="grid_view" label="Dashboard" to="/dashboard" />
          <NavItem icon="book" label="Subjects" to="/subjects" />
          <NavItem icon="calendar_today" label="Timetable" to="/timetable" />
          <NavItem icon="insights" label="Analytics" to="/analytics" />
        </nav>

        {/* FOOTER */}
        <div className="pt-6 border-t">
          <NavItem icon="settings" label="Settings" to="/settings" />
        </div>
      </div>
    </aside>
  );
}
