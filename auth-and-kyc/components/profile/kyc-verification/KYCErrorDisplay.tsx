"use client";

import { X } from "lucide-react";

interface KYCErrorDisplayProps {
  error: string;
  errors: string[];
}

export default function KYCErrorDisplay({ error, errors }: KYCErrorDisplayProps) {
  if (!error && errors.length === 0) return null;
  
  return (
    <div className="bg-red-50 p-6 rounded-xl border border-red-100 animate-in zoom-in-95 duration-200">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
          <X className="h-5 w-5 text-red-500" />
        </div>
        <h3 className="text-red-900 font-bold">Please correct the following:</h3>
      </div>
      <ul className="text-red-700 text-sm space-y-1.5 ml-11">
        {error && <li>{error}</li>}
        {errors.map((err, idx) => <li key={idx} className="list-disc">{err}</li>)}
      </ul>
    </div>
  );
}
