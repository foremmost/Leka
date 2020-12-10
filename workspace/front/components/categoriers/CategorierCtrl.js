import { systemConts } from "../../libs/Conts.lib.js";
import { Ctrl } from "../main/Ctrl.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";

export class CategorierCtrl extends Ctrl {
    constructor(model, view) {
        super(model, view);
        const _ = this;
        _.componentName = 'Categorier'

        //  Работа с пагинацией
        MainEventBus.add(_.componentName,'nextPage',_.nextPage.bind(_));
        MainEventBus.add(_.componentName,'prevPage',_.prevPage.bind(_));
        MainEventBus.add(_.componentName,'goPage',_.goPage.bind(_));

        MainEventBus.add(_.componentName,'inputSearchQuery',_.inputSearchQuery.bind(_));
        MainEventBus.add(_.componentName,'keyUpSearch',_.keyUpSearch.bind(_));
        MainEventBus.add(_.componentName,'btnSearch',_.btnSearch.bind(_));


        MainEventBus.add(_.componentName,`addThumbnail`,_.addThumbnail.bind(_));
        MainEventBus.add(_.componentName,`addEditCategory`,_.addEditCategory.bind(_));
    }

    async loadPageItems(page=1,template,searchMethod){
        const _ = this;
        let type = _.model.getCurrentType();
        if(type == 'main'){
            await _.view[template](
                {
                    page: page,
                    type: type,
                }
            );
        }else{
            let items = await _.search(searchMethod,template,page);
        }
    }

    async addThumbnail(ev){
        alert('Здесь будет браться картинка из FIler');
    }

    async addEditCategory(ev){
        const _ = this;
        let form = systemConts['content'].querySelector('.category-form');
        let formData = new FormData(form);
        console.log(formData.values())
        for(var pair of formData.entries()) {
            console.log(pair[0]+ ', '+ pair[1]);
        }
    }

    async search(searchMethod, template, page = 1) {
        await super.search(searchMethod, template, page);
    }
}