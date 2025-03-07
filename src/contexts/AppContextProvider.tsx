import * as React from 'react';

import EsriOAuth from '../utils/Esri-OAuth/EsriOAuth';
import IFeatureLayer from 'esri/layers/FeatureLayer';

interface UserData {
    name: string;
    id: string;
    customHostUrl: string;
    group: string
}

interface ContextProps {
    esriOAuthUtils: EsriOAuth;
    userData: UserData;

    pindropsLayer: IFeatureLayer;
    setPindropsLayer: (layer:IFeatureLayer)=>void;
};

interface AppContextProviderProps {
    esriOAuthUtils: EsriOAuth;
    userData: UserData;
    children: React.ReactNode;
};

export const AppContext = React.createContext<ContextProps>(null);

export const AppContextProvider:React.FC<AppContextProviderProps> = ({ 
    esriOAuthUtils,
    userData,
    children 
})=>{

    const [ pindropsLayer, setPindropsLayer ] = React.useState<IFeatureLayer>()

    const value = {
        esriOAuthUtils,
        userData,

        pindropsLayer,
        setPindropsLayer
    };

    return (
        <AppContext.Provider value={value}>
            { children }
        </AppContext.Provider>
    )
};