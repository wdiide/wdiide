const system = require("../../util/system");

class ModelsCreate {
    async create(opts){
        let  models = opts.project.app.models;
        for(var i = 0;i<models.length;i++){
            let model = models[i];
            let modelStr = `var express = require('express');
var router = express.Router();

/* GET list model of ${model.name}*/
router.get('/', function(req, res, next) {
    res.send('respond with a resource ${model.name}');
});

/* GET model of ${model.name}*/
router.get('/:id', function(req, res, next) {
    let id = req.params.id;
    res.send('respond with a resource ${model.name} '+id);
});

/* POST to create model ${model.name} */
router.post('/', function(req, res, next) {
    res.send('respond with a resource ${model.name}');
});

/* PUT to update model ${model.name} */
router.put('/:id', function(req, res, next) {
    let id = req.params.id;
    res.send('respond with a resource ${model.name} '+id);
});

/* DELETE to update model ${model.name} */
router.delete('/:id', function(req, res, next) {
    let id = req.params.id;
    res.send('respond with a resource ${model.name} '+id);
});

module.exports = router;`;
            await system.writeFile(opts.path.projectApp+'/routes/'+model.name+'.js', modelStr);
        }
    }
}

module.exports = new ModelsCreate();