import { View } from "../main/View.js";
import {systemConts} from "../../libs/Conts.lib.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";

const
    FULL = 100;
export class FilerView extends View {
    constructor(model) {
        super(model);
        const _ = this;
        _.modulePage = 'files';
        _.componentName = 'filer';
        _.type = 'page';
        MainEventBus.add(_.componentName,'updatePanel',_.updatePageBody.bind(_));
        MainEventBus.add(_.componentName,'dragEnter',_.dragEnter.bind(_));
        MainEventBus.add(_.componentName,'dragStart',_.dragStart.bind(_));
        MainEventBus.add(_.componentName,'dragOver',_.dragOver.bind(_));
        MainEventBus.add(_.componentName,'dragLeave',_.dragLeave.bind(_));
        MainEventBus.add(_.componentName,'dropFile',_.dropFile.bind(_));

        //MainEventBus.add(_.componentName,'updatePageBody',_.updatePageBody.bind(_));




        _.actions = {
            'page':{
                'showFile': `${_.componentName}:showFile`
            },
            'modal':{
                'showFile': `${_.componentName}:showModalFile`
            }
        };

    }



    pageHeadTpl(pageData = {}){
        const _ =  this;
        _.clearCont(_.content.querySelector('.page-head'));
        return new Promise(function (resolve) {
            _.content.querySelector('.page-head').append(
                _.createEl('H1','page-title',{'data-word':'Files'}
             ));
            resolve(_.content.querySelector('.page-head'));
        })

    }
    async pageTpl() {
        const _ = this;
        return new Promise( async function (resolve) {
            _.content = systemConts['content'];
            let pageBody = _.content.querySelector('.page-body');
            _.pageHeadTpl();
            _.clearCont(pageBody);
            _.content.querySelector('.page-head').append(await _.headTpl());
            pageBody.append(await _.bodyTpl());
            resolve(_.content);
        })
        //console.log("%cFiler загружен",'background:url("http://ivprogram.com/workspace/img/favicon.png");background-size:40px;');
    }
    async pageModalTpl() {
        const _ = this;
        return new Promise( async function (resolve) {
            _.content  = systemConts['content'].cloneNode(true);
            let pageBody =_.content.querySelector('.page-body');
            _.pageHeadTpl();
            _.clearCont(pageBody);
            _.content.querySelector('.page-head').append(await _.headTpl());
            pageBody.append(await _.bodyTpl());
            MainEventBus.trigger('languager','loadTranslate',{'cont':_.content});
            resolve(_.content);
        })
        //console.log("%cFiler загружен",'background:url("http://ivprogram.com/workspace/img/favicon.png");background-size:40px;');
    }
    confirmBtnTpl(){
        const _ = this;
        let tpl =  {
            el: _.createEl('BUTTON','page-btn confirm-filer-btn',{'data-click-action':`${_.componentName}:confirmChangeFile`}),
            childes:[
                {
                    el: _.createEl('IMG',null,{src:'/workspace/img/plus.svg'})
                }
            ]
        };
        return _.createTpl(tpl);
    }
    async headTpl(){
        const _ = this;
        let tpl =  {
            el : _.createEl('DIV','filer-panel-actions'),
            childes: [
                {
                    el: _.createEl('DIV','filer-panel-action'),
                    childes:[
                        {
                            el:_.createEl('BUTTON','filer-action newfolder', {
                                'data-click-action':"Filer:createFolder",
                            })
                        },
                        {
                            el:_.createEl('BUTTON','filer-action update', {
                                'data-click-action':"Filer:updatePanel",
                            })
                        },{
                            el:_.createEl('LABEL','filer-action upload', {

                                'for':'fileUpload'
                            }),
                            childes: [
                                {
                                    el:_.createEl('INPUT',null, {
                                        type: 'file',
                                        id: 'fileUpload',
                                        'data-change-action': `${_.componentName}:setFileNameToUpload`,
                                        multiple: true
                                    })
                                },
                            ]
                        }
                    ]
                }
            ]
        };
        let buffer = _.createTpl(tpl);
        return buffer;
    }
    async updatePageBody(){
        const _= this;
        let filerPanels = _.content.querySelector('.filer-panels');
        _.clearCont(filerPanels);
        let panel  = await _.panelTpl();
        filerPanels.append(panel);
        return filerPanels;
 //       filerPanels.append(panel.cloneNode(true));
    }
    async fileTpl(fileData){
        const _ = this;
        return new Promise(async function (resolve) {
            let
                itemChildes = [],
                itemsParams = {};
            if (!fileData.name) resolve({});
            if (fileData['type']){
            switch (fileData['type'].toLowerCase()) {
                case 'png':
                case 'svg':
                case 'jpg': {
                    itemChildes.push( {
                        el: _.createEl('DIV','filer-panel-item-img'),
                        childes:[{
                            el: _.createEl('IMG', null, {src: fileData['pathName']})
                        }]
                    });
                    itemsParams['data-click-action']= _.actions[_.type]['showFile'];
                } break;
                case 'dir': {
                    itemChildes.push( {
                        el: _.createEl('DIV','filer-panel-item-img'),
                        childes:[{
                            el: _.createEl('IMG', null, {src: 'img/filer/folder.svg'})
                        }]
                    });
                    itemsParams['data-click-action']=  `${_.componentName}:openFolder`;
                }break;
                case 'docx': {
                    itemChildes.push( {
                        el: _.createEl('DIV','filer-panel-item-img'),
                        childes:[{
                            el: _.createEl('IMG', null, {src: 'img/filer/word.svg'})
                        }]
                    });
                    itemsParams['data-click-action']=  _.actions[_.type]['showFile'];
                }break;
            }
            }
            itemChildes.push( {
                el: _.createEl('SPAN','filer-panel-item-title',{
                    text: fileData['name'],
                })
            });
            itemChildes.push( {
                el: _.createEl('DIV','filer-panel-item-actions'),
                childes:[
                    {
                        el: _.createEl('BUTTON','filer-panel-item-action delete',{
                            'data-file-name': fileData['name'],
                            'data-click-action':`${_.componentName}:deleteFile`
                        })
                    },{
                        el: _.createEl('INPUT','filer-panel-item-action check',{
                            type: "checkbox",
                            'data-file-name': fileData['name'],
                            'data-change-action':`${_.componentName}:checkFile`
                        })
                    }
                ]
            });
            let tpl = {
                el:  _.createEl('DIV','filer-panel-item', itemsParams),
                childes: itemChildes
            };
            resolve(  _.createTpl(tpl));
        })
    }

    async dragStart(dragEvent){
        dragEvent['event'].preventDefault();
    }
    async dragOver(dragEvent){
        dragEvent['event'].preventDefault();
    }
    async dragEnter(dragEvent){
        const _ = this;
    //    dragEvent['event'].stopPropagation();
        let elem = dragEvent['item'];
        if (elem.classList.contains('filer-panel-body')){
            elem.style.border = '1px dashed #404040';
        }
    }
    async dragLeave(dragEvent){
        const _ = this;
        let elem = dragEvent['item'];
        if (elem.classList.contains('filer-panel-body')){
            elem.style.border = '1px dashed transparent';
        }
    }
    fillProgressBarColor(elem,percent){
        const _ = this;
        //_.fillProgressBarColor(loadedElem.querySelector('b'),percent);
        elem.style.width = percent + '%' ;
        if (percent <= 40){
            elem.style.backgroundColor= 'red';
        }else if (percent <= 70){
            elem.style.backgroundColor= 'yellow';
        }else if (percent == FULL){
            elem.style.backgroundColor= 'forestgreen';
        }
    }
    async fileUploaded(event,elem,file){
        const _ = this;
        let currentFile = await _.model.getFile('',file['name']);
        if (currentFile['name']) _.content.querySelector('.filer-panel-body').append(await _.fileTpl(currentFile));

        MainEventBus.trigger(_.componentName,'updatePanel');
        //   if(elem) elem.remove();
    }
    async dropFile(dragEvent){
        const _ = this;
        let e =  dragEvent['event'];
        e.preventDefault();
        e.stopPropagation();
        let files = e.dataTransfer.files;
        let elem = dragEvent['item'];
        let itemChildes = [];
        let tpl = {
            el:  _.createEl('DIV','filer-panel-item'),
            childes: itemChildes
        };
        itemChildes.push( {
            el: _.createEl('EM','filer-panel-item-progress' ),
            childes:[
                {
                    el: _.createEl('B')
                }
            ]
        });
        let loadedElem  = _.createTpl(tpl);
        let allArr = [];
        for (let i=0;i <files.length;i++){
            let file =   _.model.fileUpload({
                path: _.model.folder,
                file: files[i],
                loadHandler: function (event) {
                    _.content.querySelector('.filer-panel-body').append(loadedElem);
                    let  percent = (event.loaded / event.total ) * 100;
                    _.fillProgressBarColor(loadedElem.querySelector('b'),percent);
                },
                loadedHandler: function (event) {
                    _.fileUploaded(event, loadedElem,files[i]);
                },
            });
            allArr.push(file);
        }
        Promise.all(allArr);
        if (elem.classList.contains('filer-panel-body')){
            elem.style.border = '1px dashed transparent';
        }
    }
    appendBread(page){
        const _ = this;
        let folders = _.model.folder.split('/');
        folders.forEach(function (folder) {
            let bread = _.createEl('BUTTON','filer-panel-path-bread',{
                'data-bread':folder,
                'data-click-action':`${_.componentName}:goOnBread`,
                text: folder
            });
            page.querySelector('.filer-panel-path').append(bread);
        })

    }
    async panelTpl(){
        const _ = this;
        return new Promise(async function (resolve) {
            let breadTpl = [],
                breadsArr = _.model.folder.split('/');
            _.clearCont('.filer-panel-path');
            breadTpl.push({
                el: _.createEl('BUTTON','filer-panel-path-bread home',{
                    'data-click-action':`${_.componentName}:goHome`
                })
            });
            if (_.model.folder){
                breadsArr.forEach(  (el)=>{
                    breadTpl.push({
                       el:  _.createEl('BUTTON','filer-panel-path-bread',{
                            'data-bread': el,
                            'data-click-action':`${_.componentName}:goOnBread`,
                            text: el
                        })
                    });
                });
            }
            let files  = await _.model.getFiles(),
                itemsTpl = [];
            for (let i = 0; i < files.length;i++){
                let file = files[i];
                itemsTpl.push({el:await _.fileTpl(file)});
            }
            let tpl =  {
                el : _.createEl('DIV','filer-panel'),
                childes: [
                    {
                        el: _.createEl('DIV','filer-panel-head'),
                        childes:[
                            {
                                el:_.createEl('DIV','filer-panel-path',{
                                    'data-click-action':`${_.componentName}:showPath`,
                                    'data-keypress-action':`${_.componentName}:openFolderFromInput`}
                                 ),
                                childes: breadTpl
                            }
                        ]
                    }, {
                        el: _.createEl('DIV','filer-panel-body',{
                            'data-drag-start-action': `${_.componentName}:dragStart`,
                            'data-drag-over-action': `${_.componentName}:dragOver`,
                            'data-drag-enter-action': `${_.componentName}:dragEnter`,
                            'data-drag-leave-action': `${_.componentName}:dragLeave`,
                            'data-drop-action': `${_.componentName}:dropFile`
                        }),
                        childes:  itemsTpl
                    }
                ]
            };
            let buffer = _.createTpl(tpl);
            resolve(buffer);
        })
    }
    async bodyTpl(){
        const _ = this;
        let tpl =  {
            el : _.createEl('DIV','filer-panels'),
            childes: [
                {
                    el:''
                }
            ]
        };
        let buffer = _.createTpl(tpl);
        let panel = await _.panelTpl();
        buffer.append(panel);
  //      buffer.append(panel.cloneNode(true));
        return buffer;
    }
    render(page,multiple) {
        const _ = this;
        return new Promise(async function (resolve) {
            if (page === _.modulePage) {
                let content = await _.pageTpl();
                resolve(content);
                return ;
            }
            if ( (page === 'modal')){
                _.type = 'modal';
                _.model.multiple = multiple;
                let content  = await _.pageModalTpl(multiple);
                resolve(content);
	            return ;
            }
            resolve(true);
        })
    }
}