import { preloadImages } from '../utils';
import { Navigation } from '../navigation';
import { Slideshow } from './slideshow';

// Preload all images
preloadImages('.slide__img').then(() => {
    // remove loader (loading class) 
    document.body.classList.remove('loading');

    const slideshow = new Slideshow(document.querySelector('.slideshow'));    
    const navigation = new Navigation(document.querySelector('.slides-nav'));
    // navigation events
    navigation.DOM.ctrls.next.addEventListener('click', () => slideshow.next());
    navigation.DOM.ctrls.prev.addEventListener('click', () => slideshow.prev());
    // set the initial navigation current slide value
    navigation.updateCurrent(slideshow.current);
    // set the navigation total number of slides
    navigation.DOM.total.innerHTML = slideshow.current < 10 ? `0${slideshow.slidesTotal}` : slideshow.slidesTotal;
    // when a new slide is shown, update the navigation current slide value
    slideshow.on('updateCurrent', position => navigation.updateCurrent(position));
});