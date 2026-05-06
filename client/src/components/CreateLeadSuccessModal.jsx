import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCheck, Sparkles } from 'lucide-react';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, y: 8 },
};

const CreateLeadSuccessModal = ({
  isOpen,
  onClose,
  onViewLeads,
  onContinue,
  autoCloseMs = 2600,
  title = 'Lead Created Successfully',
  message = 'The new lead has been successfully added to the CRM system and is now available in the pipeline.',
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const timer = setTimeout(() => {
      onViewLeads();
    }, autoCloseMs);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose, onViewLeads, autoCloseMs]);

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
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white/90 p-6 shadow-2xl"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-100/40 via-transparent to-blue-100/30" />

              <div className="relative">
                <div className="mb-4 flex justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg"
                  >
                    <CheckCheck className="h-8 w-8 text-white" />
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4], y: [-2, -6, -2] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute -right-2 -top-2"
                    >
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                    </motion.div>
                  </motion.div>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-bold tracking-tight text-slate-900">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{message}</p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onViewLeads}
                    className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-emerald-600 hover:to-green-700"
                  >
                    View Leads
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onContinue}
                    className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    Continue
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateLeadSuccessModal;
