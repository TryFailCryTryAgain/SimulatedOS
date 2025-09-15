import { useState, useRef, useEffect } from "react";
import DragDropGrid from "../components/DragAndDrop";

export const Screen = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const menuRef = useRef(null);
    const screenRef = useRef(null);

    // Types

    type Icon = {
        id: number;
        url: string;
        title: string;
    }

    function createNewFile() {
        
        console.log("New File is being created!")
        const obj1: Icon = { id: 1, title: "New", url: "N/A"}

        console.log(obj1);

    }

    const handleRightClick = (event) => {
        event.preventDefault();
        
        const x = event.clientX;
        const y = event.clientY;
        
        setMenuPosition({ x, y });
        setMenuVisible(true);
        
        console.log(`Right-click at: ${x}, ${y}`);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuVisible(false);
        }
    };

    const handleMenuItemClick = (action) => {
        console.log(`Selected: ${action}`);
        setMenuVisible(false);
        
        // Add your menu item logic here
        switch(action) {
            case 'createFolder':
                console.log("Creating folder...");
                break;
            case 'createTextFile':
                console.log("Creating text file...");
                createNewFile();
                break;
            default:
                break;
        }
    };

    // Close menu when clicking outside
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Prevent scrolling when menu is open (optional)
    useEffect(() => {
        if (menuVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [menuVisible]);

    return (
        <>
            {menuVisible && (
                <div 
                    ref={menuRef}
                    className="menu"
                    style={{
                        position: 'fixed',
                        left: menuPosition.x,
                        top: menuPosition.y,
                        zIndex: 1000
                    }}
                >
                    <ul>
                        <li onClick={() => handleMenuItemClick('createFolder')}>
                            Create Folder
                        </li>
                        <li onClick={() => handleMenuItemClick('createTextFile')}>
                            Create Text File
                        </li>
                    </ul>
                </div>
            )}

            <div className="screen-header">
                <p>Right-click anywhere in this area to open the context menu</p>
                <p>Left-click to close the menu</p>
            </div>
            <div 
                ref={screenRef}
                className="screen_container"
                onContextMenu={handleRightClick}
                onClick={() => setMenuVisible(false)} // Close menu on left click
            >
                <DragDropGrid />
            </div>
        </>
    );
};