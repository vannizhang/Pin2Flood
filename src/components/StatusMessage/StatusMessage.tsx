import * as React from 'react';

export type EditingTaskName = 'addPindrop' | 'deletePindrop' | 'updatePindrop' | '';

interface Props {
    task?: EditingTaskName;
    isDone?: boolean;
};

const EditingStatusMessage:React.FC<Props> = ({
    task,
    isDone
})=>{

    const getMessage = ()=>{
        const messages: {
            [key in EditingTaskName]?: string
        } = {
            'addPindrop': 'Adding new Pindrop',
            'deletePindrop': 'Delteing selected Pindrop',
            'updatePindrop': 'Updating selected Pindrop'
        };

        if(!messages[task]){
            return null;
        }

        return (
            <div className='alert alert-yellow is-active'>
                { messages[task] }
            </div>
        );
    };

    return task ? getMessage() : null;
};

export default EditingStatusMessage;