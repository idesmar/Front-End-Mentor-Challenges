// const log = console.log

const billElement = document.querySelector('#bill')
const tipRateElements = document.querySelectorAll('.tip-rate')
const tipRateCustomElement = document.querySelector('#custom-rate')
const divisorElement = document.querySelector('#divisor')

const tipPerPerson = document.querySelector('.tip-per-person')
const TIP_PER_PERSON_INITIAL = tipPerPerson.innerText

const totalPerPerson = document.querySelector('.total-per-person')
const TOTAL_PER_PERSON_INITIAL = totalPerPerson.innerText

const resetButton = document.querySelector('.reset')

const inputElements = document.querySelectorAll('input')
const dashboardSegment = document.querySelectorAll('.dash-seg')


const DEC = '.'
const SEP = ','

// add separator (SEP)
const mask = (num) => {
	let output = []
	let wholeNum = num
	let decNum = ''

	if (num.includes(DEC)) {
		wholeNum = num.slice(0, num.indexOf(DEC))
		decNum = num.slice(num.indexOf(DEC))
	}

	let len = wholeNum.length
	for (let i = 0; i < len; i++) {
		if (i !== 0 && (len - i) % 3 === 0) {
			output.push(SEP)
		}
		output.push(wholeNum[i])
	}
	return output.join('').concat(decNum)
}

// filter non numerical characters
const unmask = (num, wholeNumberOnly = false) => {
	let output = []
	let numRE = new RegExp(/\d|\./)

	if (wholeNumberOnly) { // wholeNumberOnly === true
		output = num.replaceAll(/[^\d]/g, '')
	} else {
		for (let i = 0; i < num.length; i++) {
			let char = num.charAt(i)
			if (numRE.test(char) === true) {
				// remove excess decimal
				char === DEC && output.includes(DEC) ?
					output.push("") : output.push(char)
			}
		}
		output = output.join("")

		/* removes decimal numbers beyond 2 places
			 note: length > 3 allows output = .xx  */
		if (output.includes(DEC) && output.length > 3) {
			output = output.slice(0, output.indexOf(DEC) + 3)
		}
	}

	// removes leading 0
	if (output.indexOf(0) === 0 && output.length > 1) {
		let firstNonZeroIndex = Array.from(output).findIndex((a) => a > 0)

		if (output.charAt(1) === DEC) {
			// do nothing
		} else { output = output.slice(firstNonZeroIndex) }
	}

	return output
}


class Currency {
	format(num) {
		/* fallback if type of num is !number
			 side note: argument = value; parameter = variable */
		if (typeof num !== 'number') {
			alert(`Attempting to parse ${typeof num}`)
			num = parseFloat(unmask(num))
		}

		let newNum = num.toLocaleString('en-US')
		let len = newNum.length
		let decimalPlaces = (() => {
			if (newNum.includes(DEC)) { return len - newNum.indexOf(DEC) - 1 }
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
		// possibly a redundant function but lazy is strong 🤪🤪🤪
		return num.includes(SEP) ? num.replaceAll(SEP, '') : num
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
			/* 💸💸💸 It's better to pay more, than pay less! But not too much!
			sample {bill: 105.10} * {tip-rate: 10} / {divisor: 5} = 210.2
			return Math.ceil(210.2) = 211 / 100 = 2.11 tipPerPerson */
			let computedVal = Math.ceil(num) / 100
			return ('$').concat(currency.format(computedVal))
		}

		if (this.bill > 0 && this.rate > 0 && this.divisor > 0) {
			let tipPerPersonFormula = (this.bill * this.rate) / this.divisor
			tipPerPerson.innerText = roundUpToCent(tipPerPersonFormula)

			let totalPerPersonFormula = this.bill * (100 + this.rate) / this.divisor
			totalPerPerson.innerText = roundUpToCent(totalPerPersonFormula)

		} else {
			tipPerPerson.innerText = TIP_PER_PERSON_INITIAL
			totalPerPerson.innerText = TOTAL_PER_PERSON_INITIAL
		}
	}
}
const calculator = new Calculator



const adjustFont = () => {
	dashboardSegment.forEach(el => {
		let resultEl = el.lastElementChild
		/* reset required for font classes to trigger
			 animation every time a calculation is made */
		if (el.classList.contains('stacked')) {
			el.classList.remove('stacked')
		}
		if (resultEl.classList.contains('min-font')) {
			resultEl.classList.remove('min-font')
		} else {
			resultEl.classList.remove('norm-font')
		}

		// evaluate which font class to add
		if (tipPerPerson.innerText.length > 7) {
			el.classList.add('stacked')
		}
		if (totalPerPerson.innerText.length > 11) {
			resultEl.classList.add('min-font')
		} else {
			resultEl.classList.add('norm-font')
		}
	})
}


const divisorErrorHandler = () => {
	let el = divisorElement
	// reset
	if (el.classList.contains('error')) {
		el.classList.remove('error')
		el.previousElementSibling.lastChild.remove()
	}
	// evaluate
	if (el.value == 0 && el.value !== '') {
		let errorEl = document.createElement('span')
		errorEl.classList.add('error-msg')
		errorEl.innerText = ' Can\'t be zero'
		el.classList.add('error')
		el.previousElementSibling.appendChild(errorEl)
	}
}
const divisorErrorFinder = divisorElement.addEventListener('input', divisorErrorHandler)


const resetRateChosenClass = () => {
	tipRateElements.forEach(el => {
		if (el.matches('.chosen')) {
			el.classList.remove('chosen')
		}
	})
}

const RESET_ALL = resetButton.addEventListener('click', (e) => {
	/* Limits button executions 🤔🤔🤔
		 button always clickable unless blocked by non-clickable
		 element which I am too lazy to add 🤪🤪🤪 */
	if (e.target.classList.contains('active')) {
		e.target.classList.remove('active')
		billElement.value = ''
		divisor.value = ''
		tipRateCustomElement.value = ''
		divisorErrorHandler()
		resetRateChosenClass()
		calculator.clear()
		tipPerPerson.innerText = TIP_PER_PERSON_INITIAL
		totalPerPerson.innerText = TOTAL_PER_PERSON_INITIAL
		adjustFont()
	}
})


document.querySelector('.logo').addEventListener('click', () => {
	this.location.href = 'https://youtu.be/2xx_2XNxxfA'
})


const activateResetButtonOrNot = () => {
	// * Naming things is hard! 🤪🤪🤪
	let calcValues = Object.values(calculator)
	let emptyCalcValues = calcValues.map(el => {
		return (el === undefined || isNaN(el) || el === '') ? 1 : 0
	}).reduce((a, b) => a + b)

	if (emptyCalcValues < calcValues.length) {
		resetButton.classList.add('active')
	} else {
		resetRateChosenClass()
		resetButton.classList.remove('active')
	}
}

const processData = (el) => {
	if (Array.from(tipRateElements).includes(el)) {
		resetRateChosenClass()
		el.classList.add('chosen')
	}

	let strNum = el.matches('button') ? el.innerText : el.value

	let prop
	switch (el.classList[0]) {
		case 'bill':
			prop = 'bill'
			break;
		case 'tip-rate':
			prop = 'rate'
			break
		case 'divisor':
			prop = 'divisor'
			break
		default:
			alert(`ERROR on processData! ${classList[0]} not in selection!`)
			break
	}

	calculator[prop] = parseFloat(currency.reformat(strNum))

	activateResetButtonOrNot()
	calculator.compute()
	adjustFont()
}

const changeValueWithArrow = (el, keyPress) => {
	const INCREASE = 'ArrowUp' || 'Up'
	const DECREASE = 'ArrowDown' || 'Down'
	let strNum = el.value
	strNum = strNum !== '' ? currency.reformat(strNum) : '0'

	let twoDec = el.classList.contains('two-dec')
	let gap = twoDec ? 0.01 : 1
	let operation = keyPress === INCREASE ? 1 : -1

	// operation * gap: toggle(add/subtract)
	let changedValue = (parseFloat(strNum) + operation * gap)
	changedValue = twoDec ? changedValue.toFixed(2) : changedValue.toString()
	changedValue = mask(changedValue) // * TEST REMOVAL

	switch (keyPress) {
		case INCREASE:
			strNum === '' ? el.value = '0' : el.value = changedValue
			break
		case DECREASE:
			if (strNum > gap) { el.value = changedValue }
			else if (strNum === gap) { el.value = '0' }
			else el.value = ''
			break
		default:
			alert(`${keyPress} Error! Cannot change value!`)
			break
	}

	if (el === divisorElement) {
		divisorErrorHandler()
	}
	processData(el)
}



// * SOURCE: https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
let hasTouchScreen = false
if ("maxTouchPoints" in navigator) {
	hasTouchScreen = navigator.maxTouchPoints > 0
} else if ("msMaxTouchPoints" in navigator) {
	hasTouchScreen = navigator.msMaxTouchPoints > 0
} else {
	let mQ = window.matchMedia && matchMedia("(pointer:coarse)")
	if (mQ && mQ.media === "(pointer:coarse)") {
		hasTouchScreen = !!mQ.matches
	} else if ('orientation' in window) {
		hasTouchScreen = true // deprecated, but good fallback
	} else {
		// Only as a last resort, fall back to user agent sniffing
		let UA = navigator.userAgent
		hasTouchScreen = (
			/\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
			/\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
		)
	}
}


// * GLOBAL variables --------------------
let oldValue
let oldCursor
let newValue
let newCursorPosition
let newCursorPosition_
// * -------------------------------------

const setValueAndCursor = (el) => {
	el.value = newValue

	let setCursor = !hasTouchScreen ? newCursorPosition : newCursorPosition_
	setCursor = setCursor === -1 ? 0 : setCursor
	el.setSelectionRange(setCursor, setCursor)

	processData(el)
}


const keydownHandler = (e) => {
	let el = e.target
	let keyPress = e.key
	let changeValueArrows = ['ArrowUp', 'Up', 'ArrowDown', 'Down']
	if (changeValueArrows.includes(keyPress)) {
		e.preventDefault()
		el.removeEventListener('input', inputHandler)
		changeValueWithArrow(el, keyPress)
		el.addEventListener('input', inputHandler)
	} else if (keyPress === 'Enter') {
		e.preventDefault()
		el.blur()
	} else {
		oldCursor = el.selectionStart
		oldValue = el.value
	}
}


// * GLOBAL variables --------------------
const BILL_LIMIT = /^\d{0,8}$/g	// 8 wholeNumber digits
const RATE_LIMIT = /^\d{0,3}$/g // 3 wholeNumber digits
const DIVISOR_LIMIT = /^\d{0,6}$/g // 6 wholeNumber digits
let limitRE
let wholeNumGlobal
let DECkeyPressed = false // will be based on Event.data
// * -------------------------------------


// works best on desktop
const inputHandler = (e) => {
	let el = e.target

	DECkeyPressed = e.data === DEC ? true : false
	newValue = el === divisorElement ?
		unmask(el.value, wholeNumberOnly = true) :
		unmask(el.value)

	wholeNumGlobal = newValue.includes(DEC) ? newValue.slice(0, newValue.indexOf(DEC)) : newValue
	switch (el) {
		case billElement:
			limitRE = BILL_LIMIT
			break
		case tipRateCustomElement:
			limitRE = RATE_LIMIT
			break
		case divisorElement:
			limitRE = DIVISOR_LIMIT
			break
		default:
			alert(`How did you get ${el} here?`)
			break
	}

	if (!!wholeNumGlobal.match(limitRE)) {
		newValue = mask(newValue)
		oldValue !== undefined ? oldValue : oldValue = ''

		let lenChange = newValue.length - oldValue.length

		if (DECkeyPressed && oldValue.includes(DEC)) {
			newValue = oldValue
			newCursorPosition = oldCursor
		} else if (lenChange === 0 && oldValue.includes(DEC) && oldCursor > oldValue.indexOf(DEC)) {
			newCursorPosition = oldCursor + 1
		} else if (lenChange === 0 && oldValue.charAt(oldCursor - 1) === SEP) {
			newValue = oldValue.slice(0, oldCursor - 2).concat(oldValue.slice(oldCursor))
			newValue = mask(unmask(newValue))
			newCursorPosition = oldCursor - 2
		} else {
			newCursorPosition = oldCursor + lenChange
		}
		setValueAndCursor(el)
	} else {
		el.value = oldValue
		el.setSelectionRange(oldCursor, oldCursor)
	}
}

// works best on mobile
const keyupHandler = (e) => {
	let el = e.target

	// el.value has been formatted by inputHandler based on event ORDER
	let newValue_ = el.value

	if (!!wholeNumGlobal.match(limitRE)) {
		oldValue !== undefined ? oldValue : oldValue = ''
		let lenChange_ = newValue_.length - oldValue.length

		if (DECkeyPressed && oldValue.includes(DEC)) {
			newCursorPosition_ = oldCursor
			DECkeyPressed = false // * reset for future use
		} else if (lenChange_ === 0 && oldValue.includes(DEC) && oldCursor > oldValue.indexOf(DEC)) {
			newCursorPosition_ = oldCursor + 1
		} else if (lenChange_ === 0 && oldValue.charAt(oldCursor - 1) === SEP) {
			newValue_ = oldValue.slice(0, oldCursor - 2).concat(oldValue.slice(oldCursor))
			newCursorPosition_ = oldCursor - 2
		} else {
			newCursorPosition_ = oldCursor + lenChange_
		}
		setValueAndCursor(el)
	} else {
		el.value = oldValue
		el.setSelectionRange(oldCursor, oldCursor)
	}
}


const formatOnChange = (e) => {
	let el = e.target
	let displayNum = el.value

	if (displayNum !== '' && displayNum !== DEC) {
		switch (el) {
			case billElement:
				el.value = currency.format(parseFloat(unmask(displayNum)))
				break
			case tipRateCustomElement:
				el.value = parseFloat(unmask(displayNum)).toLocaleString('en-US')
				break
			case divisorElement:
				el.value = displayNum
				break
			default:
				el.value = ''
				break
		}
	} else { el.value = '' }
}

const checkAllInputs = inputElements.forEach(el => {
	// ORDER of Events: keydown > input > keyup
	el.addEventListener('keydown', keydownHandler)
	el.addEventListener('input', inputHandler)
	if (hasTouchScreen) { // * setting cursor location on mobile
		el.addEventListener('keyup', keyupHandler)
	}
	el.addEventListener('change', formatOnChange)
})

const getTipRateButtonValues = tipRateElements.forEach(el => {
	if (el.matches('button')) {
		el.addEventListener('click', (e) => {
			tipRateCustomElement.value = ''
			processData(el)
		})
	}
})


/*
	performance faster (from 40's to 80's) with animation at end
	compared to located at start. setTimeout also delays other
	procedures after it.
*/
const simpleAnim = () => {
	document.querySelector('.main-cont').classList.toggle('simple-anim')
}
const animationAfterLoading = window.addEventListener('load', simpleAnim)
const removeAnimationAfterDelay = window.setTimeout(simpleAnim, 3000)

/*
	Safari Web Browser

	iPad
	- adding dec to val with existing dec, cursor moves to 0 index

	iPhone
	Tel-pad has no decimal
*/