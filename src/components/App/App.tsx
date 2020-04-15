import * as React from 'react';

import { 
    AppContext 
} from '../../contexts/AppContextProvider';

import {
    MapView,
    ControlPanel,
    PinDropsLayer,
    PinDropsCandidateLayer,
    // PinDropsTimeSwitcher,
    PinDropsEditor,
    Pin2FloodPolygonsLayer,
    MaxPredictionLayer,
    FloodPredictionLayer,
    ToggleSwitch,
    StatusMessage,
    SwitcherBtnGroup
} from '../';

import {
    PindropFeature
} from '../PinDropsLayer/PinDropsLayer';

import {
    PindropCandiate
} from '../PinDropsCandidateLayer/PinDropsCandidateLayer';

import {
    EditingTaskName
} from '../StatusMessage/StatusMessage';

import {
    MapConfig,
    PindropTimeSwitcherData
} from '../../AppConfig';

import {
    pin2Flood
} from '../../services/pin2flood-task/pin2floodTask';

import {
    savePindrop,
    deletePindrop,
    setPindropsLayerConfig
} from '../../services/pindrops-layer/pindropsLayer';

import {
    savePin2FloodPolygon,
    deletePin2FloodPolygon,
    setPin2FloodPolygonsLayerConfig
} from '../../services/pin2flood-polygons-layer/pin2floodPolygonsLayer';

// type PindropControlAction = 'addPindrop' | 'deletePindrop' | 'updatePindrop';

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
    pindropsLayerInfo,
    pin2floodPolygonsLayerInfo,
    token
})=>{

    const { userData } = React.useContext(AppContext);

    const [ pastHour, setPastHour ] = React.useState<number>();

    const [ pindropCandidate, setPindropCandidate ] = React.useState<PindropCandiate>();

    // active pindrop features that are currently visible on map 
    const [ pindropFeatures, setPindropFeatures ] = React.useState<PindropFeature[]>([]);

    const [ isPredictionLayerVisible, setIsPredictionLayerVisible ] = React.useState<boolean>(false);

    const [ isMaxPredictionLayerVisible, setIsMaxPredictionLayerVisible ] = React.useState<boolean>(false);

    const [ activeEditingTask, setAtiveEditingTask ] = React.useState<EditingTaskName>();

    const newPindropOnAcceptHandler = async()=>{
        // console.log('adding new pin drop');

        setAtiveEditingTask('addPindrop');

        try {
            const { geometry } = pindropCandidate;

            const pin2floodPolygon = await pin2Flood({
                pindropGeometry: geometry
            });
            // console.log(pin2floodPolygon);
    
            const { id, name } = userData;
    
            const pindropTime = new Date().getTime();
    
            const savePindropResponse = await savePindrop({
                pindropGeometry: geometry,
                attributes: {
                    userId: id,
                    userFullName: name,
                    compositeId: pin2floodPolygon.attributes.compositeid,
                    pindropTime
                }
            });
            // console.log(savePindropResponse);
    
            const savePin2FloodPolygonResponse = await savePin2FloodPolygon({
                geometry: pin2floodPolygon.geometry,
                attributes: {
                    userId: id,
                    userFullName: name,
                    compositeId: pin2floodPolygon.attributes.compositeid,
                    pindropId: savePindropResponse.objectId,
                    pindropTime
                }
            });
            // console.log(savePin2FloodPolygonResponse);

        } catch(err){
            console.error(err);
        }

        setAtiveEditingTask('');
    };

    const existingPindropOnDeleteHandler = async()=>{

        setAtiveEditingTask('deletePindrop');

        const { ObjectId } = pindropCandidate;

        try {
            const deletePindropRes = await deletePindrop(ObjectId);
            console.log(deletePindropRes);
    
            const deletePin2FloodPolyRes = await deletePin2FloodPolygon(ObjectId);
            console.log(deletePin2FloodPolyRes);
        } catch(err){
            console.error(err);
        }

        setAtiveEditingTask('');
    };

    React.useEffect(()=>{
        // console.log(pindropsLayerInfo, token)
        setPindropsLayerConfig({
            serviceUrl: pindropsLayerInfo.serviceUrl,
            token
        });

        setPin2FloodPolygonsLayerConfig({
            serviceUrl: pin2floodPolygonsLayerInfo.serviceUrl,
            token
        });

    }, []);

    // reset pindrop candidate when activeEditingTask becomes null
    React.useEffect(()=>{
        if(!activeEditingTask){
            setPindropCandidate(null);
        }
    }, [ activeEditingTask ]);

    return (
        <>
            <MapView
                webmapId={MapConfig["web-map-id"]}
            >

                <PinDropsCandidateLayer
                    shouldResetPindropCandidate={!pindropCandidate ? true : false}
                    onSelect={(candidate)=>{
                        setPindropCandidate(candidate);
                    }}
                />

                <MaxPredictionLayer 
                    isVisible={isMaxPredictionLayerVisible}
                />

                <FloodPredictionLayer 
                    isVisible={isPredictionLayerVisible}
                />

                <Pin2FloodPolygonsLayer
                    pindropFeatures={pindropFeatures}
                    layerTitle={'Pin to Flood'}
                />

                <PinDropsLayer 
                    itemId={pindropsLayerInfo.itemId}
                    pastHour={pastHour}
                    popupEnabled={false}
                    shouldRefresh={activeEditingTask ? false : true}
                    onUpdateEnd={setPindropFeatures}
                />

            </MapView>

            <ControlPanel 
                title={'Pin2Flood'}
            >

                <SwitcherBtnGroup 
                    title={'pins for last'}
                    data={PindropTimeSwitcherData}
                    onSelect={(val)=>{
                        setPastHour(+val);
                    }}
                />

                <PinDropsEditor 
                    pindropCandidate={pindropCandidate}
                    isEditingPindrop={activeEditingTask ? true : false}

                    newCadidateOnAccept={newPindropOnAcceptHandler}
                    deleteBtnOnClick={existingPindropOnDeleteHandler}
                    rejectBtnOnClick={setPindropCandidate.bind(this, null)}
                />

                <StatusMessage 
                    task={activeEditingTask}
                />

                <ToggleSwitch 
                    label={'Current Condition'}
                    defaultValue={isPredictionLayerVisible}
                    onChange={setIsPredictionLayerVisible}
                />

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