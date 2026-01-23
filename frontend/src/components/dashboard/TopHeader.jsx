import { useSelector } from "react-redux";


export default function TopHeader() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4">

      {/* 🔹 LEFT: PAGE TITLE */}
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold tracking-tight text-gray-900">
          Dashboard Overview
        </h2>
      </div>

      {/* 🔹 RIGHT: SEARCH + ACTIONS */}
      <div className="flex items-center gap-6">

        {/* SEARCH (DESKTOP ONLY) */}
        <div className="relative hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
            search
          </span>
          <input
            type="text"
            placeholder="Search subjects..."
            className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* NOTIFICATIONS */}
        <button className="relative p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
          <span className="material-symbols-outlined">
            notifications
          </span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* PROFILE */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            {/* <p className="text-sm font-bold text-gray-900 leading-none">
              Alex Rivera
            </p> */}
            <p className="text-sm font-bold text-gray-900 leading-none">
              {currentUser?.name || "User"}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              {currentUser?.branch || "—"}
            </p>
          </div>

          <div
            className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white shadow-sm"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD0WLrJbGhxW8d7j2eACwpBtpdv6XpzMBYieFvfhvVv-3Bx-Zg1uOReL_NeG270NkLxiMlvtHTwCUJHL7jiTCAL1zLojp8Jj8FE3Y1-Rv5cvFqRyqdRLXXnPGzFNN-Fj_HDLhkQnd9txpcS5uF_h0ZD5HxNUUXopPgSkwKx2ShW9vFRRRnzrIg1dJx_yRAr1YO8ksUbQ_O3XDge_pFMzYKwMqN1heg8Ces-D1-ZiLu82Dxp6Us6DgkfBr_FI9Rib7SfbA0kiDHnTLmM')",
            }}
          />
        </div>

      </div>
    </header>
  );
}
