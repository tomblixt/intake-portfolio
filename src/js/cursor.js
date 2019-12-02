import gsap, { Power2 } from 'gsap'

export default class Cursor {
  constructor(links) {
    this.createCursor()
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    this.links = []
    this.isSet = false

    this.listeners()
    this.animateCursor()
  }
  listeners() {
    document.addEventListener('mousemove', e => {
      this.isSet ? null : this.isSet = true
      this.mouse.x = e.clientX
      this.mouse.y = e.clientY
    })
    document.addEventListener('mousedown', () => {
      gsap.to(this.cursor, .3, { scale: .8 })
    })
    document.addEventListener('mouseup', () => {
      gsap.to(this.cursor, .3, { scale: 1 })
    })
  }
  linkListeners() {
    this.links.forEach(link => {
      if (link.classList.contains('cursor-none')) {
        link.addEventListener('mouseenter', () => {
          gsap.to(this.cursor, .4, { scale: 0, alpha: 0 })
        })
        link.addEventListener('mouseleave', this.leaveLink.bind(this))
      } else {
        link.addEventListener('mouseenter', () => {
          gsap.to(this.cursor, .4, { scale: 2, alpha: .2 })
        })
        link.addEventListener('mouseleave', this.leaveLink.bind(this))
      }
    })
  }
  leaveLink() {
    gsap.to(this.cursor, .4, { scale: 1, alpha: 1 })
  }
  createCursor() {
    this.cursor = document.createElement('div')
    this.cursor.classList.add('cursor')
    document.body.appendChild(this.cursor)
  }
  setLinks(container) {
    this.links.forEach(link => {
      link.removeEventListener('mouseenter', () => console.log('working'))
      link.removeEventListener('mouseleave', () => console.log('working'))
    })
    this.links = container.querySelectorAll('a')
    this.linkListeners()
  }
  animateCursor() {
    gsap.to(this.cursor, .2, {
      css: {
        left: this.mouse.x,
        top: this.mouse.y,
        opacity: this.isSet ? 1 : 0
      },
      ease: Power2.easeOut
    })

    requestAnimationFrame(this.animateCursor.bind(this))
  }
}