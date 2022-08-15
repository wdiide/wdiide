const appCreate = require("./app.create");
const indexCreate = require("./index.create");
const modelsCreate = require("./models.create");
const routerCreate = require("./router.create");

const createNode = {
    appCreate,
    routerCreate,
    indexCreate,
    modelsCreate
};

module.exports = createNode;