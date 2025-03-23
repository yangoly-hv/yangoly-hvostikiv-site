import instance from "./instance";

export const getAboutFoundationPage = async locale => {
    const {data} = await instance.get("/about-foundation", {
        params: {
            locale,
        }
    });

    return data.data;
}
