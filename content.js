//If the Concise Student Schedule page is past the term selection screen
var text
try {
    text = document.getElementsByClassName('plaintable')[3].children[0].children[0].children[0].innerText
}
catch (e){}
if (text == 'Concise Student Schedule'){
    //Do imports before running anything
    chrome.runtime.sendMessage({greeting: 'imports'}, function(response){
        var table = document.getElementsByClassName('datadisplaytable')[1].children[0]
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
}
