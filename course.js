class Course {
    constructor(line){
        this.name = line[4]
        this.format = line[5]
        this.startDate = line[9]
        this.endDate = line[10]

        var daysReformat = function(days) {
            var result = []
            let lower_days = days.toLowerCase()
            if (lower_days.includes('m')){
                result.push(1)
            }
            if (lower_days.includes('t')){
                result.push(2)
            }
            if (lower_days.includes('w')){
                result.push(3)
            }
            if (lower_days.includes('r')){
                result.push(4)
            }
            if (lower_days.includes('f')){
                result.push(5)
            }
            return result
        }

        let days_time_location = line[6].split('|')
        let times = days_time_location[1].split('-')
        this.days = daysReformat(days_time_location[0]),
        this.startTime = times[0].trim(),
        this.endTime = times[1].trim(),
        this.location = days_time_location[2].trim(),
        this.valid = true
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
                if (this.valid){
                    for (var j = 0; j < this.days.length; j++){
                        if (this.days[j] == correctDay){
                            let month = currentDate.getMonth() + 1
                            let date = currentDate.getDate()
                            let year = currentDate.getUTCFullYear()
                            entries += '\"' + this.name + '\"' + ','
                            entries += month + '/' + date + '/' + year + ','
                            entries += this.startTime + ','
                            entries += month + '/' + date + '/' + year + ','
                            entries += this.endTime + ','
                            entries += '\"' + this.format + '\"' + ','
                            entries += '\"' + this.location + '\"' + '\n'
                            break
                        }
                    }
                }
            }
            currentDate.setDate(currentDate.getDate() + 1)
        }
        return entries
    }
}
