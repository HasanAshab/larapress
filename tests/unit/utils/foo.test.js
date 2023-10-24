class TooManyArguments {}
class TooFewArguments {}

const parseSingleSignature = (i, signature, args, opts) => {
  let key = '';
  const obj = {
    value: '',
    description: null,
    isOptional: false,
  };
  if (signature[i] === '-') {
    obj.isFlag = true;
    obj.isOptional = true;
    obj.value = false;
    i += 2;
  }
  const validKeys = /[a-zA-Z1-9]/;

  while (i < signature.length && signature[i] !== '}') {
    if (validKeys.test(signature[i])) key += signature[i];
    else if (signature[i] === '|') {
      obj.shortKey = key;
      key = '';
    } else if (signature[i] === '=') {
      if (obj.isFlag) obj.needsValue = true;
      let value = '';
      while (signature[++i] !== '}' && signature[i] !== ' ')
        value += signature[i];
      obj.value = value;
      i--;
    } else if (signature[i] === '?') {
      obj.isOptional = true;
      obj.value = null;
    } else if (signature[i] === '*') {
      obj.value = [];
      obj.isArrayType = true;
    } else if (signature[i] === ':') {
      let desc = '';
      while (signature[++i] !== '}') desc += signature[i];

      obj.description = desc;
      i--;
    }
    i++;
  }
  if (obj.isFlag) opts[key] = obj;
  else args[key] = obj;
  return i;
};

//helper function for parseing the signatures
const parseSignature = (signature) => {
  const res = {
    args: {},
    opts: {},
  };
  const parsedSignature = {};
  for (let i = 0; i < signature.length; i++) {
    if (signature[i] === '{') {
      i = parseSingleSignature(++i, signature, res.args, res.opts);
    }
  }

  return res;
};

//helper function for adding arguments value
const addArgumentsValue = (obj, inputs) => {
  for (const key in obj) {
    if (obj[key].isArrayType) {
      for (let i = 0; i < inputs.length && inputs[i] !== key; i++)
        obj[key].value = inputs.splice(i + 1);
      if (obj[key].value.length === 0) throw TooFewArguments();
    } else {
      if (inputs.length > 0) {
        obj[key].value = inputs.shift();
      } else if (!obj[key].isOptional) throw new TooFewArguments();
      // throw new Error(`No argument passed for "${key}"`)
    }

    obj[key] = {
      value: obj[key].value,
      description: obj[key].description,
    };
  }

  if (inputs.length > 0) throw new TooManyArguments();
};

//helper function for adding options value
const addOptionsValue = (obj, inputs) => {
  for (const key in obj) {
    for (let i = 0; i < inputs.length; i++) {
      const valIndex = inputs[i].indexOf('=');
      if (inputs[i].slice(2, valIndex) === key) {
        if (obj[key].needsValue) {
          obj[key].value = inputs[i].slice(valIndex + 1);
        } else {
          obj[key].value = true;
        }
        //removing the passed argument
        inputs.splice(i, 1);
        break;
      } else if (inputs[i].slice(1) === obj[key].shortKey) {
        if (obj[key].needsValue) {
          obj[key].value = inputs[i].slice(1);
        } else {
          obj[key].value = true;
        }
        //removing the passed argument
        inputs.splice(i, 1);
        break;
      }
    }
    obj[key] = {
      value: obj[key].value,
      description: obj[key].description,
    };
  }

  if (inputs.length > 0) throw new TooManyArguments();
};

const parse = (signature, inputs) => {
  const res = parseSignature(signature);
  addArgumentsValue(
    res.args,
    inputs.filter((item) => !item.startsWith('-'))
  );
  addOptionsValue(
    res.opts,
    inputs.filter((item) => item.startsWith('-'))
  );

  return res;
};


// Argument
it('Should parse args', () => {
  const sign = '{a} {b}';
  const args = ['foo', 'bar'];
  const result = {
    args: {
      a: { value: 'foo', description: null },
      b: { value: 'bar', description: null },
    },
    opts: {},
  };
  expect(parse(sign, args)).toEqual(result);
});

it('Should throw error if args count does not satisfy the signature', () => {
  const sign = '{a} {b}';
  let args = ['foo', 'bar', 'baz'];

  expect(() => parse(sign, args)).toThrow(TooManyArguments);
  args = ['foo'];
  expect(() => parse(sign, args)).toThrow(TooFewArguments);
});

it('Should not throw error if an optional arg is not passed', () => {
  const sign = '{a} {b?}';
  const args = ['foo'];
  const result = {
    args: {
      a: { value: 'foo', description: null },
      b: { value: null, description: null },
    },
    opts: {},
  };
  expect(parse(sign, args)).toEqual(result);
});

it('Optional arg value should be the default value if not provided', () => {
  const sign = '{a} {b=bar}';
  const args = ['foo'];
  const result = {
    args: {
      a: { value: 'foo', description: null },
      b: { value: 'bar', description: null },
    },
    opts: {},
  };
  expect(parse(sign, args)).toEqual(result);
});

it('Should handle a combination of positional and optional arguments', () => {
  const sign = '{a} {b?} {c} {d?}';
  const args = ['foo', 'bar', 'baz'];
  const result = {
    args: {
      a: { value: 'foo', description: null },
      b: { value: 'bar', description: null },
      c: { value: 'baz', description: null },
      d: { value: null, description: null },
    },
    opts: {},
  };
  expect(parse(sign, args)).toEqual(result);
});

// Option
it('Should parse options', () => {
  const sign = '{--foo} {--bar}';
  const args = ['--foo', '--bar'];
  const result = {
    args: {},
    opts: {
      foo: { value: true, description: null },
      bar: { value: true, description: null },
    },
  };
  expect(parse(sign, args)).toEqual(result);
});

it('Option should be false if not provided', () => {
  const sign = '{--foo} {--bar}';
  const args = ['--bar'];
  const result = {
    args: {},
    opts: {
      foo: { value: false, description: null },
      bar: { value: true, description: null },
    },
  };
  expect(parse(sign, args)).toEqual(result);
});

it('Should pass option with alias', () => {
  const sign = '{--F|foo}';
  const args = ['-F'];
  const result = {
    args: {},
    opts: { foo: { value: true, description: null } },
  };
  expect(parse(sign, args)).toEqual(result);
});

it('Should pass alias option with its real name', () => {
  const sign = '{--F|foo}';
  const args = ['--foo'];
  const result = {
    args: {},
    opts: { foo: { value: true, description: null } },
  };
  expect(parse(sign, args)).toEqual(result);
});

it('Should pass value to valued-option', () => {
  const sign = '{--foo=}';
  const args = ['--foo=bar'];
  const result = {
    args: {},
    opts: { foo: { value: 'bar', description: null } },
  };
  expect(parse(sign, args)).toEqual(result);
});

it('Valued-option should be null if not provided', () => {
  const sign = '{--foo=}';
  const args = [];
  const result = {
    args: {},
    opts: { foo: { value: null, description: null } },
  };
  expect(parse(sign, args)).toEqual(result);
});

it('Valued-option should be the default value if not provided', () => {
  const sign = '{--foo=bar}';
  const args = [];
  const result = {
    args: {},
    opts: { foo: { value: 'bar', description: null } },
  };
  expect(parse(sign, args)).toEqual(result);
});

it('Should throw error if valued-option is provided but value not passed', () => {
  const sign = '{--foo=}';
  const args = ['--foo='];
  expect(() => parse(sign, args)).toThrow(TooFewArguments);
});

it('Should pass value to valued-option with alias', () => {
  const sign = '{--F|foo=}';
  const args = ['-F=bar'];
  const result = {
    args: {},
    opts: { foo: { value: 'bar', description: null } },
  };
  expect(parse(sign, args)).toEqual(result);
});

it('Should pass value to aliased-valued-option with its real name', () => {
  const sign = '{--F|foo=}';
  const args = ['--foo=bar'];
  const result = {
    args: {},
    opts: { foo: { value: 'bar', description: null } },
  };
  expect(parse(sign, args)).toEqual(result);
});

// input array
it('Should handle a single input array with multiple values', () => {
  const sign = '{users*}';
  const args = ['user1', 'user2', 'user3'];
  const result = {
    args: {
      users: { value: ['user1', 'user2', 'user3'], description: null },
    },
    opts: {},
  };
  expect(parse(sign, args)).toEqual(result);
});