main_code = function(){
    //Check that we're on View My Courses
    var text
    try {
        text = document.getElementsByClassName('WCUK')[0].title
    }
    catch (e){
        return "not set up"
    }
    if (text == 'View My Courses'){
        //Do imports before running anything
        console.log("Entered main code")
        chrome.runtime.sendMessage({greeting: 'imports'}, function(response){
            var table = document.getElementsByClassName('mainTable')[0].children[3]
            window.exportAction = function() {
                var fileContents = '"Subject","Start Date","Start Time","End Date","End Time","Description","Location"\n'
                /*
                data contains the necessary lines from the table to create a Course object.
                Since courses can have multiple meeting times, the data array may need to be multiple lines long.
                 */
                var data = []
                for (var row = 1; row < table.children.length - 1; row++){
                    //If a row starts blank, treat it as another line of data for the course being constructed
                    if (table.children[row].children[0].innerText.trim().length != 0){
                        if (data.length != 0){
                            fileContents += new Course(data).formatAsEntries()
                        }
                        data = []
                    }
                    var line = []
                    for (var column = 0; column < 12; column++){
                        line.push(table.children[row].children[column].innerText)
                    }
                    data.push(line)
                }
                fileContents += new Course(data).formatAsEntries()
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
        return "set up"
    }
    return "not set up"
}

var tries = 0
var try_main = function(){
    var result = main_code()
    if(result == "not set up" && tries < 100){
        tries++
        window.setTimeout(try_main, 100)
    }
}

window.onload = try_main
