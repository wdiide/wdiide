const { mkdir, access, rmdir } = require('fs/promises');
const path = require('path');
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

    dirname(pathOrDirectory){
        return path.dirname(pathOrDirectory);
    }

    async rmdir(pathDirectory, opts={recursive:false}){
        try {
            await access(pathDirectory);
            await rmdir(pathDirectory, opts)
        } catch (error) {
            if (error.message.includes('no such file or directory')) {
            }else{
                throw error;
            }
        }
    }
}

const system = new System();
module.exports = system;