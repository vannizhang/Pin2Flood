import * as React from 'react';

import { loadModules } from 'esri-loader';

import IMapView from 'esri/views/MapView';
import IFeatureLayer from 'esri/layers/FeatureLayer';
import IUniqueValueRenderer from 'esri/renderers/UniqueValueRenderer';

import { 
    AppContext 
} from '../../contexts/AppContextProvider';

import {
    PindropFeature
} from '../PinDropsLayer/PinDropsLayer';

import {
    FloodInnudationPolygonsLayerConfig
} from '../../AppConfig';
import { render } from 'react-dom';

interface Props {
    pindropFeatures: PindropFeature[];
    layerTitle?: string;
    mapView?: IMapView;
    popupEnabled?: boolean;
    // Refresh interval of the layer in minutes
    refreshInterval?: number;
};

const Pin2FloodPolygonsLayer:React.FC<Props> = ({
    pindropFeatures,
    layerTitle,
    mapView,
    popupEnabled,
    refreshInterval
})=>{

    const { userData } = React.useContext(AppContext);

    const [ pin2floodPolygonsLayer, setPin2FloodPolygonsLayer ] = React.useState<IFeatureLayer>()

    const getDefExp = ()=>{

        const { fields } = FloodInnudationPolygonsLayerConfig;

        const fieldNameForCompositeId = fields[1].name;

        const compositeIds = pindropFeatures.map(d=>d.compositeId);

        const defExp = compositeIds.length 
            ? `${fieldNameForCompositeId} in (${compositeIds.join(',')})`
            : `${fieldNameForCompositeId} = -999`;
            
        return defExp;
    };

    const getRenderer = async()=>{
        type Modules = [typeof IUniqueValueRenderer];

        const [ UniqueValueRenderer ] = await (loadModules([
            'esri/renderers/UniqueValueRenderer',
        ]) as Promise<Modules>);

        const { fields } = FloodInnudationPolygonsLayerConfig;

        const fieldNameForCompositeId = fields[1].name;

        const symbolForCurrentUser = {
            type: 'simple-fill',
            color: [ 255, 149, 0, .2],
            style: 'solid',
            outline: {  
                color: [191, 114, 0, 1],
                width: 1
            }
        };

        const symbolForOtherUsers = {
            type: 'simple-fill',
            color: [ 255, 255, 255, .3],
            style: 'solid',
            outline: {  
                color: [0, 0, 0, .6],
                width: 1
            }
        };

        const uniqueValueInfos = pindropFeatures
            .filter(d=>d.compositeId)
            .map(pindropFeature=>{

                const { compositeId, userId } = pindropFeature;

                const symbol = userData.id === userId
                    ? symbolForCurrentUser
                    : symbolForOtherUsers;

                return {
                    symbol,
                    value: compositeId
                };
            });

        const renderer = new UniqueValueRenderer({
            defaultSymbol: symbolForOtherUsers,
            field: fieldNameForCompositeId,
            uniqueValueInfos
        });

        return renderer;
    };

    const getPopupTemplate = ()=>{
        if(!popupEnabled){
            return undefined;
        }

        const { fields } = FloodInnudationPolygonsLayerConfig;

        return {
            title: layerTitle,
            content: [
                {
                    type: "fields",
                    fieldInfos: [
                        // hid
                        {
                            fieldName: fields[0].name,
                            label: fields[0].alias
                        },
                        // composite Id
                        {
                            fieldName: fields[1].name,
                            label: fields[1].alias
                        }
                    ]
                }
            ]
        }
    };

    const init = async()=>{
        type Modules = [typeof IFeatureLayer];

        try {
            const [ FeatureLayer ] = await (loadModules([
                'esri/layers/FeatureLayer'
            ]) as Promise<Modules>);

            const definitionExpression = getDefExp();

            const popupTemplate = getPopupTemplate();

            const { serviceUrl } = FloodInnudationPolygonsLayerConfig;

            const layer = new FeatureLayer({
                title: layerTitle,
                url: serviceUrl,
                definitionExpression,
                popupEnabled,
                popupTemplate,
                refreshInterval
            });

            mapView.map.add(layer);

            setPin2FloodPolygonsLayer(layer);

        } catch(err){   
            console.error(err);
        }
    };

    const refresh = async()=>{
        if(pin2floodPolygonsLayer){
            pin2floodPolygonsLayer.definitionExpression = getDefExp();
            pin2floodPolygonsLayer.renderer = await getRenderer();
            pin2floodPolygonsLayer.refresh();
        }
    }

    React.useEffect(()=>{
        if(mapView){
            init();
        }
    }, [ mapView ]);

    React.useEffect(()=>{
        refresh();
    }, [ pindropFeatures ]);

    return null;
};

export default Pin2FloodPolygonsLayer;