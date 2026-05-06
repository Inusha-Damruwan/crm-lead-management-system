import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 8 },
};

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title = 'Delete Lead',
  message = 'Are you sure you want to delete this lead?',
  warning = 'This action cannot be undone.',
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            variants={backdropVariants}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
          />

          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/20 bg-white/95 p-6 shadow-2xl"
            >
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg">
                  <Trash2 className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{message}</p>
                <p className="mt-1 text-sm font-medium text-rose-600">{warning}</p>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  disabled={loading}
                  className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  disabled={loading}
                  className="rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-red-600 hover:to-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
