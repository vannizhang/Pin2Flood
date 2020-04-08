import * as React from 'react';

import {
    MapView,
    ControlPanel
} from '../';

import {
    MapConfig
} from '../../AppConfig';

const App:React.FC = ()=>{
    return (
        <>
            <MapView
                webmapId={MapConfig["web-map-id"]}
            />

            <ControlPanel 
                title={'Pin2Flood'}
            >
            
            </ControlPanel>
        </>
    );
};

export default App;