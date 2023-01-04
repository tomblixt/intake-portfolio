export default (item, name) => {
  let tag
  if (item.type === 'img') {
    tag = document.createElement('img')
    tag.src = `/${item.type}/${name}/${item.file}`
  } else if (item.type === 'vid') {
    tag = document.createElement('video')
    tag.src = `/${item.type}/${name}/${item.file}`
    tag.autoplay = true
    tag.controls = false
    tag.muted = true
    tag.loop = true
  } else {
    tag = document.createElement('div')
  }
  return tag
}
