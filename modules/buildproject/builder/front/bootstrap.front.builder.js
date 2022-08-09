class BootstrapFrontBuilder {
    
    constructor(opts = {}) {
        this.opts = opts;
    }

    async build(projectSrc) {
        if (projectSrc.frontType != 'bootstrap') {
            return false;
        }
        console.log('Bootstrap front não implementado ainda!');
    }
}

module.exports = (opts = {}) => {
    return new BootstrapFrontBuilder(opts);
}