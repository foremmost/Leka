import {Model} from '../main/Model.js';
import {MainEventBus} from "../../libs/MainEventBus.lib.js";

/*const
	ANSWERED = 1,
	UNANSWERED = 0,
	ANSWERING = 2,
	ALL = 3;*/
export class ConsultantModel extends Model {
	
	get ANSWERED() {return 1}
	get UNANSWERED() {return 0}
	get ANSWERING() {return 2}
	get ALL() {return 3}
	
	constructor(){
		super();
		const _ = this;
		_.componentName = 'consultant';
		_.perPage = 20;
	}
	isAnswering(status){return parseInt(status) === this.ANSWERING}
	isAnswered(status){return parseInt(status) === this.ANSWERED}
	isUnanswered(status){return parseInt(status) === this.UNANSWERED}
	isCommon(status){return parseInt(status) === this.ALL}

	async sendMessage(sendData){
		const _ = this;
		let response = await _.handler({
			type: 'class',
			method: 'sendMessage',
			data: {
				uId : _.currentUser['id'],
				source : 'users',
				dialogId : _.currentChat['dialogId'],
				message : sendData.message
			},
		},'JSON');
		return response;
	}
	async sendMessageFromClient(sendData){
		const _ = this;
		let response = await _.handler({
			type: 'class',
			method: 'sendMessage',
			data: sendData,
		},'JSON');
		return response;
	}
	
	async changeMessageStatus(changeData){
		const _ = this;
		let status = await _.handler({
			type: 'class',
			method:'updateMessage',
			data:{
				id: changeData['id'],
				status: changeData['status']
			}
		},'JSON');
		return status;
	}
	async changeChatStatus(changeData){
		const _ = this;
		let status = await _.handler({
			type: 'class',
			method:'updateChat',
			data:{
				id: _.currentChat['dialogId'],
				status: changeData['status']
			}
		},'JSON');
		return status;
	}
	async changeChatAnswerUid(changeData){
		const _ = this;
		let answerUid = await _.handler({
			type: 'class',
			method:'updateAnswerUidInChat',
			data:{
				id: _.currentChat['dialogId'],
				answerUid: changeData['answerUid']
			}
		},'JSON');
		return answerUid;
	}
	
	async getChats(requestData = {}){
		const _ = this;
		let page = requestData['page'] ? requestData['page'] : 1;
		let method = 'getChats';
		let sendData = {
			perPage: _.perPage,
			page : page,
		};
		if (_.myChats) {
			method = 'getChatsByAnswerUid';
			sendData['answerUid'] = _.currentUser.id;
		}
		let response = await _.handler({
			type: 'class',
			method:method,
			data: sendData,
		},'JSON');
		return response;
	}
	async getChatById(id){
		const _ = this;
		if(!id) return;
		let response = await _.handler({
			type: 'class',
			method:'getChatById',
			data:{
				chatId:id
			}
		},'JSON');
		return response;
	}
	async getChatByUid(userData){
		const _ = this;
		if(!userData.id) return;
		let response = await _.handler({
			type: 'class',
			method:'getChatByUid',
			data:{
				uId:userData.id
			}
		},'JSON');
		return response;
	}
	async getChatsByStatus(requestData){
		const _ = this;
		let method = 'getChatsByStatus';
		let sendData = {
			perPage: _.perPage,
			page: requestData['page'],
			status: requestData['status']
		};
		if (_.myChats) {
			method = 'getChatsByAnswerUidAndStatus';
			sendData['answerUid'] = _.currentUser.id;
		}
		let response = await _.handler({
			type: 'class',
			method: method,
			data: sendData,
		},'JSON');
		return response;
	}
	
	async getMessagesCnt(cntData){
		const _ = this;
		let response = await _.handler({
			type:'class',
			method : 'getMessagesCnt',
			data : {
				dialogId: cntData['dialogId']
			}
		}, 'JSON');
		if(response['status'] === 'success'){
			return response['data']['cnt']
		}
		return 0;
	}
	async getMessages(requestData){
		const _ = this;
		let
			dialogId = requestData['dialogId'],
			page = requestData['page'],
			response = await _.handler({
				type:'class',
				method : 'getChatMessages',
				data:{
					perPage: 20,
					page : page,
					dialogId: dialogId
				}
		},'JSON');
		return response;
	}
	async getLastMessage(dialogId){
		const _ = this;
		let response = await _.handler({
			type: 'class',
			method:'getLastMessage',
			data:{
				dialogId: dialogId
			}
		},'JSON');
		return response;
	}
	async getLastMessageId(dialogId = null){
		const _ = this;
		if (!dialogId) dialogId = _.currentChat['dialogId'];
		let lastId = await _.handler({
			type: 'class',
			method:'getLastMessageId',
			data:{
				dialogId: dialogId
			}
		},'JSON');
		return Number(lastId);
	}
	async getMessageById(id){
		const _ = this;
		if(!id) return;
		let response = await _.handler({
			type: 'class',
			method:'getMessageById',
			data:{
				messageId:id
			}
		},'JSON');
		return response;
	}
	async getNewChatMessages(dialogId = null,lastMessId = null){
		const _ = this;
		if (!dialogId) dialogId = _.currentChat['dialogId'];
		if (!lastMessId) lastMessId = _.lastMessageId;
		let response = await _.handler({
			type:'class',
			method : 'getNewChatMessages',
			data:{
				perPage: 20,
				page : 1,
				dialogId: dialogId,
				id: lastMessId // (_.ctrl.chatFill _.ctrl.getLastMessId)
			}
		},'JSON');
		return response;
	}
	async getMessagesFromId(dialogId = null,firstMesId = null){
		const _ = this;
		if (!dialogId) dialogId = _.currentChat['dialogId'];
		if (!firstMesId) firstMesId = _.firstMesId;
		let response = await _.handler({
			type:'class',
			method : 'getChatMessagesFromId',
			data:{
				perPage: 20,
				dialogId: dialogId,
				id: firstMesId // (_.ctrl.chatFill _.ctrl.getLastMessId)
			}
		},'JSON');
		return response;
	}
	
	// Записывает в _.curUser name и uId пользователя, чей айди передан
	async getUserData(id = null,source = ''){
		const _ = this;
		if(!id) {
			let ansId = await MainEventBus.trigger('user','getUserId');
			id = ansId.uId;
		}
		let method = (source === 'temp_users') ? 'getUserInfoFromTemp' : 'getUserInfoFromMeta';
		let response = await _.handler({
			type: 'class',
			method: method,
			data: id
		},'JSON');
		return response;
	}
	async getItemsCnt(receivedData = null){
		const _ = this;
		let cntData = receivedData ? receivedData : {};
		cntData.type = 'class';
		if (receivedData) {
			cntData.method = 'getSearchedCnt';
			cntData.data = {query: 0}
		} else {
			if(!_.isCommon(_.currentStatus)){
				cntData.method = 'getSearchedCnt';
				cntData.data = {query: _.currentStatus}
			} else cntData.method = 'getItemsCnt';
		}

		let response = await _.handler(cntData, 'JSON');
		if(response['status'] === 'success'){
			return response['data']['cnt']
		}
		return 0;
	}
	async createNewChat(createData){
		const _ = this;
		let response = await _.handler({
			type: 'class',
			method: 'createChat',
			data: {
				uId: createData['id'],
				source: createData['source']
			},
		},'JSON');
		return response;
	}
}