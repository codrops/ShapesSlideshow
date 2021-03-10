export class Navigation {
    constructor(el) {
        this.DOM = {el};
        this.DOM.ctrls = {
            next: this.DOM.el.querySelector('.slides-nav__button--next'),
            prev: this.DOM.el.querySelector('.slides-nav__button--prev')
        };
        this.DOM.current = this.DOM.el.querySelector('.slides-nav__index-current');
        this.DOM.total = this.DOM.el.querySelector('.slides-nav__index-total');
    }
    // updates the current value
    updateCurrent(position) {
        this.DOM.current.innerHTML = position < 10 ? `0${position+1}` : position;
    }
}