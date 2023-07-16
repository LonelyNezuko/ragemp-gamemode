import React from 'react'
import $ from 'jquery'
import ragemp from '../../modules/ragemp'

import './dialog.css'

export default function Dialog() {
	const [ dialog, setDialog ] = React.useState({
		title: '',
		body: {
			text: 'Введите ваш возраст',
			input: false,
			list: ['Стандарт', 'Дом', 'Фракция']
		},
		btn: ['', '']
	})

	function submit(type, listItem) {
		console.log('submit ' + type, listItem)
		setDialog({
			title: '',
			body: {
				text: '',
				input: false,
				list: []
			},
			btn: ['', '']
		})
	}

	React.useEffect(() => {
		$('body').keydown(e =>
		{
			if($('.dialog').css('display') !== 'none'
				&& e.keyCode === 13
				&& !dialog.body.list.length) {
				e.preventDefault()
				submit(0)
			}
			if($('.dialog').css('display') !== 'none'
				&& e.keyCode === 27) {
				e.preventDefault()
				submit(1)
			}
		})

		ragemp.eventCreate('client::dialog', (cmd, data) => {
            switch(cmd)
            {
                case 'dialog':
                {
                    setDialog({
						title: !data.title && '',
						body: {
							text: !data.text && '',
							input: !data.input && false,
							list: !data.list && []
						},
						btn: !data.btn && ['', '']
					})
                    break
                }
            }
        })
	}, [])

	return (
		<div className="dialog" style={!dialog.title.length ? {display: 'none'} : {display: 'block'}}>
			<header className="dialog-header" style={dialog.title === 'title' ? {display: 'none'} : {display: 'block'}}>{dialog.title}</header>
			<div className="dialog-body">
				<div style={!dialog.body.list.length ? {display: 'none'} : {display: 'block'}} className="dialog-body-choice">
					{dialog.body.list.map((item, i) => {
						return (<section onClick={() => submit(0, item)} key={i} data-str={item}>{item}</section>)
					})}
				</div>

				<div style={dialog.body.input === false ? {display: 'none'} : {display: 'block'}} className="dialog-body-input">
					<h1 dangerouslySetInnerHTML={{__html: dialog.body.text}}></h1>
					<input type="text" placeholder="" />
				</div>

				<div style={dialog.body.input !== false || dialog.body.list.length ? {display: 'none'} : {display: 'block'}} className="dialog-body-text">
					<h1 dangerouslySetInnerHTML={{__html: dialog.body.text}}></h1>
				</div>
			</div>
			<div className="dialog-btn" style={!dialog.btn[0].length && !dialog.btn[1].length ? {display: 'none'} : {display: 'block'}}>
				<button style={!dialog.btn[0].length ? {display: 'none'} : {display: 'block'}} className="btn" onClick={() => submit(0)}>{dialog.btn[0]}</button>
				<button style={!dialog.btn[1].length ? {display: 'none'} : {display: 'block'}} className="btn" onClick={() => submit(1)}>{dialog.btn[1]}</button>
			</div>
		</div>
	)
}