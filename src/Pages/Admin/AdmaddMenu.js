import React, { useState, useEffect } from "react";
import Header from "./Header";
import Admsidebar from "./Admsidebar";
import { useSidebar } from "./SidebarContext";
import { useNavigate } from "react-router-dom";
import "./Admstyle.css";
import Select, { components } from "react-select";
import { useAppContext } from "../Components/AppProvider";
import Alert from "../Components/Alert";

const AdmaddMenu = (props) => {
  const { sideBarCollapse } = useSidebar();
  const [roleId] = useState(localStorage.getItem("Role_id"));
  const [userId] = useState(localStorage.getItem("userId"));
  const navigate = useNavigate();

  const [Productname, setProductname] = useState("");
  const [ProductDesc, setProductDesc] = useState("");
  const [price, setPrice] = useState("");
  const [gst, setGst] = useState("");
  const [Selectlocation, setSelectlocation] = useState(null);
  const [locationData, setLocationData] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [token] = useState(localStorage.getItem("token"));
  const [firstSignImg, setfirstSignImg] = useState(null);
  const [firstSignImgPreview, setfirstSignImgPreview] = useState(null);

  const [userAlert, setUserAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertConfirm, setAlertConfirm] = useState(() => null);
  const [alertClose, setAlertClose] = useState(() => null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [categoriesdata, setCategoriesdata] = useState([]);

  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const handleChange = (selected) => {
    setSelectedOptions(selected);
  };

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const { apiServiceCall } = useAppContext();

  useEffect(() => {
    GetallLocation();
    categories();
  }, []);

  // Dummy data
  const validateFields = () => {
    if (Productname.trim() === "") {
      // alert("Product name is required");
      setUserAlert(true);
      setAlertClose(() => () => {
        setUserAlert(false);
      });
      setAlertType("info");
      setAlertMsg("Product name is required");
      return false;
    }
    if (ProductDesc.trim() === "") {
      setUserAlert(true);
      setAlertClose(() => () => {
        setUserAlert(false);
      });
      setAlertType("info");
      setAlertMsg("Product description is required");
      return false;
    }
    if (selectedOptions.length === 0) {
      setUserAlert(true);
      setAlertClose(() => () => {
        setUserAlert(false);
      });
      setAlertType("info");
      setAlertMsg("Please select atleast one category");
      return false;
    }
    if (price === "" || isNaN(price) || parseFloat(price) <= 0) {
      setUserAlert(true);
      setAlertClose(() => () => {
        setUserAlert(false);
      });
      setAlertType("info");
      setAlertMsg("Please enter a valid price greater than zero");
      return false;
    }
    // if (price.trim() === "" || isNaN(price) || parseFloat(price) <= 0) {
    //     // alert("Please enter a valid price greater than zero");
    //     setUserAlert(true)
    //     setAlertClose(() => () => {
    //         setUserAlert(false)
    //     })
    //     setAlertType("info")
    //     setAlertMsg("Please enter a valid price greater than zero");
    //     return false;
    // }
    // if (gst.trim() === "" || isNaN(gst) || parseFloat(gst) < 0) {
    //     // alert("Please enter a valid GST value");
    //     setUserAlert(true)
    //     setAlertClose(() => () => {
    //         setUserAlert(false)
    //     })
    //     setAlertType("info")
    //     setAlertMsg("Please enter a valid GST value");
    //     return false;
    // }
    if (!Selectlocation) {
      // alert("Please select a location");
      setUserAlert(true);
      setAlertClose(() => () => {
        setUserAlert(false);
      });
      setAlertType("info");
      setAlertMsg("Please select a location");
      return false;
    }
    if (!firstSignImg) {
      // alert("Please select a location");
      setUserAlert(true);
      setAlertClose(() => () => {
        setUserAlert(false);
      });
      setAlertType("info");
      setAlertMsg("Please Upload Product Image");
      return false;
    }

    return true;
  };
  const LocationOptions = locationData.map((item) => ({
    value: item.locationId,
    label: `${item.locationName} - ${item.companyName}`,
  }));
  const handleLocationChange = (selectedOption) => {
    setSelectlocation(selectedOption);
    // setLocationData(selectedOption.value);
    console.log("Selected userId:", selectedOption.value);
  };

  const GetallLocation = () => {
    const url = `/location/getAllLocation`;
    apiServiceCall("GET", url, null, headers).then((response) => {
      console.log(response, "location");
      setLocationData(response.data);
    });
  };
  const handleFileInputChange = (event) => {
    event.target.value = "";
  };
  const handlesubmit = () => {
    if (!validateFields()) {
      return;
    }
    const url = "/product/createProductWithCategory";
    const formData = new FormData();
    for (let i = 0; i < selectedOptions.length; i++) {
      formData.append(`categoryIds[${i}]`, selectedOptions[i].value);
    }
    formData.append("productName", Productname);
    formData.append("productDescription", ProductDesc);
    formData.append("productPrice", price);
    // formData.append("productGST", 0);
    formData.append("productActive", true);
    formData.append("location.locationId", Selectlocation.value);
    formData.append("productUpdatedBy", userId);
    formData.append("productImg", firstSignImg);
    apiServiceCall("POST", url, formData, headers)
      .then((response) => {
        console.log(response, "");
        if (response.status === 200) {
          setUserAlert(true);
          setAlertClose(() => () => {
            navigate("/AdmMenu");
          });
          setAlertType("success");
          setAlertMsg("Product saved successfully");
        }
      })
      .catch((error) => {
        console.log(error, "Error in saveUserDetails");
      });
  };

  const handleFirstSign = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    console.log(file, "first sign");
    if (file) {
      const fileName = file.name.toLowerCase();
      if (
        fileName.endsWith(".png") ||
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".jpg")
      ) {
        const fileSizeInKB = file.size / 1024;
        if (fileSizeInKB > 500) {
          setUserAlert(true);
          setAlertClose(() => () => {
            setUserAlert(false);
          });
          setAlertType("info");
          setAlertMsg("File size should not exceed 500KB");
          // setFormErrors({ ...formErrors, firstSignImg: "File size should not exceed 500KB" });
          fileInput.value = "";
          setfirstSignImg(null);
          setfirstSignImgPreview(null);
        } else {
          const response = await imageUploadApi(file);
          console.log(response, "image");
          if (response.data === true) {
            setfirstSignImg(file);
            const reader = new FileReader();
            reader.onload = (e) => {
              setfirstSignImgPreview(e.target.result);
            };
            reader.readAsDataURL(file);
            setFormErrors({ ...formErrors, firstSignImg: "" });
          } else {
            fileInput.value = "";
            setfirstSignImg(null);
            setfirstSignImgPreview(null);
            setUserAlert(true);
            setAlertClose(() => () => {
              setUserAlert(false);
            });
            setAlertType("info");
            setAlertMsg("Invalid Image");
            // setFormErrors({ ...formErrors, firstSignImg: "Invalid Image" });
          }
        }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          firstSignImg:
            "Invalid file format. Please upload a .png, .jpeg, or .jpg file.",
        });
        setfirstSignImg(null);
        setfirstSignImgPreview(null);
      }
    }
  };
  const imageUploadApi = async (file) => {
    try {
      const url = "/product/validateImage";
      const data = new FormData();
      data.append("image", file);
      const response = await apiServiceCall("POST", url, data, headers);
      return response;
    } catch (error) {
      return { success: false, error: "Error uploading image" };
    }
  };

  const categories = () => {
    const url = `/categories/getAllCategoriesWithProducts`;
    const data = {};
    apiServiceCall("GET", url, data, headers)
      .then((response) => {
        const arr = response.data.map((e) => {
          return { value: e.categoryId, label: e.categoryName };
        });
        console.log(arr, "GET ALL Categories");
        setCategoriesdata(arr);
      })
      .catch((error) => {
        console.log("Error fetching menu:", error);
      });
  };
  const placeholderText = () => {
    if (selectedOptions.length > 3) {
      const displayedOptions = selectedOptions
        .slice(0, 2)
        .map((option) => option.label)
        .join(", ");
      return `${displayedOptions}, ...`;
    } else if (selectedOptions.length > 0) {
      return selectedOptions.map((option) => option.label).join(", ");
    }
    return "Select options...";
  };

  // Custom Styles to restrict height and show ellipsis
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "transparent"
        : provided.backgroundColor,
      color: state.isSelected ? "#000" : provided.color,
      display: "flex",
      alignItems: "center",
    }),
    control: (provided) => ({
      ...provided,
      width: "100%",
      height: 43,
      overflow: "auto",
    }),
    valueContainer: (provided) => ({
      ...provided,
      //   display: "flex",
      //   flexWrap: "nowrap",
      overflow: "auto",
      //   textOverflow: "ellipsis",
      //   whiteSpace: "nowrap",
    }),
    placeholder: (provided) => ({
      ...provided,
      whiteSpace: "nowrap",
    }),
  };

  const CheckboxOption = ({ children, ...props }) => {
    return (
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{children}</label>
      </components.Option>
    );
  };

  return (
    <div>
      <Header />
      <Admsidebar />
      <div className="page_container">
        <div
          className={
            sideBarCollapse ? "main_content" : "main_content collapsed"
          }
        >
          <div className="Summary_card">
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h4>Add Product</h4>
              </div>
            </div>
            <div className="row" style={{ marginTop: "20px", rowGap: "10px" }}>
              <div className="col-lg-4 col-md-12">
                <div className="input_contanier">
                  <label className="admaddmenu_label">
                    Product Name{" "}
                    <span className="required" style={{ color: "red" }}>
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="input_box"
                    placeholder="Product Name"
                    maxLength={20}
                    value={Productname}
                    // // readOnly={kycver === true}
                    // onChange={(e) => {
                    //     setProductname(e.target.value)
                    // }}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const regex = /^[a-zA-Z\s]*$/;
                      if (regex.test(inputValue)) {
                        setProductname(inputValue);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-4 col-md-12">
                <div className="input_contanier">
                  <label className="admaddmenu_label">
                    Product Desciption{" "}
                    <span className="required" style={{ color: "red" }}>
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="input_box"
                    placeholder="Product Desciption"
                    maxLength={100}
                    value={ProductDesc}
                    onChange={(e) => {
                      setProductDesc(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-4 col-md-12">
                <div className="input_contanier">
                  <label className="admaddmenu_label">
                    Price{" "}
                    <span className="required" style={{ color: "red" }}>
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="input_box"
                    placeholder="Price"
                    maxLength={30}
                    value={price}
                    // onChange={(e) => {
                    //     setPrice(e.target.value)
                    // }}
                    onChange={(e) => {
                      let input = e.target.value.replace(/\D/g, "");
                      input = input.slice(0, 4);
                      setPrice(input);
                    }}
                  />
                </div>
              </div>
              {/* <div className="col-lg-4 col-md-12">
                                <div className='input_contanier'>
                                    <label className="admaddmenu_label">GST Percentage<span className='required' style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className='input_box'
                                        placeholder="GST"
                                        maxLength={2}
                                        value={gst}
                                        onChange={(e) => {
                                            let input = e.target.value.replace(/\D/g, '');
                                            input = input.slice(0, 2);
                                            setGst(input);
                                        }}
                                    />
                                </div>
                            </div> */}
              <div className="col-lg-4 col-md-12">
                <div className="input_contanier">
                  <label className="admaddmenu_label">
                    Location{" "}
                    <span className="required" style={{ color: "red" }}>
                      *
                    </span>
                  </label>
                  <Select
                    name="Users"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    options={LocationOptions}
                    value={LocationOptions.find(
                      (option) => option.value === locationData
                    )}
                    onChange={handleLocationChange}
                  />
                </div>
              </div>
              <div className="col-lg-4 col-md-12">
                <div className="input_contanier">
                  <label className="admaddmenu_label">
                    Product Image
                    <span className="required" style={{ color: "red" }}>
                      *
                    </span>
                  </label>

                  <input
                    id="firstSignImg"
                    name="firstSignImg"
                    type="file"
                    accept="image/*"
                    onChange={handleFirstSign}
                    onClick={handleFileInputChange}
                    className="input_box"
                  />
                  <span style={{ fontSize: "10px" }}>
                    Note (.png,.jpeg, or .jpg file-Max Size 500KB)
                  </span>
                </div>

                {firstSignImgPreview && (
                  <div className="preview_card_img">
                    <img
                      src={firstSignImgPreview}
                      alt="Selected"
                      className="bondimgPreview"
                    />
                  </div>
                )}
              </div>
              <div className="col-lg-4 col-md-12">
                <div className="input_contanier">
                  <label className="admaddmenu_label">
                    Category
                    <span className="required" style={{ color: "red" }}>
                      *
                    </span>
                  </label>
                  <Select
                    options={categoriesdata}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    components={{ Option: CheckboxOption }}
                    onChange={handleChange}
                    value={selectedOptions}
                    styles={customStyles}
                    placeholder={placeholderText}
                  />
                </div>
              </div>
            </div>
            <button
              className="btnmenu"
              style={{ marginTop: "40px" }}
              onClick={handlesubmit}
            >
              Submit
            </button>
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

export default AdmaddMenu;
