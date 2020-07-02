# Ts-fn-parameter-type
use:
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

// return 1: Array [ "Comp1", "Comp2" ]
console.log('return 1: ', fnParameterTypes(mySystem)); 

// return 2: Array [ "Comp1", "Comp2" ]
console.log('return 2: ', fnParameterTypes(otherSystem));

// return 3: Array [ "Comp1", "Comp2" ]
console.log('return 3: ', fnParameterTypes<(dt: number, otherC1: Comp1, otherC2: Comp2) => void>(otherSystem));
```

# Use in your project: 
This is a higly untested and experimental code base, but if you want to try this you can do the following: 

### Webpack
in you webpack.config.js:
```js
const parameterTypeNamesTransformer = require('ts-fn-parameter-type').default; // <--

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
// TODO explain how to use in ttypescript

# Source
Heavily based on [ts-transformer-keys](https://github.com/kimamula/ts-transformer-keys)
