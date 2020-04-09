import * as React from 'react';

import {
    PindropCandiate
} from '../PinDropsCandidateLayer/PinDropsCandidateLayer';

interface Props {
    pindropCandidate:PindropCandiate;

    newCadidateOnAccept: ()=>void;
    newCadidateOnReject: ()=>void;
}

const PinDropsEditor:React.FC<Props> = ({
    pindropCandidate,
    newCadidateOnAccept,
    newCadidateOnReject
})=>{

    const getEditorCardForNewFeature = ()=>{
        return (
            <div className='alert is-active trailer-half'>
                <div style={{
                    'display': 'flex',
                    'placeContent': 'center flex-start'
                }}>
                    <div 
                        className='btn btn-transparent'
                        style={{
                            'padding': 0
                        }}
                        onClick={newCadidateOnReject}
                    >
                        <span>no</span>
                    </div>

                    <div 
                        className="inline-block" 
                        style={{
                            'margin': '0 auto'
                        }}
                    >
                        <span>Save Pin Drop</span>
                    </div>

                    <div 
                        className='btn btn-transparent'
                        style={{
                            'padding': 0
                        }}
                        onClick={newCadidateOnAccept}
                    >
                        <span>yes</span>
                    </div>
                </div>
            </div>
        );
    };

    const getEditorCardForExistingFeature = ()=>{
        return (
            <div></div>
        );
    };

    const getEditorCard = ()=>{

        if(!pindropCandidate){
            return null;
        }

        return pindropCandidate.ObjectId === undefined
            ? getEditorCardForNewFeature()
            : getEditorCardForExistingFeature();
    }

    return getEditorCard();
};

export default PinDropsEditor;