import * as React from 'react';

import { loadModules } from 'esri-loader';

import IMapView from 'esri/views/MapView';
import IPoint from 'esri/geometry/Point';
import IExtent from 'esri/geometry/Extent';
import IGraphic from 'esri/Graphic';

import { 
    AppContext 
} from '../../contexts/AppContextProvider';

import {
    PinDropsLayerConfig
} from '../../AppConfig';

export interface PindropCandiate {
    geometry: IPoint;
    ObjectId?: number;
}

interface Props {
    // item id for the pin drops layer
    pindropTime?: string;
    mapView?: IMapView;

    onSelect?: (candidate:PindropCandiate)=>void;
    // newPinOnAccept?: ()=>void;
    // newPinOnReject?: ()=>void;
};

// interface PindropFeature {
//     attributes: {
//         userid: string;
//         querytime: number;
//         compositeid: number;
//         fullname: string;
//     },
//     geometry: IPoint
// };

const PinDropsEditingLayer:React.FC<Props> = ({
    pindropTime,
    mapView,
    onSelect
})=>{

    const { userId, pindropsLayer } = React.useContext(AppContext);

    const addTemporaryPoint = (point:IPoint)=>{

    };

    const removeTemporaryPoint = ()=>{

    };

    const getDefExp = ()=>{
        const { fields } = PinDropsLayerConfig;

        const fieldNameForUserId = fields[0].fieldName;
        const fieldNameForPindropTime = fields[2].fieldName;

        console.log(pindropTime);

        const pindropTimeDefExp = pindropTime ? `${fieldNameForPindropTime} > '${pindropTime}'` : '';
        const userIdDefExp = `${fieldNameForUserId}='${userId}'`

        return [pindropTimeDefExp, userIdDefExp].filter(defExp=>defExp).join(' AND ');
    };

    const queryPindropFeature = async(point:IPoint): Promise<IGraphic>=>{

        type Modules = [typeof IExtent];

        try {
            const [ Extent ] = await (loadModules([
                'esri/geometry/Extent'
            ]) as Promise<Modules>);

            const queryTolerance = mapView.zoom <= 18 ? 5 : 1; 

            const geometry = new Extent({
                xmin: point.x - queryTolerance,
                ymin: point.y - queryTolerance,
                xmax: point.x + queryTolerance,
                ymax: point.y + queryTolerance,
                spatialReference: {
                    wkid: 102100
                }
            });

            const queryParams = pindropsLayer.createQuery();

            queryParams.where = getDefExp();
            queryParams.geometry = geometry;
            queryParams.spatialRelationship = "intersects";

            const { features } = await pindropsLayer.queryFeatures(queryParams);

            return features[0] || null;


        } catch(err){   
            console.error(err);
        }

    };
    
    const startEditing = async(point:IPoint)=>{
        
        const pindropGraphic = await queryPindropFeature(point);
        console.log(pindropGraphic);

        // const geometry:IPoint = pindropGraphic ? pindropGraphic.geometry : point;
        // const ObjectId:number = pindropGraphic ? pindropGraphic.attributes.ObjectId : null;

        // const candidate:PindropCandiate = {
        //     geometry,
        //     ObjectId
        // };

        // onSelect(candidate);
    };

    React.useEffect(()=>{
        if(mapView && pindropsLayer){
            mapView.on('click', (event)=>{
                startEditing(event.mapPoint);
            });
        }
    }, [mapView, pindropsLayer]);

    return null;
};

export default PinDropsEditingLayer;