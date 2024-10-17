import React, { useEffect, useState } from "react";
import Header from "./Header";
import Admsidebar from "./Admsidebar";
import { useSidebar } from "./SidebarContext";
import { useNavigate } from "react-router-dom";
import { useAppContext } from '../Components/AppProvider';
import MaterialTable from '@material-table/core';
import Select from "react-select";
import "./Sidebar.css";
import "./Admstyle.css";    
import Alert from "../Components/Alert";
import { REACT_APP_BASE_URL } from "../Components/Config";
import * as XLSX from "xlsx";

const ImportFile = (props) => {
    const { sideBarCollapse } = useSidebar();
    const [roleId] = useState(localStorage.getItem("roleId"));
    const navigate = useNavigate();
   
    const [token] = useState(localStorage.getItem("token"));
    const [userid] = useState(localStorage.getItem("userId"));
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [activeDate, setActiveDate] = useState("");

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [alertConfirm, setAlertConfirm] = useState(() => null);
    const [alertClose, setAlertClose] = useState(() => null);

    const [data, setData] = useState([]); // State to hold the imported data
    const baseUrl = REACT_APP_BASE_URL;

    // Function to handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const binaryStr = e.target.result;
                const workbook = XLSX.read(binaryStr, { type: "binary" });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Read the sheet as an array of arrays
                const formattedData = jsonData.map((row, index) => ({
                    id: index + 1, // You can adjust this as needed
                    ...row.reduce((acc, cell, cellIndex) => {
                        acc[`column${cellIndex + 1}`] = cell; // Assuming you want to create columnX properties
                        return acc;
                    }, {})
                }));
                setData(formattedData); // Set the parsed data into state
            };
            reader.readAsBinaryString(file); // Read the file as binary string
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h4>Import File</h4>
                            </div>
                            <div className='row' style={{ marginTop: "5px" }}>
                                <div className="col-lg-3 col-md-12">
                                    <div className='input_contanier'>
                                        <label className="admaddmenu_label">From Date <span className='required' style={{ color: "red" }}>*</span></label>
                                        <input
                                            type="date"
                                            id="fromDate"
                                            className='input_box'
                                            value={fromDate}     
                                            max={new Date().toISOString().split("T")[0]}
                                            onChange={(e) => setFromDate(e.target.value)} // Set fromDate
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-12">
                                    <div className='input_contanier'>
                                        <label className="admaddmenu_label">To Date <span className='required' style={{ color: "red" }}>*</span></label>
                                        <input
                                            type="date"
                                            id="toDate"
                                            className='input_box'
                                            value={toDate}        
                                            max={new Date().toISOString().split("T")[0]}
                                            onChange={(e) => setToDate(e.target.value)} // Set toDate
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-12">
                                    <div className='input_contanier'>
                                        <label className="admaddmenu_label">Active Date <span className='required' style={{ color: "red" }}>*</span></label>
                                        <input
                                            type="date"
                                            id="activeDate"
                                            className='input_box'
                                            value={activeDate}
                                            onChange={(e) => setActiveDate(e.target.value)} // Set activeDate
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-12">
                                    <div className='input_contanier'>
                                        <label className="admaddmenu_label">Upload File <span className='required' style={{ color: "red" }}>*</span></label>
                                        <input
                                            type="file"
                                            accept=".xls,.xlsx"
                                            onChange={handleFileUpload} // Handle file upload
                                            className='input_box'
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <MaterialTable
                                    title=""
                                    columns={[
                                        { title: "EmpCode", field: "column1" },
                                        { title: "Phone Number", field: "column2" },
                                        { title: "Wallet", field: "column3" },
                                        // Add more columns based on your data structure
                                    ]}
                                    data={data} // Use the imported data here
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

                             <div className="col-lg-2 col-md-12">
                                    <div className='input_contanier'>
                                        <label className="admaddmenu_label" style={{ marginBottom: "55px" }}> <span className='required' style={{ color: "red" }} ></span></label>
                                        <button className='input_box' style={{ backgroundColor: "green", color: "white" }}>Submit File</button>
                                    </div>
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

export default ImportFile;
