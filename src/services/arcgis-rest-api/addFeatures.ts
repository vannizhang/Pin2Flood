import axios from 'axios';

export interface AddFeatureResult {
    objectId: number;
    success: boolean;
}

interface AddFeaturesRespons {
    addResults: AddFeatureResult[]
}

interface Feature {
    geometry: any;
    attributes: any;
}

interface addFeatureOptions {
    serviceUrl:string;
    feature:Feature;
    token: string;
}

export const addFeature = async({
    serviceUrl,
    feature,
    token
}: addFeatureOptions):Promise<AddFeaturesRespons>=>{

    const requestUrl = serviceUrl + '/addFeatures';

    const bodyFormData = new FormData();
    bodyFormData.append('features', JSON.stringify(feature)); 
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