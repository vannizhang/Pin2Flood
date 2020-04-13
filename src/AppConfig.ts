export const Config = {
    // https://arcgis-content.maps.arcgis.com/home/item.html?id=c7490d31f52c434680edc88d2bb153bf#overview 
    'app-id': 'co1isKL7Rcyr6klX'
};

export const MapConfig = {
    'web-map-id': '03c324e32fff411d9d1db7883ab14dce'
};

export const PinDropsLayerConfig = {
    'itemID': '51a65beece9247a59e40c39bd4bb9d36',
    'serviceUrl': 'https://services.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/flood_app_pin_drops/FeatureServer/0',
    'fields': [
        {
            'fieldName': 'userid',
            'displayName': 'User ID'
        },
        {
            'fieldName': 'fullname',
            'displayName': 'User Full Name'
        },
        {
            'fieldName': 'querytime',
            'displayName': 'Pindrop Time'
        },
        {
            'fieldName': 'compositeid',
            'displayName': 'Composite ID'
        },
    ],
    'styles': {
        'current-user': {
            'color': [255,0,0,1]
        },
        'others': {
            'color': [0,0,0,1]
        }
    }
};

export const Pin2FloodPolygonsLayerConfig = {
    'itemID': 'cbbd8084f50c42aa9c69f63b4d113015',
    'serviceUrl': 'https://services.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/Pin2FloodPolygons/FeatureServer/0',
    'fields': [
        {
            'fieldName': 'userid',
            'displayName': 'User ID'
        },
        {
            'fieldName': 'fullname',
            'displayName': 'User Full Name'
        },
        {
            'fieldName': 'pindrop_id',
            'displayName': 'Pindrop ID'
        },
        {
            'fieldName': 'pin_drop_time',
            'displayName': 'Pindrop Time'
        },
        {
            'fieldName': 'compositeid',
            'displayName': 'Composite ID'
        },
    ],
};

export const FloodInnudationPolygonsLayerConfig = {
    'serviceUrl': 'https://flood.arcgis.com/arcgis/rest/services/NFIE/NWM_Flood_Inundation_Polygons/MapServer/0',
    'fields': [
        {
            "name": "hid",
            "type": "esriFieldTypeSmallInteger",
            "alias": "Height Above Nearest Drain (HAND) Identifier Index (1 based)"
        },
        {
            "name": "compositeid",
            "type": "esriFieldTypeInteger",
            "alias": "Compsite Lookup Identifier"
        }
    ]
};

export const NationalWaterModelFloodPolysConfig = {
    "serviceUrl": "https://flood.arcgis.com/arcgis/rest/services/NFIE/NationalWaterModel_FloodPolys_Short/MapServer/0",
    'fields': [
        {
            "name": "egdb.dbo.short_term_current.hid",
            "type": "esriFieldTypeSmallInteger",
            "alias": "hid"
        },
        {
            "name": "egdb.dbo.FloodPolygons.compositeid",
            "type": "esriFieldTypeInteger",
            "alias": "Compsite Lookup Identifier"
        },
        {
            "name": "egdb.dbo.FloodPolygons.streamid",
            "type": "esriFieldTypeInteger",
            "alias": "Stream Hydrologic Identifier"
        },
    ]
};

export const DepthContourLayerConfig = {
    'serviceUrl': 'https://flood.arcgis.com/arcgis/rest/services/NFIE/NWM_Depth_Contours_Short/MapServer'
}