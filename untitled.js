function expect(target) {
  function equal(matcher) {
    if(target !== matcher)
      throw new Error(`Expected: ${matcher}, Recieved: ${target}`)
  }
  return { equal }
}


class Wildcard {
  static match(str, query) {
    //
  }
  
  static replace(str, query, replacement) {
    //
  }
}

function matchTest() {
expect(
  Wildcard.match("hello world", "")
).equal(true);

expect(
  Wildcard.match("hello world", "*")
).equal(true);
expect(
  Wildcard.match("", "*")
).equal(true);
expect(
  Wildcard.match("", "")
).equal(true);
expect(
  Wildcard.match("hello world", "he*")
).equal(true);
expect(
  Wildcard.match("hello world", "*llo")
).equal(true);
expect(
  Wildcard.match("hello world", "he*ld")
).equal(true);
expect(
  Wildcard.match("hello world", "hel*w")
).equal(true);
expect(
  Wildcard.match("hello world", "hel")
).equal(true);
expect(
  Wildcard.match("hello world", " ")
).equal(true);
expect(
  Wildcard.match("hello world", "*hel")
).equal(true);
expect(
  Wildcard.match("hello world", "world*")
).equal(true);
expect(
  Wildcard.match("hello world", "held")
).equal(false);
expect(
  Wildcard.match("hello world", "")
).equal(false);
}

function replaceTest() {
  expect(
    Wildcard.replace("hello world", "hello", "fuck")
  ).equal("fuck world");
  expect(
    Wildcard.replace("hello world", "*", "")
  ).equal("");
  expect(
    Wildcard.replace("hello world", "hello *", "fuck *")
  ).equal("fuck world");
  expect(
    Wildcard.replace("hi boltu how are you", "hi * how are you", "* is fine")
  ).equal("boltu is fine");
  
}