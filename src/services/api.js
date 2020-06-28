import Axios from 'axios';

const api = Axios.create({
    baseURL: "http://192.168.14.118:3333"
})

export default api;