"use client";

import { Construction, Rocket } from "lucide-react";

interface ComingSoonProps {
  title?: string;
  description?: string;
}

export function ComingSoon({ 
  title = "Coming Soon",
  description = "This feature is currently under development and will be available soon."
}: ComingSoonProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        {/* Icon */}
        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Construction className="w-10 h-10 text-primary" />
        </div>
        
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          {title}
        </h1>
        
        {/* Description */}
        <p className="text-gray-500 mb-6">
          {description}
        </p>
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full">
          <Rocket className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-amber-700">In Development</span>
        </div>
      </div>
    </div>
  );
}

export default ComingSoon;
