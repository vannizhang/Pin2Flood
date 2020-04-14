import axios from 'axios';

export interface DeleteFeatureResult {
    objectId: number;
    success: boolean;
    globalId?: string;
}

interface DeleteFeaturesRespons {
    deleteResults: DeleteFeatureResult[]
}

interface deleteFeatureOptions {
    serviceUrl:string;
    ObjectId?:number;
    where?: string;
    token: string;
}

export const deleteFeatures = ({
    serviceUrl,
    ObjectId,
    where,
    token
}:deleteFeatureOptions): Promise<DeleteFeaturesRespons>=>{
    const requestUrl = serviceUrl + '/deleteFeatures';

    const bodyFormData = new FormData();
    bodyFormData.append('rollbackOnFailure', 'false'); 
    bodyFormData.append('f', 'json'); 
    bodyFormData.append('token', token); 

    if(typeof ObjectId === 'number'){
        bodyFormData.append('objectIds', ObjectId.toString()); 
    }

    if(where){
        bodyFormData.append('where', where); 
    }
    
    return new Promise((resolve, reject)=>{

        axios.post(requestUrl, bodyFormData).then(function (response) {
            // console.log(response);
            resolve(response.data);
        }).catch(err=>{
            console.error(err);
            reject(err);
        });
    });
}