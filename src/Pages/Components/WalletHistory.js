import React, { useEffect, useState } from 'react';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { RiLockLine } from 'react-icons/ri';
import { useAppContext } from './AppProvider';
import { Link, useNavigate } from 'react-router-dom';
// import { gp_logo } from '../components/imageUrl';
import { toast } from 'react-toastify';
import Header from '../Admin/Header';
import MaterialTable from '@material-table/core';
import moment from 'moment';
import { Phone } from '@mui/icons-material';
import Alert from './Alert';

const WalletHistory = () => {

    const [userid] = useState(localStorage.getItem("userId"));
    const [token] = useState(localStorage.getItem("token"));
    const [data, setData] = useState([]);

    const { apiServiceCall } = useAppContext();


    useEffect(() => {
        GetallWallet();
    }, []);
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    const columns = [
        {
            title: 'S.No',
            render: (rowData) => rowData.tableData.index + 1,
            sorting: false,
        },
        {
            title: 'Order Date',
            field: 'orderedDateTime',
            render: (rowData) => moment(rowData.orderedDateTime).format("DD-MM-YYYY"),
          },
        {
            title: 'Order Id',
            field: 'orderId',
        },
        {
            title: 'Wallet Amount',
            field: 'walletAmount',
        },
    ];
    const GetallWallet = () => {
        const url = `/order/getWalletDetailsById`;
        const data = { userId : userid };
        apiServiceCall('GET', url, data, headers)
            .then((response) => {
                console.log(response, "GetallWallet");
                setData(response.data);
            })
            // .catch((error) => {
            //     console.error("Error fetching locations:", error);
            // });
    };


    return (
        <div>
            <Header
                title="Kannan Catering Service"
                hideLocation={true}
            />
            {/* <form> */}
            <div className="login-container" style={{ marginTop: "10px" }}>
                <div className='wallet_maincontent'>
                    <h2 className="welcome_text" style={{ marginBottom: "10px" }}>Wallet Information </h2>
                    <div>
                        <MaterialTable
                            title=""
                            columns={columns}
                            data={data}
                            options={{
                                search: true,
                                sorting: true,
                                paging: true,
                                actionsColumnIndex: -1,
                                pageSizeOptions: [5, 10, 20],
                                pageSize: 5,
                                draggable: false,
                                emptyRowsWhenPaging: false,
                                headerStyle: {
                                    backgroundColor: '#EEE',
                                    fontWeight: 'bold'
                                },
                                rowStyle: {
                                    backgroundColor: '#FFF',
                                },
                                // emptyRowsWhenPaging: false,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WalletHistory;