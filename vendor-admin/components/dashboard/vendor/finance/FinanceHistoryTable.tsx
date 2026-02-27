import React from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import DropdownButton from "@/components/ui/DropdownButton";
import { Button } from "@/components/ui/Button";

interface FinanceHistoryItem {
  id: string;
  orderId: string;
  customerName: string;
  customerImage: string | null;
  productName: string;
  amount: number;
  date: string;
  status: string;
  releaseDate: string | null;
}

interface FinanceHistoryTableProps {
  data?: {
    data: FinanceHistoryItem[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onStatusChange: (status: string) => void;
  currentStatus: string;
}

export default function FinanceHistoryTable({
  data,
  isLoading,
  onPageChange,
  onStatusChange,
  currentStatus,
}: FinanceHistoryTableProps) {
  const statuses = [
    { label: "All Status", value: "" },
    { label: "Released", value: "RELEASED" },
    { label: "Pending", value: "PENDING" },
    { label: "Hold", value: "HOLD" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "RELEASED":
        return "bg-green-100 text-green-700 border-green-200";
      case "PENDING":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "HOLD":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[14px] overflow-hidden shadow-sm">
      <div className="p-6 border-b border-[#e5e7eb] flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#0a0a0a]">Payment History</h2>
        
        <DropdownButton
          options={statuses}
          value={currentStatus}
          onChange={onStatusChange}
          placeholder="All Status"
          className="w-45"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#e5e7eb]">
              <th className="px-6 py-3 text-sm font-bold text-gray-500">Order ID</th>
              <th className="px-6 py-3 text-sm font-bold text-gray-500">Customer</th>
              <th className="px-6 py-3 text-sm font-bold text-gray-500">Amount</th>
              <th className="px-6 py-3 text-sm font-bold text-gray-500">Date</th>
              <th className="px-6 py-3 text-sm font-bold text-gray-500">Release Date</th>
              <th className="px-6 py-3 text-sm font-bold text-gray-500 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb]">
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-4 h-16 bg-gray-50/50"></td>
                </tr>
              ))
            ) : data?.data?.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No payout history found
                </td>
              </tr>
            ) : (
              data?.data.map((item: FinanceHistoryItem) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#0a0a0a]">{item.orderId}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
                        {item.customerImage ? (
                          <Image src={item.customerImage} alt={item.customerName} fill className="object-cover" />
                        ) : (
                          <span className="text-xs text-gray-400 capitalize">{item.customerName.charAt(0)}</span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{item.customerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-[#0a0a0a]">${item.amount}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(item.date), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.releaseDate ? format(new Date(item.releaseDate), "MMM dd, yyyy") : "TBD"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.meta.totalPages > 1 && (
        <div className="p-6 border-t border-[#e5e7eb] flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold">{((data.meta.page - 1) * data.meta.limit) + 1}</span> to <span className="font-semibold">{Math.min(data.meta.page * data.meta.limit, data.meta.total)}</span> of <span className="font-semibold">{data.meta.total}</span> entries
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(data.meta.page - 1)}
              disabled={data.meta.page === 1}
              className="px-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: data.meta.totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={data.meta.page === p ? "primary" : "outline"}
                size="sm"
                onClick={() => onPageChange(p)}
                className="w-10"
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(data.meta.page + 1)}
              disabled={data.meta.page === data.meta.totalPages}
              className="px-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
