export default container => {
  const loopTitels = container.querySelectorAll('.loop-title span')
  
  loopTitels.forEach(title => {
    const value = title.innerHTML.split(' ').join('&nbsp;') + '&nbsp;'
    title.innerHTML = value.repeat(6)
  })
}