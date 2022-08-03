class RepoManager {

    constructor(opts = {}) {
        this.opts = opts;
    }

    build(projectSrc) {
        projectSrc.models = this.orderModels(projectSrc.models);

        if (projectSrc.repoType == 'sqlite') {
            return require('./sqlite.repo.builder')(this.opts).build(projectSrc);
        }
        console.log('Repo not work to ' + projectSrc.repoType);
    }

    orderModels(modelsParam) {
        if (!modelsParam || !modelsParam.length) return [];

        let modelsOrdenado = [], models = modelsParam, restante = [];

        function ordenar(first) {
            models = first ? models : restante;
            restante = [];
            models.forEach(model => {
                if (!model.fks || !model.fks.length || modelsOrdenado.filter(modelOrd => model.fks.filter(fk => fk.pk_model == modelOrd.name).length == 1).length == model.fks.length) {
                    modelsOrdenado.push(model);
                } else {
                    restante.push(model);
                }
            });
        }
        
        for (var first = true; modelsOrdenado.length < modelsParam.length && restante.length < models.length;first=false) {
            ordenar(first);
        }

        return modelsOrdenado;
    }
}

module.exports = (opts = {}) => {
    return new RepoManager(opts);
}