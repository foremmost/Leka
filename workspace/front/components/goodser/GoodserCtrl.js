import { Ctrl } from '../main/Ctrl.js';
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import {systemConts} from "../../libs/Conts.lib.js";
export class GoodserCtrl  extends Ctrl  {
    constructor(model,view){
        super(model,view);
        const _ = this;

        _.componentName = 'goodser';

        //  Работа с пагинацией
        MainEventBus.add(_.componentName,'calcItemsCount',_.calcItemsCount.bind(_),`${_.componentName}Ctrl`);
        MainEventBus.add(_.componentName,'nextPage',_.nextPage.bind(_),`${_.componentName}Ctrl`);
        MainEventBus.add(_.componentName,'prevPage',_.prevPage.bind(_),`${_.componentName}Ctrl`);
        MainEventBus.add(_.componentName,'goPage',_.goPage.bind(_),`${_.componentName}Ctrl`);

        // Поиск
        MainEventBus.add(_.componentName,'inputSearchQuery',_.inputSearchQuery.bind(_),`${_.componentName}Ctrl`);
        MainEventBus.add(_.componentName,'keyUpSearch',_.keyUpSearch.bind(_),`${_.componentName}Ctrl`);
        MainEventBus.add(_.componentName,'btnSearch',_.btnSearch.bind(_),`${_.componentName}Ctrl`);



        MainEventBus.add(_.componentName,'addProductThumbnail',_.addProductThumbnail.bind(_),`${_.componenName}Ctrl`);
        MainEventBus.add(_.componentName,'changeMainThumb',_.changeMainThumb.bind(_),`${_.componenName}Ctrl`);
        MainEventBus.add('filer','changeFile',_.changeThumbnail.bind(_),`${_.componenName}Ctrl`);
        MainEventBus.add(_.componentName,'deleteImage',_.deleteImage.bind(_),`${_.componenName}Ctrl`);
        MainEventBus.add(_.componentName,'deleteMainImage',_.deleteMainImage.bind(_),`${_.componenName}Ctrl`);
        MainEventBus.add(_.componentName,'saveProduct',_.saveProduct.bind(_),`${_.componenName}Ctrl`);
        MainEventBus.add('categorier','changeCat',_.changeCat.bind(_),`${_.componentName}View`);
    }
    changeCat(){}


    saveProduct(clickData){
        const _ = this;
        let form = _.view.content.querySelector('.goods-form'),//submitData['item'],
            formData = _.createFormData(form);
        let props = [];
        for (let prop in formData){
            if ((prop.indexOf('prop-') < 0)) continue;
            let property = {};
            property[prop.slice(prop.indexOf('prop-')+5)] = formData[prop];
            props.push(property);
            delete  formData[prop];
        }
        formData['props'] = props;
        formData['mainImage'] = _.model.mainImage;
        formData['images'] = _.model.images;
        console.log(formData);
    }
    deleteMainImage(clickData){
        const _ = this;
        _.model.mainImage = '';
        let pageImages = _.view.content.querySelector('.goods-thumb-list').children;
        if (pageImages.length){
            _.view.content.querySelector('.goods-thumb-body').append(pageImages[0]);
        }
    }
    deleteImage(clickData){
        const _ = this;
        let btn = clickData['item'],
            thumb = btn.previousElementSibling,
		        imageCont = btn.parentNode;

	      imageCont.parentNode.remove();
        if(thumb){
          _.model.deleteImage(thumb.dataset.src);
        }
    }
    async changeMainThumb(clickData){
        const _ = this;
        let thumb = clickData['item'],
            name = thumb.dataset.name,
            path =  thumb.dataset.path,
            thumbImg  = thumb.querySelector('.goods-t');
        let mainThumb = _.view.content.querySelector('.goods-thumb-body .goods-t');
        mainThumb.parentNode.append(thumbImg);
        thumb.append(mainThumb);
    }
    async addProductThumbnail(){
        const _ = this;
        let content = await MainEventBus.trigger("filer",'showOnModal',true);
        MainEventBus.trigger("Modaler",'showModal',{
            //  type:'object',
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
       let thumbBtn =  _.view.content.querySelector('.goods-thumb-btn');
        if( _.compareThumb(fileData[0]['src'])) return MainEventBus.trigger('Modaler','closeLastModal');
        let thumbBody = _.view.content.querySelector('.goods-thumb-body');
        if (!_.model.mainImageChanged){
            thumbBody.append(
                await _.view.thumbnailTpl(fileData[0])
            );
            _.model.mainImage = fileData[0]['src'];
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