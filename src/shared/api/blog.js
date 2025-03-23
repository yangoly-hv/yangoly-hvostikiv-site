import instance from "./instance";

export const getAllBlogItems = async(locale)=> {
    const {data} = await instance.get("/blogs", {
        params: {
            locale,
        }
    });

    return data.data;
}

export const getBlogItemById = async(id, locale)=> {
    const {data} = await instance.get(`/blogs/${id}`, {
        params: {
            locale,
        }
    });

    return data.data;
}
