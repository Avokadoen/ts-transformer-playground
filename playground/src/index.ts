import {fnParameterTypes} from '../../index';

interface Comp1 {
    someNumber: number;
}

interface Comp2 {
    someString: string;
}

const mySystem = (dt: number, c1: Comp1, c2: Comp2) => {
    console.log('coolio1');
}

function otherSystem(dt: number, c1: Comp1, c2: Comp2) {
    console.log('coolio2');
}

fnParameterTypes(mySystem);
fnParameterTypes(otherSystem);