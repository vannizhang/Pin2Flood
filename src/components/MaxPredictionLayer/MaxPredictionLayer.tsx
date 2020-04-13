import * as React from 'react';

import { loadModules } from 'esri-loader';

import IMapView from 'esri/views/MapView';
import IFeatureLayer from 'esri/layers/FeatureLayer';
import ISimpleRenderer from 'esri/renderers/SimpleRenderer';
import ISimpleFillSymbol from 'esri/symbols/SimpleFillSymbol';
import IWatchUtils from 'esri/core/watchUtils';

import {
    FloodInnudationPolygonsLayerConfig
} from '../../AppConfig';

import {
    fetchCompositeIds4MaxFloodPredictionPolygons
} from '../../services/max-flood-prediction/maxFloodPredictionPolygons';

interface Props {
    mapView?: IMapView;
};

const MaxPredictionLayer:React.FC<Props> = ({
    mapView
})=>{


    let queryDelay: NodeJS.Timeout = null;

    const LayerTitle = 'Max Predictions';

    const [ maxPredictionLayer, setMaxPredictionLayer ] = React.useState<IFeatureLayer>()

    const [ compositeIds, setCompositeIds ] = React.useState<number[]>([]);

    const getDefExp = ()=>{

        const { fields } = FloodInnudationPolygonsLayerConfig;

        const fieldNameForCompositeId = fields[1].name

        const defExp = compositeIds.length 
            ? `${fieldNameForCompositeId} in (${compositeIds.join(',')})`
            : `${fieldNameForCompositeId} = -999`;
            
        return defExp;
    };

    const getRenderer = async()=>{
        type Modules = [typeof ISimpleRenderer, typeof ISimpleFillSymbol];

        const [ SimpleRenderer, SimpleFillSymbol ] = await (loadModules([
            'esri/renderers/SimpleRenderer',
            'esri/symbols/SimpleFillSymbol'
        ]) as Promise<Modules>);

        const renderer = new SimpleRenderer({
            symbol: new SimpleFillSymbol({
                color: [ 255, 0, 170, 0.3 ],
                style: "solid",
                outline: {  // autocasts as new SimpleLineSymbol()
                    color: [255, 0, 170, 0.5],
                    width: '1px'
                }
            })
        });

        return renderer;
    };

    const fetchMaxPredictionPolygons = async()=>{

        queryDelay = global.setTimeout(async()=>{
            const compositeIds = await fetchCompositeIds4MaxFloodPredictionPolygons({
                mapExtent: mapView.extent
            });
    
            setCompositeIds(compositeIds);

        }, 350);
    }

    const initEventListener = async()=>{

        type Modules = [typeof IWatchUtils];

        const [ watchUtils ] = await (loadModules([
            'esri/core/watchUtils'
        ]) as Promise<Modules>);

        watchUtils.whenFalse(mapView, 'stationary', ()=>{
            // console.log('mapView is updating');
            clearTimeout(queryDelay);
        });

        watchUtils.whenTrue(mapView, 'stationary', ()=>{
            fetchMaxPredictionPolygons()
        });
    };

    const init = async()=>{
        type Modules = [typeof IFeatureLayer];

        try {
            const [ FeatureLayer ] = await (loadModules([
                'esri/layers/FeatureLayer'
            ]) as Promise<Modules>);

            const definitionExpression = getDefExp();

            const renderer = await getRenderer();

            const { serviceUrl } = FloodInnudationPolygonsLayerConfig;

            const layer = new FeatureLayer({
                title: LayerTitle,
                url: serviceUrl,
                definitionExpression,
                renderer,
            });

            mapView.map.add(layer, 0);

            setMaxPredictionLayer(layer);

        } catch(err){   
            console.error(err);
        }
    };

    const refresh = ()=>{
        if(maxPredictionLayer){
            maxPredictionLayer.definitionExpression = getDefExp();
            maxPredictionLayer.refresh();
        }
    };

    React.useEffect(()=>{
        if(mapView){
            init();
            initEventListener();
        }
    }, [ mapView ]);

    React.useEffect(()=>{

        if(maxPredictionLayer){
            fetchMaxPredictionPolygons();
        }

    }, [ maxPredictionLayer ])

    React.useEffect(()=>{
        refresh();
    }, [ compositeIds ]);

    return null;
};

export default MaxPredictionLayer;