import {
    InlineLoading,
} from 'carbon-components';

export function startRequest(view, requestId) {
    view.activeRequests[requestId] = true;
    view.inlineLoadingInstance.setState(InlineLoading.states.ACTIVE);
}

export function endRequest(view, requestId) {
    delete view.activeRequests[requestId];
    if (Object.keys(view.activeRequests).length === 0) {
        console.log('Requests complete');
        view.inlineLoadingInstance.setState(InlineLoading.states.FINISHED);
    }
}