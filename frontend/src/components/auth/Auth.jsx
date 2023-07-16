import React from 'react'
import $ from 'jquery'
import ragemp from '../../modules/ragemp'

import CONFIG from '../../config.json'

import { TbArrowsJoin } from 'react-icons/tb'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'

import { FiUser } from 'react-icons/fi'
import { RiLockPasswordLine } from 'react-icons/ri'
import { MdOutlineAlternateEmail } from 'react-icons/md'
import { BiGridAlt } from 'react-icons/bi'
import { GiPartyPopper } from 'react-icons/gi'
import { GoLinkExternal } from 'react-icons/go'
import { MdOutlinePassword } from 'react-icons/md'

import './auth.css'

export default function Auth() {
	const [ toggle, setToggle ] = React.useState(false)
	const [ type, setType ] = React.useState(0)

	const [ recoveryEmailTime, setRecoveryEmailTime ] = React.useState(0)
	const [ recoveryAccounts, setRecoveryAccounts ] = React.useState([])

	function submitRecovery(id, accountID) {
		ragemp.send('ui::auth:submitRecovery', { id, accountID })
	}
	function recoveryReEmail() {
		if(recoveryEmailTime > 0)return false
		ragemp.send('ui::auth:recoveryReEmail')
	}
	React.useEffect(() => {
		setInterval(() => {
			setRecoveryEmailTime(old => {
				if(old > 0)return old - 1000
				if(old < 0)return 0

				return old
			})
		}, 1000)
	}, [])


	React.useEffect(() => {
		ragemp.eventCreate('client::auth', (type, data) => {
			switch(type) {
				case 'toggle': {
					setToggle(data.status)
					break
				}
				case 'setType': {
					setType(parseInt(data.type))
					break
				}
				case 'setRecoveryEmailTime': {
					setRecoveryEmailTime(parseInt(data.time))
					break
				}
				case 'setRecoveryAccounts': {
					setRecoveryAccounts(data)
					break
				}
				case 'errorMessage': {
					$(`.auth label[for="${data.id}"]`).text(data.message)
					$(`.auth label[for="${data.id}"]`).show()
					break
				}
				case 'setData': {
					$('.auth #authLogin').val(data.login)
					$('.auth #authPassword').val(data.password)
					$('.auth #authSavePassword').prop('checked', true)

					if(data.auto) {
						$('.auth #authAuto').prop('checked', true)

						setTimeout(() => {
							submitAuth()
						}, 200)
					}
					break
				}
			}
		})
		$('body').on('input', '.auth .auth-body-i input', elem => {
			const id = $(elem.currentTarget).attr('id')
			$(`.auth label[for="${id}"]`).hide()
		})
		$('body').keydown(e =>
		{
			if($('.auth').css('display') !== 'none'
				&& e.keyCode === 13) {
				e.preventDefault()

				if($('.auth #authLogin').is(':focus')) $('.auth #authPassword').focus()
				else submitAuth()
			}
		})
	}, [])


	function submitAuth() {
		$('.auth input').blur()
		const
			login = $('.auth #authLogin').val(),
			password = $('.auth #authPassword').val()

		if(!login.length) {
			$('.auth label[for="authLogin"]').html('Введи логин')
			$('.auth label[for="authLogin"]').show()

			return
		}
		if(!password.length) {
			$('.auth label[for="authPassword"]').html('Введи пароль')
			$('.auth label[for="authPassword"]').show()

			return
		}

		ragemp.send('ui::auth:submitAuth', { login, password, save: $('.auth #authSavePassword').is(':checked'), auto: $('.auth #authAuto').is(':checked') }, true)
	}
	function submitAuthReg() {
		$('.auth input').blur()
		const
			login = $('.auth #authRegLogin').val(),
			password = $('.auth #authRegPassword').val(),
			email = $('.auth #authRegEmail').val(),
			promo = $('.auth #authRegPromo').val()

		if(!login.length) {
			$('.auth label[for="authRegLogin"]').html('Введи логин')
			$('.auth label[for="authRegLogin"]').show()

			return
		}
		if(!password.length) {
			$('.auth label[for="authRegPassword"]').html('Введи пароль')
			$('.auth label[for="authRegPassword"]').show()

			return
		}
		if(!email.length) {
			$('.auth label[for="authRegEmail"]').html('Введи email')
			$('.auth label[for="authRegEmail"]').show()

			return
		}

		ragemp.send('ui::auth:submitAuthReg', { login, password, email, promo, save: $('.auth #authRegSavePassword').is(':checked'), auto: $('.auth #authRegAuto').is(':checked') })
	}

	return (
		<div className="auth" style={!toggle ? {display: 'none'} : {display: 'flex'}}>
			<div className="auth-wrap">
				<header className="auth-header">
					<h1>{CONFIG.projectName}</h1>
				</header>
				<div className="auth-body" style={!type ? {display: 'block'} : {display: 'none'}}>
					<div className="auth-body-i">
						<section>
							<input id="authLogin" type="text" maxlength="32" placeholder="Твой логин" />
							<FiUser />
							<IoMdCheckmarkCircleOutline style={{display: 'none'}} className="auth-body-i-accept" />
						</section>
						<label style={{display: 'none'}} for="authLogin">Логин не найден</label>
					</div>
					<div className="auth-body-i">
						<section>
							<input id="authPassword" type="password" maxlength="64" placeholder="Твой пароль" />
							<RiLockPasswordLine />
							<IoMdCheckmarkCircleOutline style={{display: 'none'}} className="auth-body-i-accept" />
						</section>
						<label style={{display: 'none'}} for="authPassword">Этот пароль не верный</label>
					</div>
				</div>
				<div className="auth-other" style={!type ? {display: 'block'} : {display: 'none'}}>
					<div className="auth-other-i">
						<input id="authSavePassword" type="checkbox" />
						<label for="authSavePassword">Сохранить пароль</label>
					</div>
					<div style={{marginBottom: '13px'}} className="auth-other-i">
						<input id="authAuto" type="checkbox" />
						<label for="authAuto">Автоматический вход</label>
					</div>
					<h1 onClick={() => setType(1)}>Нет аккаунта? Давай создадим</h1>
					<h1 onClick={() => setType(2)}>Забыл пароль? Ща восстановим</h1>
				</div>
				<div className="auth-footer" style={!type ? {display: 'flex'} : {display: 'none'}}>
					<button onClick={() => submitAuth()} className="btn">
						<TbArrowsJoin />
						Играть
					</button>
				</div>


				<div className="auth-body" style={type !== 1 ? {display: 'none'} : {display: 'block'}}>
					<div className="auth-body-i">
						<section>
							<input id="authRegLogin" type="text" maxlength="32" placeholder="Придумай себе логин" />
							<FiUser />
							<IoMdCheckmarkCircleOutline style={{display: 'none'}} className="auth-body-i-accept" />
						</section>
						<label style={{display: 'none'}} for="authRegLogin">Логин не найден</label>
					</div>
					<div className="auth-body-i">
						<section>
							<input id="authRegPassword" type="password" maxlength="64" placeholder="Придумай пароль к аккаунту" />
							<RiLockPasswordLine />
							<IoMdCheckmarkCircleOutline style={{display: 'none'}} className="auth-body-i-accept" />
						</section>
						<label style={{display: 'none'}} for="authRegPassword">Этот пароль не верный</label>
					</div>
					<div className="auth-body-i">
						<section>
							<input id="authRegEmail" type="text" maxlength="128" placeholder="Укажи свой Email" />
							<MdOutlineAlternateEmail />
							<IoMdCheckmarkCircleOutline style={{display: 'none'}} className="auth-body-i-accept" />
						</section>
						<label style={{display: 'none'}} for="authRegEmail">Этот пароль не верный</label>
					</div>
					<div className="auth-body-i">
						<section>
							<input id="authRegPromo" type="text" maxlength="20" placeholder="Промокод? (Не знаешь - не пиши)" />
							<BiGridAlt />
							<IoMdCheckmarkCircleOutline style={{display: 'none'}} className="auth-body-i-accept" />
						</section>
						<label style={{display: 'none'}} for="authRegPromo">Этот пароль не верный</label>
					</div>
				</div>
				<div className="auth-other" style={type !== 1 ? {display: 'none'} : {display: 'block'}}>
					<div className="auth-other-i">
						<input id="authRegSavePassword" type="checkbox" />
						<label for="authRegSavePassword">Сохранить пароль</label>
					</div>
					<div style={{marginBottom: '13px'}} className="auth-other-i">
						<input id="authRegAuto" type="checkbox" />
						<label for="authRegAuto">Автоматический вход</label>
					</div>
					<h1 onClick={() => setType(0)}>Уже есть аккаунт? Так войди</h1>
				</div>
				<div className="auth-footer" style={type !== 1 ? {display: 'none'} : {display: 'flex'}}>
					<button onClick={() => submitAuthReg()} className="btn">
						<GiPartyPopper style={{transform: 'none'}} />
						Я все
					</button>
				</div>


				<div className="auth-body" style={type !== 2 ? {display: 'none'} : {display: 'block'}}>
					<div className="auth-body-i">
						<section>
							<input id="authRecoveryEmail" type="text" maxlength="128" placeholder="Введи Email от аккаунта" />
							<MdOutlineAlternateEmail />
							<IoMdCheckmarkCircleOutline style={{display: 'none'}} className="auth-body-i-accept" />
						</section>
						<label style={{display: 'none'}} for="authRecoveryEmail">Этот пароль не верный</label>
					</div>
				</div>
				<div className="auth-other" style={type !== 2 ? {display: 'none'} : {display: 'block'}}>
					<h1 onClick={() => setType(0)}>Я помню пароль</h1>
					<h1>Я не помню Email <GoLinkExternal /></h1>
				</div>

				<div className="auth-body" style={type !== 3 ? {display: 'none'} : {display: 'block'}}>
					<div className="auth-body-i">
						<section>
							<input id="authRecoveryCode" type="text" maxlength="8" placeholder="Теперь введи код с Email письма" />
							<MdOutlinePassword />
							<IoMdCheckmarkCircleOutline style={{display: 'none'}} className="auth-body-i-accept" />
						</section>
						<label style={{display: 'none'}} for="authRecoveryCode">Этот пароль не верный</label>
					</div>
				</div>
				<div className="auth-other" style={type !== 3 ? {display: 'none'} : {display: 'block'}}>
					<h1 onClick={() => setType(2)}>Назад</h1>
					<h1 onClick={() => recoveryReEmail()}>Повторно отправить письмо {recoveryEmailTime > 0 ? `(${new Date(recoveryEmailTime).getMinutes()}:${new Date(recoveryEmailTime).getSeconds()})` : ''}</h1>
				</div>

				<div className="auth-body" style={type !== 4 ? {display: 'none'} : {display: 'block'}}>
					<div className="auth-body-i auth-body-i-choice">
						<h1>Выбери аккаунт, который хочешь восстановить:</h1>
						<section>
							{recoveryAccounts.map((item, i) => {
								return (<div onClick={() => submitRecovery(type, item[1])} key={i}>{item[0]}#{item[1]}</div>)
							})}
						</section>
					</div>
				</div>
				<div className="auth-other" style={type !== 4 ? {display: 'none'} : {display: 'block'}}>
					<h1 style={{marginBottom: '20px'}} onClick={() => setType(0)}>Отмена, я вспомнил пароль</h1>
				</div>

				<div className="auth-body" style={type !== 5 ? {display: 'none'} : {display: 'block'}}>
					<div className="auth-body-i auth-body-i-choice">
						<h1>
							На твой email было отправлено письмо с новым, рандомно сгенерированным, паролем.
							<br />
							Используй окно авторизации, чтобы войти в аккаунт.
							<br /><br />
							И не забудь сменить пароль, как только войдешь в игру :)</h1>
					</div>
				</div>

				<div className="auth-footer" style={type < 2 || type >= 4 ? {display: 'none'} : {display: 'flex'}}>
					<button onClick={() => submitRecovery(type)} className="btn">Дальше</button>
				</div>
				<div className="auth-footer" style={type !== 5  ? {display: 'none'} : {display: 'flex'}}>
					<button onClick={() => setType(0)} className="btn">Хорошо</button>
				</div>
			</div>
		</div>
	)
}