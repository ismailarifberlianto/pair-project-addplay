const createAt = (time) => {
    let date = typeof time === 'object' ? time : new Date(time);
    let today = new Date
    let seconds = Math.round((today - date) / 1000)
    let minutes = Math.round(seconds / 60);
    let hour = Math.round(minutes / 60);
    
    if (seconds < 5) {
        return 'now'
    } else if (seconds < 60) {
        return `${seconds} seconds ago`
    } else if (seconds < 90) {
        return 'about a minute ago'
    } else if (minutes < 60) {
        return `${minutes} minutes ago`
    } else if (hour < 24) {
        return `${hour} hours ago`
    } else if (hour < 48) {
        return 'yesterday'
    } else {
        let days = Math.round(hour / 24)
        return `${days} days ago`
    }
}

module.exports = createAt