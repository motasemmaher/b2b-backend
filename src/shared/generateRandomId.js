//Exporting the generating method
module.exports = {
    //A method to generate teh random Id
    generateId()
    {
        return Math.random().toString(36).substr(2, 9);
    }
}