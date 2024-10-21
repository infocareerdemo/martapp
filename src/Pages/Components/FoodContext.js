import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppContext } from './AppProvider';

const FoodContext = createContext();

export const useFoodContext = () => useContext(FoodContext);

export const FoodProvider = ({ children }) => {
    const { apiServiceCall } = useAppContext();


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