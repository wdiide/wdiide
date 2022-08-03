class FrontManager {

    constructor(opts = {}) {
        this.opts = opts;
    }

    build(projectSrc) {
        if (projectSrc.frontType == 'bootstrap') {
            return require('./bootstrap.front.builder')(this.opts).build(projectSrc);
        }
        console.log('Front not work to ' + projectSrc.frontType);
    }
}

module.exports = (opts = {}) => {
    return new FrontManager(opts);
}