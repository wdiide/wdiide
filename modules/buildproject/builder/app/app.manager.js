class AppManager {
    
    constructor(opts = {}) {
        this.opts = opts;
    }

    async build(projectSrc) {
        if (projectSrc.appType == 'node') {
            return await require('./node.app.builder')(this.opts).build(projectSrc);
        }
        console.log('App not work to ' + projectSrc.appType);
    }
}

module.exports = (opts = {}) => {
    return new AppManager(opts);
}