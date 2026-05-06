import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({ isOpen, title, description, onClose, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel', isDanger = false }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <button onClick={onClose} className="rounded-lg hover:bg-gray-100 p-1">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {description && <p className="mb-6 text-gray-600">{description}</p>}

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={onClose}>
                {cancelText}
              </Button>
              <Button variant={isDanger ? 'danger' : 'primary'} className="flex-1" onClick={onConfirm}>
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
