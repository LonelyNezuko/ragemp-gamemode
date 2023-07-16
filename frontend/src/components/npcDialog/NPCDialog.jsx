import React from 'react'
import $ from 'jquery'
import ragemp from '../../modules/ragemp'
import func from '../../modules/func'

import './npcDialog.css'

export default function NPCDialog() {
	const [ toggle, setToggle ] = React.useState(false)
	const [ data, setData ] = React.useState({
		name: 'Nezuko Kamado',
		desc: 'Разработчик этой хуйни',
		text: 'Здарова, что тебе нужно?',
		btn: ['Привет, как дела?', 'Че ты такой борзый?', 'Где купить соль?', 'Как жопа?', '%last%Пока']
	})

	React.useEffect(() => {
		$('.npcDialog .npcDialog-btn').css('display', 'none')
		func.split(data.text, '.npcDialog .npcDialog-body')

		setTimeout(() => {
			$('.npcDialog .npcDialog-btn').css('display', 'flex')
		}, 60 * data.text.length)
	}, [data])
	React.useEffect(() => {
		ragemp.eventCreate('client::npcDialog', (cmd, data) => {
			switch(cmd) {
				case 'toggle': {
					setToggle(data.status)
					break
				}
				case 'setData': {
					setData(data)
					break
				}
			}
		})

		$('body').keydown(e =>
		{
			if($('.npcDialog').css('display') !== 'none'
				&& e.keyCode === 32) {
				e.preventDefault()
			
				$('.npcDialog .npcDialog-body').find('span').css('opacity', '1')
				$('.npcDialog .npcDialog-btn').css('display', 'flex')
			}
		})
	}, [])

	return (
		<div className="npcDialog" style={{display: !toggle ? 'none' : 'block'}}>
			<header>
				<h1>{data.name}</h1>
				<h2 className='btn'>{data.desc}</h2>
			</header>
			<div className="npcDialog-body"></div>
			<div className="npcDialog-btn" style={{display: 'none'}}>
				{data.btn.map((item, i) => {
					return (<button onClick={() => ragemp.send('ui::npcDialog', { btn: item.replace('%last%', '') })} key={i} style={data.btn.length % 2 === 1 && i === data.btn.length - 1 ? {width: "100%"} : {}} className={`btn ${item.indexOf('%last%') !== -1 && 'npcDialog-btn-cancel'}`}>{item.replace('%last%', '')}</button>)
				})}
			</div>
		</div>
	)
}