class NodeAppBuilderInternal {

}

class NodeAppBuilder {
    
    constructor(opts = {}) {
        this.opts = opts;
        this.iBuilder = new NodeAppBuilderInternal();
    }

    async build(projectSrc) {
        if (projectSrc.apiType != 'node') {
            return false;
        }

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