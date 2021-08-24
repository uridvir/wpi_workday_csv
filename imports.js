chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        if (request.greeting == 'imports'){
            //Add more imports here
            //Loads schedule_changes.js first because course.js is dependent on it
            chrome.tabs.executeScript({file: 'schedule_changes.js'},
                chrome.tabs.executeScript({file: 'course.js'}, sendResponse({}))
            )
        }
    }
)
