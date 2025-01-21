import axios from 'axios';

const client = axios.create({
    baseURL: 'http://103.171.85.186'
});

export default client;