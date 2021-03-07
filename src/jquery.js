window.jQuery = function ( selector ) {
	return new jQuery.fn.init( selector )
}

let version = "0.1.0"

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	addClass: function ( name ) {
		if (!name) return this

		Array.isArray(name) ? this[0].classList.toggle(...name) : this[0].classList.add(name)

		return this
	},
	append: function ( append ) {
		if (!append) return this

		if (typeof append == "string") {
			let template = document.createElement("template")
			template.innerHTML = append
			append = template.content.firstChild
		} else if (append[0]?.nodeType) append = append[0]

		if (!append.nodeType) return this

		this.each((i, el) => el.appendChild(append))

		return this
	},
	attr: function ( name, value ) {
		if (!name) return this
		if (!value) return this[0]?.getAttribute(name) ?? undefined

		this.each((i, el) => el.setAttribute(name, value))

		return this
	},
	children: function ( selector ) {
		console.log(selector)

		let array = []
		this.each((i, el) => array.push(...el.querySelectorAll(`:scope > ${selector && typeof selector == "string" ? selector : "*"}`)))

		return new jQuery.fn.init(array)
	},
	css: function ( name, value ) {
		if (!name || typeof name != "string") return this
		if (!value || typeof value != "string") return window.getComputedStyle(this[0])?.getPropertyValue(name)

		this.each((i, el) => el.setAttribute("style", `${name}: ${value}`))

		return this
	},
	data: function ( name, value ) {
		if (!name) return this
		if (!value) return this.attr(`data-${name}`)

		this.attr(`data-${name}`, value)

		return this
	},
	each: function ( callback ) {
		if (typeof callback != "function") throw new Error(`${typeof callback} is not a function`)

		for (let i = 0; i < this.length; i++) {
			callback(i, this[i])
		}
	},
	eq: function ( index ) {
		if (isNaN(+index) || +index % 1) return this

		index = index < 0 ? this.length + index : index
		return new jQuery.fn.init(this[index])
	},
	filter: function ( callback ) {
		if (typeof callback != "function") return this

		let array = []
		this.each((i, el) => callback(i, el) ? array.push(el) : 0)

		return new jQuery.fn.init(array)
	},
	find: function ( selector ) {
		if (!selector) return this

		let array = []
		this.each((i, el) => array.push(...el.querySelectorAll(selector)))

		return new jQuery.fn.init(array)
	},
	hasClass: function ( name ) {
		if (!name || typeof name != "string") return false

		return this[0].classList.contains(name)
	},
	is: function ( selector ) {
		if (!selector || !this[0]) return false

		let el = this[0]
		try {
			return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector)
		} catch { return false }
	},
	first: function () {
		return this.eq(0)
	},
	last: function () {
		return this.eq(-1)
	},
	on: function ( event, callback ) {
		if (typeof event != "string" || typeof callback != "function") return this

		this.each((i, el) => el.addEventListener(event, callback))

		return this
	},
	parent: function ( selector ) {
		if (selector) console.warn(".parent() is still under development")

		let array = []
		this.each((i, el) => array.push(el.parentNode))
		array = array.filter((el, i) => array.indexOf(el) == i)

		return new jQuery.fn.init(array)
	},
	prop: function ( prop, value ) {
		if (!prop || typeof prop != "string") return this
		if (value == undefined) return this[0]?.[prop] ?? undefined

		this.each((i, el) => el[prop] = value)

		return this
	},
	remove: function () {
		this.each((i, el) => el.remove())
	},
	removeAttr: function ( name ) {
		if (!name) return this

		this.each((i, el) => el.removeAttribute(name))
	},
	removeClass: function ( name ) {
		if (!name) return this

		Array.isArray(name) ? this[0].classList.toggle(...name) : this[0].classList.remove(name)

		return this
	},
	splice: Array.prototype.splice,
	toggleClass: function ( name ) {
		if (!name) return this

		Array.isArray(name) ? this[0].classList.toggle(...name) : this[0].classList.toggle(name)

		return this
	},
	jQuery: version
}

jQuery.fn.init = function ( selector ) {
	if (!selector) return this
	if (selector.jQuery == version) return selector

	if (typeof selector != "string" && !Array.isArray(selector)) return this
	if (typeof selector == "string" && /^<.+>$/.test(selector)) {
		let template = document.createElement("template")
		template.innerHTML = selector

		selector = template.content.firstChild
	}

	if (selector.nodeType) {
		this[0] = selector
		this.length = 1
		return this
	}

	if (Array.isArray(selector) && selector.filter(el => !el.nodeType).length) return this

	let array = (Array.isArray(selector)) ? selector : document.querySelectorAll( selector.trim() )
	this.length = array.length
	array.forEach((el, i) => this[i] = el)

	return this
}

jQuery.fn.init.prototype = jQuery.fn

window.$ = window.jQuery
