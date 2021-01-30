"use strict";
import {MainEventBus} from "./MainEventBus.lib.js";
export class _Slider{
	constructor(settings={}){
		const _ = this;
		_.sliders = [];

		_.cont = settings['cont'];
		_.autoplay = settings['autoplay'] ? settings['autoplay'] : false;
		_.arrows = settings['arrows'] ? settings['arrows'] : false;
		_.pagination = settings['pagination'] ? settings['pagination'] : false;
		_.slidesCnt = 0;
		_.init();
	}
	next(){
		const _ = this;
	}
	prev(){
		const _ = this;
	}
	goTo(){
		const _ = this;
	}
	init(){
		const _ = this;
		_.cont.style.display = 'flex';

	}
}