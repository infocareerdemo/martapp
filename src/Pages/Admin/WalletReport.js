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
import { Download, Today } from "@mui/icons-material";
import axios from "axios";
import Alert from "../Components/Alert";
import { REACT_APP_BASE_URL } from "../Components/Config";

const WalletReport = (props) => {
    const { sideBarCollapse } = useSidebar();
    const [roleId] = useState(localStorage.getItem("roleId"));
    const navigate = useNavigate();

    const [token] = useState(localStorage.getItem("token"));
    const [userid] = useState(localStorage.getItem("userId"));
    const [orderDate, setOrderDate] = useState("");
    const [locationId, setLocationId] = useState("");

    const [fromDate, setfromDate] = useState("");
    const [toDate, settoDate] = useState("");

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [alertConfirm, setAlertConfirm] = useState(() => null);
    const [alertClose, setAlertClose] = useState(() => null);

    const baseUrl = REACT_APP_BASE_URL;

    const handleActionClick = (id) => {
        navigate('/OrderBasedOnUser', { state: { id: id } });
    };

    const DownloadReport = (rowId) => {
        // setLoading(true);
        if (!fromDate) { // Check if orderDate is empty
            setAlertType("error");
            setAlertMsg("Please Choose From Date");
            setAlertClose(() => () => {
                setUserAlert(false);
            });
            setUserAlert(true);
            return;
        }
        const axiosConfig = {
            responseType: 'blob',
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                Authorization: `Bearer ${token}`
            }
        };
        axios.post(`${baseUrl}/order/getDateWiseUserOrderDetailsExcel?fromDate=${fromDate}&toDate=${toDate}`, null, axiosConfig)
            .then((response) => {
                console.log(response, "report")
                if (!response.data || response.data.size === 0) { // Adjusted check for blob size
                    setAlertType("error");
                    setUserAlert(true);
                    setAlertMsg("Excel file is not available for the date.");
                    setAlertClose(() => () => {
                        setUserAlert(false);
                    });
                    return;
                }
                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Orderdetails_Report.xlsx'); // Changed filename to .xlsx
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((error) => {
                console.log('Error fetching Excel file:', error);
            })
            .finally(() => {
                // setLoading(false);
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
                                <h4>User Wise Wallet Report</h4>
                            </div>
                            <div className='row' style={{ marginTop: "5px" }}>
                            <div className="col-lg-3 col-md-12">
                    <div className='input_contanier'>
                        <label className="admaddmenu_label">From Date <span className='required' style={{ color: "red" }}>*</span></label>
                        <input
                            type="date"
                            id="fromDate"
                            name="fromDate"
                            className='input_box'
                            value={fromDate}
                            onChange={(e) => {
                                const selectedFromDate = e.target.value;
                                setfromDate(selectedFromDate);
                                // Automatically update the minimum allowed To Date (1 day after From Date)
                                settoDate('');
                            }}
                            max={new Date().toISOString().split("T")[0]} // Optional: Prevent selecting future dates
                        />
                    </div>
                </div>
                <div className="col-lg-3 col-md-12">
                    <div className='input_contanier'>
                        <label className="admaddmenu_label">To Date <span className='required' style={{ color: "red" }}>*</span></label>
                        <input
                            type="date"
                            id="toDate"
                            name="toDate"
                            className='input_box'
                            value={toDate}
                            onChange={(e) => settoDate(e.target.value)}
                            min={fromDate ? new Date(new Date(fromDate).getTime() + 86400000).toISOString().split("T")[0] : ''} // Set minimum To Date (1 day after From Date)
                            max={new Date().toISOString().split("T")[0]} // Optional: Prevent selecting future dates
                        />
                    </div>
                </div>
                                <div className="col-lg-3 col-md-12">
                                    <div className='input_contanier'>
                                        <label className="admaddmenu_label" style={{ marginBottom: "55px" }}> <span className='required' style={{ color: "red" }} ></span></label>

                                        <button className='input_box' style={{ backgroundColor: "green", color: "white" }} onClick={DownloadReport}>Download Report</button>

                                    </div>
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

export default WalletReport;
