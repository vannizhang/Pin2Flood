import * as React from 'react';
import classnames from 'classnames';

interface Props {
    activeValue: number;
    onSelect: (val?:number)=>void;
}

const TimeSwitcherData = [
    {
        'label': '1 hr',
        'value': 1
    },
    {
        'label': '2 hr',
        'value': 2
    },
    {
        'label': 'Max',
        'value': null
    }
];

const PinDropsTimeSwitcher:React.FC<Props> = ({
    activeValue,
    onSelect
})=>{

    const getNavBtns = ()=>{

        return TimeSwitcherData.map((d, i)=>{

            const { label, value } = d;

            const className = classnames('btn btn-grouped', {
                'btn-clear': value !== activeValue
            });

            return (
                <div
                    key={`PinDropsTimeSwitcher-Btn-${i}`}
                    className={className}
                    style={{
                        'width': '33%',
                        'textAlign': 'center'
                    }}
                    onClick={onSelect.bind(this, value)}
                >
                    {label}
                </div>
            );
        });

    };
    
    return (
        <div className='leader-quarter trailer-half'>

            <div className='trailer-quarter phone-hide'>
                <span className="font-size--2 ">pins for last:</span>
            </div>
            
            <nav>
                { getNavBtns() }
            </nav>
        </div>
    );
};

export default PinDropsTimeSwitcher;