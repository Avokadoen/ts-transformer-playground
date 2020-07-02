import {fnParameterTypes} from '../../index';

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

console.log('return 1: ', fnParameterTypes(mySystem));
console.log('return 2: ', fnParameterTypes(otherSystem));
console.log('return 3: ', fnParameterTypes<(dt: number, otherC1: Comp1, otherC2: Comp2) => void>(otherSystem));
