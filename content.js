main_code = function(){
    //Check that we're on View My Courses
    var text
    try {
        console.log("Trying to find \"View My Courses\"")
        text = document.getElementsByClassName('WCUK')[0].title
    }
    catch (e){}
    if (text == 'View My Courses'){
        //Do imports before running anything
        console.log("Found \"View My Courses\"")
        chrome.runtime.sendMessage({greeting: 'imports'}, function(response){
            var table = document.getElementsByClassName('mainTable')[0].children[3]
            window.exportAction = function() {
                var fileContents = '"Subject","Start Date","Start Time","End Date","End Time","Description","Location"\n'
                for (var row = 0; row < table.children.length; row++){
                    var line = []
                    for (var column = 0; column < 12; column++){
                        line.push(table.children[row].children[column].innerText)
                    }
                    fileContents += new Course(line).formatAsEntries()
                }
                //Use the background script powers of download.js to access the downloads API
                chrome.runtime.sendMessage({greeting: 'download', data: fileContents})
            }
            var button = document.createElement("input")
            button.id = "export_button"
            button.type = "button"
            button.value = "Export to CSV"
            button.onclick = window.exportAction
            button.style.width = "100%"
            button.style.height = "100px"
            button.style.fontSize = "32pt"
            button.style.backgroundColor = "#003366"
            document.body.insertBefore(button, document.body.children[0])
        })
    }

}

window.setTimeout(main_code, 10000);
