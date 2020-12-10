"use strict";

import {MainEventBus} from "./MainEventBus.lib.js";

export class Slider{
	static WSliders = [];
	/* Передаются только контейнеры */
	constructor(settings){
		if(!settings) settings = {};
		this.sliders = [this];
		this.container = document.querySelector(settings.container) ?? null;
		this.position = parseInt(settings.startIndex ?? 0);
		this.arrows = settings.arrows ?? true;
		this.showDots = settings.showDots ?? true;
		this.next = settings.next ? document.querySelectorAll(settings.next) : null ;
		this.prev = settings.prev ? document.querySelectorAll(settings.prev) : null;
		this.nav = settings.nav ? document.querySelectorAll(settings.nav) : null;
		this.autoplay = settings.autoplay;
		this.playReverse = settings.playReverse;
		this.onHoverPause = settings.onHoverPause;
		this.wrapImg = settings.wrapImg ?? true;

		/* Системные переменные */
		this.slides = Array.from(this.container.children);
		this.slidesQuantity = this.slides.length;
		this.images = this.container.querySelectorAll('img');
		this.dots = null;
		this.autoPlayer = null;

		this.checks();
		this.init();
	}

	checks(){
		if(!this.container) throw new Error('В слайдер не передан контейнер');
	}

	init(){
		this.container.className += ' w-slider';
		this.setSlidesSystemClass();
		if(this.arrows) {this.createArrows(); this.buttonsInit();}
		if(this.showDots) this.createDots();
		if(this.next) this.setCustomNext();
		if(this.prev) this.setCustomPrev();
		if(this.nav) this.customNav();
		if(this.autoplay) this.startAutoplay();
		if(this.onHoverPause && this.autoplay) this.pauseOnHover();
		if(this.wrapImg) this.imgWrap();
		this.touchInit();
		this.setActiveSlide(this.position);
		Slider.WSliders = [...Slider.WSliders, this];
	}

	linkSilders(sliderClasses){
		sliderClasses.forEach(slider => {
			this.sliders.push(slider);
			slider.sliders = this.sliders;
		})
	}

	setActiveSlide(position){
		this.sliders.forEach(slider => {
			slider.position = position ?? slider.position;
			slider.position = (slider.position < 0) ? slider.slidesQuantity - 1 : slider.position % slider.slidesQuantity;
			slider.uncheckActive();
			slider.slides[slider.position].classList.add('active');
			if(slider.dots) slider.dots[slider.position].classList.add('active');
		})
	}

	setSlidesSystemClass(){
		this.slides.forEach(function (slide) {
			slide.className += ' w-slider-slide';
		});
	}

	createArrows(){
		this.nextBtn = document.createElement('i');
		this.prevBtn = document.createElement('i');
		this.nextBtn.className = 'w-slider-arrow next';
		this.prevBtn.className = 'w-slider-arrow prev';
		this.nextBtn.innerText = '►';
		this.prevBtn.innerText = '◄';
		this.container.append(...[this.prevBtn, this.nextBtn]);
	}

	setCustomNext(){
		this.next.forEach((button) => {
			button.addEventListener('click', () => {this.setActiveSlide(++this.position)});
		})
	}

	setCustomPrev(){
		this.prev.forEach((button) => {
			button.addEventListener('click', () => {this.setActiveSlide(--this.position)});
		})
	}


	buttonsInit(){
		this.nextBtn.addEventListener('click', () => {this.setActiveSlide(++this.position)});
		this.prevBtn.addEventListener('click', () => {this.setActiveSlide(--this.position)});
	}

	createDots(){
		let dotsContainer = document.createElement('div');
		dotsContainer.className += ' w-slider-dots';
		for (let i = 0; i < this.slidesQuantity; i++){
			let dot = document.createElement('i');
			dot.className += ' w-slider-dot';
			dot.dataset.position = i;
			dot.addEventListener('click', () => {this.setActiveSlide(i)});
			dotsContainer.append(dot);
		}
		dotsContainer.style.top = this.slides[0].querySelector('img').clientHeight + 1 + 'px';
		this.slides[this.slidesQuantity-1].after(dotsContainer);
		this.dots = Array.from(dotsContainer.querySelectorAll('.w-slider-dot'));
	}

	customNav(){
		this.nav.forEach(nav => {
			let dots = Array.from(nav.children);
			for (let i = 0; i < this.slidesQuantity; i++){
				dots[i].dataset.position = i;
				dots[i].addEventListener('click', () => {this.setActiveSlide(i)});
			}
			this.dots = this.dots ? [...this.dots, ...dots] : dots;
		})
	}

	imgWrap(){
		this.images.forEach(function(img){
			let parent = img.parentElement;
			let imgWrapper = document.createElement('div');
			imgWrapper.append(img);
			imgWrapper.className = 'w-slider-img-wrapper';
			parent.prepend(imgWrapper);
		});
	}

	// Unselect class active by elements
	uncheckActive(){
		this.slides.forEach(function (slide) {
			if(slide.classList.contains('active')) slide.classList.remove('active');
		});
		this.dots.forEach(function (dot) {
			if(dot.classList.contains('active')) dot.classList.remove('active');
		});
	}

	// Events
	startAutoplay(){
		let position = this.playReverse ? -1 : 1;
		this.autoPlayer = setInterval(() => {
			this.setActiveSlide(this.position += position)
		}, this.autoplay);
	}

	pauseAutoplay(){
		clearInterval(this.autoPlayer);
	}

	pauseOnHover(){
		this.container.addEventListener('mouseover', () => {this.pauseAutoplay()});
		this.container.addEventListener('mouseout', () => {this.startAutoplay()});
	}

	touchInit(){
		this.images.forEach((item) => {
			const _ = this;
			item.addEventListener('touchstart', function(e){_.touchStart(e)}, {passive: true});
			item.addEventListener('touchend', function(e){_.touchEnd(e)}, {passive: true});
			item.addEventListener('mousedown', function(e){_.mouseStart(e)});
			item.addEventListener('mouseup', function(e){_.mouseEnd(e)});
		})
	}

	touchStart(e){
		this.swipeStartPos = e.changedTouches[0].clientX;
	}

	touchEnd(e){
		if(this.swipeStartPos < e.changedTouches[0].clientX) this.setActiveSlide(--this.position);
		if(this.swipeStartPos > e.changedTouches[0].clientX) this.setActiveSlide(++this.position);
	}

	mouseStart(e){
		e.preventDefault();
		this.mouseStartPos = e.x;
	}

	mouseEnd(e){
		e.preventDefault();
		if(this.mouseStartPos < e.x) this.setActiveSlide(--this.position);
		if(this.mouseStartPos > e.x) this.setActiveSlide(++this.position);
	}
}