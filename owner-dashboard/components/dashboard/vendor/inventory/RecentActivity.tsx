// components/RecentActivity.tsx
import { Package, ShoppingCart, Pencil, AlertTriangle } from "lucide-react";

interface Activity {
  type: string;
  title: string;
  description: string;
  status?: string;
  time: string;
}

interface Props {
  activities: Activity[];
}

export default function RecentActivity({ activities }: Props) {
  const getActivityIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case "RESTOCK":
      case "PRODUCT":
        return <Package className="h-4 w-4 text-green-600" />;
      case "SALE":
      case "ORDER":
        return <ShoppingCart className="h-4 w-4 text-blue-600" />;
      case "ADJUSTMENT":
        return <Pencil className="h-4 w-4 text-purple-600" />;
      case "ALERT":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return "text-gray-600";
    switch (status.toUpperCase()) {
      case "COMPLETED":
      case "DELIVERED":
        return "text-green-600";
      case "PROCESSING":
      case "PENDING":
        return "text-blue-600";
      case "CANCELLED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden sticky top-6" style={{ borderColor: '#e5e7eb' }}>
      <div className="px-5 py-4 border-b" style={{ borderBottomColor: '#e5e7eb' }}>
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
      </div>

      <div className="max-h-150 overflow-y-auto">
        {activities.length > 0 ? (
          activities.map((activity, i) => (
            <div key={i} className="p-4 hover:bg-gray-50/50 transition-colors" style={{ borderTop: i !== 0 ? '1px solid #f3f4f6' : 'none' }}>
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </div>
                  <div className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                    {activity.description}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {new Date(activity.time).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>

                    {activity.status && (
                      <span
                        className={`text-xs font-medium ${getStatusColor(
                          activity.status,
                        )}`}
                      >
                        {activity.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p>No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
}
