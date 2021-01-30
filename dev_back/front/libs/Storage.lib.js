class _Storage{
    has(key){
	    return localStorage.getItem(key) ? true : false;
    }
		get(key,parse= false){
    	if (!this.has(key)) return null;
			return !parse ? localStorage.getItem(key) : JSON.parse(localStorage.getItem(key));
    }
    save(key,value){
      localStorage.removeItem(key);
      if(typeof value == 'object'){
          localStorage.setItem(key,JSON.stringify(value));
      }else{
          localStorage.setItem(key,value);
      }
    }
    update(key,value){
    	const _ = this;
    	let savedItem = _.get(key,true);
    	if (typeof savedItem != 'object' || typeof value != 'object') return;
    	for(let k in value){
    		savedItem[k] = value[k];
	    }
    	_.save(key,savedItem);
    }
    remove(key){
    	if(this.has(key)) localStorage.removeItem(key);
    }
}
export const Storage = new _Storage();