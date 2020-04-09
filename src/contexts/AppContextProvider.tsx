import * as React from 'react';

import EsriOAuth from '../utils/Esri-OAuth/EsriOAuth';
import IFeatureLayer from 'esri/layers/FeatureLayer';

interface ContextProps {
    esriOAuthUtils: EsriOAuth;
    userId: string;

    pindropsLayer: IFeatureLayer;
    setPindropsLayer: (layer:IFeatureLayer)=>void;
};

interface AppContextProviderProps {
    esriOAuthUtils: EsriOAuth;
};

export const AppContext = React.createContext<ContextProps>(null);

export const AppContextProvider:React.FC<AppContextProviderProps> = ({ 
    esriOAuthUtils,
    children 
})=>{

    const [ pindropsLayer, setPindropsLayer ] = React.useState<IFeatureLayer>()

    const userData = esriOAuthUtils.getUserData();

    const value = {
        esriOAuthUtils,
        userId: userData.id,

        pindropsLayer,
        setPindropsLayer
    };

    return (
        <AppContext.Provider value={value}>
            { children }
        </AppContext.Provider>
    )
};