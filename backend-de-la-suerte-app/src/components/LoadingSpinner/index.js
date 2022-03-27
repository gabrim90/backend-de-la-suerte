import React from 'react';
import { SpinnerImg} from './styles'

const LOADING_SPINNER = 'https://c.tenor.com/I6kN-6X7nhAAAAAi/loading-buffering.gif'


export const LoadingSpinner = () => {
    
    
        return (
            <div>
                <SpinnerImg src={LOADING_SPINNER}></SpinnerImg>
            </div>
        );
    
}

