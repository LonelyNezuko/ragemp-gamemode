import React from 'react'
import $ from 'jquery'
import 'jquery.scrollto'
import func from '../../../../modules/func'
import ragemp from '../../../../modules/ragemp'

import * as moment from 'moment'
import 'moment/locale/ru';

import './messenger.css'

import { HiOutlineMenuAlt3 } from 'react-icons/hi'
import { FiSearch } from 'react-icons/fi'

import { IoCheckmarkSharp } from 'react-icons/io5'
import { IoCheckmarkDoneSharp } from 'react-icons/io5'

import { IoMdArrowRoundBack } from 'react-icons/io'
import { HiDotsVertical } from 'react-icons/hi'
import { IoCall } from 'react-icons/io5'

import { FiPaperclip } from 'react-icons/fi'
import { MdSend } from 'react-icons/md'

import { IoLocation } from 'react-icons/io5'

import { HiUserGroup } from 'react-icons/hi'
import { IoSettings } from 'react-icons/io5'
import { IoChatbox } from 'react-icons/io5'

export default function Messenger(props) {
	const [ list, setList ] = React.useState([
		{ id: 1, number: 618887777, avatar: './assets/phone/avatars/none.png', name: 'Nezuko Kamado', messages: [
			{ id: 1, text: 'Ачнысь', date: new Date(), read: true, me: true },
			{ id: 1, text: 'Вставай', date: new Date(), read: true, me: true },
			{ id: 1, text: 'Прасыпайся', date: new Date(), read: true, me: true },
			{ id: 1, text: 'Ацтань я дохлый', date: new Date(), read: true }
		], ans: false },
		{ id: 2, number: 215938291, avatar: './assets/phone/avatars/none.png', name: 'Джеральд', messages: [
			{ id: 1, text: 'Привет, как дела?', date: new Date(), read: false },
			{ id: 1, text: 'У меня для тебя есть работа', date: new Date(), read: false },
			{ id: 1, text: 'Ответь мне как сможешь', date: new Date(), read: false },
			{ id: 1, text: 'Геолокация', date: new Date(), read: true, type: 'location', me: true },
		] }
	])

	function getUnreadMessages(id) {
		let count = 0
		list[id].messages.map((item, i) => {
			if(!item.read) count ++
		})

		return count
	}
	function getMessagesStyle(type, chat = false) {
		switch(type) {
			case 'location': return (!chat ? { color: '#622bb9', fontWeight: '700' } : { backgroundColor: '#622bb9', color: 'white', fontWeight: '700' })
		}
	}
	function getMessagesIcon(type) {
		switch(type) {
			case 'location': return (<IoLocation className="phone-app-messenger-icotype" />)
		}
	}

	const [ sms, setSMS ] = React.useState(-1)
	React.useEffect(() =>
	{
		if(sms !== -1) $('.phone-app-messenger-sms .phone-app-messenger-sms-list').scrollTo($('.phone-app-messenger-sms .phone-app-messenger-sms-list .phone-app-messenger-sms-elem:last-child'))
	}, [sms])

	const [ swap, setSwap ] = React.useState(false)
	const [ attach, setAttach ] = React.useState(false)

	return (
		<>
			<div className="phone-app-B phone-app-messenger">
				<header>
					<section>
						<button onClick={() => setSwap(true)}>
							<HiOutlineMenuAlt3 />
						</button>
						<h1>Мессенджер</h1>
					</section>
					<section>
						<button>
							<FiSearch />
						</button>
					</section>
				</header>
				<div className="phone-app-messenger-body">
					<div className="phone-app-messenger-list">
						{list.map((item, i) => {
							return (<section onClick={() => setSMS(i)} key={i} className="phone-app-messenger-list-elem">
									<section>
										<div className="phone-avatar">
											<img src={item.avatar} />
										</div>
										<h1>
											{item.name}
											<span style={getMessagesStyle(item.messages[item.messages.length - 1].type)}>{getMessagesIcon(item.messages[item.messages.length - 1].type)}{item.messages[item.messages.length - 1].text}</span>
										</h1>
									</section>
									<section>
										<h1>
											{item.messages[item.messages.length - 1].read === true ? (<IoCheckmarkDoneSharp />) : (<IoCheckmarkSharp />)}
											<span>{new Date(item.messages[item.messages.length - 1].date).getHours()}:{new Date(item.messages[item.messages.length - 1].date).getMinutes()}</span>
										</h1>
										{getUnreadMessages(i) > 0 ? (<button>{getUnreadMessages(i)}</button>) : ''}
									</section>
								</section>)
						})}
					</div>
				</div>

				<div className={`phone-app-messenger-swap ${swap === true && 'phone-app-messenger-swap-open'}`} onClick={() => setSwap(false)}>
					<div className="phone-app-messenger-swap-wrap">
						<div className="phone-app-messenger-swap-avatar">
							<div className="phone-avatar">
								<img src='./assets/phone/avatars/none.png' />
							</div>
							<h1>
								LonelyNezuko
								<span>{props.accountData.number > 0 ? func.formatPhoneNumber(props.accountData.number) : 'Нет'}</span>
							</h1>
						</div>
						<div className="phone-app-messenger-swap-nav">
							<section>
								<IoChatbox />
								<h1>Начать чат</h1>
							</section>
							<section>
								<HiUserGroup />
								<h1>Создать группу</h1>
							</section>
							<section>
								<IoSettings />
								<h1>Настройки</h1>
							</section>
						</div>
					</div>
				</div>
			</div>
			<div className={`phone-app-B phone-app-messenger phone-app-messenger-sms ${sms !== -1 && 'phone-app-messenger-sms-open'}`}>
				<header>
					<section>
						<button onClick={() => setSMS(-1)}>
							<IoMdArrowRoundBack />
						</button>
						<div className="phone-avatar phone-avatar-min">
							<img src={sms !== -1 ? list[sms].avatar : './assets/phone/avatars/none.png'} />
						</div>
						<h1>{sms !== -1 ? list[sms].name : ''}</h1>
					</section>
					<section>
						<button onClick={() => {
							ragemp.trigger('client::phone:call', 'setNumber', {
								number: list[sms].number
							})

							props.openApp(0)
							setSMS(-1)
						}}>
							<IoCall />
						</button>
						<button>
							<HiDotsVertical />
						</button>
					</section>
				</header>
				<div className="phone-app-messenger-body" style={{backgroundImage: 'url(https://aniyuki.com/wp-content/uploads/2021/05/aniyuki-nezuko-65.jpg)'}}>
					<div onClick={() => setAttach(false)} className={`phone-app-messenger-sms-list ${attach === true && 'phone-app-messenger-sms-list-attach'}`}>
						{sms !== -1 ? list[sms].messages.map((item, i) => {
							return (<section key={i} className={`phone-app-messenger-sms-elem ${!item.me && 'phone-app-messenger-sms-elem-reverse'}`}>
									<div style={getMessagesStyle(item.type, true)}>
										{getMessagesIcon(item.type)}
										<h1>{item.text}</h1>
										<h2>{new Date(item.date).getHours()}:{new Date(item.date).getMinutes()}</h2>
										{item.me ? !item.read ? (<IoCheckmarkSharp />) : (<IoCheckmarkDoneSharp />) : ''}
									</div>
								</section>)
						}) : ''}
					</div>
					<div className="phone-app-messenger-sms-input" style={{display: sms !== -1 && list[sms].ans === false ? 'none' : 'flex'}}>
						<input onClick={() => setAttach(false)} type="text" id="phoneAppMessengerInput" placeholder="Сообщение" />
						<FiPaperclip onClick={() => setAttach(!attach)} />
						<MdSend onClick={() => setAttach(false)} />
					</div>
					<div onClick={() => setAttach(false)} className={`phone-app-messenger-sms-input-attach ${attach === true && 'phone-app-messenger-sms-input-attach-open'}`}>
						<section>
							<div>
								<IoLocation />
							</div>
							<h1>Локация</h1>
						</section>
					</div>
				</div>
			</div>
		</>
	)
}