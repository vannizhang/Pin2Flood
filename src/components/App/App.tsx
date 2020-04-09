import * as React from 'react';

import {
    MapView,
    ControlPanel,
    PinDropsLayer,
    PinDropsEditingLayer,
    PinDropsTimeSwitcher
} from '../';

import {
    PindropCandiate
} from '../PinDropsEditingLayer/PinDropsEditingLayer';

import {
    MapConfig,
    PinDropsLayerConfig
} from '../../AppConfig';

import {
    getPreviousHourInUTC
} from '../../utils/date';

const App:React.FC = ()=>{

    const [ pindropTime, setPindropTime ] = React.useState<string>();

    const [ pinDropCandidate, setPinDropCandidate ] = React.useState<PindropCandiate>();

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

                <PinDropsEditingLayer 
                    pindropTime={pindropTime}
                    onSelect={(candidate)=>{
                        console.log(candidate);
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
            </ControlPanel>
        </>
    );
};

export default App;