import { useEffect, useState } from "react";
import { json, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import { useSidebar } from "./SidebarContext";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { IoIosLogOut } from "react-icons/io";
import Popover from "@mui/material/Popover";
import { PiUserList } from "react-icons/pi";
import { BiArrowBack } from "react-icons/bi";
import { useAppContext } from "../Components/AppProvider";
import { BsCart3 } from "react-icons/bs";
import { logokcs } from "../imgUrl";

const Header = ({ onLocationChange, hideLocation, title, backicon }) => {
  const {
    handleCollapsesidebar,
    handleSidebarToggle,
    sideBarToggle,
    sideBarCollapse,
  } = useSidebar();
  const { apiServiceCall } = useAppContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = parseInt(localStorage.getItem("userId"), 10);
  const roleid = localStorage.getItem("roleId");
  const saveduserId = localStorage.getItem("saveduserId");
  const userName = localStorage.getItem("userName");
  const [token] = useState(localStorage.getItem("token"));

  const [cartItemCount, setCartItemCount] = useState("");
  const isAdminLogin = location.pathname === "/AdminLogin";

  const handleBackClick = () => {
    navigate(-1);
  };

  // useEffect(() => {
  //     GetAllCardDetails();
  // }, []);

  const Logout = () => {
    var roleId = localStorage.getItem("roleId");
    if (roleId == "1") {
      navigate("/AdminLogin");
    }
    // else if (roleId == "3") {
    //     navigate("/AdminLogin")
    // }
    else {
      navigate("/");
    }
    localStorage.clear();
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleNavigateUser = (event) => {
    navigate("/UserCard");
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const open = Boolean(anchorEl);

  // const GetAllCardDetails = () => {
  //     const url = `/cart/getAllProductsByUserId`;
  //     const data = { userId: userId };
  //     apiServiceCall('GET', url, data, headers)
  //         .then((response) => {
  //             const data = response.data.length;
  //             setCartItemCount(response.data.length)
  //         })
  //         .catch((error) => {
  //             console.log('Error fetching menu:', error);
  //         });
  // };
  return (
    <div>
      {roleid != "" && (roleid === "1" || roleid === "3") && (
        <div className="header_container">
          <div className="left_section">
            {sideBarCollapse ? (
              <AiOutlineMenuFold
                id="manimage"
                className="profile_icon"
                onClick={handleCollapsesidebar}
              />
            ) : (
              <AiOutlineMenuUnfold
                id="manimageclose"
                className="profile_icon"
                onClick={handleCollapsesidebar}
              />
            )}
            <img src={logokcs} alt="Logo" />
          </div>
          <div className="right_section" onClick={Logout}>
            <IoIosLogOut className="profile_icon" />
          </div>
        </div>
      )}
      {(roleid === null || roleid === "2") && (
        <div className="header_container">
          {!hideLocation && (
            <div
              style={{
                width: "50%",
                display: "flex",
                flexDirection: "row",
                gap: "10PX",
              }}
            >
              <img src={logokcs} alt="Logo" className="logoimg" />
            </div>
          )}
          {/* #title card */}
          <div>
            <>
              {!backicon && (
                <BiArrowBack
                  size={18}
                  style={{ cursor: "pointer" }}
                  onClick={handleBackClick}
                />
              )}
            </>

            <label style={{ fontWeight: "bold", marginLeft: "10px" }}>
              {title}
            </label>
          </div>

          {/* #User card */}
          {!isAdminLogin && (
            <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
              {/* <div className="profile_icon_container" style={{ position: "relative" }} onClick={handleNavigateUser}>
                                <BsCart3 className="profile_icon" />
                                {cartItemCount > 0 && (
                                    <span className="cart-count-badge">{cartItemCount}</span>
                                )}
                            </div> */}
              <div
                onClick={handleProfileClick}
                className="profile_icon_container"
              >
                <PiUserList className="profile_icon" />
              </div>
            </div>
          )}
        </div>
      )}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className="popover_container">
          <div className="popover_content">
            {saveduserId !== null ? (
              <div className="menu_sections">
                <div className="menu_section">
                  <h3>Welcome {userName}</h3>
                  <ul>
                    <li onClick={() => navigate("/MyAccount")}>My Account</li>
                    <li onClick={() => navigate("/MyOrders")}>My Orders</li>
                    <li onClick={() => navigate("/ChangePin")}>Change PIN</li>
                    <li onClick={Logout}>Logout</li>
                  </ul>
                </div>
              </div>
            ) : roleid === "2" ? (
              <div className="menu_sections">
                <div className="menu_section">
                  <h3>Welcome {userName}</h3>
                  <ul>
                    <li onClick={() => navigate("/MyAccount")}>My Account</li>
                    <li onClick={() => navigate("/MyOrders")}>Your Orders</li>
                    <li onClick={Logout}>Logout</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="signin_section">
                {/* <button className="signin_btn" onClick={() => navigate('/Login')}>Sign in</button> */}
                {/* <p className="new_customer_text" onClick={() => navigate('/Register')}>New customer? <label style={{ color: "blue", cursor: "pointer" }}>Register.</label></p> */}
              </div>
            )}
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default Header;
