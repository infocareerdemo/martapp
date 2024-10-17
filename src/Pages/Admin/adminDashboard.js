import React, { useEffect, useState } from "react";
import { Card, Typography, Grid, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CancelIcon from '@mui/icons-material/Cancel';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Header from "./Header";
import Admsidebar from "./Admsidebar";
import { useSidebar } from "./SidebarContext";
import { useAppContext } from "../Components/AppProvider";
import useWebSocket from "../Components/useWebSocket";
// import Stomp from 'stompjs';
// import SockJS from 'sockjs-client';

const AdminDashboard = () => {
    const { sideBarCollapse } = useSidebar();
    const { apiServiceCall } = useAppContext();

    const { totalOrderDetailsArray, setTotalOrderDetailsArray, locationOrderDetailsArray, setLocationOrderDetailsArray, totalCount, setTotalCount, } = useWebSocket();

    const [token] = useState(localStorage.getItem("token"));

    const [location, setLocation] = useState('')

    const placeholderImage = "https://placehold.co/400";

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
        getLocationItem(event.target.value)
    };

    const [LocationOptions, setLocationOptions] = useState([]);

    const headers = {
        Authorization: `Bearer ${token}`,
    };


    useEffect(() => {
        GetallLocation();
    }, []);

    const GetallLocation = () => {
        const url = `/location/getAllLocation`;
        apiServiceCall('GET', url, null,headers)
            .then((response) => {
                console.log(response.data, "location");
                setLocationOptions(response.data);
                if (response.data.length > 0) {
                    setLocation(response.data[0].locationId);
                    getLocationItem(response.data[0].locationId)
                }
            })
            .catch((error) => {
                console.error("Error fetching locations:", error);
            });
    };

    const getLocationItem = (id) => {
        const url = `/order/dashboard?locationId=${id}`;
        apiServiceCall('GET', url, null, headers)
            .then((response) => {
                const data = response.data;

                setTotalCount(data.totalOrdersCount);

                setTotalOrderDetailsArray(data.totalOrderDetails);

                setLocationOrderDetailsArray(Object.keys(data.locationOrderDetails).map(key => ({
                    name: key,
                    value: data.locationOrderDetails[key]
                })));
            })
            .catch((error) => {
                console.error("Error fetching locations:", error);
            });
    };

    const base64ToImageUrl = (base64String) => {
        const binaryString = window.atob(base64String);
        const binaryLen = binaryString.length;
        const bytes = new Uint8Array(binaryLen);
        for (let i = 0; i < binaryLen; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes.buffer], { type: 'image/jpeg' });
        return URL.createObjectURL(blob);
    };

    return (
        <div>
            <Header />
            <Admsidebar />
            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '30%', padding: '20px', borderRight: '1px solid #ddd' }}>
                            <Typography variant="h6" gutterBottom>
                                Total Orders
                            </Typography>
                            <Card style={{ marginBottom: '20px', padding: '10px 20px', display: 'flex', alignItems: 'center' }}>
                                <div style={{ marginRight: '20px' }}><LocalShippingIcon style={{ fontSize: 50, color: '#FF6384' }} /></div>
                                <div>
                                    <Typography variant="h6">{totalCount}</Typography>
                                    <Typography color="textSecondary">Total Orders</Typography>
                                </div>
                            </Card>

                            {totalOrderDetailsArray.map((item, index) => (
                                <Card style={{ marginBottom: '20px', padding: '10px 20px', display: 'flex', alignItems: 'center' }}>
                                    <div style={{ marginRight: '20px' }}>
                                        <img
                                            src={item.products.productImage ? base64ToImageUrl(item.products.productImage) : placeholderImage}
                                            style={{ height: "50px", width: "50px" }}
                                            alt={item.products.productName || "Placeholder"}
                                        />
                                    </div>
                                    <div>
                                        <Typography variant="h6">{item.count}</Typography>
                                        <Typography color="textSecondary">{item.products.productName}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {/* {item.products.location.locationName} ({item.products.location.companyName}) */}

                                            {/* {item.products.location.locationName} */}
                                        </Typography>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div style={{ width: '70%', padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <div>
                                    <Typography variant="h6" gutterBottom>
                                        Orders by Location
                                    </Typography>
                                </div>
                                <Select
                                    value={location}
                                    onChange={handleLocationChange}
                                    style={{ width: 300 }}
                                    MenuProps={{ PaperProps: { style: { maxHeight: 224 } } }}
                                >
                                    {LocationOptions.map(option => (
                                        <MenuItem key={option.locationId} value={option.locationId}>
                                            {option.locationName} ({option.companyName})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>

                            <TableContainer component={Paper}>
                                {locationOrderDetailsArray.length > 0 ? (
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Items</TableCell>
                                                <TableCell align="center">Quantity</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {locationOrderDetailsArray.map((order, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{order.name}</TableCell>
                                                    <TableCell align="center">{order.value}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div style={{ padding: "16px", textAlign: "center" }}>
                                        No items ordered
                                    </div>
                                )}
                            </TableContainer>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;