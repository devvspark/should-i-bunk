import Sidebar from "../components/dashboard/Sidebar";
import TopHeader from "../components/dashboard/TopHeader";
import OverviewCards from "../components/dashboard/OverviewCards";
import SubjectGrid from "../components/dashboard/SubjectGrid";
export default function Dashboard() {
  return (
    <div className="min-h-screen flex bg-[#f7fafa]">

       <div className="fixed left-0 top-0 h-screen z-20 ">
        <Sidebar />
      </div>


      {/* <div className="flex-1 flex flex-col"> */}
      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-64"> {/* ml-64 for sidebar width */}
        {/* HEADER */}
        <div className="fixed top-0 left-0 right-0 lg:left-64 z-10">
          <TopHeader />
        </div>


        {/* PAGE CONTENT */}
        {/* <main className="p-6 space-y-8"> */}
        <main className="flex-1 pt-16 lg:pt-20 p-6 space-y-8 overflow-y-auto">
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
