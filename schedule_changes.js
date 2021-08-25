var changes
//Tells calendar_page.js to use its background script powers to fetch the calendar page from wpi.edu
chrome.runtime.sendMessage({greeting: 'get_calendar_page'}, function(response){
    var differentDays = []
    var daysOff = []
    var parser = new DOMParser()
    var calendarDocument = parser.parseFromString(response.text, 'text/html')
    let list = calendarDocument.getElementsByClassName('field-item even')[0]
    var state = 'season_header'
    var date = new Date('August 1, 1900') //Year is wrong so it's REALLY obvious if I fuck up
    var i = 0
    while (i < list.children.length){
        switch (state){
            case 'season_header':
                //Text says "Fall <current year>"
                let year = list.children[i].innerText.split(' ')[1]
                date.setFullYear(year)
                i++
                state = 'month_header'
                break
            case 'month_header':
                let month = list.children[i].innerText
                date = new Date(month + " 1, " + date.getFullYear())
                i++
                state = 'table'
                break
            case 'table':
                //console.log("Table is " + list.children[i].outerHTML)
                let table = list.children[i].children[0]
                for (var row = 0; row < table.children.length; row++){
                    //Regex will match "27-29" in "Nov 27-29", also matches dates not in ranges
                    let regex = /[1-3]?[0-9](\-[1-3]?[0-9])?/g
                    var dateString = table.children[row].children[0].innerText
                    var dateRangeArray = dateString.match(regex)[0].split('-')
                    var dates = []
                    if (dateRangeArray.length == 1){
                        dates = [parseInt(dateRangeArray[0])]
                    }
                    else if (dateRangeArray.length == 2){
                        for (var j = parseInt(dateRangeArray[0]); j <= parseInt(dateRangeArray[1]); j++){
                            dates.push(j)
                        }
                    }
                    else {
                        throw 'Date string ' + '\"' + dateString + '\" is invalid!'
                    }
                    let info = table.children[row].children[1].innerText
                    if (info.includes('No classes') || info.includes('no classes') || info.includes('No Classes')){
                        for (var j = 0; j < dates.length; j++){
                            date.setDate(dates[j])
                            //Create new Date() object in push because otherwise all entries would have
                            //the same date (passing by reference vs. by copy)
                            daysOff.push(new Date(date.getTime()))
                            console.log("Date " + date.toDateString() + " is a day off")
                        }
                    }
                    var addDifferentDay = function(dayToUse){
                        for (var j = 0; j < dates.length; j++){
                            date.setDate(dates[j])
                            //Passing by copy also happens here
                            differentDays.push({date: new Date(date.getTime()), dayToUse: dayToUse})
                            console.log("Date " + date.toDateString() + " follows day #" + dayToUse + " schedule")
                        }
                    }
                    //Checking for 'follow *** schedule' has whitespace issues
                    var followSchedule = function(dayStr){
                        return (info.includes('follow') || info.includes('Follow'))
                            && info.includes(dayStr)
                            && (info.includes('schedule') || info.includes('Schedule'))
                    }
                    if (followSchedule('Monday')){
                        addDifferentDay(1)
                    }
                    if (followSchedule('Tuesday')){
                        addDifferentDay(2)
                    }
                    if (followSchedule('Wednesday')){
                        addDifferentDay(3)
                    }
                    if (followSchedule('Thursday')){
                        addDifferentDay(4)
                    }
                    if (followSchedule('Friday')){
                        addDifferentDay(5)
                    }
                }
                date.setDate(1)
                i++
                state = 'unknown'
                break
            case 'unknown': //Figure out whether we have month or season header
                if(list.children[i].nodeName == 'H2'){
                    state = 'season_header'
                }
                else if(list.children[i].nodeName == 'H4'){
                    state = 'month_header'
                }
                else {
                    i++
                }
                break
        }
    }
    changes = {differentDays: differentDays, daysOff: daysOff}
})
