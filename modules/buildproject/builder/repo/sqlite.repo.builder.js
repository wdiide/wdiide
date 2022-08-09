const path = require('path');
const wdiKnexDb = require('./wdi.knex.db');
const system = require('../util/system');

class SQLitRepoBuilder {

    constructor(opts = {}) {
        this.opts = opts;
    }

    async build(projectSrc) {
        if (projectSrc.repoType != 'sqlite') {
            console.log('Repositorio não é do tipo sqlite');
            return false;
        }
        if (!projectSrc.models || !projectSrc.models.length) {
            console.log('Não tem nenhum modelo no projeto');
            return false;
        }

        if (projectSrc.repoSrc.file.includes('${workspace}')) {
            projectSrc.repoSrc.file = projectSrc.repoSrc.file.replaceAll('${workspace}', this.opts.workspace);
        }
        await system.mkdir(system.dirname(projectSrc.repoSrc.file));

        let wdiKnexRepo = wdiKnexDb({ file: projectSrc.repoSrc.file });

        async function compileSchema() {
            let allScriptCompiled = [];
            for (let index = 0; index < projectSrc.models.length; index++) {
                const model = projectSrc.models[index];
                let result = await wdiKnexRepo.hasModel(model.name);
                if (!result) {
                    console.log('model não existe ' + model.name);
                    let modelCreated = await wdiKnexRepo.createModel(model, { returnQuery: true });
                    modelCreated.sql && allScriptCompiled.push(modelCreated.sql);
                    console.log('model criado ' + model.name);
                } else {
                    let modelDb = await wdiKnexRepo.modelMeta(model.name);
                    console.log('ModelDb');
                    for (let idxField = 0; idxField < model.fields.length; idxField++) {
                        const field = model.fields[idxField];
                        let fieldDb = modelDb.fields.find(fieldDb => fieldDb.name == field.name);
                        console.log(JSON.stringify(fieldDb));
                        if (!fieldDb) {
                            let fieldCreated = await wdiKnexRepo.addField({ modelName: model.name, field: field, returnQuery: true });
                            fieldCreated.sql && allScriptCompiled.push(fieldCreated.sql);
                            console.log('field criado ' + field.name);
                        } else if (field.type != fieldDb.type
                            || (field.size != fieldDb.size && (field.type == fieldDb.type && field.type == 'string'))
                            || field.isNullable != fieldDb.isNullable
                            || field.digits != fieldDb.digits
                            || field.defaultValue != fieldDb.defaultValue
                            || field.isAutoincrement != fieldDb.isAutoincrement
                            || field.isKey != fieldDb.isKey
                        ) {
                            let fieldUpdated = wdiKnexRepo.updateField({ modelName: model.name, field: field, returnQuery: true });
                            fieldUpdated.sql && allScriptCompiled.push(fieldUpdated.sql);
                            console.log('field atualizado ' + field.name);
                        }
                    }


                    for (let idxField = 0; idxField < modelDb.fields.length; idxField++) {
                        const fieldDb = modelDb.fields[idxField];
                        let fieldMd = model.fields.find(fieldMd => fieldMd.name == fieldDb.name);
                        console.log(JSON.stringify(fieldMd));
                        if (!fieldMd) {
                            let fieldDeleted = await wdiKnexRepo.deleteField({ modelName: model.name, fieldName: fieldDb.name, returnQuery: true });
                            fieldDeleted.sql && allScriptCompiled.push(fieldDeleted.sql);
                            console.log('field deletado ' + fieldDb.name);
                        }
                    }


                }
            }



            let modelNames = await wdiKnexRepo.modelNames();
            for (let index = 0; modelNames && index < modelNames.length; index++) {
                const modelName = modelNames[index];
                // let result = await wdiKnexRepo.hasModel(model.name);
                // projectSrc.models[index];
                let result = projectSrc.models.find(model => model.name == modelName);
                if (!result) {
                    console.log('model foi deletado no negocio ' + modelName);
                    let modelDeleted = await wdiKnexRepo.deleteModel(modelName, { returnQuery: true });
                    modelDeleted.sql && allScriptCompiled.push(modelDeleted.sql);
                    console.log('model deletado ' + modelName);
                }
            }
            return allScriptCompiled;
        }

        async function insertDefault() {
            let allScriptInsertDefault = [];
            if (projectSrc.modelsInsertInit) {
                for (let index = 0; index < projectSrc.modelsInsertInit.length; index++) {
                    const modelInsertInit = projectSrc.modelsInsertInit[index];
                    let result = await wdiKnexRepo.insertOrUpdate({ modelName: modelInsertInit.name, content: modelInsertInit.values, ids: modelInsertInit.ids, returnQuery: true });
                    allScriptInsertDefault.push({ sql: result.sql, bindings: result.bindings });
                }
            }
        }

        let result = await compileSchema();

        let insertDefaultResult = await insertDefault();
        console.log('Resultado de compilar ' + result);
        // #########################################################
        // Testando a aplicação
        async function teste() {
            for (let index = 0; index < projectSrc.models.length; index++) {
                let model = projectSrc.models[index];
                var modelMeta = await wdiKnexRepo.modelMeta(model.name)
                console.log(JSON.stringify(modelMeta));
            }

            console.log('------------------------------------------');
            console.log('Consultando dados');
            let grps = await wdiKnexRepo.select('produto_grp');
            console.log('produto_grp: ' + JSON.stringify(grps));
            let produtos = await wdiKnexRepo.select('produto');
            console.log('produto: ' + JSON.stringify(produtos));

            return 'ok';
        }
        let resultTest = await teste();
        console.log('Finalizou o teste ' + resultTest);

        console.log('FINALIZOU');
        // Fechando conexão
        wdiKnexRepo.close();

        console.log('Repo criado');

        console.log('SQLite repositorio não implementado ainda!');
    }
}

module.exports = (opts = {}) => {
    return new SQLitRepoBuilder(opts);
}