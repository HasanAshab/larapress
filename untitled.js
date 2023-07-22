var isMatch = function(s, p) {
  let i = 0;
  let j = 0;
  while (i < p.length) {
    if(p[i] === "*"){
      let k = j;
      while(p[i + 1] === "*" || (s[k++] && p[i + 1] === "?")){
        i++;
      }
      if(i + 1 === p.length) return true;
      let sub = "";
      for(k = i + 1; p[k] && p[k] !== "?" && p[k] !== "*"; k++){
        sub += p[k];
      }
      const subStartingAt = s.indexOf(sub, j);
      if(subStartingAt === -1) return false;
      j = subStartingAt + sub.length;
      i += sub.length + 1;
      if(typeof s[j] === "undefined" && i < p.length){
        while(i < p.length){
          if(p[i] !== "*") return false;
          i++;
        }
      }
    }
    else if(p[i] === "?"){
      if(!s[j]) return false;
      i++;
      j++;
    }
    else {
      if(p[i] !== s[j]) return false;
      i++;
      j++;
    }
  }
  return j === s.length;
}

isMatch = function(s, p) {
  const parts = p.split("*")
  console.log(parts, s)
  return
}

//console.log(isMatch("abefcdgiescdfimde", "ab*cd?i*de"))
//console.log(isMatch("", "*****"))
//console.log(isMatch("bbbbabaabbabbababaabaabababaababaaaabaaabbbabbbbbbabbabbabbaaabaababbbababbbaaababbbbaabbaababbabababbbbbbabbbbbaabbabaababbabbbbbbaabbbabbbaabaaababaabaaaabababbababbaaabbaabaabaabbbbbbaabbaaaaaabbabb", "aa***bb*b**a***bb***b*b*ba********ba***bbbb*bba*a*b***ba*a*b**aabbba*aba****a*ba*****a*bab**a**b**b*a*"))
//console.log(isMatch("lmkbc", "*b?"))
//console.log(isMatch("c", "*?*"))
//console.log(isMatch("b", "?*?"))
//console.log(isMatch("b", "*?*?"))
//console.log(isMatch("a", "*a*"))

//console.log(isMatch("aa", "a")) 
//console.log(isMatch("", "?"))
//console.log(isMatch("ab", "*a"))
console.log(isMatch("adceb", "*a*b"))
//console.log(isMatch("hi", "*?"))
console.log(isMatch("mississippi", "m??*ss*?i*pi"))
console.log(isMatch("mississippi", "m*issi*iss*"))
console.log(isMatch("mississippi", "m*iss*iss*"))
