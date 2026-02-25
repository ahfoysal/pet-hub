"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Use a microtask to defer the state update
      Promise.resolve().then(() => {
        setShow(true);
      });

      const timer = setTimeout(() => {
        setShow(false);
        // Close the toast after animation completes (300ms)
        setTimeout(onClose, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getTypeStyle = () => {
    switch (type) {
      case "success":
        return "bg-green-500 border-green-600";
      case "error":
        return "bg-red-500 border-red-600";
      case "warning":
        return "bg-yellow-500 border-yellow-600";
      case "info":
        return "bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] border-[#FF6B6B]";
      default:
        return "bg-gray-800 border-gray-700";
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.5 }}
          className={`fixed top-20 right-4 z-[9999] px-4 py-3 rounded-lg border text-white shadow-lg ${getTypeStyle()}`}
        >
          <div className="flex items-center">
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
