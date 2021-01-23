import { MainEventBus } from "/workspace/front/libs/MainEventBus.lib.js";

export class Slider{
	constructor() {
		const _ = this;



		_.init();
	}
	sliderInit(sliderData = {}){
		const _ = this;
		if (!sliderData.container) return;
		let sliderCont = sliderData['container'];
		sliderCont.classList.add('g-slider');
		let slides = sliderData['slides'] ?	_.slidesToDefault(sliderData) : '';
		let arrows = sliderData['arrows'] ?	_.arrowsToDefault(sliderData['arrows']) : '';
		let dots = sliderData['dots'] ? _.dotsToDefault(sliderData['dots']) : '';

		sliderCont.innerHTML = '';
		sliderCont.append(slides);
	}

	slidesToDefault(sliderData = {}){
		const _ = this;
		let
				slidesCont = document.createDocumentFragment(),
				slidesData = sliderData['slides'];
		slidesData['type'] = slidesData['type'] ? slidesData['type'].toLowerCase() : null;
		if (slidesData['type'] === 'html'){
			slidesCont = _.slidesAsHTML(sliderData,slidesCont)
		} else {

		}
		return slidesCont;
	}
	slidesAsHTML(sliderData,cont){
		const _ = this;
		let
				slides = sliderData['slides']['list'],
				length = slides.length;
		for (let i = 0; i < length; i++){
			let
					slide = slides[0],
					gSlide = document.createElement('DIV');
			gSlide.append(slide);
			gSlide.className = 'g-slide';
			gSlide = _.slidesAddWidth(gSlide,sliderData['responsive']);
			cont.append(gSlide);
		}
		return cont;
	}
	slidesAddWidth(slide,responsiveData){
		console.log(responsiveData)
		for (let resolution in responsiveData){
			if (window.innerWidth >= resolution){
				let result = 100 / responsiveData[resolution]['count'];
				slide.setAttribute('style',`flex:0 0 ${result}%;width:${result}%;`)
			}
		}
		return slide;
	}




	arrowsToDefault(arrowsData = {}){
		const _ = this;
		let arrowPrev = arrowsData['prev'];
		let arrowNext = arrowsData['next'];
	}
	dotsToDefault(dotsData = {}){
		const _ = this;

	}





	init(){
		const _ = this;
		/*let link = document.createElement('LINK');
		link.setAttribute('rel',"stylesheet");
		link.setAttribute('property',"stylesheet");
		link.setAttribute('href','"slider.css"');
		document.querySelector('head').append(link)*/
	}
}