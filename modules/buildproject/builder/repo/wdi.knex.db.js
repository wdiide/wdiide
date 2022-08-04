let path = require('path')
let knex = require('knex');
let { default: SchemaInspector } = require('knex-schema-inspector');


class WdiKnexDb {
    constructor(opts) {
        this.opts = opts;
        this.opts.repo = this;
        this.iUtil = {}
        this.openConnection(this.opts.file);
        this.config();
    }

    openConnection(file) {
        this.knexDb = knex({
            client: 'sqlite3',
            debug: true,
            useNullAsDefault: true,
            connection: {
                filename: path.resolve(file)
            },
        });
    }

    config() {
        let inspector = this.inspector = SchemaInspector(this.knexDb);

        this.inspector.tableMeta = (tabName) => {
            let table = { name: tabName };

            let fieldsProms = inspector.columnInfo(tabName).then(colns => {
                table.fields = [];
                let typeTranslate = { 'VARCHAR': 'string', 'VARCHAR2': 'string', 'CHAR': 'string' }
                colns.forEach((coln, index) => {
                    let field = {};
                    field.name = coln.name;
                    field.type = typeTranslate[coln.data_type.toUpperCase()] || coln.data_type;
                    field.size = coln.numeric_precision || coln.max_length;
                    field.digits = coln.numeric_scale;
                    field.defaultValue = coln.default_value;
                    field.position = index;
                    field.isNullable = coln.is_nullable;
                    field.isAutoincrement = coln.has_auto_increment;
                    field.isKey = coln.is_primary_key;
                    table.fields.push(field);
                });
                return table;
            });

            let pkProms = inspector.primary(tabName).then(prim => {
                table.pk = { pk_model: table.name, fields: [] };
                table.pk.fields.push(prim);
                return table;
            });

            let fksProms = inspector.foreignKeys(tabName).then(fks => {
                if (fks && fks.length) {
                    table.fks = [];
                    fks.forEach(fk => {
                        table.fks.push({ fk_model: table.name, fk_id: fk.column, pk_model: fk.foreign_key_table, pk_id: fk.foreign_key_column, name: fk.constraint_name });
                    });
                }
                return table;
            });
            return Promise.all([fksProms, pkProms, fieldsProms]).then((data) => {
                return table;
            });
        }

        this.iUtil.fncCentralField = (table, field) => {
            var columnDbRef = undefined;
            console.log('field');
            if (field.type == 'integer') {
                if (field.size > 10) {
                    columnDbRef = table.biginteger(field.name);
                } else {
                    columnDbRef = table.integer(field.name, field.size);
                }
            } else if (field.type == 'string') {
                columnDbRef = table.string(field.name, field.size);
            }

            if (field.isKey) columnDbRef.primary();
            if (field.isNotNull) columnDbRef.notNullable();
            if (field.isAutoincrement) columnDbRef.increments();
            if (field.defaultValue) columnDbRef.defaultTo(field.defaultValue);
        }
    }

    async modelMeta(modelName) {
        return await this.inspector.tableMeta(modelName);
    }

    async hasModel(modelName) {
        return await this.inspector.hasTable(modelName);
    }

    async createModel(model, opts = { returnQuery: false }) {
        let _self = this;
        function fncCreateTable(table) {

            model.fields.forEach(function (field) {
                _self.iUtil.fncCentralField(table, field);
            });

            if (model.fks && model.fks.length) {
                model.fks.forEach(fk => {
                    table.foreign(fk.fields).withKeyName(fk.name).references(fk.pk_fields).inTable(fk.pk_model);
                });
            }
        }
        let resultCreateTable = await _self.knexDb.schema.createTableIfNotExists(model.name, fncCreateTable);
        if (opts.returnQuery) {
            let resultSql = await _self.knexDb.schema.createTableIfNotExists(model.name, fncCreateTable).toSQL();
            return { result: resultCreateTable, sql: resultSql[0].sql }
        }
        return resultCreateTable;
    }

    async select(modelName) {
        return await this.knexDb.from(modelName)
            // .offset(page.meta.offSet())
            // .limit(page.meta.limit())
            ;
    }

    async insert(modelName, content, returning = undefined) {
        return this.knexDb(modelName)
            .insert(content, returning);
    }

    // async insertOrUpdate(modelName, content, ids, fieldsMerge = undefined, returning = undefined) {
    async insertOrUpdate(param = { modelName: '', content: [], ids: [], returning: undefined, fieldsMerge: undefined, returnQuery: false }) {
        let toInsert = Object.assign({ modelName: '', content: [], ids: [], returning: undefined, fieldsMerge: undefined, returnQuery: false }, param);
        let resultInsert = await this.knexDb(toInsert.modelName).insert(toInsert.content, toInsert.returning).onConflict(toInsert.ids).merge(toInsert.fieldsMerge);
        if (toInsert.returnQuery) {
            let resultSql = await this.knexDb(toInsert.modelName).insert(toInsert.content, toInsert.returning).onConflict(toInsert.ids).merge(toInsert.fieldsMerge).toSQL().toNative();
            return { result: resultInsert, sql: resultSql.sql, bindings: resultSql.bindings }
        }
        return resultInsert;
    }

    async addField(param = { modelName: '', field: {}, returnQuery: false }) {
        let fncAddColumn = function (table) {
            this.iUtil.fncCentralField(table, field);
        }
        let resultDelete = await this.knexDb.schema.table(param.modelName, fncAddColumn);
        if (param.returnQuery) {
            let resultSql = await this.knexDb.schema.table(param.modelName, fncAddColumn).toSQL().toNative();
            return { result: resultInsert, sql: resultSql.sql, bindings: resultSql.bindings };
        }
        return resultDelete;
    }

    async deleteField(param = { modelName: '', fieldName: '', returnQuery: false }) {
        let fncDropColumn = function (table) {
            table.dropColumn(param.fieldName);
        }
        let resultDelete = await this.knexDb.schema.table(param.modelName, fncDropColumn);
        if (param.returnQuery) {
            let resultSql = await this.knexDb.schema.table(param.modelName, fncDropColumn).toSQL().toNative();
            return { result: resultInsert, sql: resultSql.sql, bindings: resultSql.bindings };
        }
        return resultDelete;
    }

    close() {
        this.knexDb.destroy();
    }
}

module.exports = (opts = {}) => {
    return new WdiKnexDb(opts);
};