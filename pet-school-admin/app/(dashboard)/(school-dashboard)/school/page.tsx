// "use client";

// import DashboardHeading from "@/components/dashboard/common/DashboardHeading";
// import LoadingSpinner from "@/components/ui/LoadingSpinner";
// import { useGetSchoolDashboardResponseQuery } from "@/redux/features/api/dashboard/school/dashboard/SchoolDashboardApi";
// import {
//   Users,
//   BookOpen,
//   DollarSign,
//   Calendar,
//   TrendingUp,
// } from "lucide-react";
// import { useSession } from "next-auth/react";

// // Mock data (replace with real API data)
// const stats = {
//   totalStudents: 324,
//   studentChange: "+12%",
//   activeCourses: 18,
//   courseChange: "+2",
//   monthlyRevenue: 45890,
//   revenueChange: "+18%",
//   classesToday: 12,
//   onSchedule: true,
// };

// const revenueExpenses = [
//   { month: "Jan", revenue: 32000, expenses: 18000 },
//   { month: "Feb", revenue: 38000, expenses: 19500 },
//   { month: "Mar", revenue: 42000, expenses: 21000 },
//   { month: "Apr", revenue: 45000, expenses: 22000 },
//   { month: "May", revenue: 48000, expenses: 23000 },
//   { month: "Jun", revenue: 52000, expenses: 24500 },
// ];

// const todaysClasses = [
//   {
//     title: "Basic Obedience Training",
//     time: "10:05 AM",
//     instructor: "Sarah Johnson",
//     students: 12,
//     status: "in-progress",
//   },
//   {
//     title: "Toilet Training for Puppies",
//     time: "2:00 PM",
//     instructor: "Mike Chen",
//     students: 8,
//     status: "upcoming",
//   },
//   {
//     title: "Advanced Social Skills",
//     time: "4:00 PM",
//     instructor: "Emily Rodriguez",
//     students: 10,
//     status: "upcoming",
//   },
// ];

// export default function PetSchoolDashboard() {
//   const { status } = useSession();
//   const {
//     data: schoolDashboardData,
//     isLoading,
//     isFetching,
//     isError,
//   } = useGetSchoolDashboardResponseQuery(undefined, {
//     skip: status === "loading",
//   });

//   console.log("School Dashboard data: ", schoolDashboardData);

//   if (isLoading || isFetching) return <LoadingSpinner />;
//   return (
//     <div className="space-y-6 pb-10">
//       {/* Header */}
//       <DashboardHeading
//         title="Pet School Dashboard"
//         description="Welcome back! Here's your training center overview"
//       />

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
//         <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
//           <div className="flex items-center justify-between mb-3">
//             <div className="p-3 bg-pink-100 rounded-lg">
//               <Users className="h-6 w-6 text-pink-600" />
//             </div>
//             <span className="text-sm font-medium text-green-600">
//               {stats.studentChange}
//             </span>
//           </div>
//           <h3 className="text-3xl font-bold">{stats.totalStudents}</h3>
//           <p className="text-sm text-gray-500">Total Students</p>
//         </div>

//         <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
//           <div className="flex items-center justify-between mb-3">
//             <div className="p-3 bg-blue-100 rounded-lg">
//               <BookOpen className="h-6 w-6 text-blue-600" />
//             </div>
//             <span className="text-sm font-medium text-green-600">
//               {stats.courseChange}
//             </span>
//           </div>
//           <h3 className="text-3xl font-bold">{stats.activeCourses}</h3>
//           <p className="text-sm text-gray-500">Active Courses</p>
//         </div>

//         <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
//           <div className="flex items-center justify-between mb-3">
//             <div className="p-3 bg-green-100 rounded-lg">
//               <DollarSign className="h-6 w-6 text-green-600" />
//             </div>
//             <span className="text-sm font-medium text-green-600">
//               {stats.revenueChange}
//             </span>
//           </div>
//           <h3 className="text-3xl font-bold">
//             ${stats.monthlyRevenue.toLocaleString()}
//           </h3>
//           <p className="text-sm text-gray-500">Monthly Revenue</p>
//         </div>

//         <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
//           <div className="flex items-center justify-between mb-3">
//             <div className="p-3 bg-orange-100 rounded-lg">
//               <Calendar className="h-6 w-6 text-orange-600" />
//             </div>
//             <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
//               On Schedule
//             </span>
//           </div>
//           <h3 className="text-3xl font-bold">{stats.classesToday}</h3>
//           <p className="text-sm text-gray-500">Classes Today</p>
//         </div>
//       </div>

//       {/* Charts Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
//         {/* Student Enrollment Trend */}
//         <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
//           <h3 className="text-lg font-semibold mb-4">
//             Student Enrollment Trend
//           </h3>
//           <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
//             <div className="text-center text-gray-500">
//               <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
//               <p>Line chart: Enrollment over months</p>
//               <p className="text-sm mt-1">(Integrate Recharts or similar)</p>
//             </div>
//           </div>
//         </div>

//         {/* Course Distribution */}
//         <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
//           <h3 className="text-lg font-semibold mb-4">Course Distribution</h3>
//           <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
//             <div className="text-center text-gray-500">
//               <div className="w-40 h-40 mx-auto rounded-full border-8 border-transparent relative">
//                 <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
//                   100%
//                 </div>
//               </div>
//               <p className="mt-4">
//                 Donut chart: Obedience 35%, Social 28%, etc.
//               </p>
//               <p className="text-sm">
//                 (Use Recharts PieChart or Chart.js doughnut)
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Revenue & Expenses */}
//       <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
//         <h3 className="text-lg font-semibold mb-4">Revenue & Expenses</h3>
//         <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
//           <div className="text-center text-gray-500">
//             <div className="flex gap-6 justify-center items-end h-48">
//               {revenueExpenses.map((item) => (
//                 <div key={item.month} className="flex flex-col items-center">
//                   <div
//                     className="w-8 bg-green-500 rounded-t"
//                     style={{ height: `${item.revenue / 800}px` }}
//                   />
//                   <div
//                     className="w-8 bg-red-500 mt-1 rounded-t"
//                     style={{ height: `${item.expenses / 800}px` }}
//                   />
//                   <span className="text-xs mt-2">{item.month}</span>
//                 </div>
//               ))}
//             </div>
//             <p className="mt-6">Bar chart: Revenue vs Expenses per month</p>
//             <p className="text-sm">(Replace with real chart library)</p>
//           </div>
//         </div>
//       </div>

//       {/* Today's Classes */}
//       <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold">Today&apos;s Classes</h3>
//           <button className="text-sm text-blue-600 hover:underline">
//             View All →
//           </button>
//         </div>

//         <div className="space-y-4">
//           {todaysClasses.map((cls, i) => (
//             <div
//               key={i}
//               className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-4"
//             >
//               <div className="flex items-start gap-4">
//                 <div className="p-3 bg-blue-100 rounded-lg">
//                   <Calendar className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <div>
//                   <h4 className="font-medium">{cls.title}</h4>
//                   <p className="text-sm text-gray-600">
//                     {cls.time} • {cls.instructor} • {cls.students} students
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <span
//                   className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
//                     cls.status === "in-progress"
//                       ? "bg-green-100 text-green-700"
//                       : "bg-yellow-100 text-yellow-700"
//                   }`}
//                 >
//                   {cls.status === "in-progress" ? "In Progress" : "Upcoming"}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import DashboardHeading from "@/components/dashboard/common/DashboardHeading";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useGetSchoolDashboardResponseQuery } from "@/redux/features/api/dashboard/school/dashboard/SchoolDashboardApi";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function PetSchoolDashboard() {
  const { status } = useSession();

  const {
    data: dashboardResponse,
    isLoading,
    isFetching,
    isError,
  } = useGetSchoolDashboardResponseQuery(undefined, {
    skip: status === "loading",
  });

  if (isLoading || isFetching) return <LoadingSpinner />;

  if (isError || !dashboardResponse?.data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <h2 className="text-red-800 font-semibold text-lg">
          Failed to load dashboard
        </h2>
      </div>
    );
  }

  const {
    stats,
  } = dashboardResponse.data;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <DashboardHeading
        title="Dashboard"
        description="Overview of your school's activities and performance"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {/* Total Students */}
        <div className="bg-white rounded-xl border border-[#d0d0d0] p-6 flex items-center justify-between">
          <div className="flex flex-col gap-3">
             <div className="flex bg-[#EBF5FF] p-2 rounded w-max">
               <Image src="/assets/c5ab3523f66c0eabe93bf5591bfe28c7c943fc36.svg" alt="Students icon" width={24} height={24} />
             </div>
             <p className="text-[14px] text-[#4f4f4f] font-['Arial:Regular'] mt-1">Total Students</p>
             <h3 className="text-[28px] font-bold text-[#282828] font-['Montserrat:Bold'] -mt-1.5">{stats?.totalPetsEnrolled || 0}</h3>
          </div>
          <div className="flex items-center gap-1.25 text-[#00b69b] font-['Montserrat:Medium'] text-[14px]">
            <Image src="/assets/e8f7d903f5ad6f4c8430768b72e5a6fc63529342.svg" alt="Up arrow" width={16} height={16} />
            <span>8.5%</span>
          </div>
        </div>

        {/* Active Courses */}
        <div className="bg-white rounded-xl border border-[#d0d0d0] p-6 flex items-center justify-between">
           <div className="flex flex-col gap-3">
             <div className="flex bg-[#fff1d6] p-2 rounded w-max">
               <Image src="/assets/952d79cd17bb58097b69766cd5333f20bd5e8cf7.svg" alt="Courses icon" width={24} height={24} />
             </div>
             <p className="text-[14px] text-[#4f4f4f] font-['Arial:Regular'] mt-1">Active Courses</p>
             <h3 className="text-[28px] font-bold text-[#282828] font-['Montserrat:Bold'] -mt-1.5">{stats?.activeCourses || 0}</h3>
          </div>
          <div className="flex items-center gap-1.25 text-[#00b69b] font-['Montserrat:Medium'] text-[14px]">
            <Image src="/assets/e8f7d903f5ad6f4c8430768b72e5a6fc63529342.svg" alt="Up arrow" width={16} height={16} />
            <span>1.3%</span>
          </div>
        </div>

        {/* Ongoing Enrollments */}
        <div className="bg-white rounded-xl border border-[#d0d0d0] p-6 flex items-center justify-between">
           <div className="flex flex-col gap-3">
             <div className="flex bg-[#e2fbd7] p-2 rounded w-max">
               <Image src="/assets/cfd8f5aa57224213da94a11f20d6abeb8b9c2ca2.svg" alt="Enrollments icon" width={24} height={24} />
             </div>
             <p className="text-[14px] text-[#4f4f4f] font-['Arial:Regular'] mt-1">Ongoing Enrollments</p>
             <h3 className="text-[28px] font-bold text-[#282828] font-['Montserrat:Bold'] -mt-1.5">{stats?.ongoingEnrollments || 0}</h3>
          </div>
          <div className="flex items-center gap-1.25 text-[#f93c65] font-['Montserrat:Medium'] text-[14px]">
            <Image src="/assets/66ec57173e49e083c7499ca092cf4de2fe9d5926.svg" alt="Down arrow" width={16} height={16} />
            <span>4.3%</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl border border-[#d0d0d0] p-6 flex items-center justify-between">
           <div className="flex flex-col gap-3">
             <div className="flex bg-[#ffebee] p-2 rounded w-max">
               <Image src="/assets/2edfcb8935c1ba1619a9eb2bc7cf4ab83c07fcde.svg" alt="Revenue icon" width={24} height={24} />
             </div>
             <p className="text-[14px] text-[#4f4f4f] font-['Arial:Regular'] mt-1">Total Revenue</p>
             <h3 className="text-[28px] font-bold text-[#282828] font-['Montserrat:Bold'] -mt-1.5">$0.00</h3>
          </div>
          <div className="flex items-center gap-1.25 text-[#00b69b] font-['Montserrat:Medium'] text-[14px]">
            <Image src="/assets/e8f7d903f5ad6f4c8430768b72e5a6fc63529342.svg" alt="Up arrow" width={16} height={16} />
            <span>1.8%</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-8 flex flex-col gap-3.75 bg-white border border-[#d0d0d0] rounded-xl p-8 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
           <h2 className="text-[#282828] font-['Montserrat:Bold'] font-bold text-[24px]">Recent Admissions</h2>
        </div>

        {/* Table Header */}
        <div className="flex items-center text-[#4f4f4f] font-['Arial:Regular'] text-[16px] border-b border-[#e5e5e5] pb-4">
          <div className="w-45">Pet Name</div>
          <div className="w-40">Owner</div>
          <div className="w-50">Course</div>
          <div className="w-30">Admitted</div>
          <div className="w-30">Status</div>
          <div className="w-30">Amount</div>
        </div>

        {/* Dummy Admission Let */}
        <div className="flex items-center text-[#4f4f4f] font-['Arial:Regular'] text-[16px] py-4 border-b border-[#e5e5e5] last:border-b-0">
          <div className="w-45 text-[#282828]">Bella</div>
          <div className="w-40">John Doe</div>
          <div className="w-50">Obedience Training</div>
          <div className="w-30">12 Sep, 2024</div>
          <div className="w-30">
            <span className="bg-[#00B69B]/20 text-[#00B69B] px-3 py-1 rounded-full text-xs font-semibold">Accepted</span>
          </div>
          <div className="w-30 font-['Montserrat:Medium']">$200.00</div>
        </div>

        <div className="flex items-center text-[#4f4f4f] font-['Arial:Regular'] text-[16px] py-4 border-b border-[#e5e5e5] last:border-b-0">
          <div className="w-45 text-[#282828]">Max</div>
          <div className="w-40">Jane Smith</div>
          <div className="w-50">Agility Training</div>
          <div className="w-30">10 Sep, 2024</div>
          <div className="w-30">
            <span className="bg-[#FCBE2D]/20 text-[#FCBE2D] px-3 py-1 rounded-full text-xs font-semibold">Pending</span>
          </div>
          <div className="w-30 font-['Montserrat:Medium']">$150.00</div>
        </div>
        
        <div className="flex items-center text-[#4f4f4f] font-['Arial:Regular'] text-[16px] py-4 border-b border-[#e5e5e5] last:border-b-0">
          <div className="w-45 text-[#282828]">Charlie</div>
          <div className="w-40">Alice Johnson</div>
          <div className="w-50">Puppy Basics</div>
          <div className="w-30">08 Sep, 2024</div>
          <div className="w-30">
             <span className="bg-[#00B69B]/20 text-[#00B69B] px-3 py-1 rounded-full text-xs font-semibold">Accepted</span>
          </div>
          <div className="w-30 font-['Montserrat:Medium']">$120.00</div>
        </div>

        {/* Empty State placeholder (hidden when items exist) */}
        {/* <div className="text-center py-12 text-[#4f4f4f] font-['Arial:Regular']">
            No recent admissions found.
        </div> */}
      </div>
    </div>
  );
}
