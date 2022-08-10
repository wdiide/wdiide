const system = require("../util/system");
const appNode = require("./createNode/app.node");
const routerNode = require("./createNode/router.node");

class NodeAppBuilderInternal {
    constructor(opts = {}) {
        this.opts = opts;
    }
    async initProject(projectSrc){
        
        await this.createExpressPugProject(projectSrc);
        
        await this.createAngularProject(projectSrc);
        
        return 'ok';
    }
    
    async createExpressPugProject(projectSrc){
        let _self = this;
        // Craindo projeto em Express Pug
        let shScript = `cd ${_self.opts.workspace} && `
        shScript += ` npx express-generator@4.16.1 --view=pug ${projectSrc.name}`
        await system.exec(shScript);
        
        // Construindo projeto em Angular
        shScript = `cd ${_self.opts.workspace}/${projectSrc.name} && `
        shScript += `npm install`;
        await system.exec(shScript);

        routerNode.create(this.opts);
        appNode.create(this.opts);
    }

    async createAngularProject(projectSrc){
        let _self = this;
        // Craindo projeto em Angular
        let shScript = `cd ${_self.opts.workspace} && `
        shScript += `npx -p @angular/cli@14.1.1 ng new ${projectSrc.name}Angular --style=scss`
        await system.exec(shScript);
        
        // Construindo projeto em Angular
        shScript = `cd ${_self.opts.workspace}/${projectSrc.name}Angular && `
        shScript += `npx ng build --output-path ../${projectSrc.name}/public/angular && `;
        shScript += `mv ../${projectSrc.name}/public/angular/* ../${projectSrc.name}/public/`;
        await system.exec(shScript);
    }
}

class NodeAppBuilder {
    
    constructor(opts = {}) {
        this.opts = opts;
        this.iBuilder = new NodeAppBuilderInternal(this.opts);
    }

    async build(projectSrc) {
        if (projectSrc.appType != 'node') {
            return false;
        }

        this.iBuilder.initProject(projectSrc);

        if (!projectSrc.models || !projectSrc.models.length) {
            console.log('Não tem nenhum modelo no projeto');
            return false;
        }

        if (projectSrc.repo.src.file.includes('${workspace}')) {
            projectSrc.repo.src.file = projectSrc.repo.src.file.replaceAll('${workspace}', this.opts.workspace);
        }
        await system.mkdir(system.dirname(projectSrc.repo.src.file));
        console.log('Node api não implementado ainda!');
    }
}

module.exports =  (opts = {}) => {
    return new NodeAppBuilder(opts);
}