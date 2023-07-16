import React from 'react'
import $ from 'jquery'
import "jquery-ui-dist/jquery-ui"
import 'jquery.scrollto'
import ragemp from '../../modules/ragemp'

import './phone.css'

import Call from './apps/call/Call'
import Contacts from './apps/contacts/Contacts'
import Messenger from './apps/messenger/Messenger'

import { MdOutlineNetworkCell } from 'react-icons/md'

import { FaBatteryFull } from 'react-icons/fa'
import { FaBatteryThreeQuarters } from 'react-icons/fa'
import { FaBatteryHalf } from 'react-icons/fa'
import { FaBatteryQuarter } from 'react-icons/fa'
import { FaBatteryEmpty } from 'react-icons/fa'

import { BsCircleFill } from 'react-icons/bs'
import { IoCaretBackSharp } from 'react-icons/io5'
import { BsFillSquareFill } from 'react-icons/bs'

export default function Phone() {
	const [ toggle, setToggle ] = React.useState(false)

	// const [ activeApp, setActiveApp ] = React.useState([ [], [], [] ])
	// const [ activeAppSel, setActiveAppSel ] = React.useState(0)

	// const activeAppRef = React.useRef([])
	// React.useEffect(() => {
	// 	activeAppRef.current.map((item => {
	// 		$(item).draggable({
	// 			axis: "y",
	// 			distance: 10
	// 		})
	// 	}))

	// 	let activeAppScroll = 0
	// 	$('.phone .phone-activeapp .phone-activeapp-wrap').on('mousewheel', elem => {
	// 		if(activeAppScroll > +new Date())return

	// 		const item = $('.phone .phone-activeapp .phone-activeapp-wrap .phone-activeapp-elem-sel')
	// 		const delta = elem.originalEvent.wheelDelta

	// 		let next = null
	// 		if(delta < 0) next = $(item).next()
	// 		else next = $(item).prev()

	// 		if(next.length > 0) {
	// 			$('.phone .phone-activeapp .phone-activeapp-wrap .phone-activeapp-elem').removeClass('phone-activeapp-elem-sel')
	// 			$(next).addClass('phone-activeapp-elem-sel')

	// 			$('.phone .phone-activeapp .phone-activeapp-wrap').scrollTo($(next), { axis: "x" })

	// 			activeAppScroll = +new Date() + 1000
	// 		}
	// 	})
	// }, [])

	const [ accountData, setAccountData ] = React.useState({
		id: 1,
		name: 'Nezuko Kamado',

		number: 9999
	})


	const [ app, setApp ] = React.useState(-1)
	const [ appList, setAppList ] = React.useState([
		{ id: 0, name: 'Телефон', img: 'call.png', saved: true },
		{ id: 1, name: 'Контакты', img: 'contacts.png', saved: true },
		{ id: 2, name: 'Мессенджер', img: 'messenger.png', saved: true },
		{ id: 3, name: 'GPS', img: 'gps.png', saved: true },
		{ id: 4, name: 'Каршеринг', img: 'carshering.png' },
		{ id: 5, name: 'Заметки', img: 'notes.png' },
		{ id: 6, name: 'Калькулятор', img: 'calculator.png' },
		{ id: 7, name: 'Настройки', img: 'settings.png' },
		{ id: 8, name: 'Музыка', img: 'music.png' },
		{ id: 9, name: 'Банк', img: 'bank.png' },
		{ id: 10, name: 'Новости', img: 'news.png' }
	])

	function openApp(id) {
		setApp(id)
	}

	return (
		<div className={`phone ${toggle === true && 'phone-open'}`}>
			<div className="phone-display phone-display-black" style={{backgroundImage: 'url(https://mobimg.b-cdn.net/v3/fetch/92/928bfeeede70d3523669dd8d51d29aa9.jpeg)'}}>
				<div className="phone-header phone-header-white">
					<section>
						<h1>11:25</h1>
					</section>
					<section>
						<MdOutlineNetworkCell />
						<FaBatteryThreeQuarters />
					</section>
				</div>
				<div className="phone-apps">
					{appList.map((item, i) => {
						if(item.saved)return
						return (<div onClick={() => openApp(item.id)} className="phone-appitem">
								<img src={`./assets/phone/apps_icon/${item.img}`} />
								<h1>{item.name}</h1>
							</div>)
					})}
				</div>
				<div className="phone-saved-apps">
					{appList.map((item, i) => {
						if(!item.saved)return
						return (<div onClick={() => openApp(item.id)} className="phone-appitem">
								<img src={`./assets/phone/apps_icon/${item.img}`} />
							</div>)
					})}
				</div>

				<div className={`phone-nav ${app !== -1 && 'phone-nav-bg'}`}>
					<IoCaretBackSharp />
					<BsCircleFill onClick={() => openApp(-1)} />
					<BsFillSquareFill />
				</div>
				{/*<div className="phone-activeapp">
					<div className="phone-activeapp-wrap">
						{activeApp.map((item, i) => {
							return (<div key={i} className={`phone-activeapp-elem ${activeAppSel === i && 'phone-activeapp-elem-sel'}`} ref={el => activeAppRef.current[i] = el}>
									<img className="phone-activeapp-elem-img" src='./assets/phone/apps_icon/contacts.png' />
									<section className="phone-activeapp-elem-bg"></section>
									<div className="phone-app phone-app-open">
										{i}
									</div>
								</div>)
						})}
					</div>
					<div className="phone-activeapp-btn">
						<button className="btn">Очистить все</button>
					</div>
				</div>*/}

				<div className={`phone-app ${app === 0 && 'phone-app-open'}`}>
					<Call openApp={openApp} accountData={accountData} />
				</div>
				<div className={`phone-app ${app === 1 && 'phone-app-open'}`}>
					<Contacts openApp={openApp} accountData={accountData} />
				</div>
				<div className={`phone-app ${app === 2 && 'phone-app-open'}`}>
					<Messenger openApp={openApp} accountData={accountData} />
				</div>
			</div>
		</div>
	)
}