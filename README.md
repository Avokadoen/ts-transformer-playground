# Ts-fn-parameter-type
### example:
```typescript
interface Comp1 {
    someNumber: number;
}

interface Comp2 {
    someString: string;
}

const mySystem = (dt: number, myC1: Comp1, myC2: Comp2) => {
    console.log('coolio1');
}

function otherSystem(dt: number, otherC1: Comp1, otherC2: Comp2) {
    console.log('coolio2');
}

// Array [ "Comp1", "Comp2" ]
console.log(fnParameterTypes(mySystem)); 

// Array [ "Comp1", "Comp2" ]
console.log(fnParameterTypes(otherSystem));

// Array [ "Comp1", "Comp2" ]
console.log(fnParameterTypes<(dt: number, otherC1: Comp1, otherC2: Comp2) => void>(otherSystem));
```

# Use in your project: 
This is a higly untested and experimental code base, but if you want to try this you can do the following: 

run:
```bash
npm i -D ts-fn-parameter-type
```

### Webpack
in you webpack.config.js:
```js
const parameterTypeNamesTransformer = require('ts-fn-parameter-type/transformer').default; // <--

module.exports = ['ts-loader'].map(loader => ({
   // ... omitted
    module: {
        rules: [
            {
                // ... omitted
                options: {
                    // make sure not to set `transpileOnly: true` here, otherwise it will not work
                    getCustomTransformers: program => ({
                        before: [
                            parameterTypeNamesTransformer(program)
                        ]
                    })
                }
            },
        ],
    },
}));
```

### Ttypescript
install ttypescript
``npm install -D ttypescript``

set the transform as a plugin
```json
{
    "compilerOptions": {
        // ...
        "plugins": [
            { "transform": "ts-fn-parameter-type/transformer" },
        ]
    },
    // ...
}
```

use ttsc instead of tsc

read more about it [here](https://github.com/cevek/ttypescript/blob/master/README.md) 

# Source
**Heavily** based on [ts-transformer-keys](https://github.com/kimamula/ts-transformer-keys)
