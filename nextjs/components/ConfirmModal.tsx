"use client";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  loading?: boolean;
}

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message = "Apakah Anda yakin ingin melanjutkan tindakan ini?",
  confirmText = "Hapus",
  loading = false,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white w-full max-w-sm rounded-xl shadow-lg p-6 text-center"
          >
            <h2 className="text-lg font-semibold mb-2 text-gray-800">{title}</h2>
            <p className="text-gray-600 mb-6 text-sm">{message}</p>

            <div className="flex justify-center gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`px-4 py-2 rounded-md font-medium text-white transition ${
                  loading
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {loading ? "Menghapus..." : confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
