import React from 'react'
import $ from 'jquery'

export default function Dialog(props) {
	let btn = props.btn

	let input = props.input
	let inputType = props.inputType

	let callback = props.callback

	if(!btn) btn = ['Закрыть']

	if(!input) input = []
	if(!inputType) inputType = []

	if(!callback) callback = () => {}

	function getInputValue() {
		const value = []
		$('#menuDialog input').each((i, item) => {
			value.push($(item).val())
		})

		return value
	}

	return (
		<div id="menuDialog">
			<div className="menuDialog-wrap">
				<section className="menuDialog-body">
					<h1 dangerouslySetInnerHTML={{__html: props.text}}></h1>
					{input.map((item, i) => {
						return (<input type={inputType[i] || 'text'} placeholder={item} />)
					})}
				</section>
				<section className="menuDialog-btn">
					{btn.map((item, i) => {
						return (<button onClick={() => callback(item, getInputValue())} key={i} className="btn">{item}</button>)
					})}
				</section>
			</div>
		</div>
	)
}