import * as React from 'react';

interface Props {
    label: string;
    onChange: (isChecked:boolean)=>void;
    defaultValue?: boolean;
};

const ToggleSwitch:React.FC<Props> = ({
    label,
    onChange,
    defaultValue
})=>{

    const [ isChecked, setIsChecked ] = React.useState<boolean>(defaultValue || false);

    const toggleCheck = ()=>{
        const newVal = !isChecked;
        setIsChecked(newVal);
        onChange(newVal);
    }

    return (
        <label className="toggle-switch leader-1">
            <input 
                type="checkbox" 
                className="toggle-switch-input" 
                checked={isChecked}
                onChange={toggleCheck}
            />
            <span className="toggle-switch-track margin-right-1"></span>
            <span className="toggle-switch-label font-size--1">{label}</span>
        </label>
    )
};

export default ToggleSwitch;