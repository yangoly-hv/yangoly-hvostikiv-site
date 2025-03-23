import instance from "./instance";

export const getAllReports = async(locale)=> {
    const {data} = await instance.get("/reports", {
        params: {
            locale,
        }
    });

    return data.data;
}

export const getReportById = async(id, locale)=> {
    const {data} = await instance.get(`/reports/${id}`, {
        params: {
            locale,
        }
    });

    return data.data;
}
