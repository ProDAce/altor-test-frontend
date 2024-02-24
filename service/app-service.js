import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL

export class AppService {
    static getAllData() {
        return axios.get(`${API_URL}`)
    }
}

export default AppService;