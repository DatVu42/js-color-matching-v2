import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import {
  getColorElementList,
  getGameButton,
  getInActiveColorList,
  getUlElement,
} from './selectors.js'
import { createTimer, disableGameButton, enableGameButton, getRandomColorPairs, setTimerText } from './utils.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING
const timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
})

function handleTimerChange(second) {
  setTimerText(second)
}

function handleTimerFinish() {
  timer.clear()
  setTimerText('Game Over! 😭')
  gameStatus = GAME_STATUS.FINISHED
  enableGameButton()
}

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function initColorList() {
  const colorList = getRandomColorPairs(PAIRS_COUNT)

  const liList = getColorElementList()
  if (!liList) return

  liList.forEach((liElement, index) => {
    const overlayElement = liElement.querySelector('.overlay')
    if (overlayElement) overlayElement.style.backgroundColor = colorList[index]

    liElement.dataset.color = colorList[index]
  })
}

function handleColorClick(liElement) {
  const shouldBlockClick = [GAME_STATUS.FINISHED, GAME_STATUS.BLOCKING].includes(gameStatus)
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
      timer.clear()
      enableGameButton()
      gameStatus = GAME_STATUS.FINISHED
    }
    selections = []
    return
  }

  // not match
  gameStatus = GAME_STATUS.BLOCKING
  setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')
    selections = []
    if (gameStatus !== GAME_STATUS.FINISHED) {
      gameStatus = GAME_STATUS.PLAYING
    }
  }, 500)
}

function attachEventForUlElement() {
  const ulElement = getUlElement()
  if (!ulElement) return

  ulElement.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return
    event.stopImmediatePropagation()
    handleColorClick(event.target)
  })
}

function handleRePlayGame() {
  // reset global variables
  selections = []
  gameStatus = GAME_STATUS.PLAYING

  // reset DOM
  // - disable Play button
  // - remove class active on all LI elements
  disableGameButton()

  const liList = getColorElementList()
  if (!liList) return
  for (const liElement of liList) {
    liElement.classList.remove('active')
  }

  // generate a new color collection
  initColorList()
}

function attachEventForPlayButton() {
  const playButton = getGameButton()
  if (!playButton) return

  playButton.addEventListener('click', () => {
    if (gameStatus === GAME_STATUS.FINISHED) {
      handleRePlayGame()
    }

    attachEventForUlElement()
    timer.start()
  })
}

;(() => {
  initColorList()
  attachEventForPlayButton()
})()
