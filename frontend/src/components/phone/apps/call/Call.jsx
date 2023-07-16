import React from 'react'
import $ from 'jquery'
import func from '../../../../modules/func'
import ragemp from '../../../../modules/ragemp'

import './call.css'

import { HiOutlineMenuAlt3 } from 'react-icons/hi'
import { HiBackspace } from 'react-icons/hi'
import { IoCall } from 'react-icons/io5'

export default function Call(props) {
	const [ fastContacts, setFastContacts ] = React.useState([
		{ avatar: 'https://cdn-icons-png.flaticon.com/512/1417/1417847.png', name: 'Полиция', number: 91101 },
		{ avatar: 'https://cdn-icons-png.flaticon.com/512/2382/2382461.png', name: 'Скорая помощь', number: 91102 },
		{ avatar: 'https://cdn-icons-png.flaticon.com/512/1040/1040655.png', name: 'Такси', number: 11777 },
		{ avatar: 'https://cdn-icons-png.flaticon.com/512/9978/9978328.png', name: 'Механик', number: 11555 }
	])
	const [ contacts, setContacts ] = React.useState([
		{ avatar: './assets/phone/avatars/none.png', name: 'Джеральд', number: 215938291 },
		{ avatar: './assets/phone/avatars/none.png', name: 'Nezuko Kamado', number: 9999 },
		{ avatar: './assets/phone/avatars/none.png', name: 'Nezuko Kun', number: 618887777 }
	])

	const [ number, setNumber ] = React.useState('')
	function submit() {
		if(!number.length)return
		ragemp.send('ui::phone:call', { number: number })
	}


	const [ fastContactsHide, setFastContactsHide ] = React.useState(false)
	const [ fastContactsHideS, setFastContactsHideS ] = React.useState(false)
	const [ contactsHide, setContactsHide ] = React.useState(false)

	const [ context, setContext ] = React.useState(false)
	function addContact() {
		ragemp.trigger('client::phone:contacts', 'setAdd', {
			status: true,
			number
		})
		props.openApp(1)
	}
	function goMessenger() {
			
	}

	React.useEffect(() => {
		ragemp.eventCreate('client::phone:call', (cmd, data) => {
			switch(cmd) {
				case 'setNumber': {
					setNumber(data.number.toString())
					break
				}
				case 'setContacts': {
					setContacts(data)
					break
				}
			}
		})
	}, [])

	return (
		<div className="phone-app-B phone-app-call">
			<div className="phone-app-call-search">
				<div className={`phone-app-call-search-elem ${fastContactsHide === true && !fastContactsHideS && 'phone-app-call-search-elem-hide'}`}>
					<h1 onClick={() => {
						if(fastContactsHide === true && !fastContactsHideS) {
							setFastContactsHideS(true)
						}
						if(fastContactsHideS === true) setFastContactsHideS(false)

						setFastContactsHide(!fastContactsHide)
					}}>Быстрый набор</h1>
					<section>
						{fastContacts.map((item, i) => {
							return (<div onClick={() => setNumber(item.number.toString())} key={i} className="phone-app-call-search-elem-item">
									<div className="phone-avatar">
										<img src={item.avatar} />
									</div>
									<h2>
										{item.name}
										<span>{func.formatPhoneNumber(item.number)}</span>
									</h2>
								</div>)	
						})}
					</section>
				</div>
				<div className={`phone-app-call-search-elem ${contactsHide === true && 'phone-app-call-search-elem-hide'}`} style={{display: !number.length ? 'none' : 'block'}}>
					<h1 onClick={() => setContactsHide(!contactsHide)}>Подходящие контакты</h1>
					<section>
						{contacts.map((item, i) => {
							return (<div onClick={() => setNumber(item.number.toString())} key={i} className="phone-app-call-search-elem-item">
									<div className="phone-avatar">
										<img src={item.avatar} />
									</div>
									<h2>
										{item.name}
										<span>{func.formatPhoneNumber(item.number)}</span>
									</h2>
								</div>)	
						})}
					</section>
				</div>
			</div>
			<div className="phone-app-call-number">
				<div className="phone-app-call-number-text">
					<button onClick={() => setContext(!context)}>
						<HiOutlineMenuAlt3 />
						{context === true ? (
							<div className="phone-app-call-number-text-context">
								<h1 onClick={() => addContact()}>В контакты</h1>
								<h1 onClick={() => goMessenger()}>Сообщение</h1>
							</div>
						) : ''}
					</button>
					<h1>{number}</h1>
					<button>
						<HiBackspace onClick={() => {
							if(!number.length)return

							ragemp.send('ui::phone:call:number', { number: number.substr(0, number.length - 1) }, true)
							setNumber(number.substr(0, number.length - 1))

							if(number.length === 1) {
								setFastContactsHide(false)
								setFastContactsHideS(false)
							}
						}} />
					</button>
				</div>
				<div className="phone-app-call-number-body">
					{new Array(12).fill(0).map((item, i) => {
						return (<section onClick={() => {
							if(number.length >= 10)return
							if(i === 10 && !number.length)return

							let temp = number

							if(i === 9) temp += '*'
							else if(i === 10) temp += '0'
							else if(i === 11) temp += '#'
							else temp += i + 1

							setNumber(temp)
							if(!fastContactsHideS) setFastContactsHide(true)

							ragemp.send('ui::phone:call:number', { number: temp }, true)
						}} key={i}>{i === 9 ? '*' : i === 10 ? '0' : i === 11 ? '#' : i + 1}</section>)
					})}
				</div>
				<div className="phone-app-call-number-submit">
					<button onClick={() => submit()}>
						<IoCall />
					</button>
				</div>
			</div>
		</div>
	)
}