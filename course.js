class Course {
    constructor(data){
        if (data.length == 0 || data[0].length != 12){
            console.log('data.length = ' + data.length)
            console.log('data[0].length = ' + data[0].length)
            throw 'Course constructed with invalid data!'
        }
        this.courseString = data[0][1]
        this.title = data[0][2]
        this.startDate = data[0][6]
        this.endDate = data[0][7]
        //Collects together the properties that change between lines
        this.collectedArray = []
        var daysReformat = function(days) {
            var result = []
            for (var i = 0; i < days.length; i++){
                let day = days[i].toLowerCase()
                if (day == 'm'){
                    result.push(1)
                }
                if (day == 't'){
                    result.push(2)
                }
                if (day == 'w'){
                    result.push(3)
                }
                if (day == 'r'){
                    result.push(4)
                }
                if (day == 'f'){
                    result.push(5)
                }
            }
            return result
        }
        for (var i = 0; i < data.length; i++){
            //This addresses issue #6 (see the GitHub)
            if (data[i][9] == 'TBA'){
                this.collectedArray.push({valid: false})
                continue
            }
            let times = data[i][9].split('-')
            let collected = {
                days: daysReformat(data[i][8]),
                startTime: times[0].trim(),
                endTime: times[1].trim(),
                location: data[i][10],
                valid: true
            }
            this.collectedArray.push(collected)
        }
    }

    /*
    The format is as follows
    "Subject", "Start Date", "Start Time", "End Date", "End Time", "Description", "Location"
    */
    formatAsEntries(){
        var entries = ''
        let dayInMillis = 24 * 60 * 60 * 1000;
        //One day past so that it can be at 12:00 am rather than 11:59:59 pm
        let endDate = new Date(new Date(this.endDate).getTime() + dayInMillis);
        var currentDate = new Date(this.startDate)
        while (currentDate < endDate){
            var isDayOff = false
            for (var i = 0; i < changes.daysOff.length; i++){
                if (currentDate.getTime() == changes.daysOff[i].getTime()){
                    isDayOff = true
                    break
                }
            }
            //Check for Monday-is-a-Friday, etc. special cases
            var correctDay = currentDate.getDay()
            for (var i = 0; i < changes.differentDays.length; i++){
                if (currentDate.getTime() == changes.differentDays[i].date.getTime()){
                    correctDay = changes.differentDays[i].dayToUse
                    break
                }
            }
            if (!isDayOff){
                for (var i = 0; i < this.collectedArray.length; i++){
                    if (!this.collectedArray[i].valid){
                        continue
                    }
                    for (var j = 0; j < this.collectedArray[i].days.length; j++){
                        if (this.collectedArray[i].days[j] == correctDay){
                            let month = currentDate.getMonth() + 1
                            let date = currentDate.getDate()
                            let year = currentDate.getUTCFullYear()
                            entries += '\"' + this.courseString + '\"' + ','
                            entries += month + '/' + date + '/' + year + ','
                            entries += this.collectedArray[i].startTime + ','
                            entries += month + '/' + date + '/' + year + ','
                            entries += this.collectedArray[i].endTime + ','
                            entries += '\"' + this.title + '\"' + ','
                            entries += '\"' + this.collectedArray[i].location + '\"' + '\n'
                        }
                    }
                }
            }
            currentDate.setDate(currentDate.getDate() + 1)
        }
        return entries
    }
}
