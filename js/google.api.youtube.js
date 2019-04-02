
const ID_SNIPPED_DATA_CONTAINER = 'snipped-data-container';

let videoId = null;

let responseStore = {
    data:null,
    error:null
};


let chatStore = null;


let LiveStreamRequest = {
    part:"id, snippet, contentDetails, status",
    mine:true
};





class StreamSnippet
{
    constructor(containerName)
    {
        this.conteiner = document.getElementById(containerName);
    }

    static renderSnippet(name,img,desc,item = null)
    {
        return '<div class="snipped" data-chatId="' + ((item != null && item.snippet.liveChatId !== undefined ) ? item.snippet.liveChatId : '') + '"><img src=" ' + img + '" alt="' + desc + '"><div class="snipped-text">' + name + '</div> </div>';
    }

    handleData(data)
    {
        if(data.items !== undefined && data.items.length>0) {
            for(let i=0;i<data.items.length;i++) {
                this.appendData(
                    StreamSnippet.renderSnippet(
                        data.items[i].snippet.title,
                        data.items[i].snippet.thumbnails.default.url,
                        data.items[i].snippet.description,
                        data.items[i]
                    )
                );
            }
        }
    }

    clearContainer()
    {
        this.conteiner.innerHTML = '';
    }

    appendData(html)
    {
        this.conteiner.insertAdjacentHTML('beforeend',html);
    }
}



class StreamMessages {

    constructor(name)
    {
        this.container = document.getElementById(name);
        this.messageStore = {};
        this.clearMessageIteval = null;
        this.newMessageIteval = null;
    }

    readNewMessages()
    {
       this.getChatMessage(videoId).then(function (result) {
           MessageObj.handleData(result.items);
       });

    }

    handleData(items)
    {
        if(items.length > 0) {
            for (let i=0; i<items.length;i++) {
                 if(this.messageStore[items[i].id] == undefined){
                     let comment = this.renderComment(
                         items[i].authorDetails.profileImageUrl,
                         items[i].authorDetails.displayName,
                         items[i].snippet.displayMessage,
                         items[i].id
                     );

                    // $('#chat-container-id').isOverflowHeight();
                     this.appendCooment(comment);
                     this.messageStore[items[i].id] = items[i].id;
                 }
            }
        }
    }

    renderComment(avatar,name,comment,id)
    {
        return  '   <div id="' + id + '" class="comment">\n' +
            '            <img class="avatar" src="' + avatar + '">\n' +
            '            <span class="text"><span class="name">' + name + '</span>' + comment + '</span>\n' +
            '        </div>'
    }

    appendCooment(html)
    {
        this.container.insertAdjacentHTML('beforeend',html);
    }

    async getChatMessage(id) {
        return await gapi.client.youtube.liveChatMessages.list({
            liveChatId: id,
            part: "snippet,authorDetails",
            profileImageSize: 16
        }).then(function(response) {
                return response.result;
            });
    }

    initClearMessageInterval()
    {
        this.clearMessageIteval = setInterval(function() {
            let comments = $('.comment');
            if(comments.length >0) {
                $(comments[0]).fadeOut( "slow",function () {
                    comments[0].remove();
                } );
            }
        }, 10000);
    }

    initNewMessageInterval()
    {
        this.newMessageIteval = setInterval(function () {
            MessageObj.readNewMessages();
        }, 5000);
    }

}



function getBroadcastList() {
    return gapi.client.youtube.liveBroadcasts.list(LiveStreamRequest)
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                responseStore.data = response;
               // SnippetObj.clearContainer();
               // SnippetObj.handleData(responseStore.data.result);
                videoId = getLiveChatId();

            },
            function(err) {
                console.log('error');
                responseStore.error = err
            });
}

function getLiveChatId() {
    if(responseStore.data.result !== undefined && responseStore.data.result.items.length > 0 ) {
        if(responseStore.data.result.items[0].snippet.liveChatId !== undefined) {
            return  responseStore.data.result.items[0].snippet.liveChatId;
        }
    }

    return null;
}

