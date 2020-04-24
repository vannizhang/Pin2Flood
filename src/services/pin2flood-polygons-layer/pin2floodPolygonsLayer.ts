
import { 
    addFeature
} from '../arcgis-rest-api/addFeatures';

import { 
    deleteFeatures,
} from '../arcgis-rest-api/deleteFeatures';

import { 
    updateFeatures,
    UpdateFeatureResult
} from '../arcgis-rest-api/updateFeatures';

import {
    Pin2FloodPolygonsLayerConfig
} from '../../AppConfig';

// import IPolygon from 'esri/geometry/Polygon';

interface savePin2FloodPolygonOptions {
    geometry: Object;
    attributes: {
        userId: string;
        userFullName: string;
        compositeId: number;
        pindropId: number;
        pindropTime: number;
        ObjectId?: number;
    }
}

const Config = {
    serviceUrl: '',
    token: ''
};

export const setPin2FloodPolygonsLayerConfig = ({
    serviceUrl = '',
    token = ''
}={})=>{
    Config.serviceUrl = serviceUrl;
    Config.token = token;
};

export const savePin2FloodPolygon = async({
    geometry,
    attributes
}:savePin2FloodPolygonOptions)=>{

    const { serviceUrl, token } = Config;

    const { 
        userId, 
        userFullName, 
        compositeId, 
        pindropTime, 
        pindropId, 
        ObjectId 
    } = attributes;

    const { fields } = Pin2FloodPolygonsLayerConfig;

    const feature =   {
        "geometry" : geometry,
        "attributes" : {
            [fields[0].fieldName]: userId,
            [fields[1].fieldName]: userFullName,
            [fields[2].fieldName]: pindropId,
            [fields[3].fieldName]: pindropTime,
            [fields[4].fieldName]: compositeId,
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

// delete pin2flood polygon using ObjectId for associated pindrop feature
export const deletePin2FloodPolygon = async(ObjectId:number)=>{
    const { serviceUrl, token } = Config;

    const { fields } = Pin2FloodPolygonsLayerConfig;

    const where = `${fields[2].fieldName}=${ObjectId}`;

    const { deleteResults } = await deleteFeatures({
        serviceUrl,
        token,
        where
    });

    return deleteResults[0].success ? deleteResults[0] : null;
};