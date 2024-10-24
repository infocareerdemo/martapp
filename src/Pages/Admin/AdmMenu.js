import React, { useEffect, useState } from "react";
import Header from "./Header";
import Admsidebar from "./Admsidebar";
import { useSidebar } from "./SidebarContext";
import { useNavigate } from "react-router-dom";
import { useAppContext } from '../Components/AppProvider';
import MaterialTable from '@material-table/core';
import Select from 'react-select'
import "./Sidebar.css";
import "./Admstyle.css";
import Alert from "../Components/Alert";

const AdmMenu = () => {
    const { sideBarCollapse } = useSidebar();
    const [roleId] = useState(localStorage.getItem("roleId"));
    const navigate = useNavigate();
    const { apiServiceCall } = useAppContext();
    const [MenuData, setMenuData] = useState([]);
    const [token] = useState(localStorage.getItem("token"));

    const [Selectlocation, setSelectlocation] = useState(null);
    const [locationData, setLocationData] = useState([]);
    const [locationId, setLocationId] = useState("");
    const [userId] = useState(localStorage.getItem("userId"));

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [alertConfirm, setAlertConfirm] = useState(() => null);
    const [alertClose, setAlertClose] = useState(() => null);

    const addmenu = () => {
        navigate("/AdmaddMenu");
    }

    useEffect(() => {
        GetallLocation();
    }, []);

    useEffect(() => {
        if (locationId) {
            GetallProducts(locationId);
        }
    }, [locationId]);
    const handlesubmit = (productId, productName, productDescription, productPrice, productGST, productActive, productImg) => {
        const url = "/product/activeOrInactive";
        const formData = new FormData();
        formData.append("productId", productId); // Assuming you have productId to update the product
        formData.append("productName", productName);
        formData.append("productDescription", productDescription);
        formData.append("productUpdatedBy", userId);
        formData.append("productPrice", productPrice);
        formData.append("productGST", productGST);
        formData.append("productActive", productActive);
        // formData.append("location.locationId", locationId);
        formData.append("productImg", null);

        apiServiceCall('POST', url, formData, headers)
            .then((response) => {
                console.log(response, "Response from saving the item");
                if (response.status === 200) {
                    setAlertType("info");
                    setAlertMsg(productActive ? "Activated" : "Deactivated");
                    setAlertClose(() => () => {
                        setUserAlert(false);
                    });
                    setUserAlert(true);
                    // alert(productActive ? "Activated" : "Deactivated");
                    GetallProducts(locationId);
                }
            })
            .catch((error) => {
                console.log(error, "Error in saveItemDetails");
            });
    };
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
    
    const columns = [
        {
            title: 'Product Image',
            field: 'productImage',
            sorting: false,
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
            sortable:true,
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
        {
            title: 'Location',
            field: 'location.locationName'
        },
    
        {
            title: 'Status',
            field: 'productActive',
            sorting: false,
            render: rowData => (
                <button
                    style={{
                        backgroundColor: rowData.productActive ? 'green' : 'red',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                    }}
                    onClick={() => {
                        const newStatus = !rowData.productActive;
                        handlesubmit(
                            rowData.productId,
                            rowData.productName,
                            rowData.productDescription,
                            rowData.productPrice,
                            rowData.productGST,
                            // userId,
                            newStatus,
                            // rowData.location.locationId,
                            rowData.productImage
                        );
                    }}
                  //  data={menuData} // Render sorted data here

                >
                    {rowData.productActive ? 'Active' : 'Inactive'}
                </button>
            )
        },
        {
            title: 'Action',
            field: 'action',
            render: rowData => (
                <button
                    variant="contained"
                    className="viewbtnmenu"
                    color="primary"
                    onClick={() => handleActionClick(rowData.productId)}
                >
                    View
                </button>
            )
        },
    ];



    const handleActionClick = (id) => {
        navigate('/AdmupdateMenu', { state: { id: id } });
    };

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const GetallProducts = (locationId) => {
        const url = `/product/getAllProductsByLocation`;
        const data = { id: locationId };
        apiServiceCall('GET', url, data, headers)
            .then((response) => {
                console.log(response);
                const sortedData = response.data.sort((a, b) => b.productActive - a.productActive);

            // Set the sorted data to the state
            setMenuData(sortedData);
               // setMenuData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    };

    const handleLocationChange = (selectedOption) => {
        setSelectlocation(selectedOption);
        setLocationId(selectedOption.value);
    };

    
    const LocationOptions = Array.isArray(locationData) 
    ? locationData.map(item => ({
        value: item.locationId,
        label: `${item.locationName} (${item.companyName})` // Combining locationName and companyName
    })) 
    : [];


    const GetallLocation = () => {
        const url = `/location/getAllLocation`;
        apiServiceCall('GET', url, null,headers)
            .then((response) => {
                console.log(response.data, "location");
                setLocationData(response.data);
                if (response.data.length > 0) {
                    const defaultLocation = response.data[0];
                    setSelectlocation({ value: defaultLocation.locationId, label: defaultLocation.locationName });
                    setLocationId(defaultLocation.locationId);
                }
            })
            .catch((error) => {
                console.error("Error fetching locations:", error);
            });
    };

    const removeProducts = (id) => {
        const url = `/food/id?id=${id}`;
        apiServiceCall('DELETE', url, null, headers)
            .then((response) => {
                console.log(response);
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error deleting product:", error);
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h4>Product</h4>
                                <button className="btnmenu" onClick={addmenu}>
                                    Add
                                </button>
                            </div>
                            <div className="col-lg-4 col-md-12">
                                <div className="input_contanier">
                                    <label className="admaddmenu_label">
                                        Location <span className="required" style={{ color: "red" }}>*</span>
                                    </label>
                                    <Select
                                        name="Users"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        isDisabled
                                        options={LocationOptions}
                                        value={LocationOptions.find(option => option.value === Selectlocation?.value)}
                                        onChange={handleLocationChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <MaterialTable
                                    title=""
                                    columns={columns}
                                    data={MenuData}
                                    options={{
                                        search: true,
                                        paging: true,
                                        draggable: false,
                                        pageSize: 5,
                                        pageSizeOptions: [5, 10, 20],
                                        headerStyle: {
                                            backgroundColor: '#EEE',
                                            fontWeight: 'bold'
                                        },
                                        rowStyle: {
                                            backgroundColor: '#FFF',
                                        },
                                        emptyRowsWhenPaging: false,
                                    }}
                                />
                            </div>
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

export default AdmMenu;
