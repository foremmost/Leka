import { MainEventBus } from "/workspace/front/libs/MainEventBus.lib.js";
import { Modaler } from "/workspace/front/libs/Modaler.lib.js";
import { _front } from "/workspace/front/_front.js";
class Front extends _front{
	constructor(){
		super();
		const _ = this;
		MainEventBus.add(_.componentName,'createOrderSuccess',_.createOrderSuccess.bind(_));
		MainEventBus.add(_.componentName,'createOrderFail',_.createOrderFail.bind(_));
		
		MainEventBus.add(_.componentName,'mainSliderSwap',_.mainSliderSwap.bind(_));
		MainEventBus.add(_.componentName,'mainSliderSwap',_.mainSliderSwapReset.bind(_));
		
		MainEventBus.add(_.componentName,'headBurgerClick',_.headBurgerClick.bind(_));
		
		MainEventBus.add(_.componentName,'asideShow',_.asideShow.bind(_));
		MainEventBus.add(_.componentName,'showItem',_.showItem.bind(_));
		
		MainEventBus.add(_.componentName,'countShow',_.countShow.bind(_));
		MainEventBus.add(_.componentName,'countChoose',_.countChoose.bind(_));
		
		MainEventBus.add(_.componentName,'showFeedback',_.showFeedback.bind(_));
		MainEventBus.add(_.componentName,'showShare',_.showShare.bind(_));
		MainEventBus.add(_.componentName,'shareCopy',_.shareCopy.bind(_));
		MainEventBus.add(_.componentName,'showCity',_.showCity.bind(_));
		
	}
	createOrderSuccess(orderData){
		console.log(orderData);
	}
	createOrderFail(orderData){}
	
	headBurgerClick(){
		const _ = this;
		let head = document.querySelector('.head');
		head.classList.toggle('active');
	}
	
	mainSliderButtonsCreate(){
		const _ = this;
		let slider = document.querySelector('.main-slider');
		if(slider) {
			let slidesCount = slider.children.length;
			let controlTpl = document.createElement('DIV');
			controlTpl.setAttribute('style',`width:${(slidesCount * 44) - 28}px`);
			controlTpl.className = 'slider-control';
			for(let i = 0; i < slidesCount; i++){
				let button = document.createElement('BUTTON');
				button.setAttribute('data-click-action',`${_.componentName}:mainSliderSwap`);
				button.setAttribute('data-number',i+1);
				button.className = 'control-button';
				if(i === 0) button.classList.add('active');
				controlTpl.append(button);
			}
			slider.append(controlTpl);
		}
	}
	mainSliderAutoSwap(){
		const _ = this;
		let slider = document.querySelector('.main-slider');
		if(slider) {
			_.mainSliderInterval = setInterval(()=>{
				let activeBtn = document.querySelector('.main-slider .control-button.active');
				let nextBtn = activeBtn.nextElementSibling;
				if(!nextBtn) nextBtn = activeBtn.parentElement.firstElementChild;
				_.mainSliderSwap({item:nextBtn});
			},10000)
		}
	}
	mainSliderSwapReset(){
		const _ = this;
		clearInterval(_.mainSliderInterval);
		_.mainSliderAutoSwap();
	}
	mainSliderSwap(clickData){
		let button = clickData.item;
		let number = button.getAttribute('data-number');
		
		let buttons = document.querySelectorAll('.main-slider .control-button');
		buttons.forEach((btn) => {
			if(btn.classList.contains("active")) btn.classList.remove('active');
		});
		if(!button.classList.contains('active')) button.classList.add('active');
		
		let slides = document.querySelectorAll('.main-slider .slide');
		slides.forEach((slide,index) => {
			if(slide.classList.contains("active")) slide.classList.remove('active');
			if(index === number - 1) slide.classList.add('active');
		});
		
	}
	
	asideShow(clickData){
		const _ = this;
		let btn = clickData['item'];
		let menuItem = btn.parentElement;
		let list = menuItem.lastElementChild;
		menuItem.classList.toggle('active');
		if(menuItem.classList.contains('active')){
			let listHeight = list.offsetHeight;
			let buttonHeight = btn.offsetHeight;
			let height = listHeight + buttonHeight;
			menuItem.setAttribute('style',`height:${height}px`)
		} else {
			menuItem.removeAttribute('style')
		}
	}
	
	showItem(clickData){
		const _ = this;
		let event = clickData.event;
		event.preventDefault();
		let btn = clickData.item;
		let targetCls = btn.getAttribute('data-target');
		let target = document.querySelector(`.${targetCls}`);
		target.classList.toggle('active');
		if(target.classList.contains('active')) btn.classList.add('active');
		else btn.classList.remove('active')
	}
	
	countShow(){
		let select = document.querySelector('.count-select');
		select.classList.toggle('active')
	}
	countChoose(clickData){
		const _ = this;
		let btn = clickData.item;
		let input = document.querySelector('.count-input');
		let head = input.nextElementSibling.firstElementChild;
		input.value = btn.textContent;
		head.textContent = btn.textContent;
		_.countShow();
	}
	
	showFeedback(){
		Modaler.showModal({
			'content' : '.form-feedback',
			'contBgc' : '#E2F0FF',
			'border-radius' : '4px',
			'box-shadow' : '7px 11px 20px rgba(0, 0, 0, 0.16)'
		})
	}
	showShare(){
		Modaler.showModal({
			'content' : '.share',
			'closeBtn' : false
 		})
	}
	shareCopy(clickData){
		const _ = this;
		let event = clickData.event;
		event.preventDefault();
		let path = location.href;
		let sp = document.getElementById('location');
		sp.textContent = path;
		let range = new Range();
		range.selectNodeContents(sp);
		document.getSelection().removeAllRanges();
		document.getSelection().addRange(range);
		document.execCommand('copy');
	}
	
	articlesLengthCheck(){
		const _ = this;
		let articles = document.querySelectorAll('.news .desc-text');
		if(articles.length) {
			articles.forEach(function(article) {
				if(window.innerWidth < 768) {
					if(article.textContent.length > 130) article.textContent = article.textContent.substr(0,130) + '...';
				}
				else {
					if(article.textContent.length > 230) article.textContent = article.textContent.substr(0,230) + '...';
				}
				article.setAttribute('style','display:block;')
			});
		}
	}
	
	currentPageCheck(){
		const _ = this;
		let headLinks = document.querySelectorAll('.head .item-link');
		let pageName = location.href;
		headLinks.forEach(function(link) {
			let linkWay = link.getAttribute("data-path");
			if(linkWay.length) {
				if(linkWay.indexOf(' ')){
					linkWay = linkWay.split(' ');
					for(let i = 0; i < linkWay.length; i++){
						if(pageName.indexOf(linkWay[i]) > -1) link.classList.add('active')
					}
				} else {
					if(pageName.indexOf(linkWay) > -1) link.classList.add('active')
				}
			}
		})
	}
	
	showCity(clickData){
		let cities = document.querySelectorAll('.map-dot');
		cities.forEach(function(el) {
			if(el.classList.contains('active')) el.classList.remove('active');
		});
		let curCity = clickData.item.parentElement;
		curCity.classList.add('active')
	}
	
	init(){
		const _ = this;
		_.currentPageCheck();
		_.mainSliderButtonsCreate();
		_.mainSliderAutoSwap();
		_.articlesLengthCheck();
	}
}
new Front();



