import * as React from 'react';

import { 
    AppContext 
} from '../../contexts/AppContextProvider';

import {
    MapView,
    ControlPanel,
    PinDropsLayer,
    PinDropsCandidateLayer,
    PinDropsTimeSwitcher,
    PinDropsEditor
} from '../';

import {
    PindropCandiate
} from '../PinDropsCandidateLayer/PinDropsCandidateLayer';

import {
    MapConfig,
    PinDropsLayerConfig
} from '../../AppConfig';

import {
    pin2Flood
} from '../../services/pin2flood-task/pin2floodTask';

import {
    savePindrop,
    setPindropsLayerConfig
} from '../../services/pindrops-layer/pindropsLayer';

import {
    savePin2FloodPolygon,
    setPin2FloodPolygonsLayerConfig
} from '../../services/pin2flood-polygons-layer/pin2floodPolygonsLayer';

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

    const [ isRunningPin2FloodTask, setIsRunningPin2FloodTask ] = React.useState<boolean>(false);

    const newPindropOnAcceptHandler = async()=>{
        // console.log('adding new pin drop');

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

        setPindropCandidate(null);
        setIsRunningPin2FloodTask(false);
    };

    const newPindropOnRejectHandler = ()=>{
        setPindropCandidate(null);
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

    return (
        <>
            <MapView
                webmapId={MapConfig["web-map-id"]}
            >
                <PinDropsLayer 
                    itemId={pindropsLayerInfo.itemId}
                    pastHour={pastHour}
                    popupEnabled={false}
                />

                <PinDropsCandidateLayer 
                    pindropCandidate={pindropCandidate}
                    onSelect={(candidate)=>{
                        setPindropCandidate(candidate);
                    }}
                />
            </MapView>

            <ControlPanel 
                title={'Pin2Flood'}
            >
                <PinDropsTimeSwitcher 
                    onSelect={setPastHour}
                />

                <PinDropsEditor 
                    pindropCandidate={pindropCandidate}

                    newCadidateOnAccept={newPindropOnAcceptHandler}
                    newCadidateOnReject={newPindropOnRejectHandler}
                />
            </ControlPanel>
        </>
    );
};

export default App;