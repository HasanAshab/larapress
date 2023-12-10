let b = null;

await new Promise(r => {
  setTimeout(() => {
    b = 94
  r()
}, 2000)
  
})
console.log(2)

