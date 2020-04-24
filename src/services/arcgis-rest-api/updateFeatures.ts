import axios from 'axios';

export interface UpdateFeatureResult {
    objectId: number;
    success: boolean;
}

interface UpdateFeaturesRespons {
    updateResults: UpdateFeatureResult[]
}

interface Feature {
    geometry: any;
    attributes: any;
}

interface updateFeatureOptions {
    serviceUrl:string;
    features:Feature[];
    token: string;
}

export const updateFeatures = async({
    serviceUrl,
    features,
    token
}: updateFeatureOptions):Promise<UpdateFeaturesRespons>=>{

    const requestUrl = serviceUrl + '/updateFeatures';

    const bodyFormData = new FormData();
    bodyFormData.append('features', JSON.stringify(features)); 
    bodyFormData.append('rollbackOnFailure', 'false'); 
    bodyFormData.append('f', 'json'); 
    bodyFormData.append('token', token); 

    try {
        const { data } = await axios.post(requestUrl, bodyFormData);
        return data;

    } catch(err){
        console.error(err);
    }
}