import { Ctrl } from '../main/Ctrl.js';
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import {Functions} from "../../libs/Functions.lib.js";
export class ConsultantCtrl  extends Ctrl  {
	constructor(model,view){
		super(model,view);
		const _ = this;

		_.componentName = 'consultant';

		//  Работа с пагинацией
		MainEventBus.add(_.componentName,'calcItemsCount',_.calcItemsCount.bind(_),`${_.componentName}Ctrl`);
		MainEventBus.add(_.componentName,'nextPage',_.nextPage.bind(_),`${_.componentName}Ctrl`);
		MainEventBus.add(_.componentName,'prevPage',_.prevPage.bind(_),`${_.componentName}Ctrl`);
		MainEventBus.add(_.componentName,'goPage',_.goPage.bind(_),`${_.componentName}Ctrl`);
		
		MainEventBus.add(_.componentName,'filterChats',_.filterTable.bind(_));
		MainEventBus.add(_.componentName,'openYourChats',_.openYourChats.bind(_));

		MainEventBus.add(_.componentName,'answerPage',_.answerPagePrepare.bind(_));
		MainEventBus.add(_.componentName,'chatFill',_.chatFill.bind(_));
		MainEventBus.add(_.componentName,'changeStatus',_.changeStatus.bind(_));
		MainEventBus.add(_.componentName,'chatScrollToTop',_.chatScrollToTop.bind(_));
		MainEventBus.add(_.componentName,'formSubmit',_.formSubmit.bind(_));
		MainEventBus.add(_.componentName,'finishChat',_.finishChat.bind(_));
		MainEventBus.add(_.componentName,'formKeyUp',_.formKeyUp.bind(_));

		MainEventBus.add(_.componentName,'newChatsCheck',_.newChatsCheck.bind(_))
		_.intLive = 1000;

	}
	
	// Фильтрует чаты
	async filterTable(){
		const _ = this;

		await MainEventBus.trigger('languager', 'loadTranslate', {
			cont: document.querySelector('.page-head')
		});

		let select = document.querySelector('.page-head select');
		let status = select.value;
		let filterData = {};
		_.model.currentStatus = status;

		if (_.model.isCommon(status)) {
			filterData['type'] = 'main';
		} else {
			filterData['type'] = 'search';
		}

		await _.view.fillTable(filterData);

		await MainEventBus.trigger('languager', 'loadTranslate', {
			cont: document.querySelector('.page-table')
		});
	}
	async openYourChats(){
		const _ = this;
		_.model.myChats = !_.model.myChats;

		let btn = document.querySelector('.my-chats-btn');
		let select = document.querySelector('.page-head select');
		if (_.model.myChats) {
			btn.setAttribute('data-word','All Chats');
			select.selectedIndex = 2;
		} else {
			btn.setAttribute('data-word','My Chats');
			select.selectedIndex = 0;
		}
		btn.removeAttribute('data-lang');

		await _.filterTable();
	}
	// Считает количетво чатов в выбранном фильтре
	async calcItemsCount(calcData = {}){
		const _ = this;
		return new Promise( async function (resolve) {
			let cnt = await _.model.getItemsCnt();
			cnt = cnt['cnt'];
			_.unAnsCnt = cnt;
			resolve(parseInt(cnt));
		})
	}
	// Проверяет наличие новых чатов
	newChatsCheck(){
		const _ = this;

	}
	// Подготавливает данные для постройки страницы ответа
	async answerPagePrepare(clickData){
		const _ = this;
		let
			btn = clickData.item,
			dialogId = btn.getAttribute('data-dialogid'),
			action = btn.getAttribute('data-action');
		
		_.model.currentChat = await _.model.getChatById(dialogId);
		_.model.currentChat = _.model.currentChat[0];
		_.model.currentChat['action'] = action;
		
		let changeData = {
			type : 'chat',
			status : _.model.ANSWERING,
			answerUid : _.model.currentUser['id']
		};
		if(action === 'answer') {
			_.model.timedStatus = _.model.currentChat['status'];
			await _.changeStatus(changeData);
			await _.model.changeChatAnswerUid(changeData);
		}
		await _.view.answerPage();
		_.checkNewMess = true;
		_.checkChangeAccess = true;
		await _.newMessageCheck();
	}
	// Заполняет чат сообщениями
	async chatFill(){
		const _ = this;
		Functions.showLoader(_.view.chatWindow);
		let requestCnt = await _.model.getMessagesCnt({'dialogId':_.model.currentChat['dialogId']});
		requestCnt = requestCnt['cnt'];
		_.model.currentMessagesPageCnt = requestCnt > _.model.perPage ? Math.ceil(requestCnt / _.model.perPage) : 1;
		_.model.currentMessagesPage = 1;
		
		let dialog = await _.model.getMessages({
			dialogId: _.model.currentChat['dialogId'],
			page: _.model.currentMessagesPage
		});
		if(!dialog.length) {
			Functions.hideLoader(_.view.chatWindow);
			return;
		}
		
		let lastMessage = await _.model.getLastMessage(_.model.currentChat['dialogId']);
		_.model.lastMessageDate = lastMessage['addDate'].split(' ')[0];
		
		await _.view.chatFill(dialog);
		Functions.hideLoader(_.view.chatWindow);
		_.getLastMessId();
		_.view.chatScrollToLast();
	}
	// Получает и записывает id последнего сообщения в окне чата
	getLastMessId(){
		const _ = this;
		let lastMes = _.view.chatWindow.lastElementChild;
		if(lastMes) {
			if(!lastMes.classList.contains('consultant-chat-message-row')) {
				while(!lastMes.classList.contains('consultant-chat-message-row')){
					lastMes = lastMes.previousElementSibling;
				}
			}
			_.model.lastMessageId = lastMes.getAttribute('data-id');
		}
	}
	// Подгружает сообщения при скролле чата наверх
	async chatScrollToTop(){
		const _ = this;
		let newMessages;
		Functions.showLoader(_.view.chatWindow);
		if(_.view.chatWindow.scrollTop === 0 && _.view.chatWindow.scrollTop < _.model.chatWindowScrolled) {
			_.model.currentMessagesPage++;
			if(_.model.currentMessagesPage <= _.model.currentMessagesPageCnt){
				let fromBottomHeight = _.view.chatWindow.scrollHeight;
				newMessages = await _.model.getMessagesFromId();
				await _.view.chatFill(newMessages);
				_.view.chatWindow.scrollTo(0,_.view.chatWindow.scrollHeight - fromBottomHeight)
			}
		}
		_.model.chatWindowScrolled = _.view.chatWindow.scrollTop;
		MainEventBus.trigger('languager','loadTranslate',_.model.chatWindow);
		Functions.hideLoader(_.view.chatWindow);
	}
	// Меняет статус переданного объекта (чата, сообщения)
	async changeStatus(changeData){
		const _ = this;
		let type = changeData['type'];
		type === 'message' ?
			await _.model.changeMessageStatus(changeData) :
			await _.model.changeChatStatus(changeData);
	}
	async formKeyUp(eventData){
		const _ = this;
		let e = eventData.event;
		if(e.ctrlKey && (e.key === 'Enter' || e.key === 'NumEnter')) {
			e.preventDefault();
			await _.sendMessage();
		}
	}
	// Отправляет сообщение модели, а та на сервер
	async formSubmit(clickData){
		const _ = this;
		clickData.event.stopPropagation();
		clickData.event.preventDefault();
		await _.sendMessage();
	}
	async sendMessage(){
		const _ = this;
		_.checkNewMess = false;
		_.checkChangeAccess = false;
		let input = document.querySelector('.consultant-chat-input');
		let sendData = {
			'message' : input.value,
		};
		await _.model.sendMessage(sendData);
		await _.chatAddMessages();
		input.value = '';
		document.querySelector('form textarea').focus();
		_.checkNewMess = true;
		_.checkChangeAccess = true;
	}
	// Проверяет наличие новых сообщений и добавляет их в чат
	async newMessageCheck(close = false){
		const _ = this;
		if(!close) {
			_.interval = setInterval(async ()=>{
				if(_.checkNewMess){
					_.checkNewMess = false;
					let lastMesId = await _.model.getLastMessageId();
					if(!_.model.lastMessageId) _.model.lastMessageId = 0;
					if(lastMesId !== parseInt(_.model.lastMessageId)) await _.chatAddMessages();
					if(_.checkChangeAccess) _.checkNewMess = true;
				}
			},_.intLive);
		}
		if(close) clearInterval(_.interval);

	}
	async chatAddMessages(){
		const _ = this;
		let dialog = await _.model.getNewChatMessages();
		await _.view.addNewMessages(dialog);
		_.getLastMessId();
		_.view.chatScrollToLast();
		MainEventBus.trigger('languager','loadTranslate',_.view.chatWindow);
	}
	// Возвращает на главную страницу
	async finishChat(clickData){
		const _ = this;
		_.model.prevUser = {uId : null};
		_.model.currentMessagePage = null;
		_.model.messagesCnt = null;
		let
			btn = clickData.item,
			select = document.querySelector('.consultant-info-item select');
		
		if(_.model.currentChat['action'] === 'answer'){
			let changeData = {type : 'chat'};
			changeData['status'] = btn.classList.contains('cons-back') ? 2 : parseInt(select.value);
			await _.changeStatus(changeData);
			await _.model.changeChatAnswerUid(changeData);
		}
		
		await _.newMessageCheck(true);

		let body = _.view.content.querySelector('.page-body');
		if (body.classList.contains('answer-page')) body.classList.remove('answer-page');
		
		await _.view.pageTpl();
		await MainEventBus.trigger('languager','loadTranslate');
	}
	
	// Создает новый чат
	async createNewChat(){
		const _ = this;
		await _.model.createNewChat();
	}
}