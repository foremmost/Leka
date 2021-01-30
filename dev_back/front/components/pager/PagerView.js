import { View } from "../main/View.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import {systemConts} from "../../libs/Conts.lib.js";

export class PagerView extends View {
    baseNode;
    constructor(model){
        super(model);
        const _ = this;
        _.componentName = 'pager';
        _.modulePage = 'pager';
        _.head = systemConts['content'].querySelector('.page-head');
        _.body = systemConts['content'].querySelector('.page-body');
        _.properties = {};
        _.layout = '';
        
        MainEventBus.add(_.componentName,'filterPages',_.filterPages.bind(_));
        MainEventBus.add(_.componentName,'keyUpSearchPage',_.keyUpSearchPage.bind(_));
        MainEventBus.add(_.componentName,'btnSearch',_.btnSearch.bind(_));
        MainEventBus.add(_.componentName,'createNewPage',_.createNewPage.bind(_));
        MainEventBus.add(_.componentName,'backToPage',_.backToPage.bind(_));

        MainEventBus.add(_.componentName,'changeView',_.changeView.bind(_));

        MainEventBus.add(_.componentName,'textAreaInput',_.textAreaInput.bind(_));
        MainEventBus.add(_.componentName,'ifrAreaInput',_.ifrAreaInput.bind(_));
        MainEventBus.add(_.componentName,'tyntClickAction',_.tyntClickAction.bind(_));
    }

    async createNewPage(){
        const _ = this;
        _.pageHeadTpl({'newPage':true});
        _.clearCont(_.body);
        let tpl = await _.getTpl('newPageTpl',{'save':true});
        _.body.append(tpl);
        _.textArea = _.body.querySelector('.npBody textarea');
        _.ifrTpl();
        MainEventBus.trigger('languager','loadTranslate',systemConts['content']);
    }

    ifrTpl(){
        const _ = this;
        let ifrTpl = _.el('DIV',{'contentEditable': true}),
            ifrStyle = _.el('STYLE',{'text':`
                body>div{width:100%;height:100%}
            `});
        _.ifrArea = ifrTpl;

        ifrTpl.addEventListener('input', function (e) {
            _.ifrAreaInput({
                item:e.target,
                event:e
            });
        });

        _.ifrTag = _.body.querySelector('iframe').contentDocument;
        _.ifrTag.querySelector('head').innerHTML += '<link rel="stylesheet" property="stylesheet" href="css/main.css">';
        let ifrBody = _.ifrTag.querySelector('body');
        ifrBody.append(ifrTpl);
        ifrBody.append(ifrStyle);
    }
    newPageTpl(params){
        const _ = this;
        return new Promise(function(resolve){
        let tpl = _.el('DIV',{'class':'npContainer npAppearanceActive','childes':[
            _.el('STYLE',{'text':`
                .npContainer{width:900px;padding: 20px 0 0}
                .npRow{display:flex;flex-wrap:wrap;margin-bottom:10px}
                .npRow>*{margin: 0 10px 10px 0}
                .npRow>*:last-child{margin: 0 0 10px 0}
                .npLayoutBtn{background-color:rgba(247, 145, 65, 0.85)}
                .npAppearanceActive .npLayout{display:none}
                .npAppearanceActive .npAppearanceBtn{background-color:rgba(247, 145, 65, 0.85)}
                .npAppearanceActive .npLayoutBtn{background-color:rgba(136, 163, 255, 0.91)}
                .npAppearanceActive .npAppearance{display:block}
                .npAppearance{display:none}
                .npAppearance .npBody{height:280px}
                .npLayout .npBody{height:340px}
                .npBody{margin-bottom:20px;overflow:auto;border:1px solid rgba(136,163,255,.91)}
                .npBody *{min-height:calc(100% - 4px);width:100%;border:none;padding:10px;font-size:14px}
                .npInpt{width:100%;text-align:left;border:1px solid rgba(136, 163, 255, 0.91);padding:10px;margin-bottom:20px}
            `}),
            _.el('INPUT',{'class':'npInpt','type':'text','data-word':'Page Title'}),
            _.el('DIV',{'class':'npRow','childes':[
                _.el('BUTTON',{'class':'btn npAppearanceBtn','data-word':'appearance','data-click-action':`${_.componentName}:changeView`}),
                _.el('BUTTON',{'class':'btn npLayoutBtn','data-word':'Layout','data-click-action':`${_.componentName}:changeView`})
            ]}),
            _.el('DIV',{'class':'npAppearance','childes':[
                _.el('DIV',{'class':'npRow','childes':[
                    _.el('BUTTON',{'class':'btn','data-word':'i','style':'font-style:italic','data-click-action':`${_.componentName}:tyntClickAction`,'id':'i'}),
                    _.el('BUTTON',{'class':'btn','data-word':'b','style':'font-weight:700','data-click-action':`${_.componentName}:tyntClickAction`,'id':'b'}),
                    _.el('BUTTON',{'class':'btn','data-word':'paragraph'}),
                    _.el('BUTTON',{'class':'btn','data-word':'paragraph'}),
                    _.el('BUTTON',{'class':'btn','data-word':'paragraph'}),
                    _.el('BUTTON',{'class':'btn','data-word':'paragraph'}),
                    _.el('BUTTON',{'class':'btn','data-word':'paragraph'})
                ]}),
                _.el('DIV',{'class':'npBody','childes':[
                    _.el('IFRAME')
                ]})
            ]}),
            _.el('DIV',{'class':'npLayout','childes':[
                _.el('DIV',{'class':'npBody','childes':[
                    _.el('TEXTAREA',{'data-input-action':`${_.componentName}:textAreaInput`})
                ]})
            ]}),
            _.el('INPUT',{'class':'npInpt','type':'text','data-word':'Meta-words'}),
            _.el('INPUT',{'class':'npInpt','type':'text','data-word':'Meta-description'})
        ]});
       //
        resolve(tpl);
        });
    }
    changeView(clickData){
        const _ = this;

        if(clickData['item'].classList.contains('npAppearanceBtn')) {
            if(!_.body.querySelector('.npContainer').classList.contains('npAppearanceActive')){
                _.body.querySelector('.npContainer').classList.add('npAppearanceActive');
            }
        } else {
            _.body.querySelector('.npContainer').classList.remove('npAppearanceActive')
        }
    }
    backToPage(){
        const _ = this;
        _.pageTpl(_.properties);
        MainEventBus.trigger('languager','loadTranslate',systemConts['content'])
    }

    textAreaInput(){
        const _ = this;
        _.layout = _.textArea.value;
        _.ifrArea.innerHTML = _.layout;
    }
    ifrAreaInput(){
        const _ = this;
        _.layout = _.ifrArea.innerHTML;
        _.textArea.value = _.layout;
    }

    getPartOfString(str = '', length = 0, toRight = true){
        str = toRight ? str : str.split('').reverse().join('');

        let ans = '';
        for(let i = 0; i < length; i++){
            ans += str[i];
        }
        ans = toRight ? ans : ans.split('').reverse().join('');
        return ans;
    }
    getPartOfHTML(htmlObj, prev = true){
        const _ = this;

        let ans = htmlObj.outerHTML ? htmlObj.outerHTML : htmlObj.textContent;
        let part = prev ? htmlObj.previousSibling : htmlObj.nextSibling;
        part = part ? _.getPartOfHTML(part,prev) : undefined;
        if(prev) ans = part ? part + ans : ans;
        else ans = part ? ans + part : ans;
        return ans;
    }
    tyntClickAction(clickData){
        const _ = this;

        let selectedTextObject = _.ifrTag.getSelection();
        let text = selectedTextObject.baseNode;
        let string = text.nodeValue;

        console.log(selectedTextObject);
        console.log(string);

        let prev = text.previousSibling ? _.getPartOfHTML(text.previousSibling) : '';
        let next = text.nextSibling ? _.getPartOfHTML(text.nextSibling,false) : '';

        console.log(prev + ' - ' + next);

        let firstPart = _.getPartOfString(string, selectedTextObject.anchorOffset);
        let lastPart = _.getPartOfString(string, string.length - selectedTextObject.focusOffset, false);
        let selectedText = selectedTextObject.toString();

        console.log(firstPart + ' - ' + selectedText + ' - ' + lastPart);

        let resultString = prev + firstPart + selectedText + lastPart + next;

        console.log(resultString);
    }

    filterPages(){
        const _ = this;
        _.properties['filter'] = _.head.querySelector('select').value;
        console.log(_.properties);
    }
    keyUpSearchPage(){
        const _ = this;
        _.properties['search'] = _.head.querySelector('input').value;
        console.log(_.properties)
    }
    btnSearch(){
        const _ = this;
        _.properties['search'] = _.head.querySelector('input').value;
        console.log(_.properties)
    }

    // Создает шаблон header
    pageHeadTpl(pageData = {}){
        const _ =  this;
        _.clearBody(_.head);
        let actions = _.el('DIV',{'class':'page-action'});

        pageData['newPage']
            ? actions.append(
                _.el('BUTTON',{'class':'btn','data-word':'Save','data-click-action':`${_.componentName}:savePage`}),
                _.el('BUTTON',{'class':'btn','data-word':'backToPage','data-click-action':`${_.componentName}:backToPage`})
            )
            : actions.append(_.el('BUTTON',{'class':'btn','data-word':'Create New Page','data-click-action':`${_.componentName}:createNewPage`}));

        let tpl = _.el('temp',{'childes':[
                _.el('H1',{'data-word':'Pager','class':'page-title'}),
                actions
            ]});
        _.head.append(tpl);
    }

    // Создает фильтр и поиск на своей странице
    filterTpl(properties = {}){
        const _ = this;

        let tpl = _.el('DIV',{'class':'page-filter','childes':[
            _.el('DIV',{'class':'page-select','childes':[
                _.el('DIV',{'class':'page-inpt','childes':[
                    _.el('SPAN',{'data-word':'Choose type'}),
                    _.el('SELECT',{'data-change-action':`${_.componentName}:filterPages`,'childes':[
                        _.el('OPTION',{'value':'all','data-word':'All'}),
                        _.el('OPTION',{'value':'news','data-word':'News'}),
                        _.el('OPTION',{'value':'blogs','data-word':'Blogs'})
                    ]})
                ]})
            ]}),
            _.el('DIV',{'class':'page-search','childes':[
                _.el('DIV',{'class':'page-inpt','childes':[
                    _.el('INPUT',{
                        'class':'page-search-value',
                        'type':'text',
                        'data-word':'Search',
                        'data-keyup-action':`${_.componentName}:keyUpSearchPage`}),
                    _.el('BUTTON',{'class':'page-btn','data-click-action':`${_.componentName}:btnSearch`,'childes':[
                        _.el('IMG',{'src':`/workspace/img/search.svg`})
                    ]})
                ]})
            ]})
        ]});
        _.head.append(tpl);

        _.head.querySelector('SELECT').childNodes.forEach(function (el) {
            if(el.value === properties['filter']) el.setAttribute('selected','selected')
        });
        _.head.querySelector('.page-search-value').value = _.properties['search'] ? _.properties['search'] : '';
    }

    // Формирует таблицу
    tableTpl(){
        const _ = this;
        let tpl = _.el('TABLE',{'class':'page-table','childes':[
            _.el('THEAD',{'childes':[
                _.el('TR',{'childes':[
                    _.el('TH',{'class':'page-table-head','data-word':'Title'}),
                    _.el('TH',{'class':'page-table-head','data-word':'Type'}),
                    _.el('TH',{'class':'page-table-head','data-word':'Date'}),
                    _.el('TH',{'class':'page-table-head','data-word':'#'})
                    ]})
                ]})
            ]});
        _.body.append(tpl);
    }
    async tableRowTpl(page){
        const _ = this;
    }

    // Создает шаблон страницы
    pageTpl(properties){
        const _ = this;
        _.pageHeadTpl();
        _.filterTpl(properties);
        _.clearCont(_.body);
        _.tableTpl();
    }
    async render(page) {
        const _ = this;
        return new Promise(async function (resolve) {
            if( page === _.modulePage){
                _.pageTpl();
                resolve(systemConts['content']);
            }
        });
    }
}