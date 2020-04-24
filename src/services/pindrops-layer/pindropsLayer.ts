
import IPoint from 'esri/geometry/Point';

import {
    PinDropsLayerConfig
} from '../../AppConfig';

import { 
    addFeature,
    AddFeatureResult,
} from '../arcgis-rest-api/addFeatures';

import { 
    deleteFeatures,
} from '../arcgis-rest-api/deleteFeatures';

import { 
    updateFeatures,
    UpdateFeatureResult
} from '../arcgis-rest-api/updateFeatures';

interface savePindropOptions {
    pindropGeometry: IPoint;
    attributes: {
        userId: string;
        userFullName: string;
        compositeId?: number;
        pindropTime: number;
        ObjectId?: number;
    }
}

const Config = {
    serviceUrl: PinDropsLayerConfig.serviceUrl,
    token: ''
};

export const setPindropsLayerConfig = ({
    serviceUrl = '',
    token = ''
}={})=>{
    Config.serviceUrl = serviceUrl;
    Config.token = token;
};

export const savePindrop = async({
    pindropGeometry,
    attributes
}:savePindropOptions): Promise<AddFeatureResult | UpdateFeatureResult>=>{
    
    const { serviceUrl, token } = Config;

    const { 
        userId, 
        userFullName, 
        compositeId, 
        pindropTime, 
        ObjectId 
    } = attributes;

    const { fields } = PinDropsLayerConfig;

    const feature =   {
        "geometry" : pindropGeometry.toJSON(),  
        "attributes" : {
            [fields[0].fieldName] : userId,
            [fields[1].fieldName]: userFullName,
            [fields[2].fieldName] : pindropTime,
            [fields[3].fieldName] : compositeId,
        }
    };

    if(ObjectId){

        feature.attributes.ObjectId = ObjectId;

        const { updateResults } = await updateFeatures({
            serviceUrl,
            token,
            features: [feature]
        });

        return updateResults[0].success ? updateResults[0] : null;

    } else {

        const { addResults } = await addFeature({
            serviceUrl,
            token,
            feature
        });
    
        return addResults[0].success ? addResults[0] : null;
    }


};

export const deletePindrop = async(ObjectId:number)=>{
    const { serviceUrl, token } = Config;

    const { deleteResults } = await deleteFeatures({
        serviceUrl,
        token,
        ObjectId
    });

    return deleteResults[0].success ? deleteResults[0] : null;
};