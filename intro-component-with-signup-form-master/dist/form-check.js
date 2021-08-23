
// form on submit event listener

const btn = document.getElementsByClassName('button')

// btn click event for testing
btn[0].onclick = function () {

	const inputColl = document.getElementsByTagName('input')
	// let ret = 0

	for (let i = 0; i < inputColl.length; i++) {
		let input = inputColl[i]
		let hasErr = input.parentElement.classList.contains('error-icon')
		let inputLabel = ''

		if (hasErr) {
			resetFunc(input, 'remove')
		}

		if (input.value === '') {
			inputLabel = input.nextElementSibling.innerText
			let = errMsg = `${inputLabel} cannot be empty`

			errorAlert(input, 'add', errMsg)
			ret++
		}
		else if (input.type === 'email') {
			let invalid = !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input.value)
			// let invalid = !email.checkValidity() // check https://caniuse.com/form-validation

			if (invalid) {
				errMsg = 'Looks like this is not a valid email'
				errorAlert(input, 'add', errMsg)
				ret++
			}
		}
	}

	// if (ret === 0) {
	// 	console.log(true)
	// 	return true
	// }
	// else {
	// 	console.log(false)
	// 	return false
	// }
}

const classToggler = (me, change) => {
	me.parentElement.classList[change]('error-icon')
	me.nextElementSibling.classList[change]('error-found')
	me.classList[change]('error-input')
}

const resetFunc = (me, remove) => {
	classToggler(me, remove)
	me.parentElement.lastElementChild.remove()

	// me.parentElement.nextElementSibling.remove()
}

const errorAlert = (me, add, msg) => {
	classToggler(me, add)
	let errDiv = document.createElement('div')
	errDiv.innerText = msg
	errDiv.classList.toggle('error-msg')
	me.parentElement.appendChild(errDiv)

	// ? buggy code below
	// me.parentElement.insertAdjacentHTML('afterend', errDiv)
}
