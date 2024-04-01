import { setupSlider } from './lib/slider'

const stepsBetween = 9
const minArea = 30
const maxArea = 100

const conditionCoefficient = {
  new: 1,
  secondary: 1.5,
  private: 2,
}

const rate = {
  partial: 1500,
  cosmetic: 2500,
  full: 3500,
  capital: 4500,
}

const form = document.querySelector('.form')
const input = document.querySelector('.calc__input')
const price = document.querySelector('.calc__price')

const changeInputValue = (areaInNumber) => {
  input.value = `${areaInNumber}м`
}

const recalculatePrice = () => {
  const areaInNumber = Number(input.value.replaceAll(/(\D)/g, ''))
  const conditionValue = document.querySelector(
    '.calc__radio[name="condition"]:checked',
  ).value
  const rateValue = document.querySelector(
    '.calc__radio[name="rate"]:checked',
  ).value

  price.innerHTML = `${new Intl.NumberFormat('ru').format(
    (rate[rateValue] * areaInNumber) / conditionCoefficient[conditionValue],
  )} руб.`
}

const handleStepChange = (step) => {
  changeInputValue(step + minArea)
  recalculatePrice()
}

/**
 * Handles the change event for the area.
 *
 * @param {Event} event - The event object representing the change event.
 * @return {undefined} This function does not return a value.
 */

export const initCalc = () => {
  const { setStep } = setupSlider({
    sliderClass: 'calc__slider',
    trackClass: 'calc__track',
    itemClass: 'calc__item',
    stepsBetween,
    onStepChange: handleStepChange,
  })

  recalculatePrice()

  input.addEventListener('input', (event) => {
    const areaInNumber = Number(event.target.value.replaceAll(/(\D)/g, ''))
    setStep(areaInNumber - minArea)
    recalculatePrice()
  })

  input.addEventListener('blur', (event) => {
    const areaInNumber = Math.min(
      maxArea,
      Math.max(minArea, Number(event.target.value.replaceAll(/(\D)/g, ''))),
    )

    changeInputValue(areaInNumber)

    recalculatePrice()
  })

  form.addEventListener('change', (event) => {
    if (event.target.className.includes('calc__radio')) {
      recalculatePrice()
    }
  })
}
