export class Module{
    constructor(View,Ctrl,Model){
        const  _ = this;
        _.model = Model;
        _.view = View;
        _.ctrl = Ctrl;
    }
    remove(){
        const _ = this;
    }
    async init(){
        const _ = this;

    }
    async includePart(partName,className =partName){
        const _ = this;
       return new Promise(async function (resolve) {
           const
               module = await import(`../${_.componentName}/${partName}.js`);
               //modulName = new module[className](page);
           resolve(module[partName]);
       })

    }
}