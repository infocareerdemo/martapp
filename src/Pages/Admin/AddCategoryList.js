import React, { useState, useEffect } from "react";
import Header from "./Header";
import Admsidebar from "./Admsidebar";
import { useSidebar } from "./SidebarContext";
import { useNavigate } from "react-router-dom";
import "./Admstyle.css";
import Select from 'react-select';
import { useAppContext } from '../Components/AppProvider';
import Alert from "../Components/Alert";

const AddCategoryList = (props) => {
    const { sideBarCollapse } = useSidebar();
    const [roleId] = useState(localStorage.getItem("Role_id"));
    const [userId] = useState(localStorage.getItem("userId"))
    const navigate = useNavigate();

    const [categoryName, setCategoryName] = useState("");
    const [ProductDesc, setProductDesc] = useState("");
    const [price, setPrice] = useState("");

    const [Selectlocation, setSelectlocation] = useState(null);
    const [locationData, setLocationData] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [token] = useState(localStorage.getItem("token"));

    const [firstSignImg, setfirstSignImg] = useState(null);
    const [firstSignImgPreview, setfirstSignImgPreview] = useState(null);

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [alertConfirm, setAlertConfirm] = useState(() => null);
    const [alertClose, setAlertClose] = useState(() => null);


    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const { apiServiceCall } = useAppContext();

    // Dummy data
    const validateFields = () => {
        if (categoryName.trim() === "") {
            // alert("Product name is required");
            setUserAlert(true)
            setAlertClose(() => () => {
                setUserAlert(false)
            })
            setAlertType("info")
            setAlertMsg("Category name is required");
            return false;
        }

        if (!firstSignImg) {
            // alert("Please select a location");
            setUserAlert(true)
            setAlertClose(() => () => {
                setUserAlert(false)
            })
            setAlertType("info")
            setAlertMsg("Please Upload Category Image");
            return false;
        }

        return true;
    };

    const handleFileInputChange = (event) => {
        event.target.value = '';
    };
    const handlesubmit = () => {
        if (!validateFields()) {
            return;
        }
        const url = "/categories/saveOrUpdateCategory";
        const formData = new FormData();
        formData.append("categoryName", categoryName);
        formData.append("categoryImage", firstSignImg);
        apiServiceCall('POST', url, formData, headers)
            .then((response) => {
                console.log(response, "");
                if (response.status === 200) {
                    setUserAlert(true)
                    setAlertClose(() => () => {
                        navigate("/CategoryList");
                    })
                    setAlertType("success")
                    setAlertMsg("Category added successfully");
                }
            })
            .catch((error) => {
                console.log(error, "Error in saveUserDetails");
            });
    };

    const handleFirstSign = async (event) => {
        const fileInput = event.target;
        const file = fileInput.files[0];
        console.log(file, "first sign");
        if (file) {
            const fileName = file.name.toLowerCase();
            if (fileName.endsWith('.png') || fileName.endsWith('.jpeg') || fileName.endsWith('.jpg')) {
                const fileSizeInKB = file.size / 1024;
                if (fileSizeInKB > 500) {
                    setUserAlert(true)
                    setAlertClose(() => () => {
                        setUserAlert(false)
                    })
                    setAlertType("info")
                    setAlertMsg("File size should not exceed 500KB");
                    // setFormErrors({ ...formErrors, firstSignImg: "File size should not exceed 500KB" });
                    fileInput.value = '';
                    setfirstSignImg(null);
                    setfirstSignImgPreview(null);
                } else {
                    const response = await imageUploadApi(file);
                    console.log(response, "image")
                    if (response.data === true) {
                        setfirstSignImg(file);
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            setfirstSignImgPreview(e.target.result);
                        };
                        reader.readAsDataURL(file);
                        setFormErrors({ ...formErrors, firstSignImg: "" });
                    } else {
                        fileInput.value = '';
                        setfirstSignImg(null);
                        setfirstSignImgPreview(null);
                        setUserAlert(true)
                        setAlertClose(() => () => {
                            setUserAlert(false)
                        })
                        setAlertType("info")
                        setAlertMsg("Invalid Image");
                        // setFormErrors({ ...formErrors, firstSignImg: "Invalid Image" });
                    }
                }
            } else {
                fileInput.value = '';
                setFormErrors({ ...formErrors, firstSignImg: "Invalid file format. Please upload a .png, .jpeg, or .jpg file." });
                setfirstSignImg(null);
                setfirstSignImgPreview(null);
            }
        }
    };
    const imageUploadApi = async (file) => {
        try {
            const url = "/product/validateImage";
            const data = new FormData();
            data.append("image", file);
            const response = await apiServiceCall('POST', url, data, headers);
            return response
        } catch (error) {
            return { success: false, error: "Error uploading image" };
        }
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
                                <h4>Add Category</h4>
                            </div>
                        </div>
                        <div className='row' style={{ marginTop: "20px", rowGap: "10px" }}>
                            <div className="col-lg-4 col-md-12">
                                <div className='input_contanier'>
                                    <label className="admaddmenu_label">Category Name <span className='required' style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className='input_box'
                                        placeholder="Category Name"
                                        maxLength={20}
                                        value={categoryName}
                                        // // readOnly={kycver === true}
                                        // onChange={(e) => {
                                        //     setProductname(e.target.value)
                                        // }}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            const regex = /^[a-zA-Z\s]*$/;
                                            if (regex.test(inputValue)) {
                                                setCategoryName(inputValue)
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className='col-lg-4 col-md-12' >
                                <div className='input_contanier'>
                                    <label className='admaddmenu_label'>Category Image<span className="required" style={{ color: "red" }}>*</span></label>
                                    <input
                                        id="firstSignImg"
                                        name="firstSignImg"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFirstSign}
                                        onClick={handleFileInputChange}
                                        className='input_box'
                                    />
                                    <span style={{ fontSize: '10px' }}>Note (.png,.jpeg, or .jpg file-Max Size 500KB)</span>
                                </div>

                                {firstSignImgPreview && (
                                    <div className="preview_card_img">
                                        <img src={firstSignImgPreview} alt="Selected" className='bondimgPreview' />
                                    </div>
                                )}



                            </div>
                        </div>


                        <div style={{ display: "flex", gap: "10px" }}>
                            <button className="btnmenu" style={{ marginTop: "40px" }} onClick={handlesubmit}>
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="btnmenu"
                                style={{ marginTop: "40px" }}
                            >
                                Back
                            </button>
                        </div>
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

export default AddCategoryList;