class ProjectBuilder {

    constructor(opts = {}) {
        this.opts = opts;
        this.appManager = require('./api/api.manager')(this.opts);
        this.frontManager = require('./front/front.manager')(this.opts);
        this.repoManager = require('./repo/repo.manager')(this.opts);
    }

    build(projectSrc) {
        this.appManager.build(projectSrc);
        this.frontManager.build(projectSrc);
        this.repoManager.build(projectSrc);
    }
}

module.exports = (opts = {}) => {
    return new ProjectBuilder(opts);
}