import instance from "./instance";

export const getAllAnimals = async(locale)=> {
    const {data} = await instance.get("/animals", {
        params: {
            locale,
        }
    });

    return data.data;
}

export const getAnimalById = async(id, locale)=> {
    const {data} = await instance.get(`/animals/${id}`, {
        params: {
            locale,
        }
    });

    return data.data;
}
