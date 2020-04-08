import './styles/index.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { setDefaultOptions } from 'esri-loader';

import EsriOAuth from './utils/Esri-OAuth/EsriOAuth';

import {
    AppContextProvider
} from './contexts/AppContextProvider';

import {
    App
} from './components';

import {
    Config
} from './AppConfig';

const init = async()=>{

    // make sure to use the latest version of JSAPI
    setDefaultOptions({
        version: '4.15' 
    });

    const esriOAuthUtils = new EsriOAuth({
        appId: Config["app-id"]
    });
    
    await esriOAuthUtils.init();

    ReactDOM.render(
        (
            <AppContextProvider
                esriOAuthUtils={esriOAuthUtils}
            >
                <App />
            </AppContextProvider>
        ), 
        document.getElementById('root')
    );
};

init();