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

    // Function to add a product to the cart based on productId
    const addToCart = (productId) => {
        const updatedFoodData = foodData.map(food => {
            if (food.productId === productId) {
                return { ...food, quantity: food.quantity + 1 };
            }
            return food;
        });
        setFoodData(updatedFoodData);
    };

    // Function to remove a product from the cart based on productId
    const removeFromCart = (productId) => {
        const updatedFoodData = foodData.map(food => {
            if (food.productId === productId && food.quantity > 0) {
                return { ...food, quantity: food.quantity - 1 };
            }
            return food;
        });
        setFoodData(updatedFoodData);
    };


    return (
        <FoodContext.Provider value={{ foodData, setFoodData, addToCart, removeFromCart }}>
            {children}
        </FoodContext.Provider>
    );
};