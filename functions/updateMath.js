module.exports = {
    /**
     * 
     * @param {Object} obj The object contained within the target document.
     * @param {Object} data The arguments received in the update function.
     */
    objectMath: function(obj, data) {
        // data = key, child, change
        // obj = file
        if(isNaN(data.change) || (isNaN(obj[data.key]) && (data.child ? isNaN((obj[data.key]))[data.child] : ""))) return -1
    }
}
