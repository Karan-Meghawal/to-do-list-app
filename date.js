
module.exports.getDate =  getDate


function getDate(){
const today = new Date()
const option = {
    weekday:'long',
    day:'numeric',
    month:'long'

}
const day = today.toLocaleDateString("US-en",option)

return day
}

module.exports.getDay = getDay

function getDay(){
const today = new Date()
var option = {
    weekday:'long',
    

}
const day = today.toLocaleDateString("US-en",option)

return day
}