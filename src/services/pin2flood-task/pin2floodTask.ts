import axios from 'axios';
import IPoint from 'esri/geometry/Point';
import IPolygon from 'esri/geometry/Polygon';

import {
    FloodInnudationPolygonsLayerConfig
} from '../../AppConfig';

interface Pin2FloodPolygonFeature {
    geometry?: IPolygon;
    attributes: {
        objectid: number;
        streamid: number;
        hid: number;
        compositeid: number;
        h: number;
        maxq: number;
        resolution: number;
        hucid: string;
    };
};

interface pin2floodOptions {
    pindropGeometry:IPoint;
};

const getRequestUrl = ()=>{
    return FloodInnudationPolygonsLayerConfig.serviceUrl + '/query';
}

const fetchPin2FloodPolygon = async(objectid:number):Promise<Pin2FloodPolygonFeature>=>{
    if(!objectid){
        return null;
    }

    const requestUrl = getRequestUrl();

    const params = {
        where: `objectid=${objectid}`,
        returnGeometry: true,
        outFields: '*',
        f: 'json'
    };

    try {
        const { data } = await axios.get(requestUrl, { params });

        const { features } = data;
        
        return features && features[0] ? features[0] : null;

    } catch(err){   
        console.error(err);
    }
}

export const pin2Flood = async({
    pindropGeometry
}:pin2floodOptions):Promise<Pin2FloodPolygonFeature>=>{

    const requestUrl = getRequestUrl();

    const fieldNameForHid = FloodInnudationPolygonsLayerConfig.fields[0].name;

    const params = {
        where: '1=1',
        geometry: JSON.stringify(pindropGeometry.toJSON()),
        geometryType: 'esriGeometryPoint',
        spatialRel: 'esriSpatialRelIntersects',
        returnGeometry: false,
        outFields: 'objectid',
        orderByFields: fieldNameForHid,
        // resultRecordCount: 1,
        f: 'json'
    };

    try {
        const { data } = await axios.get(requestUrl, { params });

        const features:Pin2FloodPolygonFeature[] = data.features;
        
        if(!data || !features || !features.length){
            console.log('no pin2flood polygon is found');
            return null;
        }

        const objectid = features[0].attributes.objectid;

        const pin2floodPolygon = await fetchPin2FloodPolygon(objectid);

        return pin2floodPolygon;

    } catch(err){   
        console.error(err);
    }
    
};