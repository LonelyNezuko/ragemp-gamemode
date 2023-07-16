import React from 'react'
import $ from 'jquery'
import func from '../../../../modules/func'
import ragemp from '../../../../modules/ragemp'

import * as moment from 'moment'
import 'moment/locale/ru';

import './contacts.css'

import { RiUserAddFill } from 'react-icons/ri'
import { FiSearch } from 'react-icons/fi'

import { ImCancelCircle } from 'react-icons/im'
import { IoCall } from 'react-icons/io5'
import { RiMessengerFill } from 'react-icons/ri'

export default function Contacts(props) {

	const [ add, setAdd ] = React.useState(false)
	const [ addNumber, setAddNumber ] = React.useState('')

	React.useEffect(() => {
		$('.phone .phone-app-contacts #phoneContactAddFirstName').val('')
		$('.phone .phone-app-contacts #phoneContactAddLastName').val('')
		$('.phone .phone-app-contacts #phoneContactAddNumber').val('')
	}, [add])
	React.useEffect(() => {
		$('.phone .phone-app-contacts #phoneContactAddNumber').val(addNumber)
	}, [addNumber])

	const [ profile, setProfile ] = React.useState(false)
	
	const [ profileData, setProfileData ] = React.useState({
		id: 1,
		avatar: './assets/phone/avatars/none.png',

		name: ['Nezuko', 'Kun'],
		number: 618887777,

		createDate: new Date(),
		lastCall: [new Date(), 10000]
	})

	function goCall() {
		setProfile(false)

		ragemp.trigger('client::phone:call', 'setNumber', {
			number: profileData.number
		})
		props.openApp(0)
	}
	function goMessenger() {

	}

	const [ contacts, setContacts ] = React.useState([
		{ id: 1, avatar: './assets/phone/avatars/none.png', name: ['Nezuko', 'Kun'], number: 618887777, createDate: new Date(), lastCall: [null, 0] },
		{ id: 2, avatar: './assets/phone/avatars/none.png', name: ['Джеральд', ''], number: 215938291, createDate: new Date(), lastCall: [new Date(), 3] },
	])


	React.useEffect(() => {
		ragemp.eventCreate('client::phone:contacts', (cmd, data) => {
			switch(cmd) {
				case 'setProfileData': {
					setProfile(true)
					setProfileData(data)
					break
				}
				case 'setAdd': {
					setAdd(data.status)

					if(data.number) setAddNumber(data.number.toString())
					else setAddNumber('')

					break
				}
			}
		})
	}, [])

	return (
		<div className="phone-app-B phone-app-contacts">
			<div className={`phone-app-contacts-add ${add === true && 'phone-app-contacts-add-open'}`}>
				<div className="phone-app-contacts-add-wrap">
					<section className="phone-app-contacts-add-top">
						<div className="phone-avatar">
							<img src='./assets/phone/avatars/none.png' />
						</div>
						<section>
							<div>
								<label for="phoneContactAddFirstName">Имя</label>
								<input id="phoneContactAddFirstName" type="text" />
							</div>
							<div>
								<label for="phoneContactAddLastName">Фамилия</label>
								<input id="phoneContactAddLastName" type="text" />
							</div>
						</section>
					</section>
					<section className="phone-app-contacts-add-second">
						<section>
							<div>
								<label for="phoneContactAddNumber">Номер телефона</label>
								<input onChange={elem => elem.target.value = elem.target.value.replace(/\D/g, '')} id="phoneContactAddNumber" type="text" />
							</div>
						</section>
					</section>
					<section className="phone-app-contacts-add-bottom">
						<button onClick={() => {
							const
								firstname = $('.phone .phone-app-contacts #phoneContactAddFirstName').val(),
								lastname = $('.phone .phone-app-contacts #phoneContactAddLastName').val(),
								number = $('.phone .phone-app-contacts #phoneContactAddNumber').val()

							if(!firstname.length || !lastname.length || !number.length)return

							ragemp.send('ui::phone:contacts:add', { firstname, lastname, number })
							setAdd(false)

						}} className="btn">Создать контакт</button>
						<button onClick={() => setAdd(false)} className="btn">
							<ImCancelCircle />
						</button>
					</section>
				</div>
			</div>
			<div className={`phone-app-contacts-add ${profile === true && 'phone-app-contacts-add-open'} phone-app-contacts-profile`}>
				<div className="phone-app-contacts-add-wrap">
					<div className="phone-avatar">
						<img src={profileData.avatar} />
					</div>

					<section className="phone-app-contacts-profile-elem">
						<h1>{profileData.name[0]}</h1>
						<h2>{profileData.name[1]}</h2>
					</section>
					<section className="phone-app-contacts-profile-elem">
						<h1>Номер</h1>
						<h2>{func.formatPhoneNumber(profileData.number)}</h2>
					</section>
					<section className="phone-app-contacts-profile-elem">
						<h1>Добавлен</h1>
						<h2>{moment(profileData.createDate).fromNow()}</h2>
					</section>
					<section className="phone-app-contacts-profile-elem">
						<h1>Последний звонок</h1>
						<h2>{profileData.lastCall[0] ? moment(profileData.lastCall[0]).fromNow() : ''} ({func.getTimeName(profileData.lastCall[1] / 1000, true)})</h2>
					</section>
					<section className="phone-app-contacts-add-bottom">
						<button onClick={() => goCall()} className="btn">
							<IoCall />
						</button>
						<button onClick={() => goMessenger()} className="btn">
							<RiMessengerFill />
						</button>
						<button className="btn" style={{display: 'none'}}></button>
					</section>
					<section className="phone-app-contacts-add-bottom">
						<button onClick={() => {
							ragemp.send('ui::phone:contacts:delete', { id: profileData.id })
							setProfile(false)
						}} className="btn">Удалить контакт</button>
						<button onClick={() => setProfile(false)} className="btn">
							<ImCancelCircle />
						</button>
					</section>
				</div>
			</div>

			<header>
				<h1>Контакты</h1>
				<section>
					<button>
						<FiSearch />
					</button>
					<button onClick={() => setAdd(true)}>
						<RiUserAddFill />
					</button>
				</section>
			</header>
			<div className="phone-app-contacts-list">
				{contacts.map((item, i) => {
					return (<section key={i} onClick={() => {
						setProfileData(item)
						setProfile(true)
					}}>
							<div className="phone-avatar">
								<img src={item.avatar} />
							</div>
							<h2>
								{item.name[0]} {item.name[1]}
								<span>{func.formatPhoneNumber(item.number)}</span>
							</h2>
						</section>)
				})}
				{/*<div className="phone-app-contacts-list-sort">B</div>*/}
			</div>
		</div>
	)
}