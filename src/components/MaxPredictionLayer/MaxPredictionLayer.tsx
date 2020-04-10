import * as React from 'react';

import { loadModules } from 'esri-loader';

import IMapView from 'esri/views/MapView';
import IFeatureLayer from 'esri/layers/FeatureLayer';
import IUniqueValueRenderer from 'esri/renderers/UniqueValueRenderer';

import {
    FloodInnudationPolygonsLayerConfig
} from '../../AppConfig';

interface Props {
    mapView?: IMapView;
};

const MaxPredictionLayer:React.FC<Props> = ({
    mapView
})=>{

    const LayerTitle = 'Max Predictions';

    const [ compositeIds, setCompositeIds ] = React.useState<number[]>([]);

    const getDefExp = ()=>{

        const { fields } = FloodInnudationPolygonsLayerConfig;

        const fieldNameForCompositeId = fields[1].name

        const defExp = compositeIds.length 
            ? `${fieldNameForCompositeId} in (${compositeIds.join(',')})`
            : `${fieldNameForCompositeId} = -999`;
            
        return defExp;
    };

    const getRenderer = ()=>{

    };

    const init = async()=>{
        type Modules = [typeof IFeatureLayer];

        try {
            const [ FeatureLayer ] = await (loadModules([
                'esri/layers/FeatureLayer'
            ]) as Promise<Modules>);

            const definitionExpression = getDefExp();

            // const popupTemplate = getPopupTemplate();

            // const renderer = await getRenderer();

            const { serviceUrl } = FloodInnudationPolygonsLayerConfig;

            const layer = new FeatureLayer({
                title: LayerTitle,
                url: serviceUrl,
                definitionExpression,
                // renderer,
            });

            mapView.map.add(layer);

        } catch(err){   
            console.error(err);
        }
    };

    React.useEffect(()=>{
        if(mapView){
            init();
        }
    }, [ mapView ]);

    return null;
};

export default MaxPredictionLayer;