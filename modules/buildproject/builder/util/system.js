const { mkdir, access, rmdir, writeFile } = require('fs/promises');
const path = require('path');
const { exec } = require("child_process");

class System {
    async mkdir(pathDirectory) {
        try {
            await access(pathDirectory);
        } catch (error) {
            if (error.message.includes('no such file or directory')) {
                await mkdir(pathDirectory, { recursive: true });
            }
        }
    }
    
    async writeFile(pathFile, content) {
        try {
            await writeFile(pathFile, content);
        } catch (error) {
            console.log(error);
        }
    }

    dirname(pathOrDirectory) {
        return path.dirname(pathOrDirectory);
    }

    async rmdir(pathDirectory, opts = { recursive: false }) {
        try {
            await access(pathDirectory);
            await rmdir(pathDirectory, opts)
        } catch (error) {
            if (error.message.includes('no such file or directory')) {
            } else {
                throw error;
            }
        }
    }

    async exec(command) {
        const promise = new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                console.log(`stdout: ${stdout}`);
                if (error) {
                    console.log(`error: ${error.message}`);
                    return reject(new Error({ error, stdout, stderr }));
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    // return reject(new Error({ error, stdout, stderr }));
                }
                return resolve('OK');
            });
        });
        return promise;
    }
}

const system = new System();
module.exports = system;