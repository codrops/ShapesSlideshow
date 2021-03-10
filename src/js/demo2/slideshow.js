import { Slide } from '../slide';
import { EventEmitter } from 'events';
import { gsap } from 'gsap';

export class Slideshow extends EventEmitter {
    constructor(el) {
        super();
        this.DOM = {el};

        this.DOM.slides = [...this.DOM.el.querySelectorAll('.slide')];
        this.slides = [];
        this.DOM.slides.forEach(slide => this.slides.push(new Slide(slide)));
        this.slidesTotal = this.slides.length;

        this.current = 0;

        this.config = {
            clipPath: {
                initial: 'inset(10% 30.1% 0% 30% round 25vw 25vw 0vw 0vw)', //two equal values cause problems because browser uses shorthand
                final: 'inset(15% 40.1% 15% 40% round 25vw 25vw 25.01vw 25.01vw)',
                hover: 'inset(20% 40% 20.01% 40.01% round 25vw 25vw 25.01vw 25.01vw)'
            }
        };

        this.init();
    }
    init() {
        this.DOM.slides[this.current].classList.add('slide--current');
        gsap.set(this.slides[this.current].DOM.imgWrap, {clipPath: this.config.clipPath.initial});
        
        for (const slide of this.slides) {
            slide.DOM.link.addEventListener('mouseenter', () => {
                gsap.killTweensOf(slide.DOM.imgWrap);
                gsap.to(slide.DOM.imgWrap, {
                    duration: 0.7,
                    ease: 'expo',
                    clipPath: this.config.clipPath.hover
                });
            });
            slide.DOM.link.addEventListener('mouseleave', () => {
                gsap.killTweensOf(slide.DOM.imgWrap);
                gsap.to(slide.DOM.imgWrap, {
                    duration: 0.7,
                    ease: 'expo',
                    clipPath: this.config.clipPath.initial
                });
            });
        }
    }
    next() {
        this.navigate('next');
    }
    prev() {
        this.navigate('prev');
    }
    navigate(direction) {
        if ( this.isAnimating ) {
            return false;
        }
        this.isAnimating = true;

        const currentSlide = this.slides[this.current];
        // update current
        if ( direction === 'next' ) {
            this.current = this.current < this.slidesTotal-1 ? this.current+1 : 0;
        }
        else {
            this.current = this.current > 0 ? this.current-1 : this.slidesTotal-1;
        }
        const upcomingSlide = this.slides[this.current];

        gsap
        .timeline({
            onStart: () => upcomingSlide.DOM.el.classList.add('slide--current'),
            onComplete: () => {
                this.isAnimating = false;
                currentSlide.DOM.el.classList.remove('slide--current');
            }
        })
        .addLabel('start', 0)
        .set(upcomingSlide.DOM.imgWrap, {
            //x: direction === 'next' ? '100%' : '-100%',
            y: direction === 'next' ? '-100%' : '100%',
            clipPath: this.config.clipPath.final
        }, 'start')
        .set(upcomingSlide.DOM.el, {opacity: 1}, 'start')
        .set(upcomingSlide.DOM.img, {
            //x: direction === 'next' ? '-100%' : '100%',
            y: direction === 'next' ? '100%' : '-100%'
        }, 'start')
        .set(upcomingSlide.DOM.text, {y: direction === 'next' ? '100%' : '-100%'}, 'start')
        .set(upcomingSlide.DOM.link, {opacity: 0}, 'start')
        // animate the shape from initial to its final state (clip-path)
        .to(currentSlide.DOM.imgWrap, {
            duration: 1,
            ease: 'expo',
            clipPath: this.config.clipPath.final,
            rotation: 0.001
        }, 'start')
        // animate the current slide texts out
        .to(currentSlide.DOM.text, {
            duration: 1,
            ease: 'power3',
            y: direction === 'next' ? '-100%' : '100%'
        }, 'start')
        // animate the current slide link out
        .to(currentSlide.DOM.link, {
            duration: 0.5,
            ease: 'power3',
            opacity: 0
        }, 'start')
        // move the current slide out (img and imgWrap)
        .to(currentSlide.DOM.imgWrap, {
            duration: 0.7,
            ease: 'expo.inOut',
            //x: direction === 'next' ? '-100%' : '100%',
            y: direction === 'next' ? '100%' : '-100%',
            rotation: 0.001
        }, 'start+=0.4')
        .to(currentSlide.DOM.img, {
            duration: 0.7,
            ease: 'expo.inOut',
            //x: direction === 'next' ? '100%' : '-100%',
            y: direction === 'next' ? '-100%' : '100%'
        }, 'start+=0.4')
        // and the upcoming slide in
        .to(upcomingSlide.DOM.imgWrap, {
            duration: 0.7,
            ease: 'expo',
            //x: '0%',
            y: '0%',
            rotation: 0.001
        }, 'start+=0.7')
        .to(upcomingSlide.DOM.img, {
            duration: 0.7,
            ease: 'expo',
            //x: '0%',
            y: '0%'
        }, 'start+=0.7')
        // animate the upcoming slide shape to initial
        .to(upcomingSlide.DOM.imgWrap, {
            duration: 1,
            ease: 'expo.inOut',
            clipPath: this.config.clipPath.initial
        }, 'start+=0.9')
        // animate the upcoming slide texts in
        .to(upcomingSlide.DOM.text, {
            duration: 1,
            ease: 'power3.inOut',
            rotation: 0.001,
            y: '0%',
            stagger: direction === 'next' ? 0.1 : -0.1
        }, 'start+=0.8')
        // animate the upcoming slide link in
        .to(upcomingSlide.DOM.link, {
            duration: 0.2,
            ease: 'power3.in',
            opacity: 1
        }, 'start+=1.3')
        

        this.emit('updateCurrent', this.current);
    }
}