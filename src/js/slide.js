export class Slide {
    constructor(el) {
        this.DOM = {el};
        this.DOM.imgWrap = this.DOM.el.querySelector('.slide__img-wrap');
        this.DOM.img = this.DOM.imgWrap.querySelector('.slide__img');
        this.DOM.headline = this.DOM.el.querySelector('.slides__caption-headline');
        this.DOM.text = this.DOM.headline.querySelectorAll('.text-row > span');
        this.DOM.link = this.DOM.el.querySelector('.slides__caption-link');
    }
}