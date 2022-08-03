const path = require('path');
const { mkdir, access } = require('fs/promises');
const wdiKnexDb = require('./wdi.knex.db');

class SQLitRepoBuilder {

    constructor(opts = {}) {
        this.opts = opts;
    }

    build(projectSrc) {
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
        this.mkdir(path.dirname(projectSrc.repoSrc.file));

        let wdiKnexRepo = wdiKnexDb({ file: projectSrc.repoSrc.file });

        async function compileSchema() {
            let allScriptCompiled = [];
            for (let index = 0; index < projectSrc.models.length; index++) {
                const model = projectSrc.models[index];
                let result = await wdiKnexRepo.hasModel(model.name);
                if (!result) {
                    console.log('model não existe ' + model.name);
                    let modelCreated = await wdiKnexRepo.createModel(model, { returnQuery: true });
                    allScriptCompiled.push(modelCreated.sql);
                    console.log('model criado ' + model.name);
                } else {
                    let modelDb = await wdiKnexRepo.modelMeta(model.name);
                    console.log('ModelDb');
                    for (let idxField = 0; idxField < model.fields.length; idxField++) {
                        const field = model.fields[idxField];
                        let fieldDb = modelDb.fields.find(fieldDb=>fieldDb.name==field.name);
                        console.log(JSON.stringify(fieldDb));
                        if(!fieldDb){
                            //TODO incluir new field(alter table add column)
                        }else if(field.type != fieldDb.type 
                            || (field.size != fieldDb.size && (field.type == fieldDb.type && field.type == 'string'))
                            || field.isNullable != fieldDb.isNullable
                            || field.digits != fieldDb.digits
                            || field.defaultValue != fieldDb.defaultValue
                            || field.isAutoincrement != fieldDb.isAutoincrement
                            || field.isKey != fieldDb.isKey
                        ){
                            //TODO alterar field
                        }
                    }
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
                    allScriptInsertDefault.push({sql: result.sql, bindings:result.bindings});
                }
            }
        }

        let compilado = compileSchema();

        compilado.then(async result => {
            let insertDefaultResult = insertDefault();
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

        }).finally(() => {
            console.log('FINALIZOU');
            setTimeout(() => {
                wdiKnexRepo.close();
            }, 30000);
        })

        console.log('Repo criado');

        console.log('SQLite repositorio não implementado ainda!');
    }

    async mkdir(pathDirectory) {
        try {
            await access(pathDirectory);
        } catch (error) {
            if (error.message.includes('no such file or directory')) {
                await mkdir(pathDirectory, { recursive: true });
            }
        }
    }
}

module.exports = (opts = {}) => {
    return new SQLitRepoBuilder(opts);
}