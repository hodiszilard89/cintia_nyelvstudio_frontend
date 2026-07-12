import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://nyelviskola-env-2.eba-unsp3j22.eu-north-1.elasticbeanstalk.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient;