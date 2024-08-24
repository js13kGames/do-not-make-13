// Constants
import { vec3 } from './math/vec3.js'

export const VIEW_WIDTH = 480
export const VIEW_HEIGHT = 360
export const VIEW_RATIO = VIEW_WIDTH / VIEW_HEIGHT

// Loop
import { mat4, setOrthographicProjection } from './math/mat4.js'

export let deltaTime

export function startGame(update, render) {
  let previousT
  let raf

  function tick(t) {
    raf = window.requestAnimationFrame(tick)

    if (!previousT) {
      previousT = t
      return
    }

    deltaTime = Math.min(0.1, (t - previousT) / 1000)

    update()
    render()

    previousT = t
  }

  window.requestAnimationFrame(tick)
}

// Graphics
export let projectionMatrix = mat4()
export let viewMatrix = mat4()

export const canvas = document.querySelector('canvas')
export const gl = canvas.getContext('webgl2', {
  antialias: false
})

function onResize() {
  canvas.width = window.innerWidth * window.devicePixelRatio
  canvas.height = window.innerHeight * window.devicePixelRatio

  let offsetX = 0
  let offsetY = 0
  if (canvas.width / canvas.height > VIEW_RATIO) {
    offsetX = (VIEW_HEIGHT * canvas.width / canvas.height - VIEW_WIDTH) / 2
  }
  else {
    offsetY = (VIEW_WIDTH * canvas.height / canvas.width - VIEW_HEIGHT) / 2
  }

  setOrthographicProjection(
    projectionMatrix,
    VIEW_HEIGHT + offsetY,
    -offsetY,
    -offsetX,
    VIEW_WIDTH + offsetX,
    0, 100
  )
}
window.onresize = onResize
onResize()

// Audio
export let audioContext = new window.AudioContext({ sampleRate: 22050 })
export let audioDestination = audioContext.createDynamicsCompressor()
export let contextSampleRate = audioContext.sampleRate

audioDestination.connect(audioContext.destination)

// Input
export let pointerPosition

document.body.addEventListener('pointerdown', (e) => {
  pointerPosition = getPointerPosition(e)
})

document.body.addEventListener('pointermove', (e) => {
  if (!pointerPosition) return

  pointerPosition = getPointerPosition(e)
})

document.body.addEventListener('pointerup', () => {
  pointerPosition = undefined
})

function getPointerPosition(e) {
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  if (screenWidth / screenHeight > VIEW_RATIO) {
    return vec3([
      (e.clientX - ((screenWidth - screenHeight * VIEW_RATIO) / 2)) * VIEW_HEIGHT / screenHeight,
      e.clientY * VIEW_HEIGHT / screenHeight,
      0
    ])
  }
  else {
    return vec3([
      e.clientX * VIEW_WIDTH / screenWidth,
      (e.clientY - ((screenHeight - screenWidth / VIEW_RATIO) / 2)) * VIEW_WIDTH / screenWidth,
      0
    ])
  }
}
