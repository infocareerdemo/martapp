let baseURL;

switch (process.env.REACT_APP_ENVIRONMENT) {
    case "production":
         baseURL = "https://kcs.infocareerindia.com/food/api/v1";
        break;
    case "test":
        baseURL = "https://foodqa.infocareerindia.com/food/api/v1";
        break;
    case "dev":
        baseURL = "http://localhost:7080/api/v1";
        break;
    case "local":
        baseURL = "http://192.168.3.107:7080/api/v1";
        break;
        case "manilocal":
            baseURL = "http://192.168.236.250:7080/api/v1";
            break;

    default:
        baseURL = "http://localhost:7080/api/v1";
}

export const REACT_APP_BASE_URL = baseURL;


