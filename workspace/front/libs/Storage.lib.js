class _Storage{
    get(key){
        const _ = this;
        return localStorage.getItem(key);
    }
    save(key,value){
        const _ = this;
        localStorage.removeItem(key);
        if(typeof value == 'object'){
            localStorage.setItem(key,JSON.stringify(value));
        }else{
            localStorage.setItem(key,value);
        }
    }
}
export const Storage = new _Storage();