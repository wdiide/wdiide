var express = require('express');
var router = express.Router();

var opts = {
  // workspace:"E:/workspace/wdiide"
  workspace:"C:/ambinete/workspaces/wdiide"
}

let buildProjectFnc = async function (req, res) {
  let projectSrc = req.body;

  try {
    if (!projectSrc.name) {
      projectSrc = require('../builder/teste/project_node_sqlite_bootstrap.json');
    }

    let projectBuilder = require('../builder/project.builder')(opts);
    await projectBuilder.build(projectSrc);

    console.log('Project build with success');
    res.send('Project build with success');
  } catch (error) {
    console.log(error);
    res.send('Project build with error');
  }

}

router.post('/', buildProjectFnc);
router.get('/', buildProjectFnc);

module.exports = router;