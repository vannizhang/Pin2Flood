import * as React from 'react';

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
} from '../../services/Pin2Flood/Pin2Flood';

const App:React.FC = ()=>{

    const [ pindropTime, setPindropTime ] = React.useState<string>();

    const [ pindropCandidate, setPindropCandidate ] = React.useState<PindropCandiate>();

    const newPindropOnAcceptHandler = async()=>{
        // console.log('adding new pin drop');

        const { geometry } = pindropCandidate;

        const pin2floodPolygon = await pin2Flood({
            pindropGeometry: geometry
        });
    };

    const newPindropOnRejectHandler = ()=>{
        setPindropCandidate(null);
    };

    return (
        <>
            <MapView
                webmapId={MapConfig["web-map-id"]}
            >
                <PinDropsLayer 
                    itemId={PinDropsLayerConfig.itemID}
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