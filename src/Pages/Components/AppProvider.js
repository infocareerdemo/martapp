import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';
import Alert from './Alert';
import { REACT_APP_BASE_URL } from './Config';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const baseURL = REACT_APP_BASE_URL;

  const [value, setValue] = useState(false);
  const [userAlert, setUserAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("");
  const [alertTittle, setAlertTittle] = useState("");
  const [alertClose, setAlertClose] = useState(() => null);

  const updateValue = (newValue) => {
    setValue(newValue);
  };

  const appContextValue = {
    value,
    updateValue,
  };

  const handleApiResponse = (response) => {
    const authorizationHeader = response.headers['authorization'];
    if (authorizationHeader) {
      const [bearer, token] = authorizationHeader.split(' ');
      if (bearer === 'Bearer') {
        localStorage.setItem("token", token);
      }
    }
    return response;
  };
  const handleApiError = (error) => {
    console.log(error, "i");
  
    if (error.response?.status === 403 || error.response?.status === 404 || error.response?.status === 400) {
      const errorCode = error.response?.data?.errorCode;
      if (errorCode === 1001 || errorCode === 1000) {
        const errorMessage = error.response?.data?.message;
        setUserAlert(true);
        setAlertClose(() => () => {
          setUserAlert(false);
        });
        setAlertType("error");
        setAlertMsg(errorMessage);
      } 
      // else {
      //   setUserAlert(true);
      //   setAlertTittle("Info");
      //   setAlertMsg("Your current session has been expired. Please log in again.");
      //   setAlertType("info");
      //   setAlertClose(() => () => {
      //     window.location.href = "/";
      //     localStorage.clear();
      //   });
      // }
    }
  
    throw error;
  };
  
  // const handleApiError = (error) => {
  //   console.log(error,"i")

  //   if (error.response?.status === 401 && error.response?.data?.errorCode === 1001) {
  //     const errorMessage = error.response?.data?.message
  //     setUserAlert(true)
  //     setAlertClose(() => () => {
  //       setUserAlert(false);
  //     })
  //     setAlertType("error")
  //     setAlertMsg(errorMessage);
  //   }
  //    if (error.response?.data?.status === 401) {
  //     setUserAlert(true);
  //     setAlertTittle("Info");
  //     setAlertMsg("Your current session has been expired. Please log in again.");
  //     setAlertType("info");
  //     setAlertClose(() => () => {
  //       window.location.href = "/";
  //       localStorage.clear();
  //     });
  //   }

  //   throw error;
  // };


  const apiServiceCall = async (method, url, data, headers) => {
    updateValue(true);
    try {
      const config = {
        method,
        url: baseURL + url,
        headers,
      };

      if (method === 'GET' || method === "Get") {
        config.params = data;
      } else {
        config.data = data;
      }

      const response = await axios(config);
      updateValue(false);
      return handleApiResponse(response);
    } catch (error) {
      updateValue(false);
      handleApiError(error);
    }
  };

  return (
    <AppContext.Provider value={{ appContextValue, apiServiceCall }}>
      {children}
      <Alert
        title={alertTittle}
        msg={alertMsg}
        open={userAlert}
        type={alertType}
        onClose={alertClose}
      />
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};