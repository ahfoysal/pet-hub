"use client";

import { useGetSitterTopCustomersQuery } from "@/redux/features/api/dashboard/sitter/dashboard/sitterDashboardApi";
import { Card, CardBody, CardHeader, Skeleton, Avatar } from "@nextui-org/react";
import { Crown } from "lucide-react";
import { useSession } from "next-auth/react";

export default function SitterTopCustomers() {
  const { status } = useSession();
  const { data, isLoading } = useGetSitterTopCustomersQuery(undefined, {
    skip: status === "loading"
  });
  const customers = data?.data || [];

  return (
    <Card shadow="sm" className="w-full h-full bg-white dark:bg-default-50 border-none">
      <CardHeader className="flex justify-between items-center px-6 pt-6">
        <div>
          <h2 className="text-xl font-bold text-default-900">Top Customers</h2>
          <p className="text-sm text-default-500">Your most frequent clients</p>
        </div>
        <div className="bg-warning-100 text-warning-600 p-2 rounded-lg">
           <Crown className="w-5 h-5" />
        </div>
      </CardHeader>
      <CardBody className="px-6 pb-6 pt-2">
        {isLoading ? (
          <div className="flex flex-col gap-4 mt-4">
             {[1,2,3].map(i => <Skeleton key={i} className="w-full h-16 rounded-xl" />)}
          </div>
        ) : customers.length === 0 ? (
           <div className="text-center text-default-500 py-8">No customers found.</div>
        ) : (
          <div className="flex flex-col gap-4 mt-4">
            {customers.map((customer: any, index: number) => (
              <div 
                key={customer.clientId}
                className="flex items-center justify-between p-4 rounded-xl border border-default-100 hover:bg-default-50 transition-colors"
                style={{
                  background: index === 0 ? "linear-gradient(to right, #fef3c7, #ffffff)" : "",
                  borderColor: index === 0 ? "#fde68a" : "var(--nextui-colors-default-100)",
                }}
              >
                <div className="flex items-center gap-4">
                   <div className="font-bold text-default-400 w-4 text-center">
                     {index + 1}
                   </div>
                   <Avatar 
                     src={customer.client?.image || ""} 
                     name={customer.client?.fullName || "User"}
                     showFallback
                     className="w-10 h-10 border-2 border-white"
                   />
                   <div>
                     <p className="font-semibold text-default-900 line-clamp-1">
                        {customer.client?.fullName || "Unknown Customer"}
                     </p>
                     <p className="text-xs text-default-500 line-clamp-1">
                        {customer.client?.email || "No email provided"}
                     </p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full text-sm">
                     {customer.totalBookings} times
                   </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
