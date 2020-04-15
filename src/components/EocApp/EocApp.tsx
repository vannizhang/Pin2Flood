import * as React from 'react';

// import { 
//     AppContext 
// } from '../../contexts/AppContextProvider';

import {
    MapView,
    ControlPanel,
    PinDropsLayer,
    // PinDropsTimeSwitcher,
    Pin2FloodPolygonsLayer,
    MaxPredictionLayer,
    FloodPredictionLayer,
    ToggleSwitch,
    LayersListWidget,
    LocatorWidget,
    SwitcherBtnGroup
} from '../';

import {
    PindropFeature
} from '../PinDropsLayer/PinDropsLayer';

import {
    MapConfig,
    PindropTimeSwitcherData,
    PredictionTimeSwitcherData
} from '../../AppConfig';

interface LayerInfo {
    itemId: string;
    serviceUrl: string;
};

interface Props {
    pindropsLayerInfo?: LayerInfo;
    pin2floodPolygonsLayerInfo?: LayerInfo;
    token?: string;
}

const App:React.FC<Props> = ({
    pindropsLayerInfo
})=>{

    const LayerListWidgetContainerId = 'layerListDiv';

    const [ pastHour, setPastHour ] = React.useState<number>();

    // active pindrop features that are currently visible on map 
    const [ pindropFeatures, setPindropFeatures ] = React.useState<PindropFeature[]>([]);

    const [ isMaxPredictionLayerVisible, setIsMaxPredictionLayerVisible ] = React.useState<boolean>(false);

    const [ idxForActivePredictionTime, setIdxForActivePredictionTime ] = React.useState<number>(0);

    return (
        <>
            <MapView
                webmapId={MapConfig["web-map-id"]}
            >
                <LocatorWidget />

                <LayersListWidget 
                    containerId={LayerListWidgetContainerId}
                />

                <MaxPredictionLayer 
                    isVisible={isMaxPredictionLayerVisible}
                />

                <FloodPredictionLayer 
                    indexForActiveTimeValue={idxForActivePredictionTime}
                    isVisible={true}
                />

                <Pin2FloodPolygonsLayer
                    pindropFeatures={pindropFeatures}
                    layerTitle={'Pin to Flood'}
                />

                <PinDropsLayer 
                    itemId={pindropsLayerInfo.itemId}
                    pastHour={pastHour}
                    popupEnabled={false}
                    onUpdateEnd={setPindropFeatures}
                    refreshInterval={2}
                />

            </MapView>

            <ControlPanel 
                title={'EOC Flood Support'}
            >
                <div id={LayerListWidgetContainerId}></div>

                <SwitcherBtnGroup 
                    title={'pins for last'}
                    data={PindropTimeSwitcherData}
                    onSelect={(val)=>{
                        setPastHour(+val);
                    }}
                />

                <SwitcherBtnGroup 
                    title={'show flood prediction for'}
                    data={PredictionTimeSwitcherData}
                    onSelect={(val)=>{
                        setIdxForActivePredictionTime(+val);
                    }}
                />

                {/* <ToggleSwitch 
                    label={'Current Condition'}
                    defaultValue={isPredictionLayerVisible}
                    onChange={setIsPredictionLayerVisible}
                /> */}

                <ToggleSwitch 
                    label={'36 Hours Max Prediction'}
                    defaultValue={isMaxPredictionLayerVisible}
                    onChange={setIsMaxPredictionLayerVisible}
                />

            </ControlPanel>
        </>
    );
};

export default App;