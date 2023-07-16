import React from 'react'
import $ from 'jquery'

import ragemp from '../../../modules/ragemp'
import func from '../../../modules/func'
import random from '../../../modules/random'

import BTNKey from '../../../modules/btnKey'
import Checkmark from '../../../modules/checkmark'

import Dialog from '../_modules/Dialog'

import './settings.css'

import { AiOutlineArrowLeft } from 'react-icons/ai'
import { AiOutlineArrowRight } from 'react-icons/ai'

import { FaExternalLinkAlt } from 'react-icons/fa'
import { MdOutlineReportGmailerrorred } from 'react-icons/md'

import { SlSocialVkontakte } from 'react-icons/sl'

export default function Settinsg(props) {

	// Key binds
	const [ keyBinds, setKeyBinds ] = React.useState([
		{ id: 'inventory', key: 'I', keyCode: 78, name: 'Инвентарь', desc: 'Открыть инвентарь' },
		{ id: 'menu', key: '', keyCode: 75, name: 'Меню', desc: 'Открыть меню' },
		{ id: 'hints', key: 'F9', keyCode: 123, name: 'Подсказки', desc: 'Скрыть подсказки клавиш' }
	])
	const [ keyBindsSel, setKeyBindsSel ] = React.useState(-1)
	const banKeys = [ 112, 91, 93, 44, 145, 19, 13, 87, 65, 83, 68 ]



	// Chat
	const [ chat, setChat ] = React.useState([ 450, 250, 13, 'Open Sans', 4, 7 ])
	const chatValues = [
		[ 300, 550, 'Ширина' ],
		[ 150, 370, 'Высота' ],
		[ 9, 18, 'Размер текста' ],
		[ [ 'Open Sans', 'Akrobat', 'Avenir', 'Chalen', 'Gilroy' ], 0, 'Шрифт' ],
		[ 2, 8, 'Отступ между строками' ],
		[ 4, 12, 'Отступ между тегом' ]
	]
	const [ chatBorder, setChatBorder ] = React.useState(false)
	function chatChangeValue(slot, type = false) {
		const tempChat = JSON.parse($('.menu-settings .menu-settings-root-chat').attr('data-chat'))
		if(slot === 3) {
			const family = chatValues[slot][0].indexOf(chat[slot])
			if(family === -1)return

			if(family > 0
				&& !type) tempChat[slot] = chatValues[slot][0][family - 1]
			if(family < chatValues[slot][0].length - 1
				&& type === true) tempChat[slot] = chatValues[slot][0][family + 1]
		}
		else {
			if(chat[slot] > chatValues[slot][0]
				&& !type) {
				if(slot < 2) tempChat[slot] -= 10
				else tempChat[slot] -= 1
			}
			if(chat[slot] < chatValues[slot][1]
				&& type === true) {
				if(slot < 2) tempChat[slot] += 10
				else tempChat[slot] += 1
			}
		}

		setChat(tempChat)
		ragemp.send('ui::menu:settings:saveChat', tempChat)
	}



	// Link email
	const [ emailCode, setEmailCode ] = React.useState(0)
	const [ emailTimer, setEmailTimer ] = React.useState(0)

	function emailCodeDialog(item, input) {
		if(item === 'Не нужно') setEmailCode(0)
		else {
			if(!input[0].length)return
			if(input[0] !== emailCode)return ragemp.trigger('client::notify', 'add', { text: 'Не верный код', type: 'error' })

			setEmailCode(0)
			const email = $('.menu .menu-settings #menuSettingsElemEmail input').val()

			if(!email.length)return ragemp.trigger('client::notify', 'add', { text: 'Введите Email', type: 'error' })
			if(!func.validateEmail(email))return ragemp.trigger('client::notify', 'add', { text: 'Не верный Email.', type: 'error' })

			ragemp.send('ui::menu:settings:setEmail', { email })
		}
	}
	function returnHideEmail() {
		let email = ''
		const index = props.accountData.email.indexOf('@')

		props.accountData.email.split('').map((item, i) => {
			if(i < 2) email += item
			else if(i >= index) email += item
			else email += '*'
		})

		return email
	}


	// Change password
	const [ changePassword, setChangePassword ] = React.useState(false)
	function changePasswordDialog(item, input) {
		if(item === 'Изменить пароль') {
			if(!input[0].length || !input[1].length || !input[2].length)return
			if(input[1] !== input[2])return ragemp.trigger('client::notify', 'add', { text: 'Новые пароли не совпадают', type: 'error' })

			// сюда загрузку
			ragemp.send('ui::menu:settings:changePassword', { old: input[0], new: input[1] })
		}
		else setChangePassword(false)
	}


	// Google Authenticator
	const [ googleAuth, setGoogleAuth ] = React.useState(false)
	function googleAuthInput(elem, id) {
		const val = $(elem.target).val().replace(/\D/g, '')
		function submit() {
			let code = ''
			$(`.menu-settings .menu-settings-elem-google .menu-settings-elem-google-bottom section input`).each((i, item) => code += $(item).val())

			if(code.length !== 6)return
			code = parseInt(code)

			// сюда загрузку
			return ragemp.send(`ui::menu:settings:googleAuth:${!props.accountData.googleAuth ? 'connect' : 'disconnect'}`, { code })
		}

		if(val.length === 6
			&& id === 0) {
			$(`.menu-settings .menu-settings-elem-google .menu-settings-elem-google-bottom section input`).each((i, item) => $(item).val(val.split('')[i]))
			$(`.menu-settings .menu-settings-elem-google .menu-settings-elem-google-bottom section input:last-child`).focus()

			submit()
			return
		}

		if(val.length === 1) $(elem.target).val(val)
		else return $(elem.target).val(val.substr(0, 1))

		if(val.length && id < 5) $(`.menu-settings .menu-settings-elem-google .menu-settings-elem-google-bottom section input:nth-child(${id + 2})`).focus()
		if(id === 5) submit()
	}

	const [ googleAuthSuccess, setGoogleAuthSuccess ] = React.useState(false)
	function _setGoogleAuthSuccess() {
		setGoogleAuthSuccess(true)
		setTimeout(() => {
			setGoogleAuthSuccess(false)
			setGoogleAuth(false)
		}, 5000)
	}





	React.useEffect(() => {
		ragemp.eventCreate('client::menu:settings', (cmd, data) => {
			switch(cmd) {
				case 'setKeyBinds': {
					setKeyBinds(data)
					break
				}
				case 'setChat': {
					setChat(data)
					break
				}
				case '_setGoogleAuthSuccess': {
					_setGoogleAuthSuccess()
					break
				}
				case 'googleAuthClearCode': {
					$(`.menu-settings .menu-settings-elem-google .menu-settings-elem-google-bottom section input`).val('')
					break
				}
				case 'setChangePassword': {
					setChangePassword(data.status)
					break
				}
			}
		})


		$('body').keydown(e =>
		{
			if($('.menu .menu-settings .menu-settings-root-keyBind').css('display') !== 'none'
				&& banKeys.indexOf(e.keyCode) === -1) {
				const id = parseInt($('.menu .menu-settings .menu-settings-root-keyBind').attr('data-keyBindsSel'))
				const code = e.keyCode

				if(id === -1)return
				if(code === 27)return setKeyBindsSel(-1)

				e.preventDefault()

				const obj = JSON.parse($('.menu .menu-settings .menu-settings-root-keyBind').attr('data-keyBinds'))

				obj[id].key = e.key.toUpperCase()
				obj[id].keyCode = code

				setKeyBinds(obj)
				setKeyBindsSel(-1)

				ragemp.send('ui::menu:settings:saveKeyBinds', obj)
			}
		})


		setInterval(() => {
			let emailTimer = parseInt($('.menu .menu-settings').attr('data-emailtimer'))
			if(emailTimer > 0) setEmailTimer(emailTimer -= 1000)
		}, 1000)
	}, [])

	return (
		<div className="menu-settings" data-emailtimer={emailTimer}>
			{emailCode === 0 ? '' : (<Dialog
				text='На указанную тобой почту мы отправили письмю с кодом. <br />Введи данный код ниже, чтобы законить привязку:'
				btn={['Закончить', 'Не нужно']}

				input={['']}

				callback={emailCodeDialog} />)}
			{!changePassword ? '' : (<Dialog
				text=''
				btn={['Изменить пароль', 'Отмена']}

				input={['Введи текущий пароль', 'Теперь введи новый пароль', 'А теперь повтори новый пароль']}
				inputType={['password', 'password', 'password']}

				callback={changePasswordDialog} />)}

			{/* Key binds */}
			<div className="menu-settings-root menu-settings-root-keyBind" style={{display: props.bodyNav !== 3 ? 'none' : 'block'}} data-keyBindsSel={keyBindsSel} data-keyBinds={JSON.stringify(keyBinds)}>
				{keyBinds.map((item, i) => {
					return (<div onClick={() => setKeyBindsSel(keyBindsSel === i ? -1 : i)} key={i} className={`menu-settings-elem ${keyBindsSel === i && 'menu-settings-elem-sel'} ${item.key === '' && 'menu-settings-root-keyBind-no'}`}>
						<h1>
							{item.name}
							<span>{item.desc}</span>
						</h1>
						{keyBindsSel === i ? (<button className='btn-key'>Нажми клавишу</button>) : item.key === '' ? (<button className='btn-key'>Не назначено</button>) : (<BTNKey keys={item.key} />)}
					</div>)
				})}
			</div>

			{/* Chat */}
			<div className="menu-settings-root menu-settings-root-chat" style={{display: props.bodyNav !== 2 ? 'none' : 'block'}} data-chat={JSON.stringify(chat)}>
				<div className={`menu-settings-root-chat-preview ${chatBorder && 'menu-settings-root-chat-preview-border'}`}>
					<div className="menu-settings-root-chat-preview-img" style={{backgroundImage: 'url(./assets/menu/settings/chat/bg.jpg)'}}></div>
					<section className="menu-settings-root-chat-preview-chat">
						<div className='hud-chat' style={{width: chat[0] + 'px'}}>
							<section className="hud-chat-body" style={{height: chat[1] + 'px'}}>
								<div>
									<h1>
										<h2 style={{fontSize: chat[2] + 'px', fontFamily: chat[3]}}>Это превью чата</h2>
									</h1>
								</div>
								<div style={{marginTop: chat[4] + 'px'}}>
									<h1>
										<h2 style={{fontSize: chat[2] + 'px', fontFamily: chat[3]}}>Это превью чата</h2>
									</h1>
								</div>
								<div style={{marginTop: chat[4] + 'px'}}>
									<h1>
										<h2 style={{fontSize: chat[2] + 'px', fontFamily: chat[3]}}>Это превью чата</h2>
									</h1>
								</div>
								<div style={{marginTop: chat[4] + 'px'}}>
									<h1>
										<button className="hud-chat-tag" style={{marginRight: chat[5] + 'px', fontSize: chat[2] + 'px', fontFamily: chat[3], backgroundColor: "#28a028", color: "white"}}>ADD</button>
										<h2 style={{fontSize: chat[2] + 'px', fontFamily: chat[3]}}>Это превью объявления</h2>
									</h1>
								</div>
								<div style={{marginTop: chat[4] + 'px'}}>
									<h1>
										<button className="hud-chat-tag" style={{marginRight: chat[5] + 'px', fontSize: chat[2] + 'px', fontFamily: chat[3], backgroundColor: "#28a028", color: "white"}}>ADD</button>
										<h2 style={{fontSize: chat[2] + 'px', fontFamily: chat[3]}}>Это превью объявления</h2>
									</h1>
								</div>
								<div style={{marginTop: chat[4] + 'px'}}>
									<h1>
										<button className="hud-chat-tag" style={{marginRight: chat[5] + 'px', fontSize: chat[2] + 'px', fontFamily: chat[3], backgroundColor: "#28a028", color: "white"}}>ADD</button>
										<h2 style={{fontSize: chat[2] + 'px', fontFamily: chat[3]}}>Это превью объявления</h2>
									</h1>
								</div>
								<div style={{marginTop: chat[4] + 'px'}}>
									<h1>
										<button className="hud-chat-tag" style={{marginRight: chat[5] + 'px', fontSize: chat[2] + 'px', fontFamily: chat[3], backgroundColor: "#858585", color: "white"}}>OOC</button>
										<h2 style={{ color: 'silver', fontSize: chat[2] + 'px', fontFamily: chat[3] }}>(( Это превью OOC чата ))</h2>
									</h1>
								</div>
								<div style={{marginTop: chat[4] + 'px'}}>
									<h1>
										<button className="hud-chat-tag" style={{marginRight: chat[5] + 'px', fontSize: chat[2] + 'px', fontFamily: chat[3], backgroundColor: "#858585", color: "white"}}>OOC</button>
										<h2 style={{ color: 'silver', fontSize: chat[2] + 'px', fontFamily: chat[3] }}>(( Это превью OOC чата ))</h2>
									</h1>
								</div><div style={{marginTop: chat[4] + 'px'}}>
									<h1>
										<button className="hud-chat-tag" style={{marginRight: chat[5] + 'px', fontSize: chat[2] + 'px', fontFamily: chat[3], backgroundColor: "#858585", color: "white"}}>OOC</button>
										<h2 style={{ color: 'silver', fontSize: chat[2] + 'px', fontFamily: chat[3] }}>(( Это превью OOC чата ))</h2>
									</h1>
								</div>
								<div style={{marginTop: chat[4] + 'px'}}>
									<h1>
										<button className="hud-chat-tag" style={{marginRight: chat[5] + 'px', fontSize: chat[2] + 'px', fontFamily: chat[3], backgroundColor: "#d93c3c", color: "white"}}>SYSTEM</button>
										<h2 style={{fontSize: chat[2] + 'px', fontFamily: chat[3]}}>Это превью системных сообщений Это превью системных сообщений Это превью системных сообщений Это превью системных сообщений Это превью системных сообщений</h2>
									</h1>
								</div>
								<div style={{marginTop: chat[4] + 'px'}}>
									<h1>
										<button className="hud-chat-tag" style={{marginRight: chat[5] + 'px', fontSize: chat[2] + 'px', fontFamily: chat[3], backgroundColor: "#d93c3c", color: "white"}}>SYSTEM</button>
										<h2 style={{fontSize: chat[2] + 'px', fontFamily: chat[3]}}>Это превью системных сообщений Это превью системных сообщений Это превью системных сообщений Это превью системных сообщений Это превью системных сообщений</h2>
									</h1>
								</div>
								<div style={{marginTop: chat[4] + 'px'}}>
									<h1>
										<button className="hud-chat-tag" style={{marginRight: chat[5] + 'px', fontSize: chat[2] + 'px', fontFamily: chat[3], backgroundColor: "#d93c3c", color: "white"}}>SYSTEM</button>
										<h2 style={{fontSize: chat[2] + 'px', fontFamily: chat[3]}}>Это превью системных сообщений Это превью системных сообщений Это превью системных сообщений Это превью системных сообщений Это превью системных сообщений</h2>
									</h1>
								</div>
							</section>
						</div>
					</section>
				</div>

				<div className="menu-settings-elem" style={{marginBottom: '40px'}}>
					<h1>Показать границы чата</h1>
					<input type="checkbox" checked={chatBorder} onChange={elem => setChatBorder(elem.target.checked)} />
				</div>

				{chatValues.map((item, i) => {
					return (<div key={i} className="menu-settings-elem menu-settings-elem-choice">
							<h1>{item[2]}</h1>
							<section>
								<button onClick={() => chatChangeValue(i)}>
									<AiOutlineArrowLeft />
								</button>
								<h2>{chat[i]} {item[2] !== 'Шрифт' ? 'px' : ''}</h2>
								<button onClick={() => chatChangeValue(i, true)}>
									<AiOutlineArrowRight />
								</button>
							</section>
						</div>)
				})}
			</div>

			{/* Secure */}
			<div className="menu-settings-root menu-settings-root-secure" style={{display: props.bodyNav !== 1 ? 'none' : 'block'}}>
				<div onClick={() => setChangePassword(true)} className={`menu-settings-elem menu-settings-elem-link`}>
					<h1>
						Пароль
						<span>Изменить пароль от аккаунта</span>
					</h1>
					<FaExternalLinkAlt />
				</div>
				<div id="menuSettingsElemEmail" className={`menu-settings-elem menu-settings-elem-input`}>
					<h1>
						Почта
						<span>Твоя почта</span>
					</h1>
					<section>
						{!props.accountData.email.length ? (<input type="text" placeholder="Введи сюда свое мыло" />) : (<h2>{returnHideEmail()}</h2>)}
						{emailTimer > 0 ? (<button className="btn btn-ban">Подожди еще {func.sliceZero(new Date(emailTimer).getMinutes())}:{func.sliceZero(new Date(emailTimer).getSeconds())}</button>) : 
						!props.accountData.email.length ? (<button onClick={() => {
							if(emailTimer > 0)return
							const email = $('.menu .menu-settings #menuSettingsElemEmail input').val()

							if(!email.length)return
							if(!func.validateEmail(email))return ragemp.trigger('client::notify', 'add', { text: 'Не верный Email.', type: 'error' })

							const code = random.textNumber(8)

							ragemp.send('ui::menu:settings:emailSendCode', { code })

							setEmailCode(code)
							setEmailTimer(300000)

							console.log(code)
						}} className="btn">Привязать</button>) : (<button className="btn">Изменить почту</button>)}
					</section>
				</div>
				<div className={`menu-settings-elem ${googleAuth && 'menu-settings-elem-sel'}`} style={{cursor: 'default'}}>
					<h1>
						Google Authenticator
						<span>Двухфакторная аунтефикация с помощью сервиса Google Authenticator</span>
					</h1>
					<button onClick={() => setGoogleAuth(!googleAuth)} className={`btn ${googleAuth && 'btn-sel'}`}>{!props.accountData.googleAuth ? !googleAuth ? 'Подключить' : 'Подключаем...' : !googleAuth ? 'Отключить' : 'Отключаем...'}</button>

					{!props.accountData.googleAuth ? !googleAuth ? '' : (
						<div className="menu-settings-elem-google">
							<img className="menu-settings-elem-google-qr" src={`https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=otpauth://totp/-NAME-%3Fsecret%3D-CODE-%26issuer%3DWIXOOS`} />
							<section>
								<h2>
									Подключить Google Authenticator очень просто, всего-то нужно...
									<br />
									<br />
									<span>1. Открыть <img style={{width: "25px", height: "25px"}} src='./assets/menu/settings/secure/googleAuthenticator.png' /> Google Authenticator на телефоне</span>
									<span>2. Нажать на <button style={{ backgroundColor: 'white', border: '0', width: '25px', height: '25px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><img style={{width: "70%", height: "70%", transform: "translate(1px, 0)"}} src='./assets/menu/settings/secure/googleAuthenticatorPlus.png' /></button> а после "Сканировать QR-код"</span>
									<span>3. Теперь просто наведи камеру своего смартфона на QR код слева и жди</span>
									<span>4. Дождался? Теперь введи ниже одноразовый код, который тебе выдает Google Authenticator. И это, этот код обновляется каждые 30 секунд</span>
								</h2>
								<div className="menu-settings-elem-google-bottom">
									<section>
										{new Array(6).fill(0).map((item, i) => {
											return (<input name="_______" autoComplete='off' key={i} onChange={elem => googleAuthInput(elem, i)} type="text" />)
										})}
									</section>
								</div>
							</section>
							{!googleAuthSuccess ? '' : (<div className="menu-settings-elem-google-success">
								<div>
									<Checkmark />
									<h1>Google Authenticator <br />успешно подключен к данному аккаунту</h1>
								</div>
							</div>)}
						</div>) : !googleAuth ? '' : (
						<div className="menu-settings-elem-google" style={{justifyContent: 'center'}}>
							<section>
								<h2>
									Ты точно уверен? Риск быть взломаным без Google Authenticator'a почти 80%
									<br />
									Ладно, тогда введи одноразовый код ниже и мы отключим это
								</h2>
								<div className="menu-settings-elem-google-bottom">
									<section>
										{new Array(6).fill(0).map((item, i) => {
											return (<input name="_______" autoComplete='off' key={i} onChange={elem => googleAuthInput(elem, i)} type="text" />)
										})}
									</section>
								</div>
							</section>
							{!googleAuthSuccess ? '' : (<div className="menu-settings-elem-google-success">
								<div>
									<Checkmark class="checkmark-red" />
									<h1>Google Authenticator <br />успешно отключен от данного аккаунта</h1>
								</div>
							</div>)}
						</div>)}
				</div>
				<div className={`menu-settings-elem`}>
					{!props.accountData.email.length ? (<div className="menu-settings-elem-ban">
							<h1>Недоступно</h1>
							<h2>Привяжи почту, чтобы разблокировать данный пункт</h2>
						</div>) : (<div className="menu-settings-elem-ban">
							<h1>Недоступно</h1>
							<h2>Временно не доступно</h2>
						</div>)}

					<h1>
						Email Authenticator
						<span>Двухфакторная аунтефикация через твою почту</span>
					</h1>
					<button className="btn">Подключить</button>
				</div>
				<div className={`menu-settings-elem`}>
					<div className="menu-settings-elem-ban">
						<h1>Недоступно</h1>
						<h2>Временно не доступно</h2>
					</div>
					<h1>
						<SlSocialVkontakte /> Authenticator
						<span>Двухфакторная аунтефикация через твой профиль ВКонтакте</span>
					</h1>
					<button className="btn">Подключить</button>
				</div>
				<div onClick={() => ragemp.send('ui::menu:settings:setOnlySCID', { status: !props.accountData.onlySCID })} className={`menu-settings-elem`}>
					<h1>
						Social Club ID
						<span>Вход в аккаунт будет возможен лишь с аккаунта Social Club с которого был зарегистрирован аккаунт</span>
					</h1>
					<input type="checkbox" checked={props.accountData.onlySCID} />
				</div>
			</div>
		</div>
	)
}