chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        if (request.greeting == 'get_calendar_page'){
            fetch('https://www.wpi.edu/offices/registrar/calendar')
                .then(response => response.text())
                .then(function(text){
                    sendResponse({text: text})
                })
            return true //allows listener to send response asynchronously without timing out
        }
    }
)
