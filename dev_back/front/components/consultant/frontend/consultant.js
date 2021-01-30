import {MainEventBus} from "../../../libs/MainEventBus.lib.js";
import {Storage} from "../../../libs/Storage.lib.js";
import {_front} from "../../../_front.js";

export class frontConsultant extends _front{
	constructor(){
		super();
		const _ = this;
		_.componentName = 'consultant';

		_.cont = document.querySelector('.consultant');
		if (_.cont){
			_.chatCont = _.cont.querySelector('.consultant-chat');
			_.sendForm = _.cont.querySelector('.consultant-form');
			_.regForm = _.cont.querySelector('.consultant-reg');
		}

		_.users = {};
		_.page = 1;
		_.checkNewMess = true;
		_.checkSendMess = true;

		_.components = new Map();
		MainEventBus
			.on(_,'showHide')
			.on(_,'messagePrepare')
			.on(_,'removePlaceholder')
			.on(_,'registration')
			.on(_,'logOut')
			.add('User','enteredAsUser',_.enteredAsUser.bind(_))
			.add('User','enteredAsGuest',_.enteredAsGuest.bind(_))
			.on(_,'chatFillByScroll');

	}
	// Подключает модуль User и запускает проверку как авторизирован пользователь
	async userCheck(){
		const _ = this;
		let user = await _.getModule({
			name: 'user',
			type: 'component',
			module:[{
				name: 'User',
				type: 'constructor',
				'container': document.querySelector('body')
			}]
		});
		return await user.checkLogin();
	}

	enteredAsUser(userData){
		let userInfo = {
			id: userData.uId,
			source: 'users'
		};
		let savedData = Storage.get('curUser',true);
		if (!savedData || (savedData.id !== userInfo.id)) Storage.save('curUser',userInfo)
		this.registrationFlag = false;
	}
	enteredAsGuest(){
		let userInfo = Storage.get('curUser',true);
		if (!userInfo || userInfo.source === 'users') {
			this.registrationFlag = true;
			if (userInfo && userInfo.source === 'users') {
				Storage.remove('curUser');
			}
		} else this.registrationFlag = false
	}

	async getUserInfo(){
		const _ = this;
		_.curUser = Storage.get('curUser',true);
		if (!_.curUser) return;
		let userData = await _.main.getUserData(_.curUser.id,_.curUser.source);
		if (!userData) {
			Storage.remove('curUser');
			return;
		}
		if (!_.curUser.chatId){
			let chat = await _.main.getChatByUid(_.curUser);
			if (!chat){
				let ans = await _.main.createNewChat(_.curUser);
				chat = {id: ans.data.chatId};
			}
			Storage.update('curUser',{chatId:chat.id})
			_.curUser.chatId = chat.id;
		}
	}

	async messagePrepare(submitData){
		const _ = this;
		if (!_.Functions){
			_.Functions = await _.getModule({
				name: 'Functions',
				type:'lib',
				module: [{
					name:'Functions',
					type:'function'
				}]});
		}
		_.checkSendMess = false;
		let form = submitData.item;
		let input = form.children[1];

		if (!input.textContent) return;
		if (_.registrationFlag){
			_.regForm.classList.add('active');
			return;
		}
		await _.getUserInfo();

		await _.sendMessage({
			source: _.curUser.source,
			uId: _.curUser.id,
			dialogId: _.curUser.chatId,
			message: input.textContent
		})
		input.textContent = '';
		_.removePlaceholder({item:input});
		input.focus();

		if (!_.haveChat()) {
			await _.getUserInfo();
			await _.chatPrepare();
			_.removeDesc()
		}

		_.checkSendMess = true;
		if (_.chatCont.children.length > 1)_.scrollToLastMes();
	}
	async sendMessage(sendData){
		const _ = this;
		await _.main.sendMessage(sendData)

		_.Functions.showLoader(_.chatCont);
		_.checkSendMess = false;
		let lastMesId = await _.main.getLastMessageId(_.curUser.chatId);
		if(!_.lastMessageId) _.lastMessageId = lastMesId;
		if(lastMesId !== parseInt(_.lastMessageId)) {
			await _.chatAddMessages();
			if (!_.yourConsultant) await _.consultantHeadInfoFill();
			_.lastMessageId = lastMesId;
		}
		_.checkSendMess = true;
		_.Functions.hideLoader(_.chatCont)
	}

	async registration(submitData){
		const _ = this;
		let
			userInfo = {},
			form = submitData.item;

		userInfo.name = form.children[0].value;
		userInfo.mail = form.children[1].value;

		if (!userInfo.name || !userInfo.mail) return;
		let createUserInfo;
		await _.getModule({
			name: 'customers',
			type: 'component',
			module: [{'container': document.querySelector('body'),name:'Customers',type:'constructor'}]
		});
		createUserInfo = await MainEventBus.trigger('customers','getTempUserByMail',{mail: userInfo.mail});
		if (!createUserInfo){
			createUserInfo = await  MainEventBus.trigger('customers','registerUser',userInfo);
			if (createUserInfo.status === 'success'){
				userInfo.id = createUserInfo.data.id;
			} else {
				console.log(createUserInfo);
				return;
			}
		} else {
			userInfo.id = createUserInfo.id;
		}
		Storage.save('curUser', {id: userInfo.id,source: 'temp_users'});

		_.regForm.classList.remove('active');
		_.registrationFlag = false;
		await _.messagePrepare({item: _.sendForm})
	}

	// Показывает скрывает онлайн-консультант
	showHide(clickData){
		const _ = this;
		let btn = clickData.item;
		if (btn.className === 'consultant-icon') {
			if (!_.cont.classList.contains('active') && window.innerWidth < 768) _.cont.classList.add('active');
		} else _.cont.classList.toggle('active');
	}

	// Убирает placeholder если в инпут что-то напечатано
	removePlaceholder(inputData){
		const _ = this;
		let
				input = inputData.item,
				placeholder = _.cont.querySelector('.consultant-form-placeholder');

		if (input.textContent.length) placeholder.classList.remove('active');
		else placeholder.classList.add('active')
	}

	// Проверяет есть ли чат
	haveChat(){
		return this.chatInfo !== undefined;
	}

	// Показывает плашку при отсутствии чата
	showDesc(){
		this.cont.querySelector('.consultant-desc').classList.add('active');
	}
	removeDesc(){
		this.cont.querySelector('.consultant-desc').classList.remove('active')
	}

	// Скроллит к последнему сообщению
	scrollToLastMes(){
		if (!this.chatCont.children.length) return;
		this.chatCont.scrollTo(0,this.chatCont.lastElementChild.offsetTop);
	}

	// Подготавливает чат
	async chatPrepare(){
		const _ = this;
		if (!_.curUser || !_.curUser.chatId) return;
		await _.getChatInfo();

		await _.consultantHeadInfoFill();

		await _.chatFill();

		await _.newMessageCheck(1000);
	}
	async getChatInfo(){
		const _ = this;
		_.chatInfo = await _.main.getChatById(_.curUser.chatId);
		_.chatInfo = _.chatInfo[0];
	}
	async consultantHeadInfoFill(){
		const _ = this;
		if (!_.haveChat()) return;
		if (!_.chatInfo.answerUid) await _.getChatInfo();
		if (!_.chatInfo.answerUid) return;
		_.yourConsultant = await MainEventBus.trigger('user','getName',_.chatInfo.answerUid);
		_.yourConsultant = _.yourConsultant.name;
		_.users[_.chatInfo.answerUid] = _.yourConsultant;
		_.cont.querySelector('.consultant-info-title').textContent = _.yourConsultant;
		_.cont.querySelector('.consultant-info-subtitle').textContent = 'Ваш консультант';
	}
	async chatFill(){
		const _ = this;
		if (!_.Functions){
			_.Functions = await _.getModule({
				name: 'Functions',
				type:'lib',
				module: [{
					name:'Functions',
					type:'function'
				}]});
		}
		_.Functions.showLoader(_.chatCont);
		let messages = await _.main.getMessages({dialogId:_.curUser.chatId,page:_.page});
		let temp = _.view.el('temp');
		for (let i = 0; i < messages.length; i++){
			let mesTpl = await _.messageTpl(messages[i]);
			_.firstMesId = messages[i].id;
			temp.prepend(mesTpl);
		}
		_.chatCont.prepend(temp);
		_.Functions.hideLoader(_.chatCont);
		_.scrollToLastMes();
	}
	async chatFillByScroll(){
		const _ = this;
		if(_.chatCont.scrollTop === 0 && _.chatCont.scrollTop < _.chatWindowScrolled){
			_.Functions.showLoader(_.chatCont);
			let fromBottomHeight = _.chatCont.scrollHeight;
			let messages = await _.main.getMessagesFromId(_.curUser.chatId,_.firstMesId);
			let temp = _.view.el('temp');
			for (let i = 0; i < messages.length; i++){
				let mesTpl = await _.messageTpl(messages[i]);
				temp.prepend(mesTpl);
				_.firstMesId = messages[i].id
			}
			_.chatCont.prepend(temp);
			_.chatCont.scrollTo(0,_.chatCont.scrollHeight - fromBottomHeight)
		}
		_.chatWindowScrolled = _.chatCont.scrollTop;
		_.Functions.hideLoader(_.chatCont);
	}

	async newMessageCheck(int){
		const _ = this;
		_.interval = setInterval(async ()=>{
			if(_.checkNewMess && _.checkSendMess){
				_.checkNewMess = false;
				let lastMesId = await _.main.getLastMessageId(_.curUser.chatId);
				if(!_.lastMessageId) _.lastMessageId = lastMesId;
				if(lastMesId !== parseInt(_.lastMessageId)) {
					await _.chatAddMessages();
					if (!_.yourConsultant) await _.consultantHeadInfoFill();
					_.lastMessageId = lastMesId;
				}
				_.checkNewMess = true;
			}
		},int);
	}
	async chatAddMessages(){
		const _ = this;
		let messages = await _.main.getNewChatMessages(_.curUser.chatId,_.lastMessageId)
		let temp = _.view.el('temp');
		for (let i = 0; i < messages.length; i++){
			let mesTpl = await _.messageTpl(messages[i]);
			temp.prepend(mesTpl);
		}
		_.chatCont.append(temp);
		_.scrollToLastMes();
	}

	// Создает и заполняет разметку сообщения
	async messageTpl(message){
		const _ = this;
		let cls = (message.uId === _.curUser.id) ? 'message client' : 'message manager';

		if (!_.users[message.uId] && (message.uId !== _.curUser.id)){
			let userInfo = await _.main.getUserData(message.uId);
			_.users[message.uId] = userInfo.name;
		}
		let name = (message.uId !== _.curUser.id) ? _.users[message.uId] : 'Вы';

		let dateInfo = message['addDate'].split(' ');
		let time = dateInfo[1];
		dateInfo = dateInfo[0].split('-');
		let date = dateInfo[2] + '-' + dateInfo[1] + '-' + dateInfo[0];

		let tpl = _.view.el('DIV',{
			class: cls,
			childes: [
				_.view.el('DIV',{class: 'message-info', childes: [
					_.view.el('SPAN',{class: 'message-name',text: name}),
					_.view.el('SPAN',{class: 'message-time',text: time}),
					_.view.el('SPAN',{class: 'message-date',text: date}),
				]}),
				_.view.el('DIV',{class: 'message-text',text: message.message})
			]
		});
		return tpl;
	}

	async logOut(){
		const _ = this;
		Storage.remove('curUser');
		location.reload()
	}

	async init(){
		super.init();
		const _ = this;
		if (_.cont){
			_.main = await _.getModule({name: 'Consultant', type:'component', module: [{
					name:'Consultant',
					'cont': document.querySelector('body'),
					type:'constructor'}]});
			await _.userCheck();
			await _.getUserInfo();
			await _.chatPrepare();
			if (!_.haveChat()) _.showDesc();

			_.chatCont.addEventListener('scroll', function (e) {
				MainEventBus.trigger(_.componentName, 'chatFillByScroll', e)
			});
		}
	}
}