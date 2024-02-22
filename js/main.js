import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import {
  getColorElementList,
  getInActiveColorList,
  getPlayAgainButton,
  getUlElement,
} from './selectors.js'
import {
  createTimer,
  getRandomColorPairs,
  hidePlayAgainButton,
  setTimerText,
  showPlayAgainButton,
} from './utils.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PENDING
const timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
})

function handleTimerChange(second) {
  console.log('change', second)
}

function handleTimerFinish() {
  console.log('Finish')
}

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function initColorList() {
  const colorList = getRandomColorPairs(PAIRS_COUNT)
  if (!colorList) return

  const liList = getColorElementList()
  liList.forEach((liElement, index) => {
    const overlayElement = liElement.querySelector('.overlay')
    if (overlayElement) overlayElement.style.backgroundColor = colorList[index]

    liElement.dataset.color = colorList[index]
  })
}

function handleColorClick(liElement) {
  const shouldBlockClick = [GAME_STATUS.BLOCKING || GAME_STATUS.FINISHED].includes(gameStatus)
  if (!liElement || shouldBlockClick) return

  liElement.classList.add('active')
  selections.push(liElement)

  if (selections.length < 2) return

  const firstColor = selections[0].dataset.color
  const secondColor = selections[1].dataset.color
  const isMatch = firstColor === secondColor

  if (isMatch) {
    // check win
    const isWin = getInActiveColorList().length === 0
    if (isWin) {
      setTimerText('YOU WIN! 🥇')
      showPlayAgainButton()
    }

    selections = []
    return
  }

  // if not match
  // remove active class on 2 LI element
  gameStatus = GAME_STATUS.BLOCKING
  setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')
    selections = []
    gameStatus = GAME_STATUS.PLAYING
  }, 500)
}

function attachEventForLiElement() {
  const ulElement = getUlElement()
  if (!ulElement) return
  ulElement.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return

    handleColorClick(event.target)
  })
}

function resetGame() {
  // reset global variables
  selections = []
  gameStatus = GAME_STATUS.PENDING

  // reset DOM
  // - change timer text
  // - hide play again button
  // - remove class active for all LI element
  setTimerText('')
  hidePlayAgainButton()

  const liList = getColorElementList()
  if (!liList) return
  for (const liElement of liList) {
    liElement.classList.remove('active')
  }

  // generate a new color collection
  initColorList()

  // start a new game
  startTimer()
}

function attachEventForPlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  if (!playAgainButton) return

  playAgainButton.addEventListener('click', resetGame)
}

function startTimer() {
  timer.start()
}

;(() => {
  initColorList()
  attachEventForLiElement()
  attachEventForPlayAgainButton()
  startTimer()
})()
