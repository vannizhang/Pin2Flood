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
                    onClick={onSelect.bind(this, value)}
                >
                    {label}
                </div>
            );
        });

    };
    
    return (
        <nav>
            { getNavBtns() }
        </nav>
    );
};

export default PinDropsTimeSwitcher;