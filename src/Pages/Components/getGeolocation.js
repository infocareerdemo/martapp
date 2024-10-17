export const getGeolocation = () => {
    return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    // Handle the case when user declines location access
                    resolve({
                        latitude: '',
                        longitude: '',
                    });
                }
            );
        } else {
            reject(new Error('Geolocation is not available in your browser.'));
        }
    });
};