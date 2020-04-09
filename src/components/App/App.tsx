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
    getPreviousHourInUTC
} from '../../utils/date';

import {
    pin2Flood
} from '../../services/pin2flood-task/pin2floodTask';

import {
    savePindrop,
    setPindropsLayerConfig
} from '../../services/pindrops-layer/pindropsLayer';

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

    const [ pindropTime, setPindropTime ] = React.useState<string>();

    const [ pindropCandidate, setPindropCandidate ] = React.useState<PindropCandiate>();

    const [ isRunningPin2FloodTask, setIsRunningPin2FloodTask ] = React.useState<boolean>(false);

    const newPindropOnAcceptHandler = async()=>{
        // console.log('adding new pin drop');

        const { geometry } = pindropCandidate;

        const pin2floodPolygon = await pin2Flood({
            pindropGeometry: geometry
        });

        const savePindropResponse = await savePindrop({
            pindropGeometry: geometry,
            attributes: {
                userId: userData.id,
                userFullName: userData.name,
                compositeId: pin2floodPolygon.attributes.compositeid
            }
        });


        setPindropCandidate(null);
    };

    const newPindropOnRejectHandler = ()=>{
        setPindropCandidate(null);
    };

    const toggleIsRunningPin2FloodTask = ()=>{
        setIsRunningPin2FloodTask(!isRunningPin2FloodTask);
    }

    React.useEffect(()=>{
        // console.log(pindropsLayerInfo, token)
        setPindropsLayerConfig({
            serviceUrl: pindropsLayerInfo.serviceUrl,
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
                    pindropTime={pindropTime}
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
                    onSelect={(pastHour)=>{
                        const pindropTime = pastHour ? getPreviousHourInUTC(pastHour) : null;
                        setPindropTime(pindropTime);
                    }}
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