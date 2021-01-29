document.addEventListener('DOMContentLoaded', () => {
  const pageTitle = document.querySelector('.header__title')
  const myPost = document.querySelector('.my__post')

  function getParams() {
    const pageParams = new URLSearchParams(window.location.search)
    let page = pageParams.get('page')
    let id = pageParams.get('id')
    return {
      id,
      page,
    }
  }
  const data = getParams()

  async function getPost(id) {
    const resolve = await fetch(`https://gorest.co.in/public-api/posts/${id}`)
    const result = await resolve.json()
    return result

  }
  async function getComments(id) {
    const resolve = await fetch(`https://gorest.co.in/public-api/comments?post_id=${id}`)
    const result = await resolve.json()
    return result

  }
  async function renderPost() {
    const postList = document.querySelector('.main')
    myPost.innerHTML = ''
    postList.innerHTML = ''

    //Пост
    const numberPost = document.querySelector('.numberPost')
    const post = await getPost(data.id)
    const date = new Date(post.data.updated_at)
    document.title = `Пост №${data.id}`
    const mainTitle = document.createElement('h2')
    const mainParagraph = document.createElement('p')
    const time = document.createElement('div')

    time.classList.add('times')

    if (post.data.body) {
      time.innerHTML = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
      mainTitle.innerHTML = post.data.title
      mainParagraph.innerHTML = post.data.body
      numberPost.innerHTML = `${data.id}`
      pageTitle.innerHTML = `Страница №${data.page}`

      postList.append(myPost)
      myPost.append(mainTitle, mainParagraph, time)
    }
    else {
      mainParagraph.innerHTML = 'Эта статья находится в разработке'
      mainTitle.innerHTML = 'Ошибка'
      postList.append(myPost)
      myPost.append(mainTitle, mainParagraph)
    }
    //комменты

    const commentsData = await getComments(data.id)
    const comments = document.createElement('div')
    const name = document.createElement('h4')
    const comment = document.createElement('div')

    comments.classList.add('comments')
    comment.classList.add('comment')

    if (commentsData?.data[0]?.body || commentsData?.data[0]?.name) {
      name.innerHTML = commentsData.data[0].name
      comment.innerHTML = commentsData.data[0].body
      comment.prepend(name)
    }
    else {
      comment.innerHTML = `Здесь могли быть ваши комментарии`
    }
    postList.append(comments)
    comments.append(comment)
  }

  renderPost()

})
