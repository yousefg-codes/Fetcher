function changeOpacity(buttonText) {
  let button = document.getElementsByName(buttonText)
  button[i].style.opacity = 0.5;
  setTimeout(() => {button[i].style.opacity = 1}, 1000)
}
