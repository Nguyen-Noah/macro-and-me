import { motion } from "framer-motion";

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <motion.div
            className="fixed inset-0 px-6 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-scroll rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="px-6 py-6 rounded-lg max-w-lg w-full relative bg-white">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                    onClick={onClose}
                >
                    ✕
                </button>
                {children}
            </div>
        </motion.div>
    );
};

export default Modal;
