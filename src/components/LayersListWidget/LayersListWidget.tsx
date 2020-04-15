import * as React from 'react';

import { loadModules } from 'esri-loader';

import IMapView from 'esri/views/MapView';
import ILayerList from 'esri/widgets/LayerList';

interface Props {
    mapView?: IMapView;
    containerId: string
};

const LayersListWidget:React.FC<Props> = ({
    mapView,
    containerId
})=>{

    const init = async()=>{
        type Modules = [typeof ILayerList];

        const [ LayerList ] = await (loadModules([
            'esri/widgets/LayerList',
        ]) as Promise<Modules>);

        const layerList = new LayerList({
            view: mapView,
            container: containerId
        });
    };

    React.useEffect(()=>{
        if(mapView){
            init();
        }
    }, [mapView]);

    return null;
};

export default LayersListWidget;