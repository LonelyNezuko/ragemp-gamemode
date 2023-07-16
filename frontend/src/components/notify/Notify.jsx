import React from 'react'
import $ from 'jquery'
import ragemp from '../../modules/ragemp'
import random from '../../modules/random'

import { IoIosCheckmarkCircle } from 'react-icons/io'
import { MdError } from 'react-icons/md'
import { TiInfo } from 'react-icons/ti'

import './notify.css'

export default function Notify() {
	const [ notify, setNotify ] = React.useState([])
	function addNotify(text, type = 'info', time = 5000) {
		const id = random.textNumber(32)
		setNotify(old => { return [...old, [text, type, id, setTimeout(() => {
			const arr = JSON.parse($('.notify').attr('data-array')).filter(el => el[2] !== id)
			setNotify(i => { return [...arr] })
		}, time + 5)]] })
	}

	ragemp.eventCreate('client::notify', (cmd, data) => {
		if(cmd === 'add') {
			addNotify(data.text, data.type || 'info', data.time || 5000)
		}
	})
	return (
		<div className="notify" data-array={JSON.stringify(notify)}>
			{notify.map((item, i) => {
				return (<section key={i} className={`notify-${item[1]}`}>
						{item[1] === 'success' ? (<IoIosCheckmarkCircle />) : item[1] === 'error' ? (<MdError />) : <TiInfo />}
						<h1>{item[0]}</h1>
					</section>)
			})}
		</div>
	)
}