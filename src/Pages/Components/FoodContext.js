import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppContext } from './AppProvider';

const FoodContext = createContext();

export const useFoodContext = () => useContext(FoodContext);

export const FoodProvider = ({ children }) => {
    const { apiServiceCall } = useAppContext();

    // useEffect(() => {
    //     getFoodItems()
    // }, [])

    const getFoodItems = () => {
        const method = 'Get';
        const url = `/food/items`;
        const data = null;
        apiServiceCall(method, url, data, null)
            .then((response) => {
                console.log(response);
              
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }

    const [foodData, setFoodData] = useState([]);
    
    const addToCart = (index) => {
        const updatedFoodData = [...foodData];
        updatedFoodData[index].quantity += 1;
        setFoodData(updatedFoodData);
    };

    const removeFromCart = (index) => {
        const updatedFoodData = [...foodData];
        if (updatedFoodData[index].quantity > 0) {
            updatedFoodData[index].quantity -= 1;
            setFoodData(updatedFoodData);
        }
    };

    return (
        <FoodContext.Provider value={{ foodData, setFoodData, addToCart, removeFromCart }}>
            {children}
        </FoodContext.Provider>
    );
};