import React, { useEffect, useState } from 'react';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { RiLockLine } from 'react-icons/ri';
import { useAppContext } from './AppProvider';
import { Link, useNavigate } from 'react-router-dom';
// import { gp_logo } from '../components/imageUrl';
import { toast } from 'react-toastify';
import Header from '../Admin/Header';
import { Phone } from '@mui/icons-material';
import Alert from './Alert';

const MyAccount = () => {

    const [userid] = useState(localStorage.getItem("userId"));
    const [token] = useState(localStorage.getItem("token"));
    const [formErrors, setFormErrors] = useState({});
    const [userName,setUserName] = useState("");
    const [phone,setPhone] = useState("");

    const { apiServiceCall } = useAppContext();

 
    useEffect(() => {
        GetallUserDetails();
    }, []);
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    const GetallUserDetails = () => {
        const url = `/user/getUserDetailsById`;
        const data = { userId: userid };
        apiServiceCall('GET', url, data,headers)
            .then((response) => {
                console.log(response, "UserDetails");
                setUserName(response.data.employeeCode);
                setPhone(response.data.phoneNo);
            })
            .catch((error) => {
                console.error("Error fetching locations:", error);
            });
    };


    return (
        <div>
            <Header
                title="Kannan Catering Service"
                hideLocation={true}
            />
            {/* <form> */}
                <div className="login-container" style={{marginTop:"10px"}}>
                    <div className='login_maincontent'>

                        <h2 className="welcome_text" style={{ marginBottom: "10px" }}>Account Information </h2>

                        <div className='col-12 col-md-4'>
                            <label className='login_label'>Emp Code</label>
                            <div className='input_contanier'>
                                <input
                                    id="name"
                                    type="text"
                                    value={userName}
                                    readOnly
                                    disabled
                                    className='input_box'
                                    placeholder="Name"
                                    maxLength={16}
                                />
                            </div>
                        </div>

                        <div className='col-12 col-md-4'>
                            <label className='login_label'>Mobile Number </label>
                            <div className='input_contanier'>
                                <input
                                    id="name"
                                    type="text"
                                    value={phone}
                                    readOnly
                                    disabled
                                    className='input_box'
                                    placeholder="Mobile Number"
                                    maxLength={10}
                                />
                            </div>
                        </div>
                    
                    
                    </div>
                </div>
        </div>
    )
}

export default MyAccount;