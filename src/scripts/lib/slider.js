/**
 * Calculates the center position of an element relative to the viewport.
 *
 * @param {Element} element - The element to calculate the center position for.
 * @return {{ x: number, y: number }} An object containing the x and y coordinates of the center position.
 */
const getCenterPosition = (element) => {
  const { top, left, width, height } = element.getBoundingClientRect()

  return {
    x: left + width / 2,
    y: top + height / 2,
  }
}

/**
 * Function that determines the direction based on the flex-direction property of an element.
 *
 * @param {Element} element - the element to retrieve the flex-direction property from
 * @return {'horizontal' | 'vertical'} 'vertical' if flex-direction is 'column', 'horizontal' otherwise
 */
const getDirection = (element) =>
  element.computedStyleMap().get('flex-direction').value === 'column'
    ? 'vertical'
    : 'horizontal'

/**
 * Sets up a slider with the given sliderClass, trackClass, and itemClass.
 *
 * @param {Object} options - The options for setting up the slider.
 * @param {string} options.sliderClass - The CSS class selector for the slider element.
 * @param {string} options.trackClass - The CSS class selector for the track element.
 * @param {string} options.itemClass - The CSS class selector for the item elements.
 * @param {number} [options.stepsBetween=0] - The number of steps between each item.
 * @param {(step: number) => void} options.onStepChange - The callback function to be called when the step changes.
 * @return {{setStep: (step: number) => void}}
 * @example
 * setupSlider({
 *   sliderClass: 'slider',
 *   trackClass: 'slider__track',
 *   itemClass: 'slider__item',
 * })
 */
export const setupSlider = ({
  sliderClass,
  trackClass,
  itemClass,
  stepsBetween = 0,
  onStepChange,
}) => {
  const slider = document.querySelector(`.${sliderClass}`)
  const track = slider.querySelector(`.${trackClass}`)
  const items = slider.querySelectorAll(`.${itemClass}`)
  let step = [...items].findIndex((item) => 'current' in item.dataset)
  let previousCord
  let direction = getDirection(slider)

  const setCurrentItem = (item) => {
    if ('current' in item.dataset) {
      return
    }

    delete slider.querySelector(`.${itemClass}[data-current]`).dataset.current
    item.dataset.current = ''
  }

  const setTrackPosition = ({ x, y }, animate = true) => {
    track.animate(
      direction === 'vertical'
        ? {
            top: `${y - slider.getBoundingClientRect().top - track.getBoundingClientRect().height / 2}px`,
            left: '0',
          }
        : {
            left: `${x - slider.getBoundingClientRect().left - track.getBoundingClientRect().width / 2}px`,
            top: '0',
          },
      { duration: animate ? 300 : 0, fill: 'forwards', easing: 'ease' },
    )
  }

  const setStep = (stepInNumbers) => {
    if (stepsBetween > 0) {
      const sliderRect = slider.getBoundingClientRect()
      const itemSize =
        items[0].getBoundingClientRect()[
          direction === 'vertical' ? 'height' : 'width'
        ]
      const min =
        sliderRect[direction === 'vertical' ? 'top' : 'left'] + itemSize / 2
      const max =
        sliderRect[direction === 'vertical' ? 'bottom' : 'right'] - itemSize / 2
      const x = Math.max(
        min,
        Math.min(
          max,
          ((sliderRect['width'] - itemSize) /
            (items.length - 1 + (items.length - 1) * stepsBetween)) *
            stepInNumbers +
            sliderRect['left'] +
            itemSize / 2,
        ),
      )
      const y = Math.max(
        min,
        Math.min(
          max,
          ((sliderRect['height'] - itemSize) /
            (items.length - 1 + (items.length - 1) * stepsBetween)) *
            stepInNumbers +
            sliderRect['top'] +
            itemSize / 2,
        ),
      )

      setTrackPosition({
        x,
        y,
      })
    } else {
      for (const [index, item] of items.entries()) {
        if (index === stepInNumbers) {
          setCurrentItem(item)
          setTrackPosition(getCenterPosition(item))
        } else {
          delete item.dataset.current
        }
      }
    }

    step = stepInNumbers
  }

  /**
   * Handles the pointer move event and updates the position of the track element
   * based on the pointer's position.
   *
   * @param {PointerEvent} event - The pointer move event.
   * @return {void} This function does not return a value.
   */
  const handlePointerMove = (event) => {
    const sliderRect = slider.getBoundingClientRect()
    const itemSize =
      items[0].getBoundingClientRect()[
        direction === 'vertical' ? 'height' : 'width'
      ]
    const min =
      sliderRect[direction === 'vertical' ? 'top' : 'left'] + itemSize / 2
    const max =
      sliderRect[direction === 'vertical' ? 'bottom' : 'right'] - itemSize / 2
    const stepsCount =
      stepsBetween > 0
        ? items.length - 1 + (items.length - 1) * stepsBetween
        : items.length
    const stepSize =
      (sliderRect[direction === 'vertical' ? 'height' : 'width'] - itemSize) /
      stepsCount

    let closestItem = slider.querySelector(`.${itemClass}[data-current]`)
    let closestCord = getCenterPosition(closestItem)

    if (stepsBetween > 0) {
      closestCord.x = Math.round(event.clientX / stepSize) * stepSize
      closestCord.y = Math.round(event.clientY / stepSize) * stepSize
    } else {
      for (const item of items) {
        const { x: itemX, y: itemY } = getCenterPosition(item)

        if (
          !closestCord ||
          Math.abs(itemX - event.clientX) + Math.abs(itemY - event.clientY) <
            Math.abs(closestCord.x - event.clientX) +
              Math.abs(closestCord.y - event.clientY)
        ) {
          closestCord = getCenterPosition(item)
          closestItem = item
        }
      }
    }

    closestCord.x = Math.max(min, Math.min(max, closestCord.x))
    closestCord.y = Math.max(min, Math.min(max, closestCord.y))

    if (previousCord.x !== closestCord.x && previousCord.y !== closestCord.y) {
      step = Math.round(
        (closestCord[direction === 'vertical' ? 'y' : 'x'] - min) / stepSize,
      )

      previousCord = closestCord
    }

    if (onStepChange) onStepChange(step)

    setCurrentItem(closestItem)
    setTrackPosition(closestCord)
  }

  const handlePointerDown = (event) => {
    event.preventDefault()
    window.addEventListener('pointermove', handlePointerMove)
  }

  const handlePointerUp = () => {
    window.removeEventListener('pointermove', handlePointerMove)
  }

  /**
   * @param {number} index - The index of the clicked item.
   */
  const handleItemClick = (event, index) => {
    event.preventDefault()
    setCurrentItem(items[index])
    setTrackPosition(getCenterPosition(items[index]))

    if (onStepChange) {
      onStepChange(index * stepsBetween + index)
    }
  }

  track.addEventListener('pointerdown', handlePointerDown)
  window.addEventListener('pointerup', handlePointerUp)

  for (const [index, item] of items.entries()) {
    if ('current' in item.dataset) {
      const pos = getCenterPosition(item)
      setTrackPosition(pos, false)
    }

    item.addEventListener('click', (event) => handleItemClick(event, index))
  }

  track.style.opacity = '1'

  window.addEventListener('resize', () => {
    direction = getDirection(slider)
    setStep(step)
  })

  return {
    setStep,
  }
}
