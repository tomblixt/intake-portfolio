import gsap, { Power2 } from 'gsap'

// TODO: change x / y in screen center and mouse
export default class Home {
  constructor() {
    this.links = document.querySelectorAll('.page-link')
    this.pagesCursor = document.querySelector('.pages-cursor')
    this.intro = document.querySelector('.intro')
    this.introTitle = document.querySelector('.intro__title')
    this.screenCenter = { x: window.innerHeight / 2, y: window.innerWidth / 2 }
    this.mouse = { x: window.innerHeight / 2, y: window.innerWidth / 2 }
    this.isHovering = false

    this.listeners()
    this.animateCursor()
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
      this.screenCenter = { x: window.innerHeight / 2, y: window.innerWidth / 2 }
    })
  }
  enterLink(i, item) {
    this.isHovering = true
    const title = item.getAttribute('data-link')
    this.pagesCursor.querySelector('h3').innerHTML = title
    this.pagesCursor.classList.add('active')
    
    this.links.forEach((link, index) => {
      if (i === 0 && index !== 0) {
        gsap.to(link, 0.4, { alpha: 1 - index / 10 })
      } else if (i === 1 && index !== 1) {
        gsap.to(link, 0.4, { alpha: index < 3 ? .9 : .8 })
      } else if (i === 2 && index !== 2) {
        gsap.to(link, 0.4, { alpha: index > 0 ? .9 : .8 })
      } else if (i == 3 && index !== 3) {
        gsap.to(link, 0.4, { alpha: 0.7 + index / 10 })
      }
    })
  }
  leaveLink() {
    this.isHovering = false
    this.pagesCursor.classList.remove('active')

    this.links.forEach(singleLink => {
      gsap.to(singleLink, 0.4, { alpha: 1 })
    })
  }
  animateCursor() {
    if (this.isHovering) {
      gsap.to(this.pagesCursor, .2, {
        css: {
          left: this.mouse.x,
          top: this.mouse.y
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

    gsap.to([...this.links, this.intro], 1, {
      x: dx / this.screenCenter.x * -24,
      y: dy / this.screenCenter.y * -16,
      ease: Power2.easeOut
    })

    requestAnimationFrame(this.animateCursor.bind(this))
  }
}