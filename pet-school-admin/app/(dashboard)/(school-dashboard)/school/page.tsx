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
import CourseWiseEnrollmentChart from "@/components/dashboard/school/dashboard/CourseWiseEnrollmentChart";
import { useGetSchoolDashboardResponseQuery } from "@/redux/features/api/dashboard/school/dashboard/SchoolDashboardApi";
import { Users, BookOpen, Calendar } from "lucide-react";
import { useSession } from "next-auth/react";

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
    enrollmentTrend,
    courseWiseEnrollments,
    trainerPerformance,
    enrollmentStatusDistribution,
  } = dashboardResponse.data;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <DashboardHeading
        title="Pet School Dashboard"
        description="Overview of enrollments and courses"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-pink-100 rounded-lg">
              <Users className="h-6 w-6 text-pink-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold">{stats.totalPetsEnrolled}</h3>
          <p className="text-sm text-gray-500">Total Enrolled Pets</p>
        </div>

        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold">{stats.activeCourses}</h3>
          <p className="text-sm text-gray-500">Active Courses</p>
        </div>

        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold">{stats.ongoingEnrollments}</h3>
          <p className="text-sm text-gray-500">Ongoing Enrollments</p>
        </div>

        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold">{stats.availableSeatsToday}</h3>
          <p className="text-sm text-gray-500">Available Seats Today</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Enrollment Trend */}
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Enrollment Trend</h3>

          <div className="h-64 flex items-center justify-center text-gray-500">
            {enrollmentTrend.length === 0
              ? "No trend data"
              : `${enrollmentTrend[0].date} : ${enrollmentTrend[0].count} enrollment`}
          </div>
        </div>

        {/* Course-wise Distribution */}
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Course-wise Enrollments
          </h3>

          <CourseWiseEnrollmentChart data={courseWiseEnrollments} />
        </div>
      </div>

      {/* Trainer Performance */}
      <div className="bg-white rounded-xl border p-5 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Trainer Performance</h3>

        <div className="space-y-3">
          {trainerPerformance.map((trainer) => (
            <div
              key={trainer.trainerName}
              className="flex justify-between items-center border rounded-lg p-3"
            >
              <span className="font-medium">{trainer.trainerName}</span>
              <span className="text-sm text-gray-600">
                {trainer.students} students
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Enrollment Status */}
      <div className="bg-white rounded-xl border p-5 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">
          Enrollment Status Distribution
        </h3>

        <div className="space-y-3">
          {enrollmentStatusDistribution.map((item) => (
            <div
              key={item.status}
              className="flex justify-between items-center border rounded-lg p-3"
            >
              <span className="font-medium">{item.status}</span>
              <span className="text-sm text-gray-600">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
