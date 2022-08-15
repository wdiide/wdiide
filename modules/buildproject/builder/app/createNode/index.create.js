const system = require("../../util/system");

class IndexCreate {
    async create(opts){
        let result = {base:'/'};
        opts.project.app.models.forEach(model => {
            result[model.name] = '/'+model.name
        });
        let appStr = `var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.json(${JSON.stringify(result)});
});

module.exports = router;`;
        await system.writeFile(opts.path.projectApp+'/routes/index.js', appStr);
    }
}

module.exports = new IndexCreate();