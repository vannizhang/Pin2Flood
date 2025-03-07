
// import axios from 'axios';

import IExtent from 'esri/geometry/Extent';

import {
    NationalWaterModelFloodPolysConfig
} from '../../AppConfig';

interface fetchMaxFloodPredictionPolygonsOptions {
    mapExtent:IExtent;
};

interface MaxFloodPredictionQueryResult {
    attributes: {
        b_streamid: number;
        max_hid: number
    }
};

const generateCompositeID = (streamid:number, hid:number)=>{
    const compositeID = ( (streamid * 100) + hid );
    return compositeID;
};

export const fetchCompositeIds4MaxFloodPredictionPolygons = async({
    mapExtent
}: fetchMaxFloodPredictionPolygonsOptions):Promise<number[]>=>{

    const { serviceUrl, fields } = NationalWaterModelFloodPolysConfig;

    const fieldNameForHid = fields[0].name;
    const fieldNameForCompositeId = fields[1].name;
    const fieldNameForStreamId = fields[2].name;

    const requestUrl = serviceUrl + '/query';

    const params = {
        where: '1=1',
        geometry: JSON.stringify(mapExtent.toJSON()),
        geometryType: 'esriGeometryEnvelope',
        spatialRel: 'esriSpatialRelIntersects',
        outFields: '*',
        returnGeometry: 'false',
        groupByFieldsForStatistics: fieldNameForStreamId,
        outStatistics: JSON.stringify([
            {
                "statisticType": "max",
                "onStatisticField": fieldNameForHid, 
                "outStatisticFieldName": "max_hid"
            }
        ]),
        f: 'json'
    };

    // const { data } = await axios.get(requestUrl, {
    //     params
    // });

    try {
        const res = await fetch(requestUrl + '?' + new URLSearchParams(params));
        const data = await res.json();
    
        if(!data.features || !data.features.length){
            return [];
        }
    
        const compositeIds = data.features.map((d:MaxFloodPredictionQueryResult)=>{
            const { b_streamid, max_hid } = d.attributes;
            return generateCompositeID(b_streamid, max_hid);
        });
    
        return compositeIds;
    } catch(err){
        console.error(err);

        return [];
    }
};