import Sidebar from "../components/dashboard/Sidebar";
import TopHeader from "../components/dashboard/TopHeader";
import OverviewCards from "../components/dashboard/OverviewCards";
import SubjectGrid from "../components/dashboard/SubjectGrid";
export default function Dashboard() {
  return (
    <div className="min-h-screen flex bg-[#f7fafa]">

      {/* SIDEBAR */}
      {/* <aside className="w-64 hidden lg:block"> */}
        <Sidebar />
      {/* </aside> */}


      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="bg-white border-b">
          <TopHeader />
        </header>

        {/* PAGE CONTENT */}
        <main className="p-6 space-y-8">

          {/* OVERVIEW */}
          <section>
            <OverviewCards />
          </section>

          {/* SUBJECTS */}
          <section>
            <SubjectGrid />
          </section>


          </main>
      </div>       
    </div>
  );
}
