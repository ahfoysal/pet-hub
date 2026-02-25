interface Summary {
  inStock: number;
  outOfStock: number;
  published: number;
  unpublished: number;
  lowStockItems: number;
  averageRating: number;
}

interface Props {
  summary: Summary;
}

export default function InventoryOverview({ summary }: Props) {
  const total = summary.inStock + summary.outOfStock + summary.lowStockItems;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 h-full">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Inventory Summary
      </h3>
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">In Stock</span>
            <span className="font-medium text-gray-900">{summary.inStock}</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${(summary.inStock / total) * 100 || 0}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Out of Stock</span>
            <span className="font-medium text-red-600">
              {summary.outOfStock}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-full"
              style={{ width: `${(summary.outOfStock / total) * 100 || 0}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Low Stock</span>
            <span className="font-medium text-amber-600">
              {summary.lowStockItems}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{
                width: `${(summary.lowStockItems / total) * 100 || 0}%`,
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Published</span>
            <span className="font-medium text-green-600">
              {summary.published}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{
                width: `${(summary.published / (summary.published + summary.unpublished)) * 100 || 0}%`,
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Unpublished</span>
            <span className="font-medium text-gray-500">
              {summary.unpublished}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-400 rounded-full"
              style={{
                width: `${(summary.unpublished / (summary.published + summary.unpublished)) * 100 || 0}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
