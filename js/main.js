import { GAME_STATUS, PAIRS_COUNT } from './constants.js'
import { getColorElementList, getUlElement } from './selectors.js'
import { getRandomColorPairs } from './utils.js'

// Global variables
let selections = []
let gameState = GAME_STATUS.PLAYING

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
  })
}

function handleColorClick(liElement) {
  if (!liElement) return
  liElement.classList.add('active')
}

function attachEventForLiElement() {
  const ulElement = getUlElement()
  if (!ulElement) return
  ulElement.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return

    handleColorClick(event.target)
  })
}

;(() => {
  initColorList()
  attachEventForLiElement()
})()
