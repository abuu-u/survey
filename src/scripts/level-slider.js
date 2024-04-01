import { setupSlider } from './lib/slider'

export const initLevelSlider = () => {
  setupSlider({
    sliderClass: 'level',
    trackClass: 'level__track',
    itemClass: 'level__item',
  })
}
