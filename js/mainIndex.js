document.addEventListener('DOMContentLoaded', async function () {
  if (window.location.search && window.location.search !== '?page=1') {
    const pageParams = new URLSearchParams(window.location.search)
    page = pageParams.get('page')
  }
  else {
    page = 1
  }

  async function getMeta() {
    const resolve = await fetch(`https://gorest.co.in/public-api/posts`)
    const result = await resolve.json()
    return result.meta.pagination.pages
  }

  const meta = await getMeta()
  state = await getLink(page)
  const pageTitle = document.querySelector('.header__title')
  const search = document.querySelector('.search')
  const postList = document.querySelector('.main__post')
  const btnRight = document.getElementById('btnRight')
  const btnLeft = document.getElementById('btnLeft')
  const btnNews = document.getElementById('btnNews')
  const btnRandom = document.getElementById('btnRandom')
  const searchInput = document.getElementById('search_input')

  btnRight.addEventListener('click', getNewPage)
  btnLeft.addEventListener('click', getNewPage)
  btnRandom.addEventListener('click', getNewPage)
  btnNews.addEventListener('click', getNewPage)
  searchInput.addEventListener('click', getNewPage)
  search.addEventListener('input', async function () {
    const state = await getLink(page)
    console.log(state)
    const value = this.value
    let newState = await state.data.filter(el => el.title.includes(value))
    render(newState)
  })

  async function render(arr) {
    postList.innerHTML = ''
    pageTitle.innerHTML = `Страница №${page}`
    arr.map(el => {
      const div = document.createElement('div')
      const span = document.createElement('span')
      const title = document.createElement('h5')
      const anchor = document.createElement('a')
      const countPages = document.getElementById('countPage')

      div.classList.add('post')
      span.classList.add('post__str')
      title.classList.add('post__title')
      anchor.classList.add('btn__accordeon')
      countPages.innerHTML = `Всего ${meta} страниц`
      anchor.innerHTML = '<i class = "fa fa-angle-double-right strlk fa-3x"></i>'
      title.textContent = el.title
      anchor.href = `./post.html?page=${page}&id=${el.id}`
      anchor.id = el.id
      span.append(title)
      div.append(span, anchor)
      postList.append(div)

      btnLeft.style.display = (+page === 1) ? 'none': 'block'
      btnRight.style.display = (+page === meta) ?  'none': 'block'
    })
  }
  async function getLink(page) {
    const resolve = await fetch(`https://gorest.co.in/public-api/posts?page=${page}`)
    let result = await resolve.json()
    return result
  }
  async function getNewPage() {
    switch (this.id) {
      case 'btnRandom':
        page = ~~(Math.random() * meta - 1) + 2
        break
      case 'btnRight':
        page++
        break
      case 'btnLeft':
        page--
        break
      case 'btnNews':
        page = meta
        break
      case 'search_input':
        const inputValue = document.querySelector('.pageInput__input').value
        return inputValue ? page = inputValue : page
    }
    this.href = Number(page) === 1 ? './index.html' :  `./index.html?page=${page}`
  }

  render(state.data)
})
