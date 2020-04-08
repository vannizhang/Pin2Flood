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