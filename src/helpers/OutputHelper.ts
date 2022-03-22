import {isFloat, isInteger} from "./TypeHelper";

function generateUniqueId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function getHumanNumber(value: number | string): string | number {
    let number: string | number = 0;
    const valueCasted = Number(value);
    if (isFloat(valueCasted)) {
        number = valueCasted.toFixed(2).replace('.', ',');
    } else if (isInteger(valueCasted)) {
        number = valueCasted;
    }

    return number;
}

export {
    generateUniqueId,
    getHumanNumber
};
