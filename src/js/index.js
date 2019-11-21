import '../sass/style.scss'

import barba from '@barba/core'

import Cursor from './cursor'
import Home from './home'

const isDebug = process.env.NODE_ENV === 'development'

const initLoops = () => {
  const loopTitels = document.querySelectorAll('.loop-title span')
  
  loopTitels.forEach(title => {
    const value = title.innerHTML.split(' ').join('&nbsp;') + '&nbsp;'
    title.innerHTML = value.repeat(6)
  })
}

let cursor = new Cursor()

// TODO: stagger animation in home

barba.init({
  debug: isDebug,
  transitions: [
    {
      name: 'toPage',
      beforeLeave() {
        cursor.leaveLink()
      }
    }
  ],
  views: [
    {
      namespace: 'home',
      beforeEnter({ next }) {
        new Home()
        initLoops()
        cursor.setLinks()
      }
    }
  ]
})

