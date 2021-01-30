import { Module } from "../main/Module.js";
import { ConsultantModel } from "./ConsultantModel.js";
import { ConsultantView } from "./ConsultantView.js";
import { ConsultantCtrl } from "./ConsultantCtrl.js";

export class Consultant extends Module {
	constructor(){
		let
			model = new ConsultantModel(),
			view = new ConsultantView(model),
			ctrl = new ConsultantCtrl(model, view);

		super(view,ctrl,model);
		const _ = this;
	}


	async createNewChat(createData){
		const _ = this;
		return await _.model.createNewChat(createData);
	}
	async getChatByUid(userData){
		return await this.model.getChatByUid(userData);
	}
	async getChatById(id){
		return await this.model.getChatById(id);
	}
	async sendMessage(messageData){
		return await this.model.sendMessageFromClient(messageData)
	}
	async getMessages(requestData){
		return await this.model.getMessages(requestData);
	}
	async getUserData(id,source = null){
		return await this.model.getUserData(id,source);
	}
	async getLastMessageId(dialogId){
		return await this.model.getLastMessageId(dialogId);
	}
	async getNewChatMessages(dialogId,lastMessId){
		return await this.model.getNewChatMessages(dialogId,lastMessId);
	}
	async getMessagesFromId(dialogId,firstMesId){
		return await this.model.getMessagesFromId(dialogId,firstMesId);
	}



	async init(page){
		const _ = this;
		return await _.view.render(page);



	}
}