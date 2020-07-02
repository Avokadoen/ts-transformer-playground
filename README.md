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

# Source
Heavily based on [ts-transformer-keys](https://github.com/kimamula/ts-transformer-keys)
