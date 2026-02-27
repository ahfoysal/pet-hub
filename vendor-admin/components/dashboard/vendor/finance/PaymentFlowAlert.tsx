import React from "react";

export default function PaymentFlowAlert() {
  return (
    <div className="bg-[#fff9f9] border border-[#ff7176]/30 p-4 rounded-xl flex items-start gap-3 shadow-sm">
      <span className="text-xl" role="img" aria-label="light bulb">💡</span>
      <div className="text-sm leading-relaxed">
        <span className="font-bold text-[#ff7176]">Payment Flow:</span>
        <span className="text-gray-600 ml-1">
          All payments go to Super Admin first. After order delivery is confirmed and the review period ends, 
          payments are released to your vendor account automatically. This process typically takes 3-7 business days 
          depending on the order status.
        </span>
      </div>
    </div>
  );
}
