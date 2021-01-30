import { Ctrl } from '../main/Ctrl.js';
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import {systemConts} from "../../libs/Conts.lib.js";
import {TweenMax} from "../../libs/GreenSock.lib.js";
export class GoodserCtrl	extends Ctrl	{
	constructor(model,view){
		super(model,view);
		const _ = this;

		_.componentName = 'goodser';

		//	Работа с пагинацией
		_.busProp = `${_.componentName}Ctrl`;
		MainEventBus
			.on(_,'copyGoods')
			.on(_,'calcItemsCount')
			.on(_,'nextPage')
			.on(_,'prevPage')
			.on(_,'goPage')
		// Поиск
			.on(_,'inputSearchQuery')
			.on(_,'keyUpSearch')
			.on(_,'btnSearch')
		//
			.on(_,'addProductThumbnail')
			.on(_,'changeMainThumb')
			.on(_,'clearForm')
			.on(_,'deleteImage')
			.on(_,'deleteMainImage')
			.on(_,'saveGoods')
			.on(_,'fillForm')
			.on('categorier','changeCat',_.changeCat.bind(_))
			.on('filer','changeFile',_.changeThumbnail.bind(_))
		//
	}
		clearForm(){
				const _ = this;
				_.model.mainImageChanged = false;
		}
	changeCat(catData){
		const _ = this;
		_.model.c_id = catData['id'];
	}
	copyGoods(clickData){
		MainEventBus.inDev();
	}
	async fillForm(itemId){
		const _ = this;
		let formData = await _.model.getGoodsFull(itemId),
		cat = await	MainEventBus.trigger('categorier','getCategory',formData['c_id']);
		await _.view.changeCat(cat);
		let elems =systemConts['content'].querySelector('.goods-form').elements;
		_.fillMainFormProps(elems,formData);
		_.fillCatFormProps(elems,formData['props']);
		await _.changeThumbnail([
				{
					src: formData['image']
				}
			]);
		if(!formData['images']) return
		formData['images'].forEach(async (img)=>{
			await _.changeThumbnail([
				{
					src: img
				}
			]);
		});
	}
	async fillCatFormProps(elems,props){
		for (let prop of props){
			let name = 'prop-'+prop['prop_id'];
			if (elems[name]){
				elems[name].value = prop['prop_value'];
			}
		}
	}
	async fillMainFormProps(elems,props){
		for (let prop in props){
			if (elems.hasOwnProperty(prop)) elems[prop].value = props[prop];
		}
	}

	async saveGoods(clickData){
		const _ = this;
		let form = _.view.content.querySelector('.goods-form'),//submitData['item'],
			formData = _.createFormData(form);
		let props = [];
		for (let prop in formData){
			if ((prop.indexOf('prop-') < 0)) continue;
			let property = {};
			property[prop.slice(prop.indexOf('prop-')+5)] = formData[prop];
			props.push(property);
			delete	formData[prop];
		}
		formData['props'] = props;
		formData['image'] = _.model.image;
		formData['images'] = _.model.images;
		let response = await _.model.saveGoods(formData);
		if (_.checkResponse(response)){
			MainEventBus.trigger('Log','showLog',{
						'status': 'success',
						'title':'Goods saved',
						'save': true
					})
				}
	}
	deleteMainImage(clickData){
		const _ = this;
		let btn = clickData['item'],
			imageCont = btn.parentNode;
		imageCont.remove();
		_.model.image = '';
		let pageImages = _.view.content.querySelector('.goods-thumb-list-item');
		pageImages.querySelector('button').setAttribute('data-click-action',`${_.componentName}:deleteMainImage`)
		if (pageImages){
			_.model.image = pageImages.querySelector('img').dataset.src;
			_.view.content.querySelector('.goods-thumb-body').append(pageImages);
		}
	}
	deleteImage(clickData){
		const _ = this;
		let btn = clickData['item'],
			thumb = btn.previousElementSibling,
				imageCont = btn.parentNode;
			TweenMax.to(imageCont,1,{
				rotation: -360,
				opacity: 0,
				scale: 0,
				ease: Back.easeInOut,
				onComplete: function(){
					imageCont.remove();
					if(thumb){
						_.model.deleteImage(thumb.dataset.src);
					}
				}
			});
			
	}
	async changeMainThumb(clickData){
		const _ = this;
		let thumb = clickData['item'],
			thumbImg	= thumb.querySelector('.goods-t');
		let mainThumb = _.view.content.querySelector('.goods-thumb-body .goods-t');
		mainThumb.parentNode.append(thumbImg);
		thumb.append(mainThumb);
	}
	async addProductThumbnail(){
		const _ = this;
		let content = await MainEventBus.trigger("filer",'showOnModal',true);
		MainEventBus.trigger("Modaler",'showModal',{
			//	type:'object',
			'min-width': '90%',
			content: content
		})
	}
	compareThumb(src){
		const _ = this;
		let allThumbs = _.view.content.querySelectorAll('.goods-t');
		for(let thumb of allThumbs){
			if(thumb.dataset.src === src) return true;
		}
		return false;
	}
	async changeThumbnail(fileData){
		const _ = this;
		return new Promise(async function(resolve){
		let thumbBtn =	_.view.content.querySelector('.goods-thumb-btn');
		if( _.compareThumb(fileData[0]['src'])) return MainEventBus.trigger('Modaler','closeLastModal');
		let thumbBody = _.view.content.querySelector('.goods-thumb-body');
		if (!_.model.mainImageChanged){
			thumbBody.append(
				await _.view.thumbnailTpl(fileData[0])
			);
			_.model.image = fileData[0]['src'];
			_.model.mainImageChanged = true;
		}
		for (let file of fileData){
			let compare = _.compareThumb(file['src']);
			if(compare) continue;
			_.model.images.push(file['src']);
			let filesList = _.view.content.querySelector('.goods-thumb-list');
			filesList.append(await _.view.thumbListItem(file));
		}
		_.view.content.querySelector('.goods-thumb-list').append(thumbBtn);
		MainEventBus.trigger('Modaler','closeLastModal');
		resolve(_.model.mainImageChanged);
		});
	}
	async calcItemsCount(calcData = {type:'main'}){
		const _ = this;
		return new Promise( async function (resolve) {
			calcData['type'] = calcData['type'] ? calcData['type'] : 'main';
			let cnt;
			cnt = await _.model.getItemsCnt(calcData);
			resolve(parseInt(cnt));
		})
	}
}