import { MainEventBus } from "/workspace/front/libs/MainEventBus.lib.js";
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
		
		_.mainSliderButtonsCreate();
		_.mainSliderAutoSwap();
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
}
new Front();



