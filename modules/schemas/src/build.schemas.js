
var jsonSchemaGenerator = require('json-schema-generator'),
    fs = require('fs'),
    path = require('path');

let idxOut = process.argv.indexOf('-o');

let srcDir = './schemas/';
let targetDir = idxOut && process.argv[idxOut + 1] || './dist';
let refTargetDir = targetDir;
if(targetDir.startsWith('./')){
    targetDir = path.join(__dirname, targetDir.replace('./','../'));
}

function build(instruction){
    let srcJson = require(instruction.srcDir+instruction.jsonName);
    let targetJsonSchema = jsonSchemaGenerator(srcJson);
    let targetJson = instruction.targetDir+'/'+instruction.jsonName;

    var targetDir = path.dirname(targetJson);

    fs.mkdir(targetDir, {recursive: true}, function(err, other){
        if(err) {
            return console.log(err);
        }
        fs.writeFile(targetJson, JSON.stringify(targetJsonSchema,null,2), 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("JSON_SCHEMA saved in "+refTargetDir+'/'+instruction.jsonName);
        });
    });
    
    console.log(targetJsonSchema);
}

build({srcDir,targetDir,jsonName:'page.json'});
build({srcDir,targetDir,jsonName:'project.json'});
build({srcDir,targetDir,jsonName:'menu.json'});
build({srcDir,targetDir,jsonName:'db/table.json'});
