let a = null;

await new Promise(r => {
  setTimeout(() => {
    a = 69
  r()
}, 5000)
  
})
console.log(1)

