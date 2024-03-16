module.exports = {
    /**
     * @param {Boolean} allowed Is the process allowed to be killed?
     * @param {String} error The 'err.message'
     * @param {*} fn The function name. ex: ".find()"
     */
    kill: function(allowed = false, error, fn) {
        error = !error ? "(No error message provided)" : error;
        if(allowed) {
            throw new Error(`${fn} - ${error}`);
        } else {
            console.log(`An error occurred while executing [${fn}] : ${error}`);
        }
    }
}
