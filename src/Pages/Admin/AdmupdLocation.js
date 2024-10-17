import React, { useState, useEffect } from "react";
import Header from "./Header";
import Admsidebar from "./Admsidebar";
import { useSidebar } from "./SidebarContext";
import { useNavigate, useLocation } from "react-router-dom";
import "./Admstyle.css";
import Select from 'react-select';
import { useAppContext } from '../Components/AppProvider';
import Alert from "../Components/Alert";


const AdmupdLocation = (props) => {
    const { sideBarCollapse } = useSidebar();
    const [roleId] = useState(localStorage.getItem("Role_id"));
    const [userId] = useState(localStorage.getItem("userId"))
    const navigate = useNavigate();

    const [locationname, setlocationName] = useState("");
    const [companyname, setCompanyname] = useState("");
    
    const [formErrors, setFormErrors] = useState({});
    const [token] = useState(localStorage.getItem("token"));

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [alertConfirm, setAlertConfirm] = useState(() => null);
    const [alertClose, setAlertClose] = useState(() => null);

    const [Selectlocation, setSelectlocation] = useState(null);
    const [locationData, setLocationData] = useState([]);
    const [locationIds,setLocationIds] = useState("");



    
    const location = useLocation();
    const id = location.state.id;

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const { apiServiceCall } = useAppContext();

    useEffect(() => {
        GetallLocation();
        ViewProducts();
    }, []);

    // Dummy data
    const validateFields = () => {
        if (locationname.trim() === "") {
            // alert("Product name is required");
            setUserAlert(true)
            setAlertClose(() => () => {
                setUserAlert(false)
            })
            setAlertType("info")
            setAlertMsg("Location name is required");
            return false;
        }
        if (companyname.trim() === "") {
            setUserAlert(true)
            setAlertClose(() => () => {
                setUserAlert(false)
            })
            setAlertType("info")
            setAlertMsg("Company Name is required");
            return false;
        }
        // if (!Selectlocation) {
        //     // alert("Please select a location");
        //     setUserAlert(true)
        //     setAlertClose(() => () => {
        //         setUserAlert(false)
        //     })
        //     setAlertType("info")
        //     setAlertMsg("Please select a location");
        //     return false;
        // }

        return true;
    };
    const LocationOptions = locationData.map(item => ({
        value: item.locationId,
        label: item.companyName
    }));
    const handleLocationChange = (selectedOption) => {
        setSelectlocation(selectedOption);
        // setLocationData(selectedOption.value);
        console.log('Selected userId:', selectedOption.value);
    };

    const GetallLocation = () => {
        const url = `/location/getAllLocation`;
        apiServiceCall('GET', url, null,headers)
            .then((response) => {
                console.log(response, "location")
                setLocationData(response.data)
            })
    }
    const ViewProducts = () => {
        const url = `/product/id`;
        const data = {
            id:id,
        };
        apiServiceCall('GET', url, data, headers)
            .then((response) => {
                console.log(response)
                setlocationName(response.data.location.locationName);
                setCompanyname(response.data.location.companyName);
                setLocationIds(response.data.location.locationId)
                // if (response.data?.productImage) {
                //     console.log(response.data.productImage,)
                //     const productImg = base64ToImageUrl(response.data.productImage);
                //     setfirstSignImgPreview(productImg);
                // } else {
                //     setfirstSignImgPreview(null);
                // }

            })
    }
    const handlesubmit = () => {
        if (!validateFields()) {
            return;
        }
        const url = "/location/saveOrupdateLocation";
        const data = {
            locationId:locationIds,
            locationName:locationname,
            companyName:companyname,
            lastUpdatedBy:userId
        }
        
        apiServiceCall('POST', url,data, headers)
            .then((response) => {
                console.log(response, "");
                if (response.status === 200) {
                    setUserAlert(true)
                    setAlertClose(() => () => {
                        navigate("/AdminLocation");
                    })
                    setAlertType("success")
                    setAlertMsg("Location saved successfully");
                }
            })
            .catch((error) => {
                console.log(error, "Error in saveUserDetails");
            });
    };

    return (
        <div>
            <Header />
            <Admsidebar />
            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <div className="Summary_card">
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4>Add Location</h4>
                            </div>
                        </div>
                        <div className='row' style={{ marginTop: "20px", rowGap: "10px" }}>
                            <div className="col-lg-4 col-md-12">
                                <div className='input_contanier'>
                                    <label className="admaddmenu_label">Location Name <span className='required' style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className='input_box'
                                        placeholder="Location Name"
                                        maxLength={20}
                                        value={locationname}
                                        // // readOnly={kycver === true}
                                        // onChange={(e) => {
                                        //     setProductname(e.target.value)
                                        // }}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            const regex = /^[a-zA-Z\s]*$/;
                                            if (regex.test(inputValue)) {
                                                setlocationName(inputValue)
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-12">
                                <div className='input_contanier'>
                                    <label className="admaddmenu_label">Company Name <span className='required' style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className='input_box'
                                        placeholder="Company Name"
                                        maxLength={100}
                                        value={companyname}
                                        onChange={(e) => {
                                            setCompanyname(e.target.value)
                                        }}
                                    />
                                </div>
                            </div>
                           
                            {/* <div className="col-lg-4 col-md-12">
                                <div className='input_contanier'>
                                    <label className="admaddmenu_label">Location <span className='required' style={{ color: "red" }}>*</span></label>
                                    <Select
                                        name="Users"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        options={LocationOptions}
                                        value={LocationOptions.find(option => option.value === locationData)}
                                        onChange={handleLocationChange}
                                    />

                                </div>
                            </div> */}
                        </div>
                        <button className="btnmenu" style={{ marginTop: "40px" }} onClick={handlesubmit}>
                            Update
                        </button>
                    </div>
                </div>
                <Alert
                    title={alertTitle}
                    msg={alertMsg}
                    open={userAlert}
                    type={alertType}
                    onClose={alertClose}
                    onConfirm={alertConfirm}
                />
            </div>
        </div>
    );
};

export default AdmupdLocation;