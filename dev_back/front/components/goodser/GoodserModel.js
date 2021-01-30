import { Model } from '../main/Model.js';
export class GoodserModel extends Model {
		constructor(){
				super();
				const _ = this;
				_.componentName = 'goodser';
				_.perPage = 25;
				_.mainImageChanged = false;
				_.image ='';
				_.images = [];
		}
		deleteImage(path){
				const _ = this;
				_.images.forEach((image,index)=>{
						if(image === path){
								_.images.splice(index,1);
								return;
						}
				});

		}
		async getItemsCnt(itemsData){
				const _ = this;
				return 10;
		}
		async getTableItems(itemsData){
				const _ = this;
				let
						page = itemsData['page'] ? itemsData['page'] : 1,
						resp=  await _.handler({
								method: 'getGoods',
								type: 'class',
								data: {
										'page': page,
										'perPage': _.perPage
								}
						},'JSON'
				);
				return resp;
		}

		async getGoodsProps(id){
			const _ = this;
			let
					resp=  await _.handler({
								method: 'getGoodsProps',
								type: 'class',
								data: {
									'id': id
								}
							},'JSON'
					);
			return resp;
		}
		async getGoodsFull(id){
			const _ = this;
			let
					resp=  await _.handler({
								method: 'getGoodsFull',
								type: 'class',
								data: {
									'id': id
								}
							},'JSON'
					);
			console.log(resp);
			return resp;
		}

		async saveGoods(goodsData){
			const _ = this;
			if (_.c_id){
				goodsData['c_id'] = _.c_id;
			}
			return   await _.handler({
						method: 'save',
						type: 'class',
						data: goodsData
					},'JSON'
			);
		}
}