import * as React from 'react';

import {
    PindropCandiate
} from '../PinDropsCandidateLayer/PinDropsCandidateLayer';

interface Props {
    pindropCandidate:PindropCandiate;
    isEditingPindrop?: boolean;
    newCadidateOnAccept: ()=>void;
    rejectBtnOnClick: ()=>void;
    deleteBtnOnClick: ()=>void;
}

const PinDropsEditor:React.FC<Props> = ({
    pindropCandidate,
    isEditingPindrop,

    newCadidateOnAccept,
    rejectBtnOnClick,
    deleteBtnOnClick
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
                        onClick={rejectBtnOnClick}
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
            <div className='panel panel-white trailer-half'>
                <div>
                    <div className='font-size-1 trailer-half'>
                        <span className=''>Edit Pin Drop</span>
                        <span className='icon-ui-close right cursor-pointer' onClick={rejectBtnOnClick}></span>
                    </div>
                    <p className="font-size--3 trailer-quarter">Click on map to select a new location for this pin drop</p>
                </div>
                <div className='text-right'>
                    <span className='btn btn-transparent' onClick={deleteBtnOnClick}>delete</span>
                    <span className='btn btn-transparent'>update</span>
                </div>
            </div>
        );
    };

    const getEditorCard = ()=>{

        if(!pindropCandidate){
            return null;
        }

        const editorCard = pindropCandidate.ObjectId === undefined
            ? getEditorCardForNewFeature()
            : getEditorCardForExistingFeature();
        
        return (
            <div 
                style={{
                    'display': !isEditingPindrop ? 'block' : 'none'
                }}
            >
                { editorCard }
            </div>
        )
    }

    return getEditorCard();
};

export default PinDropsEditor;