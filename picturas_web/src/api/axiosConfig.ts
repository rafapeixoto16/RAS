import axios from 'axios';

const baseURL = 'http://192.168.49.2:80';

const axiosInstance = axios.create({
    baseURL,
});

export default axiosInstance;
