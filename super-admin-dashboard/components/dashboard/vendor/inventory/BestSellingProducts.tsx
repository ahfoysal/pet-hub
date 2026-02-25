import { TrendingUp } from "lucide-react";

interface Product {
  rank: number;
  productId: string;
  productName: string;
  unitsSold: number;
  revenue: number;
}

interface Props {
  products: Product[];
}

export default function BestSellingProducts({ products }: Props) {
  return (
    <div className="bg-[#FF7176] rounded-xl p-5 sm:p-6 text-white shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Best Selling Products</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {products.length > 0 ? (
          products.map((p) => (
            <div
              key={p.productId}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
            >
              <div className="text-2xl font-bold mb-1">#{p.rank}</div>
              <div className="text-sm opacity-90 mb-2 line-clamp-2 min-h-10">
                {p.productName}
              </div>
              <div className="text-xs opacity-75 space-y-1">
                <div>{p.unitsSold} units</div>
                <div className="font-semibold">${p.revenue}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-white/80">
            No best selling products yet
          </div>
        )}
      </div>
    </div>
  );
}
