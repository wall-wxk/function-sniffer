# [![CircleCI](https://img.shields.io/circleci/build/github/wall-wxk/function-sniffer/master)](https://circleci.com/gh/wall-wxk/function-sniffer/tree/master) [![Coverage Status](https://coveralls.io/repos/github/wall-wxk/function-sniffer/badge.svg?branch=master)](https://coveralls.io/github/wall-wxk/function-sniffer?branch=master) [![NPM version](https://img.shields.io/npm/v/function-sniffer.svg)](https://www.npmjs.com/package/function-sniffer) [![download](https://img.shields.io/npm/dm/function-sniffer)](https://www.npmjs.com/package/function-sniffer) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/wall-wxk/function-sniffer/blob/master/LICENSE)

## Features
- Sniffer function can or can't run.
- can do lazy run until function is loaded.

## Environment Support

- Modern browsers and Internet Explorer 6+

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --- | --- | --- | --- | --- | --- |
| IE6+, Edge | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## Usage

Using npm
```bash
npm install --save function-sniffer
```

node environment：
```js
var Sniffer = require('function-sniffer');
```

webpack or similar environment：
```js
import Sniffer from 'function-sniffer';
```

requirejs environment:
```js
requirejs(['node_modules/function-sniffer/dist/function-sniffer.cjs.js'], function (base) {
    // do something...
})
```

browser environment:
```html
<script src="node_modules/function-sniffer/dist/ifunction-sniffer.min.js"></script>
```

## Example

This is a Object `Tool` has a function `do`.
// tool.js
```javascript
(function(Tool, undefined){
    Tool.do = function(thing){
        console.log('try to do '+ thing);
    }
})(window.Tool || (window.Tool = {});
```

Now, `Sniffer.run` can execute function just like `Tool.do`. 
- **Sniffer.run**
    - **base** `default: window, base is not required, if object is base on window.`
    - **name** `execute `base.name` function. is required.`
    - **prompt** `prompting when function can't be found and execute. not required.`
    - **showPromptFn** `custom prompt function. default is alert. not required.`
    - **subscribe** `if you want to lazy run function which is not exist now.Sniffer memory it.When function loaded, try Sniffer.trigger to run it. not required.`

```javascript
import Sniffer from 'function-sniffer';
Sniffer.run({
    name: 'Tool.do', 
    prompt: 'Tool.do is not exist.',
    showPromptFn: (str)=>{ console.log(str);}, 
    subscribe: true
});
```

`Sniffer.trigger` can run the memory list of function.

- **Sniffer.trigger**
    - **base** `default: window, base is not required, if object is base on window.`
    - **name** `execute `base.name` function. is required.`

```javascript
import Sniffer from 'function-sniffer';
Sniffer.run({
    name: 'Tool.walk', 
    subscribe: true
});

// walk() is not exist in Tool.And Sniffer memory it, Because `subscribe:true`.

Tool.walk = function(person){
    console.log(person + ' is walking.');
}

// walk loaded.And trigger to run it.

Sniffer.trigger({
    base: Tool,
    name: 'walk'
}, 'leon')

// => leon is walking.
```


## License
MIT

