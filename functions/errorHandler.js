module.exports = {
    /**
     * @param {Boolean} allowed Is the process allowed to be killed?
     * @param {String} error The 'err.message'
     * @param {String} fn The function name. ex: ".find()"
     */
    kill: function(allowed = false, error, fn) {
        error = !error ? "(No error message provided)" : error;
        if(allowed) {
            throw new Error(`${fn} - ${error}`);
        } else {
            console.log(`An error occurred while executing [${fn}] : ${error}`);
        }
    },

    /**
     * Throws a slash at the end of a directory; this'll make directory specifying less sensitive.
     * 
     * Also less bulky putting this here instead of in the main file.
     * 
     * @param {String} directory 
     * @returns {String}
     */
    trailingSlash: function(directory) {
        if(directory[directory.length-1] == "/") return directory;
         return directory+"/";
    }
}
