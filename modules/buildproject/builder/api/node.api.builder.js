class NodeApiBuilder {
    
    constructor(opts = {}) {
        this.opts = opts;
    }

    async build(projectSrc) {
        if (projectSrc.apiType != 'node') {
            return false;
        }
        console.log('Node api não implementado ainda!');
    }
}

module.exports =  (opts = {}) => {
    return new NodeApiBuilder(opts);
}