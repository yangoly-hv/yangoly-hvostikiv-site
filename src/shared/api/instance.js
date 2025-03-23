import axios from "axios";

const instance = axios.create({
    baseURL: "https://yangoly-hvostikiv-admin-production.up.railway.app/api",
    params: {
        populate: "*"
    }
})

export default instance;
