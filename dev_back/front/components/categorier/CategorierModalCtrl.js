import { Ctrl } from '../main/Ctrl.js';
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import {systemConts} from "../../libs/Conts.lib.js";
export class CategorierModalCtrl  extends Ctrl  {
	constructor(model,view){
		super(model,view);
		const _ = this;
		_.componentName = 'Categorier';
	}
}