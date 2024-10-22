import React, { useState, useEffect } from "react";
import Header from "./Header";
import Admsidebar from "./Admsidebar";
import { useSidebar } from "./SidebarContext";
import { useNavigate, useLocation } from "react-router-dom";
import "./Admstyle.css";
import Select from 'react-select';
import { useAppContext } from '../Components/AppProvider';
import Alert from "../Components/Alert";
import MaterialTable from "@material-table/core";

const UpdateCategory = (props) => {
    const { sideBarCollapse } = useSidebar();
    const [roleId] = useState(localStorage.getItem("Role_id"));
    const [userId] = useState(localStorage.getItem("userId"))
    const navigate = useNavigate();

    const [categoryName, setCategoryName] = useState("");

    const [formErrors, setFormErrors] = useState({});
    const [token] = useState(localStorage.getItem("token"));
    // const [selectedIds, setSelectedIds] = useState();


    const [firstSignImg, setfirstSignImg] = useState(null);
    const [firstSignImgPreview, setfirstSignImgPreview] = useState(null);

    const [MenuData, setMenuData] = useState([]);
    const [categories, setCategories] = useState("")
        const [datas, setDatas] = useState([]);

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [alertConfirm, setAlertConfirm] = useState(() => null);
    const [alertClose, setAlertClose] = useState(() => null);

    const [productIds, setProductIds] = useState("")

    const location = useLocation();
    const id = location.state.id;
    const { data } = location.state;

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const { apiServiceCall } = useAppContext();

    useEffect(() => {
        // ViewCategory();
        GetallProducts();
    }, []);
    useEffect(() => {
        // Check if data is available and set category name and image
        if (data) {
            setCategoryName(data.categoryName);
            if (data.categoryImage) {
                const imageUrl = base64ToImageUrl(data.categoryImage);
                setfirstSignImgPreview(imageUrl);
            }
        }
        GetallProducts(); // Assuming you still want to fetch products
    }, [data]); // Depend on data to ensure it runs when data changes
    
    // Dummy data
    const validateFields = () => {
        if (categoryName.trim() === "") {
            // alert("Product name is required");
            setUserAlert(true)
            setAlertClose(() => () => {
                setUserAlert(false)
            })
            setAlertType("info")
            setAlertMsg("Product name is required");
            return false;
        }

        if (!firstSignImg) {
            // alert("Please select a location");
            setUserAlert(true)
            setAlertClose(() => () => {
                setUserAlert(false)
            })
            setAlertType("info")
            setAlertMsg("Please Upload Product Image");
            return false;
        }

        return true;
    };

    const handleFileInputChange = (event) => {
        event.target.value = '';
    };
 
    const columns = [
        {
            title: 'Product Image',
            field: 'productImage',
            render: rowData => {
                const imageUrl = base64ToImageUrl(rowData.productImage);
                return (
                    <div>
                        <img
                            src={imageUrl || "https://via.placeholder.com/150"}
                            alt={rowData.productName}
                            style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                    </div>
                );
            }
        },
        {
            title: 'Product Name',
            field: 'productName',
            customFilterAndSearch: (term, rowData) => rowData.productName.toLowerCase().includes(term.toLowerCase())

        },
        // {
        //     title: 'GST',
        //     field: 'productGST',
        //     render: rowData => `${rowData.productGST}%`
        // },
        {
            title: 'Description',
            field: 'productDescription',
            render: rowData => (
                <span>
                    {rowData.productDescription.length > 20
                        ? rowData.productDescription.substring(0, 20) + '...'
                        : rowData.productDescription}
                </span>
            )
        },
        {
            title: 'Price',
            field: 'productPrice'
        },
        // {
        //     title: 'Status',
        //     field: 'productActive',
        //     render: rowData => (
        //         <span
        //             style={{
        //                 color: rowData.productActive ? 'green' : 'red',
        //             }}
        //         >
        //             {rowData.productActive ? 'Active' : 'Inactive'}
        //         </span>
        //     )
        // },
        {
            title: 'Status',
            field: 'active',
            render: rowData => (
                <button
                    style={{
                        backgroundColor: rowData.productCategory ? 'green' : 'red',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                    }}
                    onClick={() => handlesubmit(rowData.productId, !rowData.productCategory)}
                >
                    {rowData.productCategory ? 'Active' : 'Remove'}
                </button>
            )
        },

    ];
    const base64ToImageUrl = (base64String) => {
        try {
            if (typeof base64String !== 'string' || base64String.trim() === '') {
                throw new Error('Invalid Base64 string');
            }
            const paddedBase64String = base64String.padEnd(base64String.length + (4 - base64String.length % 4) % 4, '=');
            const binaryString = window.atob(paddedBase64String);
            const binaryLen = binaryString.length;
            const bytes = new Uint8Array(binaryLen);
            for (let i = 0; i < binaryLen; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes.buffer], { type: 'image/jpeg' });
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Error converting Base64 string to image URL:', error);
            return null;
        }
    };
    const GetallProducts = (locationId) => {
        const url = `/categories/getAllProductsByCategoryIdOrAll`;
        const reqdata = { categoryId: data.categoryId };
        apiServiceCall('GET', url, reqdata, headers)
            .then((response) => {
                console.log(response, "getallProducts");
                setDatas(response.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
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
    const handlesubmit = (productId,newStatus) => {
        const url = `/categories/updateCategoryProducts?categoryId=${data.categoryId}`;
        let requestData  = [{
            "productId": productId,
            "productCategory":false
        }]
        apiServiceCall('POST', url, requestData, headers)
            .then((response) => {
                console.log(response, "");
                if (response.status === 200) {
                    setUserAlert(true)
                    setAlertClose(() => () => {
                        navigate("/CategoryList");
                    })
                    setAlertType("success")
                    setAlertMsg("Category Updated successfully");

                    setDatas(prevData => prevData.map(user =>
                        user.productId === productId ? { ...user, userActive: newStatus } : user
                    ));
                }
            })
            .catch((error) => {
                console.log(error, "Error in saveUserDetails");
            });
    };

    const handleSelectionChange = (rows) => {
        const selectedIdsArray = rows.map(row => (row.productId));
        console.log("Selected IDs:", selectedIdsArray);
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
                                <h4>Update Category</h4>
                            </div>
                        </div>
                        <div className='row' style={{marginTop:"10px"}}>
                            <div className="col-lg-4 col-md-12">
                                <div className='catagori_contanier'>
                                    <label className="admaddmenu_label">Category Name <span className='required' style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className='input_box'
                                        placeholder="Category Name"
                                        maxLength={20}
                                        value={data.categoryName}
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
                                <div className='catagori_contanier'>
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

                        <div style={{ marginTop: "10px" }}>
                            <MaterialTable
                                title=""
                                columns={columns}
                                data={datas}
                                options={{
                                    // selection: true,
                                }}
                                // onSelectionChange={handleSelectionChange}
                            />
                        </div>
                        <div className='col-lg-4 col-md-12' >
                            <button className="btnmenu" style={{ marginTop: "25px" }} onClick={handlesubmit}>
                                Update
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

export default UpdateCategory;