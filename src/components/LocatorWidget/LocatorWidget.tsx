import * as React from 'react';

import { loadModules } from 'esri-loader';

import IMapView from 'esri/views/MapView';
import ILocator from 'esri/widgets/Locate';

interface Props {
    mapView?: IMapView;
};

const LocateWidget:React.FC<Props> = ({
    mapView
})=>{

    const init = async()=>{
        type Modules = [typeof ILocator];

        const [ Locate ] = await (loadModules([
            'esri/widgets/Locate',
        ]) as Promise<Modules>);

        const locate = new Locate({
            view: mapView,
        });

        mapView.ui.add(locate, {
            position: "top-left",
            index: 1
        });
    };

    React.useEffect(()=>{
        if(mapView){
            init();
        }
    }, [mapView]);

    return null;
};

export default LocateWidget;