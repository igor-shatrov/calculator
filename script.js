const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const clearButton = document.querySelector('[data-all-clear]');
const deleteButton = document.querySelector('[data-delete]');
const equalsButton = document.querySelector('[data-equals]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const rootButton = document.querySelector('[data-root-of-number]');
const squareButton = document.querySelector('[data-square]');
const minusButton = document.querySelector('[data-minus]');

class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    getDisplayNumber(number) {
        let sign = '';
        if (number < 0) {
            sign = "-";
        }
        let stringNumber = number.toString();
        let integerDigits = parseFloat(stringNumber.split('.')[0]);
        let decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDigits = ''
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            })
        }
        if (decimalDigits != null) {
            return `${sign}${integerDigits}.${decimalDigits}`
        } else {
            return integerDigits;
        }
    }

    displayUpdate() {
        document.querySelector('[data-current-operand]').innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            document.querySelector('[data-previous-operand]').innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            document.querySelector('[data-previous-operand]').innerText = `${this.getDisplayNumber(this.previousOperand)}`;
        }
    }

    addNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return
        this.currentOperand = this.currentOperand + number.toString();
        this.displayUpdate();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        document.querySelector('[data-previous-operand]').innerText = '';
        this.operation = undefined;
        this.displayUpdate();
    }

    delete() {
        if (this.currentOperand === '') return
        this.currentOperand = this.currentOperand.slice(0, -1);
        this.displayUpdate();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return
        if (this.previousOperand !== '') {
            console.log("this.previousOperand !== ''")
            this.compute()
            this.previousOperand = this.currentOperand;
            this.currentOperand = '';
            this.operation = operation;
        }
        if (this.operation != null) {
            console.log('this.operation !== undefined')
            this.operation = operation;
        } else {
            console.log('else')
            this.operation = operation;
            this.previousOperand = this.currentOperand;
            this.currentOperand = '';
        }
        this.displayUpdate();
    }

    squareOrRoot(operation) {
        if (this.currentOperand === '' && this.previousOperand === '') return
        if (this.currentOperand === '' && this.previousOperand !== '') {
            this.currentOperand = this.previousOperand;
        } else if (this.currentOperand !== '' && this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.compute();
        console.log('end of square');
    }

    minus() {
        if (this.currentOperand === '') {
            this.currentOperand = '-';
        } else if (this.currentOperand !== '' && this.operation === undefined) {
            this.chooseOperation('-')
        }
    }

    compute() {
        if (this.currentOperand === '' || this.previousOperand === '' && this.operation !== 'square' && this.operation !== 'root') return
        if (this.previousOperand !== '' || this.operation === 'square' || this.operation === 'root') {
            switch (this.operation) {
                case '+':
                    this.currentOperand = BigNumber(parseFloat(this.currentOperand)) + BigNumber(parseFloat(this.previousOperand));
                    break;
                case '-':
                    this.currentOperand = BigNumber(parseFloat(this.previousOperand)).minus(parseFloat(this.currentOperand));
                    break;
                case '÷':
                    this.currentOperand = BigNumber(parseFloat(this.previousOperand)).div(parseFloat(this.currentOperand));
                    break;
                case '*':
                    this.currentOperand = BigNumber(parseFloat(this.previousOperand)).times(parseFloat(this.currentOperand));
                    break;
                case 'square':
                    this.currentOperand = BigNumber(parseFloat(this.currentOperand)).times(parseFloat(this.currentOperand));
                    break;
                case 'root':
                    if (this.currentOperand === '0') {
                        alert('root of null');
                        this.clear();
                        break;
                    }
                    this.currentOperand = BigNumber(parseFloat(this.currentOperand)).sqrt();
                    break;
                default:
                    return;
            }
        }
        this.previousOperand = '';
        this.operation = undefined;
        this.displayUpdate();
    }

}

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        calculator.addNumber(button.innerText);
    });
})

deleteButton.addEventListener('click', () => {
    calculator.delete()
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
    })
})

equalsButton.addEventListener('click', () => {
    calculator.compute();
})

clearButton.addEventListener('click', () => {
    calculator.clear();
})

squareButton.addEventListener('click', () => {
    console.log('square');
    calculator.squareOrRoot('square');
})

rootButton.addEventListener('click', () => {
    console.log('root');
    calculator.squareOrRoot('root');
})

minusButton.addEventListener('click', () => {
    console.log('minus');
    calculator.minus();
})