import * as React from 'react';
import classnames from 'classnames';

interface Data {
    label: string;
    value: string | number;
}

interface Props {
    title: string;
    data: Data[];
    onSelect: (val?:number | string)=>void;
}

const PinDropsTimeSwitcher:React.FC<Props> = ({
    title,
    data,
    onSelect
})=>{

    // use the past hour to filter pindrop features added in past hours
    const [ activeValue, setActiveValue ] = React.useState<number | string>(data[0].value);

    const getNavBtns = ()=>{

        return data.map((d, i)=>{

            const { label, value } = d;

            const className = classnames('btn btn-grouped', {
                'btn-clear': value !== activeValue
            });

            return (
                <div
                    key={`switcher-btn-${i}`}
                    className={className}
                    style={{
                        'width': '33%',
                        'textAlign': 'center'
                    }}
                    onClick={setActiveValue.bind(this, value)}
                >
                    {label}
                </div>
            );
        });

    };

    React.useEffect(()=>{
        onSelect(activeValue);
    }, [activeValue]);
    
    return (
        <div className='leader-quarter trailer-half'>

            <div className='trailer-quarter phone-hide'>
                <span className="font-size--2 ">{title}:</span>
            </div>
            
            <nav>
                { getNavBtns() }
            </nav>
        </div>
    );
};

export default PinDropsTimeSwitcher;