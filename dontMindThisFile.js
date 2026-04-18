const noButton = new Audio('noButton.mp3')
const adminButton = new Audio('adminButton.mp3')

stealthBtn.addEventListener('click', () => {
  adminButton.play()
})

notifNo.addEventListener('click', ()=>{
  noButton.play()
}) 
