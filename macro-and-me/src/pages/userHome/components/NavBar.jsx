import { useState } from "react";
import { motion } from "framer-motion";
import Modal from "./Modal";
import FoodSearch from "./foodSearch/FoodSearch";
import ImageUpload from "../components/ImageUpload"
import { ICON_USER, ICON_SEARCH, ICON_CAMERA } from "../../../utils/svg";

const NavBar = ( {selectedDate} ) => {
    const [modalContent, setModalContent] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = (content) => {
        setModalContent(content);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalContent(null);
    };

    const handleClick = (button) => {
        switch (button) {
            case "Food Search":
                openModal(<FoodSearch  closePopup={closeModal} selectedDate={selectedDate}/>);
                break;
            case "Image Search":
                openModal(<ImageUpload />);
                break;
            default:
                break;
        }
    };

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {modalContent}
            </Modal>


            <motion.nav
                className="fixed bottom-0 left-0 w-full z-40"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="flex justify-between items-center max-w-6xl mx-auto px-12 md:my-2 bg-stone-950/30 p-4 md:rounded-xl backdrop-blur-lg">
                <button onClick={() => handleClick("Image Search")}>{ICON_CAMERA}</button>
                    <button onClick={() => handleClick("Food Search")}>{ICON_SEARCH}</button>
                    <button className="p-2 profile">{ICON_USER}</button>
                </div>
            </motion.nav>
        </>
    );
};

export default NavBar;
