import { Link } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import { motion } from 'framer-motion'
import { ICON_GRAPH, ICON_HOME, ICON_PLUS, ICON_BOOK, ICON_USER } from "../../../utils/svg"

const NavBar = () => {

    const [showAdditionalButtons, setShowAdditionalButtons] = useState(false)
    const addButtonRef = useRef(null)
    const toggleAdditionalButtons = () => {
        setShowAdditionalButtons((prev) => !prev)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (addButtonRef.current && !addButtonRef.current.contains(event.target)) {
                setShowAdditionalButtons(false)
            }
        }

        if (showAdditionalButtons) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        else {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }

    }, [showAdditionalButtons])



    return (
        <motion.nav 
            className="fixed bottom-0 left-0 w-full z-40"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}>

            <div className="flex justify-between items-center max-w-6xl mx-auto md:my-2
            bg-stone-950/30 p-4 md:rounded-xl backdrop-blur-lg">

                {/* Home Button */}
                <button className="p-2 home">
                    {ICON_HOME}
                </button>

                {/* Stats Button */}
                <button className="p-2 stats">
                    {ICON_GRAPH}
                </button>


                {/* Add Button with additional buttons above */}
                <div className="relative flex flex-col items-center" ref={addButtonRef}>
                    {/* Additional Buttons */}
                    {showAdditionalButtons && (
                        <div className="absolute -top-28 left-8 transform -translate-x-1/2 flex flex-row gap-6">
                            <button className="p-2 bg-gray-200 rounded-full">Log Meal</button>
                            <button className="p-2 bg-gray-200 rounded-full">Food Search</button>
                            <button className="p-2 bg-gray-200 rounded-full">Image Upload</button>
                        </div>
                    )}
                    <button onClick={toggleAdditionalButtons} className="bg-black p-2 rounded-full text-white add">
                        {ICON_PLUS}
                    </button>
                </div>


                {/* Recipies Button */}
                <button className="p-2 recipes">
                    {ICON_BOOK}
                </button>

                {/* Profile Button */}
                <button className="p-2 profile">
                    {ICON_USER}
                </button>


            </div>
        </motion.nav>
    )
}
export default NavBar