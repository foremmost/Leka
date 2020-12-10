class _MainEventBus {
	constructor(flag){
		const _ = this;
		_.flag =  flag;
		_.components = {};
	}
	add(componentName,eventName,fn,prop){
		const _ = this;
		if(!prop){
			prop= fn.name;
		}
		if (!componentName) return;
		componentName = componentName.toLowerCase();
		if(!_.components[componentName]){
			_.components[componentName] = {};
			_.components[componentName]['events'] = {};
		}
		if(!_.components[componentName]['events'][eventName]){
			_.components[componentName]['events'][eventName] = new Map();
		}
		_.components[componentName]['events'] = _.components[componentName]['events'] || new Map();
		if(!_.components[componentName]['events'][eventName].has(prop)) {
			_.components[componentName]['events'][eventName].set(prop, fn);
			return;
		}
		if(_.flag === 'dev'){
			console.warn(`Подписка на событие ${eventName} на ф-ю: ${fn.name}`);
		}

	}
	trigger(componentName,eventName,data){
		const _ = this;
		componentName = componentName.toLowerCase();
		return new Promise(function (resolve) {
			if(eventName == 'loadPage'){
			}
			if(_.flag === 'dev'){
				console.warn(`Компонент ${componentName}: Запуск события ${eventName} с данными: "${data}" `);
			}
			try{
				if (_.components[componentName]['events'][eventName]) {
					_.components[componentName]['events'][eventName].forEach( async function(fn) {
						resolve(await fn(data));
					});
				}
			} catch (e) {
				if(e.name == 'TypeError'){
					let errObj = {};
					errObj['err'] = e;
					errObj['component'] = componentName;
					errObj['event'] = eventName;
					errObj['line'] = e.lineNumber;
					console.log('%c%s',`background-color:#3f51b5;`,`!Обращение к событию, которое не определено ${componentName}: ${eventName}\n${e}`);
				}
			}
		})
	}
	remove(componentName,eventName,prop){
		const _ = this;
		if (_.components[componentName].events[eventName]) {
				_.components[componentName].events[eventName].delete(prop);
		}
	}
	clear(){
		const _ = this;
		for(let prop in _.events) {
			if (prop === 'includeModule' || prop === 'showMenu') continue;
			delete _.events[prop];
		}
	}
}
export const MainEventBus = new _MainEventBus('prod');
window['bus'] = MainEventBus;