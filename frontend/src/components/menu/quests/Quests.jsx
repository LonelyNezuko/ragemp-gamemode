import React from 'react'
import $ from 'jquery'
import ragemp from '../../../modules/ragemp'

import './quests.css'

export default function Shop(props) {
	const [ quests, setQuests ] = React.useState([
		{
			id: 1,
			title: 'Новая жизнь',
			progress: 1,
			task: [ 'Получите паспорт в мэрии', 'Сдайте на права в автошколе', 'Заработайте первые 5.000$' ]
		},
		{
			id: 1,
			title: 'Новая жизнь',
			progress: 4,
			task: [ 'Получите паспорт в мэрии', 'Сдайте на права в автошколе', 'Заработайте первые 5.000$', 'dasdad', 'dasdad', 'dasdad', 'dasdad', 'dasdad' ]
		},
		{
			id: 1,
			title: 'Новая жизнь',
			progress: 1,
			task: [ 'Получите паспорт в мэрии', 'Сдайте на права в автошколе', 'Заработайте первые 5.000$' ]
		}
	])

	return (
		<>
			<h6 style={{display: !quests.length ? 'flex' : 'none'}} className="menu-body-notfound"><span>У Вас нет активных заданий</span></h6>
			<div style={{display: quests.length ? 'flex' : 'none'}} className="menu-body-quests">
				{quests.map((item, i) =>
				{
					return (<section key={i} className="menu-body-quests-item">
						<h1>
							{item.title}
							<span>{item.progress} / {item.task.length}</span>
						</h1>
						<div className="menu-body-quests-item-progress">
							<div style={{width: `${100 / item.task.length * item.progress}%`}}></div>
						</div>
						<div className="menu-body-quests-item-task">
							{item.task.map((task, taski) => {
								return (<h2 key={taski}>{item.progress >= taski + 1 ? (<strike>{taski + 1}. {task}</strike>) : `${taski + 1}. ${task}`}</h2>)
							})}
						</div>
						<button className="btn">Навигатор</button>
					</section>)
				})}
			</div>
		</>
	)
}