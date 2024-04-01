export const initExpandableTextarea = () => {
  const textareaWrapper = document.querySelector('.expandable-textarea')
  const textarea = textareaWrapper.querySelector('textarea')
  const lines = textareaWrapper.querySelector('.expandable-textarea__lines')

  const update = () => {
    textareaWrapper.dataset.value = textarea.value
    lines.innerHTML = ''
    lines.append(
      ...Array.from({
        length: Math.round(
          textarea.offsetHeight /
            (textarea.computedStyleMap().get('line-height').value *
              textarea.computedStyleMap().get('font-size').value),
        ),
      }).map(() => {
        const span = document.createElement('span')
        span.textContent = 'line'
        return span
      }),
    )
  }

  textarea.addEventListener('input', update)

  window.addEventListener('resize', update)

  update()
}
