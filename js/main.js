import { GAME_STATUS, PAIRS_COUNT } from './constants.js'
import { getColorElementList, getUlElement } from './selectors.js'
import { getRandomColorPairs } from './utils.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING

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
    console.log('Match', gameStatus, selections)
    // check win
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
  console.log('Not match', gameStatus, selections)
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
