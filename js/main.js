import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import { getColorElementList, getGameButton } from './selectors.js';
import { createTimer, getRandomColorPairs, setTimerText } from './utils.js';

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PENDING
const timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish
})

function handleTimerChange(second) {
  setTimerText(second)
}

function handleTimerFinish() {
  console.log('finish');
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

function attachEventForPlayButton() {
  const playButton = getGameButton()
  if (!playButton) return

  playButton.addEventListener('click', () => {
    timer.start()
  })
}

(() => {
  initColorList()
  attachEventForPlayButton()
})()