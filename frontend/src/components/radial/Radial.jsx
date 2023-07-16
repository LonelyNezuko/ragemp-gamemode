import React from 'react'
import $ from 'jquery'
import ragemp from '../../modules/ragemp'

import './radial.css'

import { AiFillCar } from 'react-icons/ai'
import { FaUserEdit } from 'react-icons/fa'

import { RiCloseCircleFill } from 'react-icons/ri'

export default function Radial() {
	const btnPos = [
		{top: '50%', right: '120%', transform: 'translateY(-50%)'},
		{top: '50%', left: '120%', transform: 'translateY(-50%)'},
		{top: '5%', right: '105%'},
		{top: '5%', left: '105%'},
		{bottom: '5%', right: '105%'},
		{bottom: '5%', left: '105%'},
		{top: '-27%', right: '75%'},
		{top: '-27%', left: '75%'},
		{bottom: '-27%', right: '75%'},
		{bottom: '-27%', left: '75%'},
		{top: '-58%', right: '50%', transform: 'translateX(50%)'},
		{bottom: '-58%', right: '50%', transform: 'translateX(50%)'}
	]
	const [ data, setData ] = React.useState({
		type: '',
		name: 'VAZ 2106',

		btn: ['Открыть', 'Запустить двигатель', 'Багажник', 'Заглянуть в багажник', 'Открыть окна', 'Заглянуть в багажник', 'Открыть окна', 'Заглянуть в багажник', 'Открыть окна', 'Заглянуть в багажник', 'Открыть окна', 'Открыть окна']
	})

	React.useEffect(() => {
		ragemp.eventCreate('client::radial', (cmd, data) => {
			if(cmd === 'setData') {
				setData(data)
			}
		})

		$('body').keydown(e =>
		{
			if($('.radial').css('display') !== 'none'
				&& e.keyCode === 27) {
				e.preventDefault()
				ragemp.send('ui::radial:close')
			}
		})
	}, [])

	return (
		<div className="radial" style={{display: !data.type.length ? 'none' : 'block'}}>
			<div className="radial-center" onClick={() => ragemp.send('ui::radial:close')}>
				<section>
					{data.type === 'vehicle' ? (<AiFillCar />) : (<FaUserEdit />)}
					<h1>{data.name}</h1>
				</section>
				<section>
					<RiCloseCircleFill />
					<h1>Закрыть</h1>
				</section>
			</div>

			{data.btn.map((item, i) => {
				return (<button onClick={() => ragemp.send('ui::radial', { btn: item })} key={i} style={btnPos[i]} className="btn radial-btn">
						<h2>{i + 1}.</h2>
						<h1>{item}</h1>
					</button>)
			})}
		</div>
	)
}