import { Slide } from '../slide';
import { EventEmitter } from 'events';
import { gsap } from 'gsap';

export class Slideshow extends EventEmitter {
    constructor(el) {
        super();
        // the main wrapper <div class="slideshow">
        this.DOM = {el};
        // the slides
        this.DOM.slides = [...this.DOM.el.querySelectorAll('.slide')];
        // array of Slide obj instances
        this.slides = [];
        this.DOM.slides.forEach(slide => this.slides.push(new Slide(slide)));
        // total number of Slides
        this.slidesTotal = this.slides.length;
        // current position
        this.current = 0;
        // some settings, like the clip paths
        this.config = {
            clipPath: {
                initial: 'circle(55% at 70% 50%)',
                final: 'circle(15% at 70% 50%)',
                hover: 'circle(20% at 30% 50%)'
            }
        };
        this.init();
    }
    init() {
        // start with the first slide as the current slide
        this.DOM.slides[this.current].classList.add('slide--current');
        // set the initial clip path
        gsap.set(this.slides[this.current].DOM.imgWrap, {clipPath: this.config.clipPath.initial});
        // when hovering over the "explore" link on each slide, we animate the clip path from this.config.clipPath.initial to this.config.clipPath.hover
        for (const slide of this.slides) {
            slide.DOM.link.addEventListener('mouseenter', () => {
                gsap.killTweensOf(slide.DOM.imgWrap);
                gsap.to(slide.DOM.imgWrap, {
                    duration: 1,
                    ease: 'expo',
                    clipPath: this.config.clipPath.hover
                });
            });
            slide.DOM.link.addEventListener('mouseleave', () => {
                gsap.killTweensOf(slide.DOM.imgWrap);
                gsap.to(slide.DOM.imgWrap, {
                    duration: 1,
                    ease: 'expo',
                    clipPath: this.config.clipPath.initial
                });
            });
        }
    }
    // navigate to the next slide
    next() {
        this.navigate('next');
    }
    // navigate to the previous slide
    prev() {
        this.navigate('prev');
    }
    navigate(direction) {
        // if animating do nothing
        if ( this.isAnimating ) {
            return false;
        }
        this.isAnimating = true;
        // get the current slide
        const currentSlide = this.slides[this.current];
        // update current
        if ( direction === 'next' ) {
            this.current = this.current < this.slidesTotal-1 ? this.current+1 : 0;
        }
        else {
            this.current = this.current > 0 ? this.current-1 : this.slidesTotal-1;
        }
        // now get the upcoming slide
        const upcomingSlide = this.slides[this.current];

        // animate things...
        gsap
        .timeline({
            // add class current to the upcoming slide (pointer events related)
            onStart: () => upcomingSlide.DOM.el.classList.add('slide--current'),
            // and remove that class from the currentSlide when the animation ends
            onComplete: () => {
                this.isAnimating = false;
                currentSlide.DOM.el.classList.remove('slide--current');
            }
        })
        .addLabel('start', 0)
        // set the initial styles for the upcoming slide imgWrap: clip path and translateY position 
        .set(upcomingSlide.DOM.imgWrap, {
            y: direction === 'next' ? '100%' : '-100%',
            clipPath: this.config.clipPath.final
        }, 'start')
        // also set the opacity of the upcoming slide to 1
        .set(upcomingSlide.DOM.el, {opacity: 1}, 'start')
        // set the initial styles for the upcoming slide img: translateY position
        // same for the texts and link elements
        .set(upcomingSlide.DOM.img, {y: direction === 'next' ? '-50%' : '50%'}, 'start')
        .set(upcomingSlide.DOM.text, {y: direction === 'next' ? '100%' : '-100%'}, 'start')
        .set(upcomingSlide.DOM.link, {opacity: 0}, 'start')
        // animate the clip path from this.config.clipPath.initial to this.config.clipPath.final
        .to(currentSlide.DOM.imgWrap, {
            duration: 1,
            ease: 'power3',
            clipPath: this.config.clipPath.final,
            rotation: 0.001 // bugfix
        }, 'start')
        // animate the current slide texts out
        .to(currentSlide.DOM.text, {
            duration: 1,
            ease: 'power3',
            y: direction === 'next' ? '-100%' : '100%',
        }, 'start')
        // animate the current slide link out
        .to(currentSlide.DOM.link, {
            duration: 0.5,
            ease: 'power3',
            opacity: 0
        }, 'start')
        // move the current slide away 
        .to(currentSlide.DOM.imgWrap, {
            duration: 1,
            ease: 'power2.inOut',
            y: direction === 'next' ? '-100%' : '100%',
            rotation: 0.001
        }, 'start+=0.6')
        .to(currentSlide.DOM.img, {
            duration: 1,
            ease: 'power2.inOut',
            y: direction === 'next' ? '50%' : '-50%'
        }, 'start+=0.6')
        // and the upcoming slide in
        .to(upcomingSlide.DOM.imgWrap, {
            duration: 1,
            ease: 'power2.inOut',
            y: '0%',
            rotation: 0.001
        }, 'start+=0.6')
        .to(upcomingSlide.DOM.img, {
            duration: 1,
            ease: 'power2.inOut',
            y: '0%'
        }, 'start+=0.6')
        // animate the upcoming slide clip path to the initial shape
        .to(upcomingSlide.DOM.imgWrap, {
            duration: 1.5,
            ease: 'expo.inOut',
            clipPath: this.config.clipPath.initial
        }, 'start+=1.2')
        // animate the upcoming slide texts in
        .to(upcomingSlide.DOM.text, {
            duration: 1.5,
            ease: 'expo.inOut',
            y: '0%',
            rotation: 0.001,
            stagger: direction === 'next' ? 0.1 : -0.1
        }, 'start+=1.1')
        // animate the upcoming slide link in
        .to(upcomingSlide.DOM.link, {
            duration: 1,
            ease: 'expo.in',
            opacity: 1
        }, 'start+=1.4')
        
        // update the slideshow current value
        this.emit('updateCurrent', this.current);
    }
}