import {Model} from '../main/Model.js';
export class FilerModel extends Model {
    constructor(){
        super();
        const _ = this;
        _.componentName =  'filer';
        _.mainFolder = '/uploads/';
        _.folder = '';
    }
    clearFolderPath(){
        this._folder = '';
    }
    set folder(value){
        if(!this._folder){
            this._folder = value;
        }else{
            this._folder+= '/'+value;
        }
    }
    get folder(){
        return this._folder;
    }
    async getFiles(){
        const _ = this;
        return await _.handler({
            method: 'getFiles',
            type: 'class',
            data: {
                'dir': _.folder
            }
        }, 'JSON');
    }
    async getFile(dir,fileName){
        const _ = this;
        return await _.handler({
            method: 'getFile',
            type: 'class',
            fileName: fileName,
            dir: dir
        }, 'JSON');
    }
    async createFolder(folderName){
        const _ = this;
        return await _.handler({
            method: 'createFolder',
            type: 'class',
            path: _.folder,
            folderName: folderName,
        }, 'JSON');
    }
    async deleteFile(name){
        const _ = this;
        return await _.handler({
            method: 'delete',
            type: 'class',
            dir: _.folder,
            name: name,
        }, 'JSON');
    }
}