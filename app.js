let flippedCards = []
let matchedCards = []

const body = document.querySelector('body')
const head = document.querySelector('header')
const mainEnter = document.querySelector('.enter')
const gameCards = document.createElement('div')
const gameBoard = document.querySelector('.game-container')
const restart = document.querySelector('#restart')

/*This being a single page application, used session storage 
to control rendering beteween main Page and game page*/
gameBoard.style.display = 'none'
if (sessionStorage.getItem('gameStatus') == 'start') {
  gameBoard.style.display = 'none'
} else if (sessionStorage.getItem('gameStatus') == 'running') {
  head.style.display = 'none'
  gameBoard.style.display = 'flex'
}

/* Trigerred as soon as we click enter or hit enter button in main page */
const enterGame = (e) => {
  sessionStorage.gameStatus = 'running'
  if (sessionStorage.getItem('gameStatus') == 'running') {
    if (e.keyCode == 13 || e.target.innerText == 'Enter') {
      head.style.display = 'none'
      gameBoard.style.display = 'flex'
    } else {
      alert('Please press Enter key')
    }
  }
}

body.addEventListener('keypress', enterGame)
mainEnter.addEventListener('click', enterGame)

/* restart handler that reflips all cards and shuffles on reload*/

restart.addEventListener('click', () => {
  matchedCards = []
  flippedCards = []
  sessionStorage.setItem('gameStatus', 'running')
  cardElements.forEach((ce, index) => {
    ce.classList.remove('flip')
  })
  window.location.reload()
})

/*Generates Card Data with dynamic ID's and randox Hex Codes for color
Used Math.random() to generate random numbers between 0 & 1, rounded off and multiplied with 1000000
converts it to HEX using .toString(16) with base 16
padEnd() makes sure that the generated hex is always 6 char by adding 0 until it becomes 6 char */
function cardGenerator(n) {
  let cards = []
  for (let i = 0; i < n; i++) {
    cards.push({
      id: i,
      color:
        '#' +
        Math.floor(Math.random() * 1000000)
          .toString(16)
          .padEnd(6, 0),
    })
  }
  return cards
}

/* Generates cards, duplicates and shuffles */
let cards = cardGenerator(6)
let cardSet = [...cards, ...cards]
shuffledCardSet = Shuffle([...cardSet])

function Shuffle(a) {
  return a.reduce((acc, _, i, arr) => {
    const rI = Math.floor(Math.random() * (arr.length - i)) + i
    ;[arr[i], arr[rI]] = [arr[rI], arr[i]]
    return arr
  }, [])
}

/* Renders card in the webpage */

function renderCards(cards) {
  gameCards.classList.add('game-cards')
  gameBoard.appendChild(gameCards)
  cards.forEach((card) => {
    const cardElement = document.createElement('div')
    cardElement.classList.add('card')
    cardElement.setAttribute('id', card.id)
    const front = document.createElement('div')
    front.classList.add('front')
    const back = document.createElement('div')
    back.classList.add('back')
    back.style.backgroundColor = card.color
    cardElement.append(front, back)
    gameCards.appendChild(cardElement)
  })
}

renderCards(shuffledCardSet)

/* Handler function that handles clicking on a card, flipping them back and fro, finalizes the winning condition.*/ 
function handleCardClick(e) {
  if (flippedCards.length > 2) {
    return
  }
  setTimeout(() => {
    const clickedCard = e.target

    clickedCard.classList.add('flip')
    flippedCards.push(clickedCard)

    if (flippedCards.length === 2) {
      const [card1, card2] = flippedCards

      if (card1.id === card2.id) {
        // Cards match
        matchedCards.push(card1, card2)
        flippedCards = []

        if (matchedCards.length === shuffledCardSet.length) {
          setTimeout(() => {
            alert('You won!')
            window.location.reload()
          }, 500)
        }
      } else {
        setTimeout(() => {
          card1.classList.remove('flip')
          card2.classList.remove('flip')
          flippedCards = []
        }, 250)
      }
    }
  }, 100)
}
const cardElements = document.querySelectorAll('.card')
cardElements.forEach((card) => card.addEventListener('click', handleCardClick))
