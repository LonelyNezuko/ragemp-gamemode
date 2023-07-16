import React from 'react'
import $ from 'jquery'
import ragemp from '../../modules/ragemp'

import * as moment from 'moment'
import 'moment/locale/ru';

import Inventory from './inventory/Inventory'
import Report from './report/Report'
import Quests from './quests/Quests'
import Info from './info/Info'
import Settings from './settings/Settings'
import Shop from './shop/Shop'

import { ImStatsBars } from 'react-icons/im'
import { MdInventory } from 'react-icons/md'
import { FaTasks } from 'react-icons/fa'
import { MdReportProblem } from 'react-icons/md'
import { RiShoppingCart2Fill } from 'react-icons/ri'
import { GoOrganization } from 'react-icons/go'
import { MdFamilyRestroom } from 'react-icons/md'
import { MdSettings } from 'react-icons/md'
import { MdAdminPanelSettings } from 'react-icons/md'

import { MdOutlineAttachMoney } from 'react-icons/md'
import { RiBankCardLine } from 'react-icons/ri'

import './menu.css'

export default function Menu() {
	const [ accountData, setAccountData ] = React.useState({
		id: 1,
		admin: 0,
		char: {
			id: 1,
			name: 'Unnamed',
			cash: [ 0, 0 ],
			fraction: undefined,
			family: undefined
		},
		avatar: 'https://www.casaylienzo.es/wp-content/uploads/2020/05/Picaporte-unificado-2048x2048.jpg',

		googleAuth: false,
		email: 'test@mail.ru',
		onlySCID: false,

		donate: 7582938273
	})

	const [ headerNav, setHeaderNav ] = React.useState(4)
	const [ bodyNav, setBodyNav ] = React.useState(5)

	const [ bodyNavList, setBodyNavList ] = React.useState([
		[], [], [], [], [], [], [], [], [],
	])
	const [ headerNavList, setHeaderNavList ] = React.useState([])

	function updateBodyNavList() {
		setBodyNavList([
			[
				[ 'Аккаунт' ],
				[ 'Персонаж' ],
				[ 'История пополнений' ],
				[ 'История наказаний' ],
				[ 'Имущество', false ],
			],
			[],
			[],
			[],
			[
				[ 'Валюта', false ],
				[ 'VIP статус', false ],
				[ 'Транспорт', false ],
				[ 'Одежда', false ],
				[ 'Рулетка' ]
			],
			[],
			[],
			[],
			[
				[ 'Игра', false ],
				[ 'Безопасность' ],
				[ 'Чат' ],
				[ 'Клавиши' ],
				[ 'Прицел', false ]
			],
		])
	}
	function updateHeaderNavList() {
		setHeaderNavList([
			[ (<ImStatsBars />), 'Информация' ],
			[ (<MdInventory />), 'Инвентарь' ],
			[ (<FaTasks />), 'Задания' ],
			[ (<MdReportProblem />), 'Жалобы' ],
			[ (<RiShoppingCart2Fill />), 'Магазин' ],
			[ (<GoOrganization />), 'Фракция', !accountData.char.fraction ? false : true ],
			[ (<MdFamilyRestroom />), 'Семья', !accountData.char.family ? false : true ],
			[ (<MdAdminPanelSettings />), 'Админка', accountData.admin <= 0 ? false : true ],
			[ (<MdSettings />), 'Настройки' ],
		])
	}

	React.useEffect(() => {
		updateHeaderNavList()
		updateBodyNavList()
	}, [accountData])


	function toggle(toggle) {
		if(!toggle) $('.menu').css('display', 'none')
		else $('.menu').css('display', 'flex')
	}

	function openHeaderNav(id) {
		if(headerNavList[id][2] === false)return
		ragemp.send('ui::menu:openHeaderNav', { id })
	}
	function openBodyNav(id) {
		if(bodyNavList[headerNav][id][1] === false)return
		ragemp.send('ui::menu:openBodyNav', { headerNav: headerNav, id })
	}



	React.useEffect(() => {
		ragemp.eventCreate('client::menu', (cmd, data) => {
			switch(cmd) {
				case 'toggle': {
					toggle(data.status)

					if(data.accountData) setAccountData(data.accountData)

					break
				}
				case 'setHeaderNav': {
					setHeaderNav(data.id)
					break
				}
				case 'setBodyNav': {
					setBodyNav(data.id)
					break
				}
			}
		})

		// Закрытие
		$('body').keydown(e =>
		{
			if($('.menu').css('display') !== 'none'
				&& e.keyCode === 27) {
				e.preventDefault()

				toggle(false)
				ragemp.send('ui::menu:close', {}, true)
			}
		})
	}, [])

	return (
		<div className="menu" style={{display: 'flex'}}>
			<section className="menu-wrap">
				<div className="menu-header">
					<div className="menu-header-title">
						<div className="menu-header-title-nav">
							{headerNavList.map((item, i) => {
								return (<section onClick={() => openHeaderNav(i)} className={`${headerNav === i && 'menu-header-title-nav-sel'} ${item[2] === false && 'menu-header-title-nav-block'}`}>
									{item[0]}
									<span>{item[1]}</span>
								</section>)
							})}
						</div>
					</div>
					<div className="menu-header-char">
						<div className="menu-header-char-info">
							<h1>{accountData.char.name}</h1>
							<h2>#{accountData.char.id}</h2>
							<h3>
								<span>
									<MdOutlineAttachMoney />
									{accountData.char.cash[0].toLocaleString()}
								</span>
								<span>
									<RiBankCardLine />
									{accountData.char.cash[1].toLocaleString()}
								</span>
							</h3>
						</div>
						<div className="avatar avatar-big">
							<div>
								<img src={accountData.avatar} />
							</div>
						</div>
					</div>
				</div>
				<div className={`menu-body ${JSON.stringify(bodyNavList[headerNav]) !== '[]' ? 'menu-body-choice' : ''}`}>
					<div className="menu-body-nav" style={JSON.stringify(bodyNavList[headerNav]) === '[]' ? {display: 'none'} : {display: 'block'}}>
						{bodyNavList[headerNav].map((item, i) => {
							return (<h1 onClick={() => openBodyNav(i)} className={`${i === bodyNav && 'menu-body-nav-sel'} ${item[1] === false && 'menu-body-nav-block'}`} key={i}>{item[0]}</h1>)
						})}
					</div>


					{/* Pages */}
					<div className="menu-body-wrap" style={{display: headerNav !== 1 ? 'none' : 'block', overflow: 'visible'}}>
						<Inventory />
					</div>
					<div className="menu-body-wrap" style={headerNav !== 2 ? {display: 'none'} : {display: 'block'}}>
						<Quests />
					</div>
					<div className="menu-body-wrap" style={headerNav !== 3 ? {display: 'none'} : {display: 'block'}}>
						<Report accountData={accountData} />
					</div>
					<div className="menu-body-wrap" style={headerNav !== 0 ? {display: 'none'} : {display: 'block'}}>
						<Info accountData={accountData} bodyNav={bodyNav} />
					</div>
					<div className="menu-body-wrap" style={headerNav !== 8 ? {display: 'none'} : {display: 'block'}}>
						<Settings accountData={accountData} bodyNav={bodyNav} />
					</div>
					<div className="menu-body-wrap" style={headerNav !== 4 ? {display: 'none'} : {display: 'block'}}>
						<Shop accountData={accountData} bodyNav={bodyNav} />
					</div>
				</div>
			</section>
			<section className="menu-footer">
			</section>
		</div>
	)
}
