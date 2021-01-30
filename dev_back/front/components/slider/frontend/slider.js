import { MainEventBus } from "../../../libs/MainEventBus.lib.js";
import { gsap } from '../../../libs/GreenSock.lib.js'

export class Slider{
	constructor(params) {
		const _ = this;
		_.gsap = gsap;
		_.tl = _.gsap.timeline();

		_.sliderData = params;
		_.slidesKeeper = [];
		_.componentName = _.sliderData['name'];

		_.init();

		MainEventBus
				.on(_,'next')
				.on(_,'prev')
				.on(_,'dot');
	}
	// вспомогательные методы
	el(tag,params = {}){
		const _ = this;
		if (!tag) return null;
		let
				childes =  params['childes'] ?  params['childes']: null;
		delete params['childes'];
		let temp = document.createElement(tag);
		if (tag == 'temp'){
			temp = document.createDocumentFragment();
		}
		if(params){
			for(let key in params){
				if(key === 'text') {
					if( (tag === 'INPUT') || (tag === 'TEXTAREA') ) temp.value = params[key];
					else temp.textContent = params[key];
				} else if(key === 'html') temp.innerHTML = params[key];
				else temp.setAttribute(`${key}`,`${params[key]}`);
			}
		}
		if(  (childes instanceof  Array) && (childes.length) ) {
			childes.forEach(function (el) {
				temp.append(el);
			});
		}
		return temp;
	}
	getSlide(pos){
		return this.slidesKeeper[pos];
	}

	// Обрабатывает входящие данные и вызывает методы для их преобразования
	sliderInit(){
		const _ = this;
		if (!_.sliderData.container) return;
		_.settings = _.sliderData['settings'];
		_.sliderData['container'] = document.querySelector(`.${_.sliderData.container}`)

		_.setDefaultSettings();
		_.slidesToDefault(_.sliderData['slides']);
		_.dotsToDefault(_.sliderData['dots']);
		_.containerToDefault(_.sliderData['container']);

		_.acceptSettings();

		_.sliderFilling();
		_.setGSliderHeight();
	}

	// Приводит слайды к единому виду
	slidesToDefault(slidesData = {}){
		const _ = this;
		let slides = slidesData['list'];
		let type;
		if (slides) {
			type = slidesData['type'];
			type = type ? type.toLowerCase() : null;
			if (type === 'class') slides = document.querySelectorAll(`.${slidesData['list']}`);
		} else {
			slides = _.sliderData['container'].children;
			type = 'html';
		}

		let length = slides.length;

		for (let i = 0; i < length; i++){
			let
					slide = slides[type === 'html' ? 0 : i],
					gSlide = _.el('DIV',{'data-pos':i,class:'g-slide',childes:[slide]});

			_.slidesKeeper.push(gSlide)
		}
	}
	// Приводит доты к единому виду
	dotsToDefault(dotsData = {}){
		const _ = this;
		_.dots = dotsData;
		if (_.dots['list']){
			_.dots['list'] = document.querySelectorAll(`.${_.sliderData['dots']['class']}`);
			_.dots['list'].forEach(function (dot,index){
				_.setAttrToDots(dot,index);
			})
		} else {
			let
					slidesCount = _.slidesKeeper.length,
					controlTpl = _.el('DIV',{
						class: 'slider-control',
						style: `width:${(slidesCount * 44) - 28}px`,
						childes: [_.createDots(slidesCount)]
					});
			_.dots['list'] = controlTpl.children;
			_.sliderData['container'].append(controlTpl);
		}
		_.dots['active'] = _.dots['list'][0];
		_.dots['active'].classList.add('active');
	}
	createDots(count){
		const _ = this;

		let temp = _.el('temp');
		for (let i = 0; i < count; i++){
			let dot = _.el('BUTTON',{class: 'control-button'});
			_.setAttrToDots(dot,i);
			temp.append(dot);
		}
		return temp;
	}
	setAttrToDots(dot,index){
		const _ = this;
		dot.setAttribute('data-click-action',`${_.componentName}:dot`);
		dot.setAttribute('data-index',index)
	}
	// Приводит контейнер к единому виду
	containerToDefault(cont){
		const _ = this;
		_.gSlider = _.el('DIV',{class: 'g-slider'});
		cont.prepend(_.gSlider);
		return cont;
	}

	// Применяет переданные настройки
	setDefaultSettings(){
		const _ = this;
		_.showCount = 1;
		_.animTime = 0.5;
		_.moveCount = 1;
		_.animation = 'scroll';
	}
	acceptSettings(){
		const _ = this;
		_.resolutions = {
			next: Infinity,
			current: null
		};
		let styles = _.setSettingsData();
		let slideStyleStr = _.setStyleStr(styles);
		_.setSettingsToSlides(slideStyleStr);
	}
	setSettingsData(){
		const _ = this;
		let styles = {};
		for (let resolution in _.settings){
			let resValue = _.settings[resolution];
			if (window.innerWidth >= parseInt(resolution)) {
				_.resolutions['current'] = parseInt(resolution);

				if (resValue['padding']) styles['padding'] = resValue['padding'];
				if (resValue['width']){
					styles['width'] = `${resValue['width']}px`;
					styles['flex'] = `0 0 ${resValue['width']}px`;
					_.showCount = _.slidesKeeper.length - 1;
				} else if (resValue['count']){
					styles['width'] = `${100 / resValue['count']}%`;
					styles['flex'] = `0 0 ${100 / resValue['count']}%`;
					_.showCount = parseInt(resValue['count'])
				}

				_.animTime = resValue['animationTime'] ? resValue['animationTime'] : _.animTime;
				_.moveCount = resValue['moveCount'] ? resValue['moveCount'] : _.moveCount;
				_.animation = resValue['animation'] ? resValue['animation'] : _.animation;
			} else {
				_.resolutions['next'] = parseInt(resolution);
				break;
			}
		}
		return styles;
	}
	setStyleStr(styles){
		let slideStyleStr = '';
		for (let style in styles){
			let subStr = style + ':' + styles[style] + ';';
			slideStyleStr += subStr;
		}
		if (!slideStyleStr) slideStyleStr = `width:100%`;
		return slideStyleStr;
	}
	setSettingsToSlides(slideStyleStr){
		const _ = this;
		for (let i = 0; i < _.slidesKeeper.length; i++){
			let slide = _.slidesKeeper[i];
			slide.setAttribute('style',slideStyleStr);
		}
	}

	sliderFilling(){
		const _ = this;
		_.gSlider.innerHTML = '';
		_.currentPosNext = 0;
		_.currentPosPrev = _.showCount - 1;
		for(let i = 0; i < _.showCount; i++){
			let slide = _.getSlide(i);
			_.gSlider.append(slide);
			_.gsap.set(slide,{x:slide.clientWidth * i});
		}
	}
	setGSliderHeight(){
		const _ = this;
		let height = 0;
		for (let i = 0; i < _.gSlider.children.length; i++){
			let slide = _.gSlider.children[i];
			if (slide.clientHeight > height){
				height = slide.clientHeight;
			}
		}
		_.gSlider.setAttribute('style',`height:${height}px;`)
	}

	dot(clickData){
		const _ = this;
		let btn = clickData['item'];
		let index = parseInt(btn.getAttribute('data-index'));
		let moveCount = index - _.currentPosNext;
		if (moveCount === 0) return;
		if (moveCount < 0){
			moveCount *= -1;
			_.moveToPrev(moveCount,moveCount)
		} else {
			_.moveToNext(moveCount,moveCount)
		}
	}

	prev(){
		const _ = this;
		_.moveToPrev(_.moveCount);
	}
	next(){
		const _ = this;
		_.moveToNext(_.moveCount);
	}
	moveToNext(count = this.moveCount, partTime = this.moveCount){
		const _ = this;
		if (_.swipeAccess){
			_.swipeAccess = false;

			let
					len = _.slidesKeeper.length,
					currentSlide = _.gSlider.querySelector(`[data-pos='${_.currentPosNext}']`),
					nextPos = _.currentPosNext + _.showCount;

			if (nextPos >= len) nextPos = nextPos - len;

			let nextSlide = _.getSlide(nextPos);
			_.gSlider.append(nextSlide);
			_.gsap.set(nextSlide,{x:(_.gSlider.children.length - 1) * nextSlide.clientWidth})

			_.currentPosNext++;
			_.currentPosPrev++;
			if (_.currentPosNext >= len) _.currentPosNext = 0;
			if (_.currentPosPrev >= len) _.currentPosPrev = 0;

			_.slideAnimation({currentSlide,count,direction: 'next',partTime})
		}
	}
	moveToPrev(count = this.moveCount, partTime = this.moveCount){
		const _ = this;
		if (_.swipeAccess){
			_.swipeAccess = false;

			let
					len = _.slidesKeeper.length,
					currentSlide = _.gSlider.querySelector(`[data-pos='${_.currentPosPrev}']`),
					nextPos = _.currentPosPrev - _.showCount;

			if (nextPos < 0) nextPos = nextPos + len;

			let nextSlide = _.getSlide(nextPos);
			_.gSlider.prepend(nextSlide);
			_.gsap.set(nextSlide,{x:-nextSlide.clientWidth})

			_.currentPosPrev--;
			_.currentPosNext--;
			if (_.currentPosPrev < 0) _.currentPosPrev = len - 1;
			if (_.currentPosNext < 0) _.currentPosNext = len - 1;

			_.slideAnimation({currentSlide,count,direction: 'prev',partTime})
		}
	}
	slideAnimation(animationData){
		const _ = this;
		if (_.dots) _.dotsActiveInactive();
		if (_.animation === 'opacity'){

		} else {
			_.gsap.to(_.gSlider.children,{
				x:(pos,slide)=>{
					return animationData['direction'] === 'next' ? (pos - 1) * slide.clientWidth : pos * slide.clientWidth
				},
				duration: _.animTime / animationData['partTime'],
				ease: 'none',
				onComplete:()=>{
					animationData['currentSlide'].remove();
					_.swipeAccess = true;
					let count = animationData['count'] - 1;
					if (count >= 1) {
						animationData['direction'] === 'next'
								? _.moveToNext(count,animationData['partTime']) : _.moveToPrev(count,animationData['partTime'])
					}
				}
			})
		}
	}
	dotsActiveInactive(){
		const _ = this;
		_.dots['prev'] = _.dots['active'];
		_.dots['prev'].classList.remove('active');
		_.dots['active'] = _.dots['list'][_.currentPosNext];
		_.dots['active'].classList.add('active');
	}

	reInit(){
		const _ = this;
		_.acceptSettings();
		_.sliderFilling();
		_.setGSliderHeight();
	}
	init(){
		const _ = this;
		_.swipeAccess = true;
		_.sliderInit();
		window.addEventListener('resize',function (){
			if (window.innerWidth >= _.resolutions['next'] || window.innerWidth < _.resolutions['current'])	{
				_.reInit();
			}
		})
	}
}