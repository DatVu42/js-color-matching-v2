import { getGameButton, getTimerElement } from './selectors.js'

function shuffle(arr) {
  if (!Array.isArray(arr)) return

  return arr.sort(() => Math.random() - 0.5)
}

export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor

  const colorList = []
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome']

  for (let i = 0; i < count; i++) {
    const color = randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length],
    })

    colorList.push(color)
  }

  const fullColorList = [...colorList, ...colorList]

  return shuffle(fullColorList)
}

export function createTimer({ seconds, onChange, onFinish }) {
  let intervalId = null

  function start() {
    clear()

    let currentSecond = seconds
    intervalId = setInterval(() => {
      onChange?.(currentSecond)

      currentSecond--

      if (currentSecond < 0) {
        clear()
        onFinish?.()
      }
    }, 500)
  }

  function clear() {
    clearInterval(intervalId)
  }

  return {
    start,
    clear,
  }
}

export function setTimerText(text) {
  const timerElement = getTimerElement()
  if (timerElement) {
    timerElement.textContent = text
  }
}

export function disableGameButton() {
  const gameButton = getGameButton()
  if (gameButton) gameButton.setAttribute('disabled', '')
}

export function enableGameButton() {
  const gameButton = getGameButton()
  if (gameButton) gameButton.removeAttribute('disabled')
}
