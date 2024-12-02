import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Modal from "./Modal";
import FoodSearch from "../../FoodSearch";
import ImageUpload from "../../ImageUpload";
import { ICON_GRAPH, ICON_HOME, ICON_PLUS, ICON_BOOK, ICON_USER, ICON_SEARCH, ICON_CAMERA } from "../../../utils/svg";

const NavBar = () => {
    const [showAdditionalButtons, setShowAdditionalButtons] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const addButtonRef = useRef(null);

    const toggleAdditionalButtons = () => {
        setShowAdditionalButtons((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (addButtonRef.current && !addButtonRef.current.contains(event.target)) {
                setShowAdditionalButtons(false);
            }
        };

        if (showAdditionalButtons) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showAdditionalButtons]);

    const openModal = (content) => {
        setModalContent(content);
        setModalOpen(true);
        setShowAdditionalButtons(false); 
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalContent(null);
    };

    const handleClick = (button) => {
        switch (button) {
            case "Food Search":
                openModal(<FoodSearch />);
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
                <div className="flex justify-between items-center max-w-6xl mx-auto md:my-2 bg-stone-950/30 p-4 md:rounded-xl backdrop-blur-lg">
                    <button className="p-2 home">{ICON_HOME}</button>
                    <button className="p-2 stats">{ICON_GRAPH}</button>

                    <div className="relative flex flex-col items-center" ref={addButtonRef}>
                        {showAdditionalButtons && (
                            <div className="absolute -top-16 left-7 transform -translate-x-1/2 flex flex-row gap-4">
                                {[
                                    {
                                        label: "Food Search",
                                        icon: ICON_SEARCH,
                                    },
                                    {
                                        label: "Image Search",
                                        icon: ICON_CAMERA,
                                    },
                                ].map((button, index) => (
                                    <button
                                        key={index}
                                        className="p-2 bg-gray-200 text-black rounded-full"
                                        onClick={() => handleClick(button.label)}
                                    >
                                        {button.icon}
                                    </button>
                                ))}
                            </div>
                        )}
                        <button onClick={toggleAdditionalButtons} className="bg-black p-2 rounded-full text-white add">
                            {ICON_PLUS}
                        </button>
                    </div>


                    <button className="p-2 recipes">{ICON_BOOK}</button>
                    <button className="p-2 profile">{ICON_USER}</button>
                </div>
            </motion.nav>
        </>
    );
};

export default NavBar;
