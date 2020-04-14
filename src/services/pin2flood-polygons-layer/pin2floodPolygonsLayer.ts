
import { 
    addFeature
} from '../arcgis-rest-api/addFeatures';

import { 
    deleteFeatures,
} from '../arcgis-rest-api/deleteFeatures';

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

    const { userId, userFullName, compositeId, pindropTime, pindropId } = attributes;

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

    const { addResults } = await addFeature({
        serviceUrl,
        token,
        feature
    });

    return addResults[0].success ? addResults[0] : null;
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