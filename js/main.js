import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import { getColorElementList, getGameButton, getUlElement } from './selectors.js'
import { createTimer, getRandomColorPairs, setTimerText } from './utils.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PENDING
const timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
})

function handleTimerChange(second) {
  setTimerText(second)
}

function handleTimerFinish() {
  console.log('finish')
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
  const shouldBlockClick = [GAME_STATUS.FINISHED || GAME_STATUS.BLOCKING].includes(gameStatus)
  if (!liElement || shouldBlockClick) return
  console.log('start',selections, gameStatus);

  liElement.classList.add('active')
  selections.push(liElement)

  if (selections.length < 2) return

  const firstColor = selections[0].dataset.color
  const secondColor = selections[1].dataset.color
  const isMatch = firstColor === secondColor

  if (isMatch) {
    console.log('Match')
    selections = []

    return
  }

  gameStatus = GAME_STATUS.BLOCKING
  setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')
    selections = []
    if (gameStatus !== GAME_STATUS.BLOCKING) {
      gameStatus = GAME_STATUS.PLAYING
    }
  }, 5000000)
  console.log('end',selections, gameStatus);
}

function attachEventForUlElement() {
  const ulElement = getUlElement()
  if (!ulElement) return

  ulElement.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return

    handleColorClick(event.target)
  })
}

// function attachEventForPlayButton() {
//   const playButton = getGameButton()
//   if (!playButton) return

//   playButton.addEventListener('click', () => {
//     attachEventForUlElement()
//     timer.start()
//   })
// }

;(() => {
  initColorList()
  // attachEventForPlayButton()
  attachEventForUlElement()
})()
