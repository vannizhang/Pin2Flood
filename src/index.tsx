import './styles/index.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { setDefaultOptions } from 'esri-loader';

import { urlFns } from 'helper-toolkit-ts';

import EsriOAuth from './utils/Esri-OAuth/EsriOAuth';

import {
    AppContextProvider
} from './contexts/AppContextProvider';

import {
    App,
    EOCApp
} from './components';

import {
    Config,
    PinDropsLayerConfig,
    Pin2FloodPolygonsLayerConfig
} from './AppConfig';

import { 
    getAgolItemData
} from './services/arcgis-online-item-data/agolItemData';

const init = async()=>{

    const pathnames = window.location.pathname.split('/').filter(path=>path);
    const isEOC = pathnames[pathnames.length - 1] === 'eoc';

    // make sure to use the latest version of JSAPI
    setDefaultOptions({
        version: '4.15' 
    });

    const searchParams = urlFns.parseQuery();

    const customAppId = searchParams.appId;
    const esriOAuthUtils = new EsriOAuth({
        appId: customAppId || Config["app-id"]
    });

    try {
        // sign in and get user data and credentials
        const { credential } = await esriOAuthUtils.init();
        const { token } = credential;
        // console.log(credential, credential.token);
    
        const userData = esriOAuthUtils.getUserData();
        const { customHostUrl } = userData;
        // console.log('userData', userData);
        
        // check custom Item Ids for Pindrops Layer and Pin2Flood Polygons layer from search params 
        const customPindropsLayerId = searchParams.pindropsItemId;
        const customPin2FloodPolygonsLayerId = searchParams.floodPolygonsItemId;

        const customPindropsLayer = customPindropsLayerId
            ? await getAgolItemData({
                itemId: customPindropsLayerId,
                token,
                customHostUrl
            }) : null;
        // console.log(customPindropsLayer);
        
        const pindropsLayerInfo = {
            itemId: customPindropsLayer 
                ? customPindropsLayer.id 
                : PinDropsLayerConfig.itemID,

            serviceUrl: customPindropsLayer 
                ? customPindropsLayer.url + '/0' 
                : PinDropsLayerConfig.serviceUrl
        };
    
        const customPin2FloodPolygonsLayer = customPin2FloodPolygonsLayerId
            ? await getAgolItemData({
                itemId: customPin2FloodPolygonsLayerId,
                token,
                customHostUrl
            }) : null;
        // console.log(customPin2FloodPolygonsLayer);

        const pin2floodPolygonsLayerInfo = {

            itemId: customPin2FloodPolygonsLayer 
                ? customPin2FloodPolygonsLayer.itemId 
                : Pin2FloodPolygonsLayerConfig.itemID,

            serviceUrl: customPin2FloodPolygonsLayer 
                ? customPin2FloodPolygonsLayer.url + '/0' 
                : Pin2FloodPolygonsLayerConfig.serviceUrl
        };
    
        ReactDOM.render(
            (
                <AppContextProvider
                    esriOAuthUtils={esriOAuthUtils}
                    userData={userData}
                >
                    {
                        !isEOC
                        ? <App 
                            pindropsLayerInfo={pindropsLayerInfo}
                            pin2floodPolygonsLayerInfo={pin2floodPolygonsLayerInfo}
                            token={token}
                        />
                        : <EOCApp 
                            pindropsLayerInfo={pindropsLayerInfo}
                        />
                    }

                </AppContextProvider>
            ), 
            document.getElementById('root')
        );

    } catch(err){
        console.error(err);
    }

};

init();