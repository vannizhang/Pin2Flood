import * as React from 'react';

import { loadModules } from 'esri-loader';

import IMapView from 'esri/views/MapView';
import IFeatureLayer from 'esri/layers/FeatureLayer';
import ILabelClass from 'esri/layers/support/LabelClass';
import ITextSymbol from 'esri/symbols/TextSymbol';
import IUniqueValueRenderer from 'esri/renderers/UniqueValueRenderer';
import ISimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';

import { 
    AppContext 
} from '../../contexts/AppContextProvider';

import {
    PinDropsLayerConfig
} from '../../AppConfig';

import {
    getPreviousHourInUTC
} from '../../utils/date';

export interface PindropFeature {
    compositeId: number;
    userId: string;
}

interface Props {
    itemId: string;
    // use the past hour to filter pindrop features added in past hours
    pastHour?: number;
    popupEnabled?: boolean;
    mapView?: IMapView;
    // Refresh interval of the layer in minutes
    refreshInterval?: number;
    shouldRefresh?: boolean;

    // call this method after the layer is added/refreshed on map to get list of composite Ids from pindrops visible on map 
    onUpdateEnd?: (compositeIds: PindropFeature[])=>void;
};

const PinDropsLayer:React.FC<Props> = ({
    itemId,
    pastHour,
    popupEnabled,
    mapView,
    refreshInterval,
    shouldRefresh,

    onUpdateEnd
})=>{

    const LayerTitle = 'Pin Drops';

    const { userData, pindropsLayer, setPindropsLayer } = React.useContext(AppContext);

    const getDefExp = ()=>{

        const { fields } = PinDropsLayerConfig;

        const fieldNameForPindropTime = fields[2].fieldName;

        const defExpForTime = pastHour ? `${fieldNameForPindropTime} > '${getPreviousHourInUTC(pastHour)}'` : null;

        return defExpForTime;
    };

    const getRenderer = async()=>{
        type Modules = [typeof IUniqueValueRenderer, typeof ISimpleMarkerSymbol];

        const [ UniqueValueRenderer, SimpleMarkerSymbol ] = await (loadModules([
            'esri/renderers/UniqueValueRenderer',
            'esri/symbols/SimpleMarkerSymbol'
        ]) as Promise<Modules>);

        const { fields } = PinDropsLayerConfig;

        const fieldNameForUserId = fields[0].fieldName;

        return new UniqueValueRenderer({
            defaultSymbol: new SimpleMarkerSymbol({
                color: PinDropsLayerConfig.styles.others.color,
                size: '15px',
                outline: {
                    color: [255, 255, 255, 1],
                    width: '2.5px'
                }
            }),
            defaultLabel: "Others' Pin Drop",
            field: fieldNameForUserId,
            uniqueValueInfos: [
                {
                    value: userData.id,
                    symbol: new SimpleMarkerSymbol({
                        color: PinDropsLayerConfig.styles["current-user"].color,
                        size: '15px',
                        outline: {
                            color: [255, 255, 255, 1],
                            width: '2.5px'
                        }
                    }),
                    label: "My Pin Drops"
                }
            ]
        });
    };

    const getPopupTemplate = ()=>{
        if(!popupEnabled){
            return undefined;
        }

        const { fields } = PinDropsLayerConfig;

        return {
            title: LayerTitle,
            content: [
                {
                    type: "fields",
                    fieldInfos: [
                        {
                            fieldName: fields[0].fieldName,
                            label: fields[0].displayName
                        },
                        {
                            fieldName: fields[1].fieldName,
                            label: fields[1].displayName
                        },
                        {
                            fieldName: fields[2].fieldName,
                            label: fields[2].displayName
                        },
                    ]
                }
            ]
        }
    };

    const getLabeleClass = async()=>{

        type Modules = [typeof ILabelClass, typeof ITextSymbol];

        const [ LabelClass, TextSymbol ] = await (loadModules([
            'esri/layers/support/LabelClass',
            'esri/symbols/TextSymbol'
        ]) as Promise<Modules>);

        const { fields } = PinDropsLayerConfig;

        const fieldNameForUserFullName = fields[1].fieldName;
        const fieldNameForPindropTime = fields[2].fieldName;

        const labelClass = new LabelClass({
            symbol: new TextSymbol({
                color: "#fff",
                haloColor: "#000",
                haloSize: .8,
                font: {
                    size: 11,
                }
            }),
            minScale: 10000,
            labelPlacement: "center-right",
            labelExpressionInfo: {
                expression: `Concatenate([$feature.${fieldNameForUserFullName}, Text(Date($feature.${fieldNameForPindropTime}), 'MMM-D HH:mm')], TextFormatting.NewLine)`
            }
        });

        return labelClass;
    };

    const initPinDropsLayer = async()=>{

        type Modules = [typeof IFeatureLayer];

        try {
            const [ FeatureLayer ] = await (loadModules([
                'esri/layers/FeatureLayer'
            ]) as Promise<Modules>);

            const labelClass = await getLabeleClass();

            const renderer = await getRenderer();

            const definitionExpression = getDefExp();

            const layer = new FeatureLayer({
                title: LayerTitle,
                portalItem: {  // autocasts as new PortalItem()
                    id: itemId
                },
                definitionExpression,
                renderer,
                popupEnabled,
                popupTemplate: getPopupTemplate(),
                labelingInfo: [labelClass],
                refreshInterval
            });

            setPindropsLayer(layer);

        } catch(err){   
            console.error(err);
        }
    };

    // query pindrops layer to get all visible features
    const fetchPindrops = async()=>{
        const queryParams = pindropsLayer.createQuery();

        const { features } = await pindropsLayer.queryFeatures(queryParams);

        const { fields } = PinDropsLayerConfig;

        const fieldNameForUserId = fields[0].fieldName;
        const fieldNameForCompositeId = fields[3].fieldName;

        const pindropFeatures: PindropFeature[] = features && features.length 
            ? features.map(feature=>{
                return {
                    userId: feature.attributes[fieldNameForUserId],
                    compositeId: feature.attributes[fieldNameForCompositeId]
                };
            }) 
            : []

        onUpdateEnd(pindropFeatures);
    };

    const refresh = ()=>{
        if(pindropsLayer){
            pindropsLayer.definitionExpression = getDefExp();
            pindropsLayer.refresh();

            fetchPindrops();
        }
    };

    React.useEffect(()=>{
        if(mapView){
            initPinDropsLayer();
        }
    }, [mapView]);

    React.useEffect(()=>{
        if(pindropsLayer){
            mapView.map.add(pindropsLayer);

            fetchPindrops();
        }
    }, [pindropsLayer]);

    React.useEffect(()=>{
        if(mapView){
            refresh();
        }
    }, [pastHour]);

    React.useEffect(()=>{
        if(shouldRefresh){
            refresh();
        }
    }, [ shouldRefresh ]);

    return null;
};

export default PinDropsLayer;