
let GoogleAuth;



let isAuthorized;
let currentApiRequest;

/**
 * Store the request details. Then check to determine whether the user
 * has authorized the application.
 *   - If the user has granted access, make the API request.
 *   - If the user has not granted access, initiate the sign-in flow.
 */
function sendAuthorizedApiRequest(requestDetails) {
    currentApiRequest = requestDetails;
    if (isAuthorized) {
        loadClient();
        console.log('try Load Client')
    } else {
        GoogleAuth.signIn();
    }
}

/**
 * Listener called when user completes auth flow. If the currentApiRequest
 * variable is set, then the user was prompted to authorize the application
 * before the request executed. In that case, proceed with that API request.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        isAuthorized = true;
        if (currentApiRequest) {
            sendAuthorizedApiRequest(currentApiRequest);
        }
    } else {
        isAuthorized = false;
    }
}
