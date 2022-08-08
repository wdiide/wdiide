class ApiManager {
    
    constructor(opts = {}) {
        this.opts = opts;
    }

    async build(projectSrc) {
        if (projectSrc.apiType == 'node') {
            return await require('./node.api.builder')(this.opts).build(projectSrc);
        }
        console.log('Api not work to ' + projectSrc.apiType);
    }
}

module.exports = (opts = {}) => {
    return new ApiManager(opts);
}