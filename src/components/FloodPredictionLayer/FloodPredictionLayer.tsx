import * as React from 'react';
import axios from 'axios';

import { loadModules } from 'esri-loader';

import IMapView from 'esri/views/MapView';
import IMapImageLayer from 'esri/layers/MapImageLayer';
import ITimeExtent from 'esri/TimeExtent';

import {
    DepthContourLayerConfig
} from '../../AppConfig';

interface TimeExtentFeature {
    attributes: {
        timevalue: number;
    }
}

interface Props {
    mapView?: IMapView;
    isVisible: boolean;
    indexForActiveTimeValue?: number;
};

const FloodPredictionLayer:React.FC<Props> = ({
    mapView,
    isVisible,
    indexForActiveTimeValue
})=>{

    const [ predictionLayer, setPredictionLayer ] = React.useState<IMapImageLayer>();

    const [ timeValues, setTimeValues ] = React.useState<number[]>([]);

    const init = async()=>{

        type Modules = [typeof IMapImageLayer];

        const [ MapImageLayer ] = await (loadModules([
            'esri/layers/MapImageLayer'
        ]) as Promise<Modules>);

        const timeValue = indexForActiveTimeValue ? timeValues[indexForActiveTimeValue] : timeValues[0];

        const layer = new MapImageLayer({
            // URL to the map service
            url: DepthContourLayerConfig.serviceUrl,
            // dynamic sublayers. See sublayers documentation for more info
            sublayers: [ 
                {
                    id: 0,
                    visible: true
                } 
            ],
            timeExtent: {
                start: new Date(timeValue),
                end: new Date(timeValue)
            },
            useViewTime: false,
            visible: isVisible
        });

        mapView.map.add(layer);

        setPredictionLayer(layer);
    };

    const fetchTimeValues = async()=>{

        try {

            const requestUrl = `${DepthContourLayerConfig.serviceUrl}/1/query?where=1=1&f=json`;

            const { data } = await axios.get(requestUrl);

            if(data && data.features){

                const timevalues:number[] = data.features.map((d:TimeExtentFeature)=>{
                    return d.attributes.timevalue;
                });

                setTimeValues(timevalues);

            }

        } catch(err){
            console.error(err);
        }

    };

    const updateLayerTimeExtent = async()=>{

        type Modules = [typeof ITimeExtent];

        const [ TimeExtent ] = await (loadModules([
            'esri/TimeExtent'
        ]) as Promise<Modules>);

        if(predictionLayer){
            const timeValue = timeValues[indexForActiveTimeValue];

            predictionLayer.timeExtent = new TimeExtent({
                start: new Date(timeValue),
                end: new Date(timeValue)
            });

            predictionLayer.refresh();
        }
        
    };

    const toggleLayerVisibility = ()=>{
        if(predictionLayer){ 
            predictionLayer.visible = isVisible;
            predictionLayer.refresh();
        }
    }

    React.useEffect(()=>{
        fetchTimeValues();
    }, []);

    React.useEffect(()=>{
        if(mapView && timeValues.length){
            init();
        }
    }, [ mapView ]);

    React.useEffect(()=>{
        if(mapView){
            updateLayerTimeExtent();
        }
    }, [ indexForActiveTimeValue ]);

    React.useEffect(()=>{
        if(mapView){
            toggleLayerVisibility();
        }
    }, [ isVisible ]);

    return null;
};

export default FloodPredictionLayer;