document.addEventListener("DOMContentLoaded", ready)

function ready() {
    getDate()
    renderComments()
}

function getDate() {
    const months = ['Января','Февраля','Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октября','Ноября','Декабря']
    const now = new Date()
    const thisMonth = months[now.getMonth()]
    const date = `${now.getDate()} ${thisMonth.toLowerCase()} ${now.getFullYear()}`
    return date
}

let comments = [
    {name: 'Самуил', date: '13 октября 2011', commentText: 'Привет, Верунь! ниче себе ты крутая. фотка класс!!!!'},
    {name: 'Лилия Семёновна', date: '14 октября 2011', commentText: 'Вероника, здравствуйте! Есть такой вопрос: Особый вид куниц жизненно стабилизирует кинетический момент, это и есть всемирно известный центр огранки алмазов и торговли бриллиантами?'},
    {name: 'Лилия Семёновна', date: '14 октября 2011', commentText: 'Вероника, здравствуйте! Есть такой вопрос: Особый вид куниц жизненно стабилизирует кинетический момент?'},
]

const list = document.querySelector('[data-comment]')
const form = document.querySelector('[data-form]')
const commentObj = JSON.parse(localStorage.getItem('comments'))

if(localStorage.getItem('comments') !== null){
    comments = commentObj
}
console.log(comments)
function renderComments() {
    const itemsHTML = comments.map((i)=>{
        return `
        <li>
            <strong class="name">${i.name}</strong>
            <span class="date">${i.date}</span>
            <div class="comment-text">
                <p>${i.commentText}</p>
            </div>
        </li>
    `
    }).join('')
    
    list.insertAdjacentHTML('afterbegin', itemsHTML)
}

form.addEventListener('submit', (e)=> sendHandler(e))
form.addEventListener('keydown', function (e) {
    if (e.target.classList.contains('form-control-messagebox')){
        if(e.ctrlKey && e.keyCode == 13) {
            sendHandler(e)
        }

    }
})
function sendHandler(e) {
    e.preventDefault()

    const textCommit = document.querySelector('.form-control-messagebox')
    const nameUser = document.getElementById('profile__name').textContent

    if (textCommit.value !== ''){
        formHandler(nameUser, textCommit)
    } else{
        textCommit.classList.add('error')
    }
}

function formHandler(nameUser, textCommit) {
    textCommit.addEventListener('input', (e)=> e.target.classList.remove('error'))

    const personCommit = {
        name: nameUser,
        date: getDate(),
        commentText: textCommit.value
    }

    comments.push(personCommit)
    localStorage.setItem('comments', JSON.stringify(comments))
    list.innerHTML = ''
    textCommit.value = ''
    const commentObj = JSON.parse(localStorage.getItem('comments'));
    renderComments()
}