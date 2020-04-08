import * as React from 'react';

interface Props {
    title?:string;
}
const ControlPanel:React.FC<Props> = ({
    title,
    children
})=>{

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

    return (
        <div 
            className='panel'
            style={{
                'position': 'absolute',
                'top': '1rem',
                'right': '1rem',
                'width': '350px',
                'zIndex': 5,
                'boxShadow': 'rgba(0, 0, 0, 0.2) 0px 2px 6px',
                'boxSizing': 'border-box'
            }}
        >
            { getTitle() }
            { children }
        </div>
    );
};

export default ControlPanel;