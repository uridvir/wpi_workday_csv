chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        if (request.greeting == 'download'){
            var blob = new Blob([request.data], {type: 'text/csv'})
            var url = URL.createObjectURL(blob)
            chrome.downloads.download({url: url, filename: 'Schedule.csv', saveAs: true}, function(id){
                sendResponse({})
            })
            return true //allows listener to send response asynchronously without timing out
        }
    }
)
