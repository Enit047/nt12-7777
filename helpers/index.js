module.exports = {
    ifunique(x, y, options){
        if(x.toString() == y.toString()) {
            return options.fn(this)
        }
        return options.inverse(this)
    }
}