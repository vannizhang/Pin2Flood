import * as React from 'react';

import EsriOAuth from '../utils/Esri-OAuth/EsriOAuth';

interface ContextProps {
    esriOAuthUtils: EsriOAuth;
};

interface AppContextProviderProps {
    esriOAuthUtils: EsriOAuth;
};

export const AppContext = React.createContext<ContextProps>(null);

export const AppContextProvider:React.FC<AppContextProviderProps> = ({ 
    esriOAuthUtils,
    children 
})=>{

    const value = {
        esriOAuthUtils
    };

    return (
        <AppContext.Provider value={value}>
            { children }
        </AppContext.Provider>
    )
};