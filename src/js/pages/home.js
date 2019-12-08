import gsap, { Power2 } from 'gsap'

export default class Home {
  constructor(container) {
    // pages
    this.pages = container.querySelector('.pages')
    this.links = this.pages.querySelectorAll('.page-link')
    this.pagesCursor = container.querySelector('.pages-cursor')
    // intro
    this.intro = container.querySelector('.intro')
    this.introTitle = this.intro.querySelector('.intro__title')
    this.revealWrapper = this.introTitle.querySelector('.reveal-wrapper')
    this.revealText = this.revealWrapper.querySelector('h1')
    // mouse
    this.screenCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    this.isHovering = false

    this.listeners()
    this.animateCursor()
  }
  animateIn() {
    return new Promise(resolve => {
      const delay = .6
      const timeline = gsap.timeline({
        defaults: {
          duration: .8
        },
        onComplete() {
          resolve()
        }
      })
      timeline
        .set(this.intro, { alpha: 0 })
        .set(this.links, { y: -220, alpha: 0, width: 80, pointerEvents: 'none' })
        .set(this.revealWrapper, { clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0% 100%)' })
        .set(this.revealText, { y: '100%' })
        .set(this.links, {pointerEvents: 'all'}, delay + 1.4)
        .to(this.intro, { alpha: 1 }, delay)
        .to(this.revealWrapper, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)', ease: Power2.easeOut }, delay + .3)
        .to(this.revealText, { y: 0, ease: Power2.easeOut }, delay + .2)
        .to(this.links, { y: 0, alpha: 1, width: 160, ease: Power2.easeOut, stagger: .3,  }, delay + .8)
    })
  }
  listeners() {
    this.links.forEach((link, index) => {
      link.addEventListener('mouseenter', this.enterLink.bind(this, index, link))
      link.addEventListener('mouseleave', this.leaveLink.bind(this))
    })
    document.addEventListener('mousemove', e => {
      this.mouse = { x: e.clientX, y: e.clientY }
    })
    window.addEventListener('resize', () => {
      this.screenCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    })
  }
  enterLink(i, item) {
    this.isHovering = true
    const title = item.getAttribute('data-link')
    this.pagesCursor.querySelector('h3').innerHTML = title
    this.pagesCursor.classList.add('active')
    
    this.links.forEach((link, index) => {
      if (i === 0 && index !== 0) {
        gsap.to(link, .4, { alpha: 1 - index / 10 })
      } else if (i === 1 && index !== 1) {
        gsap.to(link, .4, { alpha: index < 3 ? .9 : .8 })
      } else if (i === 2 && index !== 2) {
        gsap.to(link, .4, { alpha: index > 0 ? .9 : .8 })
      } else if (i === 3 && index !== 3) {
        gsap.to(link, .4, { alpha: .7 + index / 10 })
      }
    })
  }
  leaveLink() {
    this.isHovering = false
    this.pagesCursor.classList.remove('active')

    this.links.forEach(singleLink => {
      gsap.to(singleLink, .4, { alpha: 1 })
    })
  }
  animateCursor() {
    if (this.isHovering) {
      gsap.to(this.pagesCursor, .2, {
        css: {
          left: this.mouse.x,
          top: this.mouse.y,
        },
        ease: Power2.easeOut
      })
    }

    const dx = this.mouse.x - this.screenCenter.x
    const dy = this.mouse.y - this.screenCenter.y

    const degree = (dx / this.screenCenter.x)
    
    gsap.to(this.introTitle, 1, {
      rotateY: degree,
      ease: Power2.easeOut
    })

    gsap.to([this.pages, this.intro], 2, {
      x: dx / this.screenCenter.x * -24,
      y: dy / this.screenCenter.y * -16,
      ease: Power2.easeOut
    })

    requestAnimationFrame(this.animateCursor.bind(this))
  }
}