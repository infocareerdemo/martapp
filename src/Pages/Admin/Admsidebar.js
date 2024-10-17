import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useSidebar } from './SidebarContext';
import { AiOutlineProduct } from "react-icons/ai";
import { MdRoundaboutRight, MdMessage } from "react-icons/md";
import { TbReport, TbLayoutBoardSplit, TbUsersPlus } from "react-icons/tb";
import { TbMessageCircleShare } from "react-icons/tb";
import { IoFastFoodOutline } from "react-icons/io5";
import { IoDownloadOutline } from "react-icons/io5";
import { BiSolidDashboard } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";

const Admsidebar = () => {
    var { sideBarCollapse, sideBarToggle, handleSidebarToggle, handleBackdropClick } = useSidebar();
    const navigate = useNavigate();
    const location = useLocation();
    const storedItem = localStorage.getItem('Role_id');

    var role = []
    if (storedItem !== null && storedItem !== undefined) {
        role = JSON.parse(storedItem);
    }
    else {
        role = []
    }

    return (
        <Sidebar
            collapsed={sideBarCollapse}
            toggled={sideBarToggle}
            onToggle={handleSidebarToggle}
            onBackdropClick={handleBackdropClick}
            breakPoint="md"
            className='sidebar_container'
        >
            <Menu iconShape="square" className="ClsMenu">
                <MenuItem
                    onClick={() => navigate('/AdminDashboard')}
                    icon={<BiSolidDashboard id="sidebaruser" />}
                    className={['/AdminDashboard'].includes(location.pathname) ? 'active' : ''}
                >
                    Dashboard
                </MenuItem>

            </Menu>
            <Menu iconShape="square" className="ClsMenu">
                <MenuItem
                    onClick={() => navigate('/AdmMenu')}
                    icon={<AiOutlineProduct id="sidebaruser" color="green"/>}
                    className={['/AdmMenu', '/AdmupdateMenu', '/AdmaddMenu'].includes(location.pathname) ? 'active' : ''}
                >
                    Menu
                </MenuItem>

            </Menu>
            <Menu iconShape="square" className="ClsMenu">
                <MenuItem
                    onClick={() => navigate('/TodayOrder')}
                    icon={<IoFastFoodOutline id="sidebaruser"  color="red"/>}
                    className={['/TodayOrder', '/OrderBasedOnUser'].includes(location.pathname) ? 'active' : ''}
                >
                    Order List
                </MenuItem>

            </Menu>
            {/* <Menu iconShape="square" className="ClsMenu">
                <MenuItem
                    onClick={() => navigate('/AdminLocation')}
                    icon={<FaLocationDot id="sidebaruser" color="red"/>}
                    className={['/AdminLocation'].includes(location.pathname) ? 'active' : ''}
                >
                   Location
                </MenuItem>

            </Menu> */}
            <Menu iconShape="square" className="ClsMenu">
                <MenuItem
                    onClick={() => navigate('/Report')}
                    icon={<IoDownloadOutline id="sidebaruser" color="blue"/>}
                    className={['/Report'].includes(location.pathname) ? 'active' : ''}
                >
                    Report
                </MenuItem>

            </Menu>
            {/* <Menu iconShape="square" className="ClsMenu">
                <MenuItem
                    onClick={() => navigate('/AdmMessage')}
                    icon={<TbMessageCircleShare id="sidebaruser" color="brown"/>}
                    className={['/AdmMessage'].includes(location.pathname) ? 'active' : ''}
                >
                    Message User
                </MenuItem>

            </Menu> */}
        </Sidebar>
    );
}

export default Admsidebar;