const navigate = (event, destination) => {
  let tabPages = document.getElementsByClassName('tabPage')
  for(var i = 0; i < tabPages.length; i++){
    tabPages[i].style.display = "none";
  }
  let arr = document.getElementsByClassName("tabPage")
  arr[0].style.display = "none"
  let tabBtns = document.getElementsByClassName('tabButtons')
  for(var i = 0; i < tabBtns.length; i++){
    tabBtns[i].className = tabBtns[i].className.replace(" active", "")
  }
  let loginBtns = document.getElementsByClassName('logInBtn')
  for(var i = 0; i < loginBtns.length; i++){
    loginBtns[i].className = loginBtns[i].className.replace(" active", "")
  }
  document.getElementById(destination).style.display != "" ? document.getElementById(destination).style.display = "flex" : document.getElementById(destination).style.display += "flex";
  if(destination == "Sign In"){
    document.getElementById('topBar').style.display = 'none'
  }
  event.currentTarget.className += " active"
}
export default navigate