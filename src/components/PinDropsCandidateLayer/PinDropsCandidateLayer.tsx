import * as React from 'react';

import { loadModules } from 'esri-loader';

import esri = __esri;
import IMapView from 'esri/views/MapView';
import IPoint from 'esri/geometry/Point';
import IGraphic from 'esri/Graphic';
import ISimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';

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
    mapView?: IMapView;
    shouldResetPindropCandidate?: boolean;

    onSelect?: (candidate:PindropCandiate)=>void;
};

const PinDropsEditingLayer:React.FC<Props> = ({
    mapView,
    shouldResetPindropCandidate,
    onSelect
})=>{

    const { userData, pindropsLayer } = React.useContext(AppContext);

    const [ pindropCandidate, setPindropCandidate ] = React.useState<PindropCandiate>();

    const [ clickEventPoint, setClickEventPoint ] = React.useState<IPoint>();

    const showPindropCandidate = async(candidate:PindropCandiate)=>{

        clearAllTemporaryGraphics();

        type Modules = [typeof IGraphic, typeof ISimpleMarkerSymbol];

        try {
            const [ Graphic, SimpleMarkerSymbol ] = await (loadModules([
                'esri/Graphic',
                'esri/symbols/SimpleMarkerSymbol'
            ]) as Promise<Modules>);

            const { geometry } = candidate;

            const candidateGraphic = new Graphic({
                geometry,
                symbol: new SimpleMarkerSymbol({
                    color: [ 217, 70, 52 ],
                    size: '15px',
                    outline: { // autocasts as new SimpleLineSymbol()
                        color: [255, 255, 255, .7],
                        width: 2
                    }
                })
            });

            mapView.graphics.add(candidateGraphic);

        } catch(err){
            console.error(err);
        }
    };

    const clearAllTemporaryGraphics = ()=>{
        mapView.graphics.removeAll();
    };

    const getWhereClause= ()=>{
        const { fields } = PinDropsLayerConfig;

        // add this expression because user can only edit thier own pindrops 
        const fieldNameForUserId = fields[0].fieldName;
        const userIdDefExp = `${fieldNameForUserId}='${userData.id}'`;

        const pindropsLayerDefExp = pindropsLayer.definitionExpression;
        
        return [userIdDefExp, pindropsLayerDefExp].filter(defExp=>defExp).join(' AND ');
    };

    const queryPindropLayer = async(point:IPoint): Promise<PindropCandiate>=>{

        type Modules = [typeof IPoint];

        try {
            const [ Point ] = await (loadModules([
                'esri/geometry/Point'
            ]) as Promise<Modules>);

            const queryParams = pindropsLayer.createQuery();

            queryParams.where = getWhereClause();
            queryParams.geometry = point;
            queryParams.distance = 10;
            queryParams.units = 'meters';
            queryParams.spatialRelationship = "intersects";
    
            const { features } = await pindropsLayer.queryFeatures(queryParams);

            if(!features[0]){
                return null;
            }
    
            const geometry:IPoint = new Point(features[0].geometry);
            const ObjectId:number = features[0].attributes.ObjectId;

            return {
                geometry,
                ObjectId
            };

        } catch(err){
            console.error(err);
        }

    };
    
    const findPinDropCandidate = async(point:IPoint)=>{
        
        // try to query pin drop layer using input point in case user want to edit existing feature
        const existingPinDrop = await queryPindropLayer(point);

        const candidate:PindropCandiate = existingPinDrop || {
            geometry: point,
            ObjectId: undefined
        };

        setPindropCandidate(candidate);
    };

    const updatePindropCandidateLocation = (point:IPoint)=>{

        const { ObjectId } = pindropCandidate;

        const candidate:PindropCandiate = {
            geometry: point,
            ObjectId
        };

        setPindropCandidate(candidate);

        // console.log('updatePindropLocation', candidate);
        // onSelect(candidate);
    };

    const setMapViewOnClickHandler = ()=>{
        mapView.on('click', (evt)=>{
            setClickEventPoint(evt.mapPoint);
        });
    };

    React.useEffect(()=>{
        if(mapView && pindropsLayer){
            setMapViewOnClickHandler();
        }
    }, [mapView, pindropsLayer]);

    React.useEffect(()=>{

        if(mapView){

            if(pindropCandidate){
                // show pindrop candidate on map
                showPindropCandidate(pindropCandidate);

                onSelect(pindropCandidate);
            } else {
                // remove pindrop candidate from map
                clearAllTemporaryGraphics()
            }
        }

    }, [ pindropCandidate ]);

    React.useEffect(()=>{

        if(!clickEventPoint){
            return;
        }

        ( pindropCandidate && pindropCandidate.ObjectId !== undefined ) 
            ? updatePindropCandidateLocation(clickEventPoint)
            : findPinDropCandidate(clickEventPoint);

    }, [ clickEventPoint ]);

    React.useEffect(()=>{
        if(shouldResetPindropCandidate){
            setPindropCandidate(null);
        }
    }, [ shouldResetPindropCandidate ]);

    return null;
};

export default PinDropsEditingLayer;