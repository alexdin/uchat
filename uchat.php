<?php
 $chatId = (isset($_GET['id']) && !empty($_GET['id'])) ? $_GET['id'] : '';
 $chatId = htmlspecialchars(html_entity_decode($chatId));

 ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="/css/chat.css">
    <script src="/js/jquery.min.js"></script>
    <script src="/js/api.js"></script>
    <script src="/js/google.api.youtube.js"></script>
    <script src="/js/OAuthHelper.js"></script>
    <title>Chat</title>
</head>
<script>

    let SnippetObj = null;
    let MessageObj = null;
    document.addEventListener("DOMContentLoaded", function () {
        SnippetObj = new StreamSnippet(ID_SNIPPED_DATA_CONTAINER);
        MessageObj = new StreamMessages('chat-container-id');
    });

    videoId = '<?=$chatId?>';

    /**
     * Sample JavaScript code for youtube.liveChatMessages.list
     * See instructions for running APIs Explorer code samples locally:
     * https://developers.google.com/explorer-help/guides/code_samples#javascript
     */

    async function authenticate() {
        return await GoogleAuth
            .signIn({scope: "https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly"})
            .then(function() { console.log("Sign-in successful"); },
                function(err) { console.error("Error signing in", err); });
    }
    function loadClient() {
        return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/youtube/v3/rest")
            .then(function() { console.log("GAPI client loaded for API"); },
                function(err) { console.error("Error loading GAPI client for API", err); });
    }
    // Make sure the client is loaded and sign-in is complete before calling this method.
    function execute() {
        return gapi.client.youtube.liveBroadcasts.list(LiveStreamRequest)
            .then(function(response) {
                    // Handle the results here (response.result has the parsed body).
                    responseStore.data = response;
                    console.log('ok');
                },
                function(err) {
                    console.log('error');
                    responseStore.error = err
                });
    }
    gapi.load("client:auth2", function() {
        gapi.auth2.init({client_id: "325464991668-7td1mt49jrtos3h88i7ierh8e9f8tvv3.apps.googleusercontent.com"}).then(function () {
            GoogleAuth = gapi.auth2.getAuthInstance();

            // Listen for sign-in state changes.
            GoogleAuth.isSignedIn.listen(updateSigninStatus);

            // Handle the initial sign-in state.
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

            if(isAuthorized){
                loadClient().then(function () {
                    initChat();

                });
            }else{
                authenticate().then(function () {
                    initChat();
                });
            }

            console.log( 'Is auth: ' + isAuthorized);
        });
    });

    function initChat() {
        loadClient().then(function () {
            getBroadcastList().then(function () {
                if (videoId !== '' && videoId !== null) {
                    console.log(' id:' + videoId);
                    MessageObj.readNewMessages();
                }
            });
        });
    }
</script>
<body>
    <div class="chat-container" id="chat-container-id">

    </div>
<script>
    let chatId = '<?=$chatId?>';
</script>
</body>
</html>
