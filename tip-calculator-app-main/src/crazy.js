/*
	First attempt FAILED because of mobile incompatibility
	Learnt a lot from this failure however!
*/

const billElement = document.querySelector('#bill')
const tipRateElements = document.querySelectorAll('.tip-rate')
const tipRateCustomElement = document.querySelector('#custom-rate')
const divisorElement = document.querySelector('#divisor')

const tipPerPerson = document.querySelector('.tip-per-person')
const tipPerPersonInitial = tipPerPerson.innerText

const totalPerPerson = document.querySelector('.total-per-person')
const totalPerPersonInitial = totalPerPerson.innerText

const resetButton = document.querySelector('.reset')

const inputElements = document.querySelectorAll('input')

const simpleAnim = () => {
	document.querySelector('.main-cont').classList.toggle('simple-anim')
}
const animationAfterLoading = window.addEventListener('load', simpleAnim)
const removeAnimationAfterDelay = window.addEventListener('load', () => {
	setTimeout(simpleAnim, 4500)
})

class Currency {
	format(num) {
		let newNum = num.toLocaleString('en-US')
		let len = newNum.length
		let decimalPlaces = (() => {
			if (newNum.includes('.')) { return len - newNum.indexOf('.') - 1 }
			else if (newNum != 0) { return 0 }
			else if (newNum == 0) { return 'zero' }
			else { return '' }
		})()

		switch (decimalPlaces) {
			case 0: return `${newNum}.00`
			case 1: return `${newNum}0`
			case 2: return newNum
			case 'zero': return '0'
			default: return 'ERROR is real'
		}
	}

	reformat(num) {
		return num.includes(',') ? num.replaceAll(',', '') : num
	}
}
const currency = new Currency

class Calculator {
	constructor(bill, rate, divisor) {
		this.bill = bill
		this.rate = rate
		this.divisor = divisor
	}

	clear() {
		this.bill = ''
		this.rate = ''
		this.divisor = ''
	}

	compute() {
		const roundUpToCent = (num) => {
			/* It's better to pay more, than pay less! But not too much! 💸💸💸
			sample {bill: 105.10} * {tip-rate: 10} / {divisor: 5} = 210.2
			return Math.ceil(210.2) = 211 / 100 = 2.11 tipPerPerson */
			// let computedVal = ('$').concat((Math.ceil(num) / 100).toLocaleString('en-US'))
			let computedVal = Math.ceil(num) / 100
			return ('$').concat(currency.format(computedVal))
		}

		if (this.bill > 0 && this.rate > 0 && this.divisor > 0) {
			let tipPerPersonFormula = (this.bill * this.rate) / this.divisor
			tipPerPerson.innerText = roundUpToCent(tipPerPersonFormula)

			let totalPerPersonFormula = this.bill * (100 + this.rate) / this.divisor
			totalPerPerson.innerText = roundUpToCent(totalPerPersonFormula)
		}
		else {
			tipPerPerson.innerText = tipPerPersonInitial
			totalPerPerson.innerText = totalPerPersonInitial
		}
	}
}
const calculator = new Calculator

const changeValueWithArrow = (e, keyPress) => {
	let el = e.target
	let strNum = el.value
	let twoDec = el.classList.contains('two-dec')
	let gap = twoDec ? 0.01 : 1
	const INCREASE = 'ArrowUp' || 'Up'
	const DECREASE = 'ArrowDown' || 'Down'
	let operation = keyPress === INCREASE ? 1 : -1

	let newValue = (parseFloat(strNum) + operation * gap)
	newValue = twoDec ? newValue.toFixed(2) : newValue

	switch (keyPress) {
		case INCREASE:
			strNum === '' ? el.value = '0' : el.value = newValue
			break
		case DECREASE:
			if (strNum > gap) { el.value = newValue }
			else if (strNum === gap) { el.value = '0' }
			else el.value = ''
			break
		default: break
	}
}

const allowKeyPressed = (keyPress, condition) => {
	const DIGITS = new RegExp(/\d/, 'g') // ? typing [0-9] in an array is lame. 🤪🤪🤪
	const MOVE_KEYS = ['ArrowLeft', 'Left', 'ArrowRight', 'Right', 'Backspace', 'Delete', 'Tab', 'Enter']
	const CHANGE_VALUE_ARROWS = ['ArrowUp', 'ArrowDown', 'Up', 'Down']
	const DECIMAL = ['.']

	switch (condition) {
		case 'change-value-arrows':
			return CHANGE_VALUE_ARROWS.includes(keyPress) ? true : false
		case 'no-decimal':
			return DIGITS.test(keyPress) || MOVE_KEYS.includes(keyPress) ? true : false
		case 'edit-only':
			return MOVE_KEYS.includes(keyPress) ? true : false
		case 'allowed-input':
			return DIGITS.test(keyPress) || MOVE_KEYS.concat(DECIMAL).includes(keyPress) ? true : false
		default: return false
	}
}

const inputChecker = inputElements.forEach(el => {
	const limitKeyPressed = el.addEventListener('keydown', (e) => {
		let keyPress = e.key
		let strNum = el.value
		let len = strNum.length
		let caretPosFromEnd = len - el.selectionStart
		let noDecimalElement = el === divisorElement

		let keyPressedNotAllowed = !allowKeyPressed(keyPress, 'allowed-input')
		let changeValueArrows = allowKeyPressed(keyPress, 'change-value-arrows')
		let decimalExists = strNum.includes('.') && !allowKeyPressed(keyPress, 'no-decimal')
		let wholeNumbersOnly = noDecimalElement && !allowKeyPressed(keyPress, 'no-decimal')
		let twoDecimalValueExists = strNum.charAt(len - 3) === '.' && caretPosFromEnd < 3 &&
			!allowKeyPressed(keyPress, 'edit-only')
		let zeroEntryPositionInvalid = strNum.charAt(0) === '0' && el.selectionStart === 1 &&
			keyPress !== '.' && !allowKeyPressed(keyPress, 'edit-only')

		if (changeValueArrows) {
			e.preventDefault()
			changeValueWithArrow(e, keyPress)
		}
		else if (keyPressedNotAllowed) {e.preventDefault()}
		else if (decimalExists ||	wholeNumbersOnly) {e.preventDefault()}
		else if (twoDecimalValueExists) {e.preventDefault()}
		else if (zeroEntryPositionInvalid) {
			e.preventDefault()
			// * subtle way of saying you did something wrong! 🤪🤪🤪
			el.selectionStart = 0
		}
	})
	const formatNumberAfterFocus = el.addEventListener('blur', (e) => {
		let strNum = el.value
		
		let intNum = parseFloat(strNum)
		if (isNaN(intNum)) {return}
		else {
			el.value = el === billElement ? currency.format(intNum) :
				intNum.toLocaleString('en-US')
		}
	})
	const reverseNumberFormattingOnFocus = el.addEventListener('focusin', (e) => {
		let strNum = el.value
		el.value = currency.reformat(strNum)
	})
})

const resetRateChosenClass = () => {
	tipRateElements.forEach(el => {
		if (el.matches('.chosen')) {
			el.classList.remove('chosen')
		}
	})
}

const RESET_ALL = resetButton.addEventListener('click', (e) => {
	/* Limits button executions 🤔🤔🤔
		 button is always clickable unless blocked by another element */
	if (e.target.classList.contains('active')) {
		e.target.classList.remove('active')
		billElement.value = ''
		divisor.value = ''
		tipRateCustomElement.value = ''
		resetRateChosenClass()
		calculator.clear()
		tipPerPerson.innerText = tipPerPersonInitial
		totalPerPerson.innerText = totalPerPersonInitial
	}
})

const activateResetButtonOrNot = () => {
	// * Naming things is hard! 🤪🤪🤪
	let calcValues = Object.values(calculator)
	let missingCalcValues = calcValues.map(el => {
		return (el === undefined || isNaN(el) || el === '') ? 1 : 0
	}).reduce((a, b) => a + b)

	if (missingCalcValues < calcValues.length) {
		resetButton.classList.add('active')
	} else {
		resetRateChosenClass()
		resetButton.classList.remove('active')
	}
}

const processData = (el, value, prop) => {
	/* - removed param with default value of false
		 - true is coded manually to tipRateElements
		 - param removal slows down computation but 
			 makes code more understandable. Maybe? 🤷‍♂️ */
	if (Array.from(tipRateElements).includes(el)) {
		resetRateChosenClass()
		el.classList.add('chosen')
	}
	let strNum = el[value]
	calculator[prop] = parseFloat(currency.reformat(strNum))
	calculator.compute()
	activateResetButtonOrNot()
}

const tipRateCheck = tipRateElements.forEach(el => {
	if (el.matches('button')) {
		el.addEventListener('click', (e) => {
			tipRateCustomElement.value = ''
			processData(e.target, 'innerText', 'rate')
		})
	}
	else if (el.matches('input')) {
		el.addEventListener('keyup', (e) => {
			processData(e.target, 'value', 'rate')
		})
	}
})

const billCheck = billElement.addEventListener('keyup', (e) => {
	processData(e.target, 'value', 'bill')
})

const divErrorHandler = (e) => {
	let el = e.target
	if (el.classList.contains('error')) {
		el.classList.remove('error')
		el.previousElementSibling.lastChild.remove()
	}
	if (el.value == 0 && el.value !== '') {
		let errorEl = document.createElement('span')
		let errMsg = ' Can\'t be zero'
		errorEl.classList.add('error-msg')
		errorEl.innerText = errMsg
		el.classList.add('error')
		el.previousElementSibling.appendChild(errorEl)
	}
}
const divisorCheck = divisorElement.addEventListener('keyup', (e) => {
	divErrorHandler(e)
	processData(e.target, 'value', 'divisor')
})

document.querySelector('.logo').addEventListener('click', () => {
	this.location.href = 'https://youtu.be/2xx_2XNxxfA'
})
