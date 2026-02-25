"use client";

import {
  useGetSitterTopPackagesQuery,
  useGetSitterTopServicesQuery,
  useGetSitterLowPackagesQuery,
  useGetSitterLowServicesQuery,
} from "@/redux/features/api/dashboard/sitter/dashboard/sitterDashboardApi";
import {
  Card,
  CardBody,
  CardHeader,
  Tab,
  Tabs,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Skeleton,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";

export default function SitterPerformanceTables() {
  const { status } = useSession();
  const skipLoad = status === "loading";
  
  const { data: topPackages, isLoading: isTopPkgLoad } = useGetSitterTopPackagesQuery(undefined, { skip: skipLoad });
  const { data: topServices, isLoading: isTopSvcLoad } = useGetSitterTopServicesQuery(undefined, { skip: skipLoad });
  const { data: lowPackages, isLoading: isLowPkgLoad } = useGetSitterLowPackagesQuery(undefined, { skip: skipLoad });
  const { data: lowServices, isLoading: isLowSvcLoad } = useGetSitterLowServicesQuery(undefined, { skip: skipLoad });

  const renderTable = (data: any[], type: "top" | "low", isService: boolean, isLoading: boolean) => {
    if (isLoading) return <Skeleton className="w-full h-[200px] rounded-lg mt-4" />;
    
    return (
      <Table aria-label="Performance table" removeWrapper className="mt-4">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>BOOKINGS</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        <TableBody emptyContent={`No ${isService ? 'services' : 'packages'} to display.`}>
          {data?.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-default-900">{item.name}</TableCell>
              <TableCell>{item.bookingsCount || item.bookingCount || 0}</TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  color={type === "top" ? "success" : "danger"}
                  variant="flat"
                >
                  {type === "top" ? "High Demand" : "Low Demand"}
                </Chip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card shadow="sm" className="w-full h-full bg-white dark:bg-default-50 border-none">
      <CardHeader className="flex flex-col items-start px-6 pt-6">
        <h2 className="text-xl font-bold text-default-900">Performance Metrics</h2>
        <p className="text-sm text-default-500">Analyze your best and worst performing offerings</p>
      </CardHeader>
      <CardBody className="px-6 pb-6 pt-0">
        <Tabs aria-label="Performance Options" color="primary" variant="underlined" className="mt-4">
          <Tab key="top-packages" title="Top Packages">
            {renderTable(topPackages?.data || [], "top", false, isTopPkgLoad)}
          </Tab>
          <Tab key="top-services" title="Top Services">
             {renderTable(topServices?.data || [], "top", true, isTopSvcLoad)}
          </Tab>
          <Tab key="low-packages" title="Low Packages">
             {renderTable(lowPackages?.data || [], "low", false, isLowPkgLoad)}
          </Tab>
          <Tab key="low-services" title="Low Services">
             {renderTable(lowServices?.data || [], "low", true, isLowSvcLoad)}
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
