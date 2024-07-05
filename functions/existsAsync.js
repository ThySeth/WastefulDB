module.exports = {
    /**
     * Asynchronously check if a file exists!
     * @param {String} file File name to check?
     * @param {String} directory.dir What directory to check for the file in? 
     * @returns {Promise}
     */
    fileReal: async function(file, directory) {
        try {
            return await fs.promises.stat(file) ? true : "";
        } catch(err) {
            return false;
        }
    }
}
