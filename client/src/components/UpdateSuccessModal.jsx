import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCheck } from 'lucide-react';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, y: 8 },
};

const UpdateSuccessModal = ({
  isOpen,
  onClose,
  title = 'Lead Updated Successfully',
  message = 'The lead information has been updated successfully in the CRM system.',
  actionLabel = 'Back to Leads',
  autoCloseMs = 2800,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const timer = setTimeout(() => onClose(), autoCloseMs);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose, autoCloseMs]);

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
              className="w-full max-w-md rounded-2xl border border-white/20 bg-white/90 p-6 shadow-2xl"
            >
              <div className="mb-4 flex justify-center">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg"
                >
                  <CheckCheck className="h-8 w-8 text-white" />
                </motion.div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{message}</p>
              </div>

              <div className="mt-6 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-emerald-600 hover:to-green-700"
                >
                  {actionLabel}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateSuccessModal;
