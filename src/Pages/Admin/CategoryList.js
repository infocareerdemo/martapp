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

const CategoryList = () => {
    const { sideBarCollapse } = useSidebar();
    const [roleId] = useState(localStorage.getItem("roleId"));
    const navigate = useNavigate();
    const { apiServiceCall } = useAppContext();
    const [MenuData, setMenuData] = useState([]);
    const [categoriesdata,setCategoriesdata] = useState([]);
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
        navigate("/AddCategoryList");
    }

    useEffect(() => {
        categories();
    }, []);


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
            title: 'Category Image',
            render: rowData => {
                const imageUrl = base64ToImageUrl(rowData.categoryImage);
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
            title: 'Category Name',
            field: 'categoryName',
            customFilterAndSearch: (term, rowData) => rowData.productName.toLowerCase().includes(term.toLowerCase())

        },
        {
            title: 'Action',
            field: 'action',
            render: rowData => (
                <button
                    variant="contained"
                    className="viewbtnmenu"
                    color="primary"
                    onClick={() => handleActionClick(rowData)}
                >
                    View
                </button>
            )
        },
    ];



    const handleActionClick = (rowData) => {
        navigate('/UpdateCategory', { state: { data: rowData } });
    };

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const categories = () => {
        const url = `/categories/getAllCategoriesWithProducts`;
        const data = {};
        apiServiceCall('GET', url, data, headers)
            .then((response) => {
                console.log(response, "GET ALL Categories")
                setCategoriesdata(response.data)
            })
            .catch((error) => {
                console.log('Error fetching menu:', error);
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
                                <h4>Category</h4>
                                <button className="btnmenu" onClick={addmenu}>
                                    Add
                                </button>
                            </div>
                            <div>
                                <MaterialTable
                                    title=""
                                    columns={columns}
                                    data={categoriesdata}
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

export default CategoryList;
