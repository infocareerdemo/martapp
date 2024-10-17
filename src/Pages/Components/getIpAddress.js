export const getIpAddress = async () => {
    try {
        const response = await fetch('https://api64.ipify.org?format=json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.ip;
    } catch (error) {
        throw new Error('Failed to fetch IP address: ' + error.message);
    }
};