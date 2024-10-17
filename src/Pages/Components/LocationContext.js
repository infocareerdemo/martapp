import React, { createContext, useContext, useState } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);

    return (
        <LocationContext.Provider value={{ selectedLocation, setSelectedLocation }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocationContext = () => useContext(LocationContext);
