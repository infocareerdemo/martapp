import { useEffect, useState } from "react";
import { json, useNavigate } from 'react-router-dom';
// import '.././Header.css'
import { useSidebar } from "../Admin/SidebarContext";
import { useAppContext } from "../Components/AppProvider";
import Select from 'react-select';
import { useLocationContext } from "../Components/LocationContext";
import { CiLocationOn } from "react-icons/ci";
import { BiArrowBack } from "react-icons/bi";

const LocationPage = ({ onLocationChange, hideLocation, title, backicon }) => {
    const { handleCollapsesidebar, handleSidebarToggle } = useSidebar();
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const roleid = localStorage.getItem('roleId');
    const userId = localStorage.getItem("userId");
    const saveduserId = localStorage.getItem("saveduserId");
    const userName = localStorage.getItem("userName");
    const Location = localStorage.getItem("location");
    const { selectedLocation, setSelectedLocation } = useLocationContext();
    const storedLocation = localStorage.getItem("location");

    useEffect(() => {
        GetallLocation();
    }, []);

    const { apiServiceCall } = useAppContext();
    const [token] = useState(localStorage.getItem("token"));
    const [locationData, setLocationData] = useState([]);

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const LocationOptions = locationData.map(item => ({
        value: item.locationId,
        label: item.locationName
    }));
    const handleBackClick = () => {
        navigate(-1); // This will navigate to the previous page
    };
    const handleLocationChange = (selectedOption) => {
        setSelectedLocation(selectedOption);
        onLocationChange(selectedOption); // Notify parent about the change
        console.log('Selected location:', selectedOption.value);
    };

    const GetallLocation = () => {
        const url = `/location/getAllLocation`;
        apiServiceCall('GET', url, null,headers)
            .then((response) => {
                console.log(response, "location");
                setLocationData(response.data);
                if (response.data.length > 0) {
                    const locationString = localStorage.getItem("location");
                    let initialLocation;

                    if (locationString) {
                        const locationObject = JSON.parse(locationString);
                        initialLocation = { value: locationObject.locationId, label: locationObject.locationName };
                    } else {
                        initialLocation = { value: response.data[0].locationId, label: response.data[0].locationName };
                    }

                    setSelectedLocation(initialLocation);
                    onLocationChange(initialLocation);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };



    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <div> 
                <div className="header_container">      
                        <div style={{ width: "50%", display: 'flex', flexDirection: "row", gap: "10PX" }}>
                            <CiLocationOn size={40} color="red"></CiLocationOn>
                            {/* <span>Location {"DLF"}</span> */}
                            <div className="col-lg-4 col-md-12 col-sm-12">
                                <Select
                                    name="Users"
                                    // className="react-select-container"
                                    classNamePrefix="react-select"
                                    options={LocationOptions}
                                    value={selectedLocation}
                                    onChange={handleLocationChange}
                                />
                            </div>

                        </div>
                </div>
          
        </div>
    );
};

export default LocationPage;

