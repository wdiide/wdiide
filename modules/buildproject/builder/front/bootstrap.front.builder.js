class BootstrapFrontBuilder {
    
    constructor(opts = {}) {
        this.opts = opts;
    }

    build(projectSrc) {
        if (projectSrc.frontType != 'bootstrap') {
            return false;
        }
        console.log('Bootstrap front não implementado ainda!');
    }
}

module.exports = (opts = {}) => {
    return new BootstrapFrontBuilder(opts);
}