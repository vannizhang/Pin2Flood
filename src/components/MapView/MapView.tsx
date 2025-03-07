import * as React from 'react';
import { urlFns } from 'helper-toolkit-ts';

import { loadModules, loadCss } from 'esri-loader';
import IMapView from 'esri/views/MapView';
import IWebMap from "esri/WebMap";
import IWatchUtils from 'esri/core/watchUtils';
import IExtent from 'esri/geometry/Extent';
import ISpatialReference from 'esri/geometry/SpatialReference';

loadCss();

interface Props {
    webmapId: string;
    children: React.ReactNode;
};

const MapView:React.FC<Props> = ({
    webmapId,
    children
})=>{

    const mapDivRef = React.useRef<HTMLDivElement>(null);

    const [ mapView, setMapView] = React.useState<IMapView>(null);

    const SearchParamKey4Extent = 'ext';

    const initMapView = async()=>{
        
        type Modules = [typeof IMapView, typeof IWebMap];

        try {
            const [ 
                MapView, 
                WebMap 
            ] = await (loadModules([
                'esri/views/MapView',
                'esri/WebMap',
            ]) as Promise<Modules>);

            const predefinedExtent = await getExtentInUrl();
            // console.log(predefinedExtent)

            const view = new MapView({
                container: mapDivRef.current,
                map: new WebMap({
                    portalItem: {
                        id: webmapId
                    }  
                }),
                extent: predefinedExtent || undefined
            });

            view.when(()=>{
                setMapView(view);
                initEventHandler(view)
            });

        } catch(err){   
            console.error(err);
        }
    };

    const initEventHandler = async(view:IMapView)=>{

        type Modules = [typeof IWatchUtils];

        try {
            const [ 
                watchUtils
            ] = await (loadModules([
                'esri/core/watchUtils'
            ]) as Promise<Modules>);

            watchUtils.whenFalse(view, 'stationary', (evt)=>{
                updateExtentInUrl(view.extent);
            });

        } catch(err){   
            console.error(err);
        }
    };

    const updateExtentInUrl = (extent:IExtent)=>{
        const value = `${extent.xmin.toFixed(3)},${extent.ymin.toFixed(3)},${extent.xmax.toFixed(3)},${extent.ymax.toFixed(3)}`;
        urlFns.updateQueryParam({key: SearchParamKey4Extent, value});
        // console.log(extent.toJSON())
    };

    const getExtentInUrl = async():Promise<IExtent> =>{

        const searchParams = urlFns.parseQuery();
        // console.log(searchParams)

        if(!searchParams[SearchParamKey4Extent]){
            return null;
        }

        type Modules = [typeof IExtent, typeof ISpatialReference];

        try {
            const [ 
                Extent,
                SpatialReference
            ] = await (loadModules([
                'esri/geometry/Extent',
                'esri/geometry/SpatialReference'
            ]) as Promise<Modules>);

            const [xmin, ymin, xmax, ymax] = searchParams[SearchParamKey4Extent].split(',')

            const extent = new Extent({
                xmin,
                ymin,
                xmax,
                ymax,
                spatialReference: new SpatialReference({
                    wkid: 102100
                })
            });

            return extent;

        } catch(err){   
            console.error(err);
        }

        return null;
    }

    React.useEffect(()=>{
        
        initMapView();
    }, []);

    return (
        <>
            <div 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                }}
                ref={mapDivRef}
            ></div>
            { 
                React.Children.map(children, (child)=>{
                    return React.cloneElement(child as React.ReactElement<any>, {
                        mapView,
                    });
                }) 
            }
        </>
    );
};
export default MapView;