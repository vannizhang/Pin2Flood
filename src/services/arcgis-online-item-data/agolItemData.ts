import axios from 'axios';

export interface AgolItem {
    id: string;
    title: string;
    type: string;
    owner?: string;
    typeKeywords?: string[];
    description?: string;
    snippet?: string;
    documentation?: string;
    extent?: number[][];
    categories?: string[];
    culture?: string;
    properties?: any;
    url?: string;
    tags?: string[];
    thumbnail?: string;
    [key: string]: any;
};

export const getAgolItemData = async({
    itemId='',
    token='',
    customHostUrl=''
}):Promise<AgolItem>=>{

    if(!itemId || !token || !customHostUrl){
        return null;
    }

    try {
        // e.g. https://vannizhang.maps.arcgis.com/sharing/rest/content/items/90f7aa6e10654bc09cc3e4b20f61b384?f=json&token=yv5oorhm_daHkX9YZiWZJibtWtUQuhA7A-Dr9avI9ObKMpRFAzXMAIG30pBRPgFJpsbxIrEgC87-BP_CJo_4ePR9luq3RAgD3QRLEKUH92CrnJIjU9kqg3QrazBkftbOyMl7gQ7FHYgSHWawkBvmD52cq6ZPyBUQQPOClYqACzGOHirmu7-3P-VVc-O8lYqeLqQGpf1DpdEf-XI4HGKA5HcT9Fqd-KUk167JVBt85pY.
        const requestUrl = `${customHostUrl}/sharing/rest/content/items/${itemId}?f=json&token=${token}`;

        const { data } = await axios.get(requestUrl) as AgolItem;

        if(data.error){
            console.error(data.error);
        }

        return data;

    } catch(err){
        console.error(err);
    }
}