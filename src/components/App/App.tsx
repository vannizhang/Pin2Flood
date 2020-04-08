import * as React from 'react';

import {
    MapView,
    ControlPanel,
    PinDropsLayer,
    PinDropsTimeSwitcher
} from '../';

import {
    MapConfig,
    PinDropsLayerConfig
} from '../../AppConfig';

const App:React.FC = ()=>{

    // use the past hour to filter pindrop features added in past hours
    const [ pastHour, setPastHour ] = React.useState<number>(1);

    return (
        <>
            <MapView
                webmapId={MapConfig["web-map-id"]}
            >
                <PinDropsLayer 
                    itemId={PinDropsLayerConfig.itemID}
                    pastHour={pastHour}
                    popupEnabled={false}
                />
            </MapView>

            <ControlPanel 
                title={'Pin2Flood'}
            >
                <PinDropsTimeSwitcher 
                    activeValue={pastHour}
                    onSelect={setPastHour}
                />
            </ControlPanel>
        </>
    );
};

export default App;