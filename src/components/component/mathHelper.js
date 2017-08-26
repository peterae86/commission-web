
class MathHelper {
    static roundNumber(numberToRound, numberOfDecimalPlaces) {
        if (numberToRound === 0) {
            return 0;
        }

        if (!numberToRound) {
            return '';
        }

        const scrubbedNumber = numberToRound.toString().replace('$', '').replace(',', '');
        return Math.round(scrubbedNumber * Math.pow(10, numberOfDecimalPlaces)) / Math.pow(10, numberOfDecimalPlaces);
    }

    static addArray(values) { // adds array of values passed.
        const total = values.reduce((previousValue, currentValue) => {
            return previousValue + parseInt(this.convertToPennies(currentValue), 10); // do math in pennies to assure accuracy.
        }, 0);

        return total / 100; // convert back into dollars
    }

    static convertToPennies(value) {
        if (value === 0) {
            return 0;
        }

        let dollarValue = parseFloat(value);
        dollarValue = this.roundNumber(dollarValue, 2); // round to 2 decimal places.
        const dollarValueContainsDecimal = (dollarValue.toString().indexOf('.') !== -1);
        return (dollarValueContainsDecimal) ? parseInt(dollarValue.toString().replace('.', ''), 10) : parseInt(dollarValue, 10) * 100;
    }
}

class NumberFormatter {
    static getCurrencyFormattedNumber(value) {
        if (value === null) {
            return '';
        }

        return this.getFormattedNumber(value); // eslint-disable-line prefer-template
    }

    static getFormattedNumber(value) {
        if (value === 0) {
            return 0;
        }

        if (!value) {
            return '';
        }

        if (!this.isInt(this.scrubFormatting(value))) {
            return ''; // if it's not a number after scrubbing formatting, just return empty.
        }

        let roundedValue = MathHelper.roundNumber(value, 2); // round if more than 2 decimal points
        roundedValue = roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); // add commas for 1,000's. RegEx from http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
        const numbersToTheRightOfDecimal = roundedValue.split('.')[1] || '00';
        switch (numbersToTheRightOfDecimal.length) {
            case 2:
                if (numbersToTheRightOfDecimal === '00') {
                    return `${roundedValue}.${numbersToTheRightOfDecimal}`;
                }
                return `${roundedValue}`;
            case 1:
                return `${roundedValue}0`;
            default:
                return roundedValue;
        }
    }

    static isInt(n) {
        if (n === '' || n === null) {
            return false;
        }
        return n % 1 === 0;
    }

    static scrubFormatting(value) {
        return value.toString().replace(',', '').replace('.', '');
    }
}

export function formateNumber(value, replace) {
    if (value == 0) {
        return replace ? replace : '0.00';
    }
    return NumberFormatter.getCurrencyFormattedNumber(value);
}