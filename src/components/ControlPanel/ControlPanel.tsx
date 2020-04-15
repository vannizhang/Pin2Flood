import * as React from 'react';

import { miscFns } from 'helper-toolkit-ts';

interface Props {
    title?:string;
}
const ControlPanel:React.FC<Props> = ({
    title,
    children
})=>{

    const isMobile = miscFns.isMobileDevice();

    const [isHide, setIsHide] = React.useState<boolean>(false);

    const getTitle = ()=>{
        if(!title){
            return null;
        }

        return (
            <div
                style={{
                    'borderBottom': 'solid 1px rgba(0, 0, 0, 0.1)',
                    'textAlign': 'center'
                }}
            >
                <h4 className="trailer-quarter">{title}</h4>
            </div>
        )
    }

    const getStyle = ():React.CSSProperties=>{

        const desktopStyle:React.CSSProperties = {
            'position': 'absolute',
            'top': '1rem',
            'right': '1rem',
            'width': '350px',
            'zIndex': 5,
            'boxShadow': 'rgba(0, 0, 0, 0.2) 0px 2px 6px',
            'boxSizing': 'border-box'
        };

        const mobileStle:React.CSSProperties = {
            'position': 'absolute',
            'left': '0',
            'right': '0',
            'bottom': '0',
            'zIndex': 5
        };

        return isMobile
            ? mobileStle
            : desktopStyle;
    };

    const getToggleBtn = ()=>{
        return (
            <div
                style={{
                    'padding': '.5rem 0px',
                    'borderBottom': '1px solid #efefef',
                    'textAlign': 'center',
                    'background': '#f8f8f8'
                }}
                onClick={setIsHide.bind(this, !isHide)}
            >
                {
                    isHide 
                    ? <span className='icon-ui-up'></span>
                    : <span className='icon-ui-down'></span>
                }
            </div>
        )
    };

    const getContent = ()=>{
        if(isHide){
            return null;
        }

        return (
            <div className='panel'>
                {getTitle()}
                {children}
            </div>
        )
    }

    return (
        <div 
            style={getStyle()}
        >
            { getToggleBtn () }
            { getContent() }
        </div>
    );
};

export default ControlPanel;