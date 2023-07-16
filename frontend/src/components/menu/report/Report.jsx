import React from 'react'
import $ from 'jquery'
import ragemp from '../../../modules/ragemp'

import * as moment from 'moment'
import 'moment/locale/ru';

import elementVisibleArea from '../../../modules/elementVisibleArea'

import { BiCheckDouble } from 'react-icons/bi'
import { HiOutlineLockClosed } from 'react-icons/hi'

import './report.css'

export default function Report(props) {
	const [ report, setReport ] = React.useState([
		{
			id: 1,
			status: true,

			messages: [
				{ owner: [ 'Nezuko Kamado', 1, 'https://i.pinimg.com/originals/8a/c7/16/8ac7161bab41afebebd0ce63e34c484a.jpg' ], text: 'дм', date: new Date(), read: true, player: [ 'Nezuko Kun', 59182, -1, 'https://i.pinimg.com/originals/af/25/0c/af250c4fcfde886d5d85eb8f5c93aad9.jpg', false ] },
				{ owner: [ 'LonelyNezuko', 31, 'https://sun6-20.userapi.com/s/v1/if1/U8NF44n0KHi7ZGWsd7EXTE7YSwSu271VXqJITbBP-HvP0pVmFM_hGJ4zX2t3EXnVvoCWvaNF.jpg?size=720x720&quality=96&crop=0,0,720,720&ava=1' ], text: 'Уже лечу на помощь', date: new Date(), read: true },
				{ owner: [ 'Система', -1, '' ], text: 'Администратор начал следить за нарушителем', date: new Date(), read: true },
				{ owner: [ 'Система', -1, '' ], text: 'Администратор перестал следить за нарушителем', date: new Date(), read: true },
				{ owner: [ 'Система', -1, '' ], text: 'Нарушитель получил наказание по данной жалобе', date: new Date(), read: true },
				{ owner: [ 'LonelyNezuko', 31, 'https://sun6-20.userapi.com/s/v1/if1/U8NF44n0KHi7ZGWsd7EXTE7YSwSu271VXqJITbBP-HvP0pVmFM_hGJ4zX2t3EXnVvoCWvaNF.jpg?size=720x720&quality=96&crop=0,0,720,720&ava=1' ], text: 'Нарушитель был заблокирован. Приятной игры', date: new Date(), read: false },
				{ owner: [ 'Система', -1, '' ], text: 'Администратор закрыл жалобу', date: new Date(), read: false },
				{ owner: [ 'Система', -1, '' ], text: 'Администратор закрыл жалобу', date: new Date(), read: false },
				{ owner: [ 'LonelyNezuko', 31, 'https://sun6-20.userapi.com/s/v1/if1/U8NF44n0KHi7ZGWsd7EXTE7YSwSu271VXqJITbBP-HvP0pVmFM_hGJ4zX2t3EXnVvoCWvaNF.jpg?size=720x720&quality=96&crop=0,0,720,720&ava=1' ], text: 'Нарушитель был заблокирован. Приятной игры', date: new Date(), read: false },
				{ owner: [ 'Система', -1, '' ], text: 'Администратор закрыл жалобу', date: new Date(), read: false },
			]
		}
	])
	const [ reportOpen, setReportOpen ] = React.useState(0)


	function openReport(id) {
		if(reportOpen === id)return setReportOpen(-1)
		setReportOpen(id)
	}
	function createReport() {

	}

	function findUnreadReport(id) {
		let count = 0
		report[id].messages.map(item => {
			if(item.read === false) count ++
		})
		return count
	}
	React.useEffect(() => {
		if(reportOpen === -1)return
		
		const array = report
		array[reportOpen].messages.map((item, i) =>
		{
			if(item.read === false
				&& elementVisibleArea(`.menu .menu-body-report .menu-body-report-chat-messages section[data-i="${i}"]`, '.menu .menu-body-report .menu-body-report-chat-messages', 107) === true) {
				array[reportOpen].messages[i].read = true
			}
		})
		setReport(array)

		let count = 0
		array[reportOpen].messages.map(item => {
			if(item.read === false) count ++
		})
		if(count === 0) $(`.menu .menu-body-report .menu-body-report-nav section[data-i="${reportOpen}"] h3`).css('display', 'none')
	}, [reportOpen])


	return (<div className="menu-body-report">
				<div className="menu-body-report-nav">
					{report.map((item, i) =>
					{
						return (<section data-i={i} onClick={() => openReport(i)} key={i} className={`menu-body-report-nav-item ${reportOpen === i && 'menu-body-report-nav-item-sel'}`}>
							<h1>
								<h2>Жалоба #{item.id} {item.status === false ? (<HiOutlineLockClosed />) : ''}</h2>
								<span>{moment(item.messages[item.messages.length - 1].date).fromNow()}</span>
							</h1>
							<div className="menu-body-report-nav-item-ans">
								<h2>
									<span>{item.messages[item.messages.length - 1].owner[1] === props.accountData.char.id ? 'Вы' : item.messages[item.messages.length - 1].owner[0]}:</span>{item.messages[item.messages.length - 1].text}
								</h2>
								<h3 style={!findUnreadReport(i) ? {display: 'none'} : {display: 'block'}}></h3>
							</div>
						</section>)
					})}
				</div>
				<div className="menu-body-report-chat">
					<h1 className="menu-body-report-chat-title" style={reportOpen === -1 ? {display: 'none'} : {display: 'block'}}>Жалоба #{reportOpen !== -1 ? report[reportOpen].id : -1}</h1>
					<h1 className="menu-body-report-chat-title" style={reportOpen !== -1 ? {display: 'none'} : {display: 'block'}}>Создать новую жалобу</h1>
					<div className="menu-body-report-chat-wrap">
						<div className="menu-body-report-add" style={reportOpen !== -1 ? {display: 'none'} : {display: 'flex'}}>
							<section>
								<input placeholder="Опишите Вашу проблему" maxlength="255" />
								<input className="inputOnlyNumber" placeholder="ID нарушителя (необязательно)" maxlength="4" />
								<div>
									<button onClick={() => createReport()} className="btn">Создать</button>
								</div>
							</section>
						</div>
						<div className="menu-body-report-chat-messages" style={reportOpen === -1 ? {display: 'none'} : {display: 'block'}}>
							{reportOpen !== -1 ? report[reportOpen].messages.map((item, i) =>
							{
								return (
									<section data-i={i} key={i} className={`${item.owner[1] === props.accountData.char.id && 'menu-body-report-chat-messages-right'} ${item.owner[1] === -1 && 'menu-body-report-chat-messages-system'}`}>
										<div className="menu-body-report-chat-messages-title">
											<div className="avatar">
												<div>
													<img src={item.owner[2]} />
												</div>
											</div>
											<h1>
												{item.owner[0]}
												<span>#{item.owner[1]}</span>
											</h1>
										</div>
										<div className="menu-body-report-chat-messages-text">
											<h3>
												{item.text}
												{item.player ? (
													<div className="menu-body-report-chat-messages-player">
														<header>
															<div className="avatar avatar-min">
																<div>
																	<img src={item.player[3]} />
																</div>
															</div>
															<h1>
																{(props.accountData.admin > 0 || item.player[4] === true) ? item.player[0] : 'Гражданин'} [{item.player[2] === -1 ? 'Игрок вышел' : ''}]
																<span>#{item.player[1]}</span>
															</h1>
														</header>
														<button style={item.player[2] === -1 ? {display: 'none'} : {display: 'block'}} className="btn">Следить</button>
													</div>) : ''}
											</h3>
											<h4>
												<span>{moment(item.date).fromNow()}</span>
												{item.read === true ? (<BiCheckDouble />) : ''}
											</h4>
										</div>
									</section>)
							}) : ''}
						</div>
						<div className="menu-body-report-chat-input" style={reportOpen === -1 || (reportOpen !== -1 && report[reportOpen].status === false) ? {display: 'none'} : {display: 'block'}}>
							<input placeholder="Напишите ответ" maxlength="255" />
						</div>
					</div>
				</div>
			</div>)
}