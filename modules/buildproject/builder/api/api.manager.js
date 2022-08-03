class ApiManager {
    
    constructor(opts = {}) {
        this.opts = opts;
    }

    build(projectSrc) {
        if (projectSrc.apiType == 'node') {
            return require('./node.api.builder')(this.opts).build(projectSrc);
        }
        console.log('Api not work to ' + projectSrc.apiType);
    }
}

module.exports = (opts = {}) => {
    return new ApiManager(opts);
}