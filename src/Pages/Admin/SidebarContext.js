// SidebarContext.js
import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }) => {
    const [sideBarCollapse, setSideBarCollapse] = useState(false);
    const [sideBarToggle, setSideBarToggle] = useState(false);

    const handleSidebarToggle = () => {
        setSideBarToggle(prevToggle => !prevToggle);
    };

    const handleCollapsesidebar = () => {
        setSideBarCollapse(prevCollapse => !prevCollapse);
        document.body.classList.toggle('mini-sidebar');
    };

    const handleBackdropClick = () => {
        setSideBarToggle(false);
    };

    return (
        <SidebarContext.Provider value={{ sideBarCollapse,sideBarToggle, handleSidebarToggle, handleCollapsesidebar, handleBackdropClick }}>
            {children}
        </SidebarContext.Provider>
    );
};