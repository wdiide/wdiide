const system = require('./util/system');

class ProjectBuilder {

    constructor(opts = {}) {
        this.opts = opts;
        this.repoManager = require('./repo/repo.manager')(this.opts);
        this.appManager = require('./api/api.manager')(this.opts);
        this.frontManager = require('./front/front.manager')(this.opts);
    }

    async build(projectSrc) {
        await this.createProjectInit(projectSrc);
        await this.repoManager.build(projectSrc);
        await this.appManager.build(projectSrc);
        await this.frontManager.build(projectSrc);
    }

    async createProjectInit(projectSrc){
        await system.rmdir(this.opts.workspace+'/'+projectSrc.name, {recursive:true});
        console.log('projeto removido');
        await system.mkdir(this.opts.workspace+'/'+projectSrc.name);
    }
}

module.exports = (opts = {}) => {
    return new ProjectBuilder(opts);
}