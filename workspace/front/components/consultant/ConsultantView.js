import { View } from "../main/View.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import {systemConts} from "../../libs/Conts.lib.js";

export class ConsultantView extends View {
    constructor(model){
        super(model);
        const _ = this;
        _.componentName = 'Consultant';
        _.modulePage = 'consultant';
        _.messages = {
            '141jlj123kl' : {
            'id' : '141jlj123kl',
            'userId' : 'user515',
            'date' : '27.10.2020',
            'name' : 'Андрей',
            'contact' : 'test@mail.ru',
            'status' : 'unanswered',
            'dialog' : {
                'user515' : 'Здавствуйте, подскажите, пожалуйста, мне нужна вентиляционная система для нового объекта спортивного центра, как можно ее заказать и с кем обговорить?'
            }
        }};

        MainEventBus.add(_.componentName,'answerPageTpl',_.answerPageTpl.bind(_),{'item' : this})
    }

    pageHeadTpl(pageData = {}){
        const _ =  this;

        _.clearBody(systemConts['content'].querySelector('.page-head'));
        _.clearCont(systemConts['content'].querySelector('.page-body'));

        return new Promise(function (resolve) {

            let head = _.el('H1',{'data-word':'Consultant','class':'page-title'});
            systemConts['content'].querySelector('.page-head').append(head);

            let body = _.tableTpl();
            systemConts['content'].querySelector('.page-body').append(body);

            resolve(systemConts['content'].querySelector('.page-head'));
        })
    }
    answerPageTpl(clickData){
        const _ = this;
        let item = clickData.item,
            id = item.getAttribute('data-id'),
            messageData = _.messages[id];

        _.clearCont(systemConts['content'].querySelector('.page-body'));

        let style = _.el('STYLE',{
            'text' : `
                .page-body{
                    padding-top:20px;
                    grid-template-areas:none;
                    grid-template-columns: 1fr 3fr
                }
                .consultant-answer-dialog{
                    height:300px;
                    overflow:auto;
                    border:1px solid rgba(0,0,0,0.5);
                    margin-bottom:20px;
                }
                .consultant-answer-input{
                    width:100%;
                    min-height:50px;
                    max-height:150px;
                    overflow:auto;
                    border:1px solid rgba(0,0,0,0.5);
                    padding:10px;
                    margin-bottom:20px;
                    text-align:right;
                }
                .consultant-answer-confirm{
                    margin-left:auto;
                }
                .consultant-info-cont{
                    padding-left: 20px;
                }
                .consultant-info-actions button, .consultant-info-item{
                    margin-bottom:10px;
                }
                button{
                    width:150px
                }
            `
            }),
            ans = _.el('DIV',{'class' : 'consultant-answer-cont', 'childes' : [
                _.el('DIV',{'class' : 'consultant-answer-dialog'}),
                _.el('FORM',{'class' : 'consultant-answer-form', 'childes' : [
                    _.el('TEXTAREA', {'class' : 'consultant-answer-input', 'data-word' : 'Write your answer here'}),
                    _.el('BUTTON',{'class' : 'consultant-answer-confirm btn', 'data-word' : 'Send'})
                ]})
            ]}),
            info = _.el('DIV',{'class' : 'consultant-info-cont', 'childes' : [
                _.el('UL',{'class' : 'consultant-info-list'}),
                _.el('DIV',{'class' : 'consultant-info-actions', 'childes' : [
                    _.el('BUTTON',{'data-word' : 'Close', 'class' : 'btn'}),
                    _.el('BUTTON',{'data-word' : 'Finish dialog', 'class' : 'btn'})
                ]})
            ]});

        for (let param in messageData){
            if(param === 'id' || param === 'message') continue;
            let item = _.el('LI', {'class' : 'consultant-info-item', 'childes' : [
                _.el('SPAN', {'data-word' : param}),
                _.el('SPAN', {'text' : `: ${messageData[param]}`})
            ]});
            info.querySelector('.consultant-info-list').append(item)
        }

        systemConts['content'].querySelector('.page-body').append(style,info,ans);
        MainEventBus.trigger('languager','loadTranslate',systemConts['content']);
    }
    tableTpl(){
        const _ = this;

        let tpl = _.el('TABLE',{'class':'page-table'}),
            head = _.el('THEAD',{
                'childes' : [
                    _.el('TR',{
                        'childes' : [
                            _.el('TH',{'data-word':'Date'}),
                            _.el('TH',{'data-word':'Name'}),
                            _.el('TH',{'data-word':'Message'}),
                            _.el('TH',{'text':'#'})
                        ]
                    })
                ]
            }),
            body = _.el('TBODY');

        for (let message in _.messages) {
            let row = _.tableRowTpl(_.messages[message]);
            body.append(row);
        }

        tpl.append(head);
        tpl.append(body);

        return tpl;
    }
    tableRowTpl(data = {}){
        const _ = this;
        let tpl = _.el('TR',{
            'childes' : [
                _.el('TD',{'text' : data.date}),
                _.el('TD',{'text' : data.name}),
                _.el('TD',{'text' : data.message}),
                _.el('TD',{'childes' : [
                    _.el('BUTTON',{
                        'data-word' : 'Answer',
                        'data-id' : data.id,
                        'class' : 'btn',
                        'style' : 'width:100%',
                        'data-click-action' : `${_.componentName}:answerPageTpl`
                    })
                ]})
            ]
        });

        return tpl;
    }

    pageTpl(){
        const _ = this;
        _.pageHeadTpl();
    }


    async render(page) {
        const _ = this;
        return new Promise(async function (resolve) {
            if( page === _.modulePage){
                let content =  await _.pageTpl();
                resolve(systemConts['content']);
            }
        });
    }
}