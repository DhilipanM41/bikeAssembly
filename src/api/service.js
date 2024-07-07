import axios from "axios";

const axiosService = async (methodType, endpoint, data = {}) => {
    try {
        let axiosConfig = {
            url: "http://localhost:8080" + endpoint,
            method: methodType,
            headers: {
                "authorization": "Bearer " + sessionStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            data: data
        };

        let response = await axios(axiosConfig);

        return response;
    } catch (error) {
        console.log(error);
    }
}

export const postLoginData = async (payload) => {
    let resp = await axiosService("POST", "/login", payload);
    return resp;
}

export const getBikeDetailsData = async (payload) => {
    let resp = await axiosService("POST", "/getbikes", payload);
    return resp;
}

export const postBikeAssemblyData = async (payload) => {
    let resp = await axiosService("POST", "/mapBikeAssembly", payload);
    return resp;
}

export const postBikeAssemblyStatus = async (payload) => {
    let resp = await axiosService("POST", "/updateAssemblyStatus", payload);
    return resp;
}

export const getAllBikeAssemblyDetails = async (payload) => {
    let resp = await axiosService("POST", "/getAllAssemblyDetails", payload);
    return resp;
}