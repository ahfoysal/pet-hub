/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { FileText, Loader2, Eye, X, Upload } from "lucide-react";

interface DocumentItemProps {
  title: string;
  status: "Verified" | "Pending" | "Missing";
  date: string;
  onView?: () => void;
  onUpload?: () => void;
  isUploading?: boolean;
}

const DocumentItem = ({ title, status, date, onView, onUpload, isUploading }: DocumentItemProps) => {
  const statusColors = {
    Verified: "bg-[#dcfce7] text-[#008236]",
    Pending: "bg-[#fefce8] text-[#894b00]",
    Missing: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="flex items-center justify-between p-5 border border-[#e5e7eb] rounded-[10px] bg-white group hover:border-[#ff7176]/20 transition-all font-arimo">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-[10px] bg-[#f8f9fa] flex items-center justify-center text-[#94a3b8]">
          <FileText size={24} />
        </div>
        <div className="space-y-1">
          <h4 className="text-[16px] font-normal text-[#0a0a0a]">{title}</h4>
          <p className="text-[14px] text-[#667085]">
            {status === "Missing" ? "No document uploaded" : `Uploaded: ${date}`}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <span className={`px-3 py-1 rounded-full text-[12px] font-medium ${statusColors[status]}`}>
          {status}
        </span>
        
        <div className="flex items-center gap-2">
          {status !== "Missing" && onView && (
            <button 
              onClick={onView}
              className="p-2 text-[#667085] hover:text-[#ff7176] hover:bg-[#fff1f1] rounded-lg transition-all"
              title="View Document"
            >
              <Eye size={18} />
            </button>
          )}
          
          <button 
            onClick={onUpload}
            disabled={isUploading}
            className="h-[36px] px-4 border border-[#e5e7eb] rounded-[8px] text-[14px] font-normal text-[#0a0a0a] hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : (status === "Missing" ? "Upload" : "Replace")}
          </button>
        </div>
      </div>
    </div>
  );
};

interface DocumentsTabProps {
  docsData: any;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

export default function DocumentsTab({ docsData, onFileUpload, isUploading }: DocumentsTabProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const docItems = [
    { id: "ownerId", title: "Owner National ID / Passport", status: "Verified", date: "2024-01-15", url: docsData?.data?.ownerId },
    { id: "businessLicense", title: "School Business License", status: "Verified", date: "2024-01-15", url: docsData?.data?.businessLicense },
    { id: "schoolPhotos", title: "School Photos", status: "Verified", date: "2024-01-15", url: docsData?.data?.schoolPhotos },
    { id: "insuranceCertificate", title: "Insurance Certificate", status: "Pending", date: "-", url: docsData?.data?.insuranceCertificate },
  ];

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[14px] p-[25px] shadow-sm animate-in fade-in duration-300 font-arimo relative">
      <h2 className="text-[20px] font-normal text-[#0a0a0a] mb-8">KYC Documents</h2>
      
      <div className="space-y-4">
        {docItems.map((doc) => (
          <DocumentItem 
            key={doc.id}
            title={doc.title}
            status={doc.url ? (doc.status as any) : "Missing"}
            date={doc.date}
            onView={doc.url ? () => setPreviewUrl(doc.url) : undefined}
            onUpload={() => {
              const input = document.getElementById(`upload-${doc.id}`) as HTMLInputElement;
              input?.click();
            }}
            isUploading={isUploading}
          />
        ))}
      </div>

      {docItems.map(doc => (
        <input 
          key={`input-${doc.id}`}
          id={`upload-${doc.id}`}
          type="file"
          className="hidden"
          onChange={onFileUpload}
        />
      ))}

      {previewUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-[20px] overflow-hidden max-w-4xl w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Document Preview</h3>
              <button 
                onClick={() => setPreviewUrl(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 flex items-center justify-center bg-gray-50 min-h-[300px] max-h-[70vh] overflow-auto">
              <img 
                src={previewUrl} 
                alt="Document Preview" 
                className="max-w-full h-auto rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
