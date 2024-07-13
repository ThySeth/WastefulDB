module.exports = {
    /**
     * Boolean & Null Stringification!
     * @param {String} text The target string to filter through.
     */
    BNS: function(text) {
        switch(text) {
            case "false":
                text = false;
            break;
            case "true":
                text = true;
            break;
            case "null":
                text = null;
            break;
            case "0":
                text = 0;
            break;
        }
        return text;
    },

    clog: function(text) {
        console.log(text);
    }
}
