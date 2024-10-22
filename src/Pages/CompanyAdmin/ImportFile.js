import React, { useEffect, useState } from "react";
import Header from "../Admin/Header";
import Admsidebar from "../Admin/Admsidebar";
import { useSidebar } from "../Admin/SidebarContext";
import { useNavigate } from "react-router-dom";
import { useAppContext } from '../Components/AppProvider';
import MaterialTable from '@material-table/core';
import { Modal } from "react-bootstrap";
import { AiOutlineClose, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Select from "react-select";
// import "../Sidebar.css";
// import "./Admstyle.css";    
import Alert from "../Components/Alert";
import { REACT_APP_BASE_URL } from "../Components/Config";
import * as XLSX from "xlsx"; // Import the xlsx library
import { toast } from "react-toastify";
import moment from 'moment';

const ImportFile = (props) => {
    const { sideBarCollapse } = useSidebar();
    const [roleId] = useState(localStorage.getItem("roleId"));
    const navigate = useNavigate();

    const [token] = useState(localStorage.getItem("token"));
    const [userid] = useState(localStorage.getItem("userId"));
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [activeDate, setActiveDate] = useState("");

    const [enterOTP, setEnterOTP] = useState("");

    const [otpModalOpen, setOtpModalOpen] = useState(false)

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [alertConfirm, setAlertConfirm] = useState(() => null);
    const [alertClose, setAlertClose] = useState(() => null);

    const { apiServiceCall } = useAppContext();
    const [data, setData] = useState([]);

    const minDateTime = moment().format('YYYY-MM-DDTHH:mm');

    const baseUrl = REACT_APP_BASE_URL;
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const binaryStr = e.target.result;
                const workbook = XLSX.read(binaryStr, { type: "binary" });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
                if (jsonData.length > 0) {
                    // Extract the first row as the header
                    const headers = jsonData[0].map(header => header.trim());
    
                    // Extract the rest of the rows as data, filtering out empty rows
                    const formattedData = jsonData.slice(1).filter(row => {
                        return row[headers.indexOf('employeeCode')] && row[headers.indexOf('phone')]; // Add additional fields if needed
                    }).map((row, index) => {
                        return {
                            id: index + 1,
                            employeeCode: row[headers.indexOf('employeeCode')],
                            name: row[headers.indexOf('name')],
                            phone: row[headers.indexOf('phone')],
                            email: row[headers.indexOf('email')],
                            walletAmount: row[headers.indexOf('walletAmount')],
                        };
                    });
    
                    console.log("Parsed Excel Data:", formattedData); // Log the data in console
                    setData(formattedData); // Set the parsed data into state
                } else {
                    console.error("No data found in the Excel sheet.");
                }
            };
            reader.readAsBinaryString(file); // Read the file as binary string
        }
    };
    
    // const handleFileUpload = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //             const binaryStr = e.target.result;
    //             const workbook = XLSX.read(binaryStr, { type: "binary" });
    //             const firstSheetName = workbook.SheetNames[0];
    //             const worksheet = workbook.Sheets[firstSheetName];
    //             const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    //             if (jsonData.length > 0) {
    //                 // Extract the first row as the header
    //                 const headers = jsonData[0].map(header => header.trim());

    //                 // Extract the rest of the rows as data
    //                 const formattedData = jsonData.slice(1).map((row, index) => {
    //                     return {
    //                         id: index + 1,
    //                         employeeCode: row[headers.indexOf('employeeCode')],
    //                         name: row[headers.indexOf('name')],
    //                         phone: row[headers.indexOf('phone')],
    //                         email: row[headers.indexOf('email')],
    //                         walletAmount: row[headers.indexOf('walletAmount')],
    //                     };
    //                 });

    //                 console.log("Parsed Excel Data:", formattedData); // Log the data in console
    //                 setData(formattedData); // Set the parsed data into state
    //             } else {
    //                 console.error("No data found in the Excel sheet.");
    //             }
    //         };
    //         reader.readAsBinaryString(file); // Read the file as binary string
    //     }
    // };
    const validateForm = () => {
        if (!activeDate) {
            setUserAlert(true);
            setAlertType("error");
            setAlertMsg("Please select an Active Date.");
            setAlertClose(() => () => {
                setUserAlert(false)
            })
            return false;
        }
        if (data.length === 0) {
            setUserAlert(true);
            setAlertType("error");
            setAlertMsg("Please upload a valid file.");
            setAlertClose(() => () => {
                setUserAlert(false)
            })
            return false;
        }
        return true;
    };
    const Otpsent = () => {
        if (!validateForm()) return;
        const url = `/companyadmin/verifyCmpnyAdminAndSendOtp`;
        const data = { userId: userid };
        apiServiceCall('GET', url, data, headers)
            .then((response) => {
                console.log(response, "Otpsent response");
                if (response.data === "OTP SENT") {
                    toast.success("OTP Sented")
                    setOtpModalOpen(true);
                    setEnterOTP(null)
                    setAlertMsg("Wallet updated successfully");
                }
               
            })
            .catch((error) => {

            });
    };
    const Otpverify = () => {
        const url = `/companyadmin/verifyOtp`;
        const data = { 
            userId: userid,
            reqOtp: enterOTP
        };
        apiServiceCall('GET', url, data, headers)
            .then((response) => {
                console.log(response, "Otpsent response");
                if (response.data === true) {
                    setOtpModalOpen(false);
                    setEnterOTP("");
                    setUserAlert(true)
                    setAlertType("success")
                    setAlertClose(() => () => {
                        setUserAlert(false)
                        SaveList();
                    })
                    setAlertMsg("OTP Verified Click OK to Submit");
                }
                else if(response.data === false) {
                    toast.error("Invalid OTP")
                }
            })
            .catch((error) => {

            });
    };
    const SaveList = () => {
        console.log(data, "SaveList data");
        const url = `/companyadmin/addWallet?futureDate=${activeDate}`;

        const Importdata = data.map(item => ({
            employeeCode: item.employeeCode,
            // name: item.name,
            phone: item.phone,
            // email: item.email,
            walletAmount: item.walletAmount,
        }));

        apiServiceCall('POST', url, Importdata, headers)
            .then((response) => {
                console.log(response, "SaveList response");
                if (response.status === 200) {
                    setUserAlert(true)
                    setAlertType("success")
                    setAlertClose(() => () => {
                        setUserAlert(false)
                        setActiveDate("");
                        setData([]); // Set the parsed data into state
                    })

                    setAlertMsg("Wallet saved successfully");
                }
            })
            .catch((error) => {

            });
    };
    const handleModalToggle = () => {
        setOtpModalOpen(true); // Toggle modal visibility
    };
    const closeModal = () => {
        setOtpModalOpen(false);
    }
    return (
        <div>
            <Header />
            <Admsidebar />
            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <div className="Summary_card">
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h4>Multiple User's Wallet Upload</h4>
                            </div>
                            <div className='row' style={{ marginTop: "5px" }}>
                                <div className="col-lg-4 col-md-12">
                                    <div className='input_contanier'>
                                        <label className="admaddmenu_label">Actived Date <span className='required' style={{ color: "red" }}>*</span></label>
                                        <input
                                         type="datetime-local" 
                                            id="activeDate"
                                            className='input_box'
                                            value={activeDate}
                                            onChange={(e) => setActiveDate(e.target.value)}
                                            min={minDateTime} 
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12">
                                    <div className='input_contanier'>
                                        <label className="admaddmenu_label">Upload File <span className='required' style={{ color: "red" }}>*</span></label>
                                        <input
                                            type="file"
                                            accept=".xls,.xlsx"
                                            onChange={handleFileUpload}
                                            className='input_box'
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <MaterialTable
                                    title=""
                                    columns={[
                                        { title: "Employee Code", field: "employeeCode" },
                                        { title: "Phone", field: "phone" },
                                        // { title: "Name", field: "name" },
                                        // { title: "Email", field: "email" },
                                        { title: "Wallet Amount", field: "walletAmount" },
                                    ]}
                                    data={data}
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
                                    <button className='input_box' style={{ backgroundColor: "green", color: "white" }} onClick={Otpsent}>Submit File</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/***************************** OTP Modal*************************/}
                <Modal dialogClassName='modal-dialog modal-md' centered show={otpModalOpen}>
                    <Modal.Header>
                        <div className='modal_subhead'>
                            <span className='modal_head_txt'>Verify OTP</span>
                            <AiOutlineClose className="moda_closel_icon" onClick={() => closeModal()} />
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='modal_body_container'>
                            <div className="col-lg-12 col-md-12">
                                <div className='input_contanier'>
                                    <label className="admaddmenu_label">OTP <span className='required' style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="number"
                                        id="activeDate"
                                        className='input_box'
                                        value={enterOTP}
                                        maxLength={6}
                                        onChange={(e) => setEnterOTP(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <div className="col-lg-6 col-md-12">
                                    <label className="admaddmenu_label" style={{ marginBottom: "55px" }}> <span className='required' style={{ color: "red" }} ></span></label>
                                    <button className='input_box' style={{ backgroundColor: "green", color: "white" }} onClick={Otpverify}>Verify</button>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
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
