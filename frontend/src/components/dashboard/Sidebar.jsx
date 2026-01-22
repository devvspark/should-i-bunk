import { useNavigate } from "react-router-dom";
export default function Sidebar() {
  const navigate = useNavigate(); 
  return (
    <aside className="w-64 flex-shrink-0 border-r border-[#eaeff1] dark:border-gray-800 bg-white dark:bg-gray-900 hidden lg:flex flex-col">
      <div className="p-6 flex flex-col h-full">

        {/* 🔹 LOGO / BRAND */}
        <button
          onClick={() => navigate("/")}
          className ="flex items-center gap-3 mb-10">
          <div className="bg-teal-600 rounded-xl size-10 flex items-center justify-center text-white">
            <span className="material-symbols-outlined">
              school
            </span>
          </div>
          


          <div className="flex flex-col">
            <h1 className="text-[#101718] dark:text-white text-base font-bold leading-none">
              Should I Bunk?
            </h1>
            <p className="text-[#5c808a] dark:text-gray-400 text-[10px] uppercase tracking-widest font-semibold mt-1">
              Risk Awareness
            </p>
          </div>
        </button>
        

        {/* 🔹 NAVIGATION */}
        <nav className="flex flex-col gap-1 flex-1">

          {/* ACTIVE ITEM */}
          <NavItem
            icon="grid_view"
            label="Dashboard"
            active
            filled
          />

          <NavItem
            icon="book"
            label="Subjects"
          />

          <NavItem
            icon="calendar_today"
            label="Timetable"
          />

          <NavItem
            icon="insights"
            label="Analytics"
          />

        </nav>

        {/* 🔹 FOOTER / SETTINGS */}
        <div className="pt-6 border-t border-[#eaeff1] dark:border-gray-800">
          <NavItem
            icon="settings"
            label="Settings"
          />
        </div>

      </div>
    </aside>
  );
}

/* 🔹 REUSABLE NAV ITEM */
function NavItem({ icon, label, active = false, filled = false }) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
        ${
          active
            ? "bg-primary/10 text-primary"
            : "text-[#5c808a] hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
    >
      <span
        className="material-symbols-outlined"
        style={
          filled
            ? { fontVariationSettings: "'FILL' 1" }
            : undefined
        }
      >
        {icon}
      </span>

      <span
        className={`text-sm ${
          active ? "font-semibold" : "font-medium"
        }`}
      >
        {label}
      </span>
    </a>
  );
}
