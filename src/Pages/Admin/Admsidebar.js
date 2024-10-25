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
import { HiOutlineUsers } from "react-icons/hi2";
import { AiOutlineImport } from "react-icons/ai";
import { CiGrid42 } from "react-icons/ci";

const Admsidebar = () => {
    var { sideBarCollapse, sideBarToggle, handleSidebarToggle, handleBackdropClick } = useSidebar();
    const navigate = useNavigate();
    const location = useLocation();
    // const storedItem = localStorage.getItem('Role_id');
    const roleId = localStorage.getItem("roleId");

    // var role = []
    // if (storedItem !== null && storedItem !== undefined) {
    //     role = JSON.parse(storedItem);
    // }
    // else {
    //     role = []
    // }

    return (
        <Sidebar
            collapsed={sideBarCollapse}
            toggled={sideBarToggle}
            onToggle={handleSidebarToggle}
            onBackdropClick={handleBackdropClick}
            breakPoint="md"
            className='sidebar_container'
        >
            {roleId === '1' && (
                <>
                    {/* <Menu iconShape="square" className="ClsMenu">
                        <MenuItem
                            onClick={() => navigate('/AdminDashboard')}
                            icon={<BiSolidDashboard id="sidebaruser" />}
                            className={['/AdminDashboard'].includes(location.pathname) ? 'active' : ''}
                        >
                            Dashboard
                        </MenuItem>
                    </Menu> */}

                    <Menu iconShape="square" className="ClsMenu">
                        <MenuItem
                            onClick={() => navigate('/AdmMenu')}
                            icon={<AiOutlineProduct id="sidebaruser" color="green" />}
                            className={['/AdmMenu', '/AdmupdateMenu', '/AdmaddMenu'].includes(location.pathname) ? 'active' : ''}
                        >
                            Product
                        </MenuItem>
                    </Menu>
                    <Menu iconShape="square" className="ClsMenu">
                        <MenuItem
                            onClick={() => navigate('/CategoryList')}
                            icon={<CiGrid42 id="sidebaruser" color="black" />}
                            className={['/CategoryList', '/UpdateCategory', '/AddCategoryList'].includes(location.pathname) ? 'active' : ''}
                        >
                            Category
                        </MenuItem>
                    </Menu>
                    <Menu iconShape="square" className="ClsMenu">
                        <MenuItem
                            onClick={() => navigate('/TodayOrder')}
                            icon={<IoFastFoodOutline id="sidebaruser" color="red" />}
                            className={['/TodayOrder', '/OrderBasedOnUser'].includes(location.pathname) ? 'active' : ''}
                        >
                            Order List
                        </MenuItem>
                    </Menu>

                    <Menu iconShape="square" className="ClsMenu">
                        <MenuItem
                            onClick={() => navigate('/Report')}
                            icon={<IoDownloadOutline id="sidebaruser" color="blue" />}
                            className={['/Report'].includes(location.pathname) ? 'active' : ''}
                        >
                            Report
                        </MenuItem>
                    </Menu>
                    <Menu iconShape="square" className="ClsMenu">
                        <MenuItem
                            onClick={() => navigate('/WalletReport')}
                            icon={<AiOutlineImport id="sidebaruser" color="red" />}
                            className={['/WalletReport'].includes(location.pathname) ? 'active' : ''}
                        >
                            Wallet Report
                        </MenuItem>
                    </Menu>
                </>
            )}
            {roleId === '3' && (
                <>

                    <Menu iconShape="square" className="ClsMenu">
                        <MenuItem
                            onClick={() => navigate('/UserList')}
                            icon={<HiOutlineUsers id="sidebaruser" color="green" />}
                            className={['/UserList', '/AddUserByAdmin', '/UpdateUserByAdmin'].includes(location.pathname) ? 'active' : ''}
                        >
                            Users
                        </MenuItem>
                    </Menu>
                    <Menu iconShape="square" className="ClsMenu">
                        <MenuItem
                            onClick={() => navigate('/ImportFile')}
                            icon={<AiOutlineImport id="sidebaruser" color="brown" />}
                            className={['/ImportFile'].includes(location.pathname) ? 'active' : ''}
                        >
                            Manage Wallet Import
                        </MenuItem>
                    </Menu>
                   
                </>
            )}
        </Sidebar>
    );
}

export default Admsidebar;

{/* <Menu iconShape="square" className="ClsMenu">
                <MenuItem
                    onClick={() => navigate('/AdmMessage')}
                    icon={<TbMessageCircleShare id="sidebaruser" color="brown"/>}
                    className={['/AdmMessage'].includes(location.pathname) ? 'active' : ''}
                >
                    Message User
                </MenuItem>
            </Menu> */}

{/* <Menu iconShape="square" className="ClsMenu">
                <MenuItem
                    onClick={() => navigate('/AdminLocation')}
                    icon={<FaLocationDot id="sidebaruser" color="red"/>}
                    className={['/AdminLocation'].includes(location.pathname) ? 'active' : ''}
                >
                   Location
                </MenuItem>

            </Menu> */}