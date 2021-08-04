// ? reference: https://wpbeaches.com/create-expandcollapse-faq-accordion-collapse-click/

// * show only one and hide others
// event listener DOMContentLoaded -- does not require whole page to load
// document.addEventListener("DOMContentLoaded", function (e) {

const queryCollection = document.getElementsByClassName("query");
const answerCollection = document.getElementsByClassName('answer');

for (let i = 0; i < queryCollection.length; i++) {
	queryCollection[i].onclick = function () {
		// will return True if element does NOT have .active class
		let toActivate = !this.classList.contains('active');

		// remove .active and .show classes on all elements
		resetClass(queryCollection, 'active');
		resetClass(answerCollection, 'show');

		// add .active and .show class based on isActive
		if (toActivate) {
			this.classList.add("active");
			// answerCollection[i].classList.toggle("show");
			answerCollection[i].classList.add("show");
		}
	}
}

// function to remove .active and .show class
const resetClass = (el, className) => {
	for (let i = 0; i < el.length; i++) {
		el[i].classList.remove(className)
	}
}

// });


// show-hide independently
// for (let i = 0; i < queryElement.length; i++) {
//     queryElement[i].onclick = function(){
//         this.classList.toggle("active");
//         this.nextElementSibling.classList.toggle("show");
// 	};
// }