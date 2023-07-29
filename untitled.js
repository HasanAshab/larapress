/**
* undo and redo function should return the current mementor
* add should add a new mementor and return this
*/

class Mementor {
  steps = [];
  current = -1;
  
  add(step) {
    this.steps.splice(this.current + 1)
    this.steps.push(step);
    this.current = this.steps.length - 1;
  }
  
  redo() {
    return this.steps[++this.current];
  }
  
  undo() {
    return this.steps[--this.current];
  }
  
  current() {
    return this.steps[this.current];
  }
  
  last() {
    return this.steps[this.steps.length - 1];
  }
}

const fn = new Mementor();

fn.add("hello");
fn.add("hello bro");
fn.add("hello bro how");
fn.add(" ");
fn.add("bye");

let res;

function case1() {
  res = fn.undo();
  res = fn.undo();
  res = fn.undo();
  console.log(res); //hello bro
}
//case1()

function case2() {
  res = fn.undo();
  res = fn.undo();
  res = fn.add("last");
  res = fn.undo();
  res = fn.redo();
  res = fn.redo();
  res = fn.undo();
  res = fn.undo();
  console.log(res); //hello bro how
}

case2()


