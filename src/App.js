import './App.css';
import './theme.css';
import { BrowserRouter as Router, Routes, Route, HashRouter } from 'react-router-dom';
import { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import FoodList from './Pages/Menu';
import UserForm from './Pages/UserForm';
import { FoodProvider } from './Pages/Components/FoodContext';
import { useAppContext } from './Pages/Components/AppProvider';
import { Modal } from 'react-bootstrap';
import { RotatingLines,Triangle } from 'react-loader-spinner';
import AdmMenu from './Pages/Admin/AdmMenu';
import { SidebarProvider } from './Pages/Admin/SidebarContext';
import AdmLogin from './Pages/Admin/AdmLogin';
import AdmaddMenu from './Pages/Admin/AdmaddMenu';
import AdmupdateMenu from './Pages/Admin/AdmupdateMenu';
// import Register from './Pages/Register';
import useWebSocket from './Pages/Components/useWebSocket';
import AdmMessage from './Pages/Admin/AdmMessage';
import { toast } from 'react-toastify';
import MyOrders from './Pages/Components/MyOrders';
import { LocationProvider } from './Pages/Components/LocationContext';
import Header from './Pages/Admin/Header';
import OrderPlaced from './Pages/Components/OrderPlaced';
import TodayOrder from './Pages/Admin/TodayOrder';
import OrderBasedOnUser from './Pages/Admin/OrderBasedOnUser';
import AdminDashboard from './Pages/Admin/adminDashboard';
import OrderSummary from './Pages/OrderSummary';
import OrderHistory from './Pages/Components/OrderHistory';
import LocationPage from './Pages/Components/locationpage';
import UserInfo from './Pages/UserInfo';
import Report from './Pages/Admin/Report';
import MyAccount from './Pages/Components/MyAccount';
import Forgotpassword from './Pages/Forgotpassword';
import QrcodeDownload from './Pages/Admin/QrcodeDownload';
import AdminLocation from './Pages/Admin/AdminLocation';
import AdmAddLocation from './Pages/Admin/AdmAddLocation';
import AdmupdLocation from './Pages/Admin/AdmupdLocation';
import ChangePIN from './Pages/Components/ChangePIN';
import UserLogin from './Pages/User/UserLogin';
import UserFoodList from './Pages/User/UserFoodList';
import UserCard from './Pages/User/UserCard';
import OrderCardSummary from './Pages/OrderCardSummary';
import ImportFile from './Pages/CompanyAdmin/ImportFile';
import UserList from './Pages/CompanyAdmin/UserList';
import AddUserByAdmin from './Pages/CompanyAdmin/AddUserByAdmin';
import UpdateUserByAdmin from './Pages/CompanyAdmin/UpdateUserByAdmin';
import UploadMultipleUser from './Pages/CompanyAdmin/UploadMultipleUser';
import { Category } from '@mui/icons-material';
import CategoryList from './Pages/Admin/CategoryList';
import AddCategoryList from './Pages/Admin/AddCategoryList';
import UpdateCategory from './Pages/Admin/UpdateCategory';

function App() {
  const { appContextValue } = useAppContext();
  const { notificationMsg, setNotificationMsg } = useWebSocket();
  const roleId = localStorage.getItem("roleId");

  useEffect(() => {
    if (notificationMsg) {
      toast.info(notificationMsg, {
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setNotificationMsg(null);
    }
  }, [notificationMsg, setNotificationMsg]);



  return (
    <div className="App">
      <HashRouter>
        <FoodProvider>
          <LocationProvider>
            <SidebarProvider>
              {/* <Header /> */}
              <Routes>
                {/* -------------- User-------------- */}
                <Route path="/" element={<UserLogin />} />
                <Route path="/UserFoodList" element={<UserFoodList />} />
                <Route path="/FoodList" element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "2" ? <FoodList /> : <UserLogin />} />
                <Route path="/UserFoodList" element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "2" ? <UserFoodList /> : <UserLogin />} />
                <Route path="/UserCard" element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "2" ? <UserCard /> : <UserLogin />} />
                <Route path="/OrderSummary" element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "2" ? <OrderSummary /> : <UserLogin />} />
                <Route path="/OrderCardSummary" element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "2" ? <OrderCardSummary /> : <UserLogin />} />
                <Route path="/ForgetPassword" element={<Forgotpassword></Forgotpassword>} />

                <Route path="/MyOrders" element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "2" ? <MyOrders /> : <UserLogin />} />
                <Route path="/OrderPlaced" element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "2" ? <OrderPlaced /> : <UserLogin />} />
                <Route path="/MyAccount" element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "2" ? <MyAccount /> : <UserLogin />} />
                <Route path="/OrderHistory" element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "2" ? <OrderHistory /> : <UserLogin />} />
                <Route path="/ChangePin" element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "2" ? <ChangePIN /> : <ChangePIN />} />

                {/* -------------- Admin-------------- */}

                <Route path="/AdminLogin" element={<AdmLogin />} />
                <Route path="/AdminLocation" element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "1" ? <AdminLocation /> : <AdmLogin />} />
                <Route path="/AdmMenu" element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "1" ? <AdmMenu /> : <AdmLogin />} />
                <Route path="/AdmaddMenu" element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "1" ? <AdmaddMenu /> : <AdmLogin />} />
                <Route path="/AdmMessage" element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "1" ? <AdmMessage /> : <AdmLogin />} />
                <Route path="/AdminDashboard" element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "1" ? <AdminDashboard /> : <AdmLogin />} />
                <Route path="/AdmupdLocation" element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "1" ? <AdmupdLocation /> : <AdmLogin />} />
                <Route path='/AdmAddLocation' element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "1" ? <AdmAddLocation /> : <AdmLogin />} />
                <Route path='/AdmupdateMenu' element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "1" ? <AdmupdateMenu /> : <AdmLogin />} />
                <Route path='/QrcodeDownload' element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "1" ? <QrcodeDownload /> : <AdmLogin />} />
                {/* <Route path="/AdmupdateMenu" element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "1" ? <AdmupdateMenu /> : <FoodList />} /> */}
                <Route path='/TodayOrder' element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "1" ? <TodayOrder /> : <AdmLogin />} />
              
                <Route path='/OrderBasedOnUser' element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "1" ? <OrderBasedOnUser /> : <AdmLogin />} />
                <Route path='/Report' element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "1" ? <Report /> : <AdmLogin />} />
                <Route path='/CategoryList' element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "1" ? <CategoryList/> : <AdmLogin />} />
                <Route path='/AddCategoryList' element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "1" ? <AddCategoryList /> : <AdmLogin />} />
                <Route path='/UpdateCategory' element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "1" ? <UpdateCategory /> : <AdmLogin />} />

         {/* -------------- Company Admin-------------- */}
                <Route path='/ImportFile' element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "3" ? <ImportFile></ImportFile> : <AdmLogin />} />
                <Route path='/UserList' element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "3" ? <UserList/> : <AdmLogin />} />
                <Route path='/AddUserByAdmin' element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "3" ? <AddUserByAdmin/> : <AdmLogin />} />
                <Route path='/UpdateUserByAdmin' element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "3" ? <UpdateUserByAdmin/> : <AdmLogin />} />
                <Route path='/UploadMultipleUser' element={roleId !== null && roleId !== undefined && roleId !== "" && roleId === "3" ? <UploadMultipleUser/> : <AdmLogin />} />
              </Routes>
            </SidebarProvider>
          </LocationProvider>
        </FoodProvider>
      </HashRouter>

      <div>
        <Modal className='loader_modal' centered show={appContextValue.value}>
          <Triangle
            strokeColor="#FF5722"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={appContextValue.value}
          />
        </Modal>
      </div>
    </div>
  );
}

export default App;
