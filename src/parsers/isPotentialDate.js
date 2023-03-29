function isPotentialDate(input) {
    const dateRegexes = [
        /^(\d{2}|\d{4})-(\d{2})-(\d{2})$/,                           // YY-MM-DD or YYYY-MM-DD    
        /^(\d{2})\/(\d{2})\/(\d{2}|\d{4})$/,                         // MM/DD/YY or MM/DD/YYYY    
        /^(\d{2}|\d{4})\/(\d{2})\/(\d{2})$/,                         // YY/MM/DD or YYYY/MM/DD    
        /^([a-z]{3}) (\d{1,2}), (\d{2}|\d{4})$/i,                    // MMM DD, YY or MMM DD, YYYY
        /^([a-z]{4,}) (\d{1,2}), (\d{2}|\d{4})$/i,                   // MMMM DD, YY or MMMM DD, YYYY
        /^(\d{1,2}) ([a-z]{3}) (\d{2}|\d{4})$/i,                     // DD MMM YY or DD MMM YYYY
        /^(\d{1,2}) ([a-z]{4,}) (\d{2}|\d{4})$/i,                    // DD MMMM YY or DD MMMM YYYY
        /^(\d{2}|\d{4})-(\d{2})-(\d{2,4})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z$/,   // YY-MM-DDTHH:mm:ss.sssZ or YYYY-MM-DDTHH:mm:ss.sssZ
        /^(\d{2}|\d{4})-(\d{2})-(\d{2,4})T(\d{2}):(\d{2}):(\d{2})Z$/       // YY-MM-DDTHH:mm:ssZ or YYYY-MM-DDTHH:mm:ssZ
    ]

    // If the input is not a string, return false
    if (typeof input !== 'string') return false

    for (let regex of dateRegexes) {
        if (regex.test(input)) {
            return true;
        }
    }

    return false
}

module.exports = { isPotentialDate }
