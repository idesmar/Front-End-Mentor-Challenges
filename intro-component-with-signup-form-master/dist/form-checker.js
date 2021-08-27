
const validateForm = document.getElementById('trialForm')

validateForm.addEventListener('submit', (e) => {
	const inputCollection = document.getElementsByTagName('input')
	let err = 0

	for (let i = 0; i < inputCollection.length; i++) {
		let input = inputCollection[i]
		let hasErr = input.classList.contains('error-input')
		let inputLabel = ''

		if (hasErr) {
			resetFunc(input, 'remove')
		}

		if (input.value === '') {
			inputLabel = input.nextElementSibling.innerText
			let = errMsg = `${inputLabel} cannot be empty`

			addErrAlert(input, 'add', errMsg)
			err++
		}
		else if (input.type === 'email') {
			let invalid = !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input.value)
			// let invalid = !email.checkValidity() // check https://caniuse.com/form-validation

			if (invalid) {
				errMsg = 'Looks like this is not a valid email'
				addErrAlert(input, 'add', errMsg)
				err++
			}
		}
	}

	if (err !== 0) {
		e.preventDefault()
	}
})


const resetFunc = (me, remove) => {
	classToggler(me, remove)
	me.parentElement.lastElementChild.remove()
}

const classToggler = (me, change) => {
	me.parentElement.classList[change]('error-icon')
	me.nextElementSibling.classList[change]('error-found')
	me.classList[change]('error-input')
}

const addErrAlert = (me, add, msg) => {
	classToggler(me, add)
	let errDiv = document.createElement('div')
	errDiv.innerText = msg
	errDiv.classList.toggle('error-msg')
	me.parentElement.appendChild(errDiv)
}
