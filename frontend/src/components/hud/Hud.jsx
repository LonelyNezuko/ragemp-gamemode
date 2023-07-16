import React from 'react'
import $ from 'jquery'
import ragemp from '../../modules/ragemp'

import BtnKey from '../../modules/btnKey'

import CONFIG from '../../config.json'

import random from '../../modules/random'

import { RiRadioButtonLine } from 'react-icons/ri'
import { RiUserFill } from 'react-icons/ri'
import { MdOutlineAttachMoney } from 'react-icons/md'
import { RiBankCardLine } from 'react-icons/ri'
import { HiOutlineIdentification } from 'react-icons/hi'

import { IoIosCheckmarkCircle } from 'react-icons/io'
import { MdError } from 'react-icons/md'
import { TiInfo } from 'react-icons/ti'

import { BsFillPatchQuestionFill } from 'react-icons/bs'

import { FaMicrophoneAlt } from 'react-icons/fa'
import { FaMicrophoneAltSlash } from 'react-icons/fa'
import { MdFastfood } from 'react-icons/md'
import { MdEmojiFoodBeverage } from 'react-icons/md'

import './hud.css'

import HudChat from './chat'

export default function Hud() {

	const [ accountData, setAccountData ] = React.useState({
		mute: 0
	})

	const [ notf, setNotf ] = React.useState([])
	function addNotf(text, type = 'info', time = 5000) {
		const id = random.textNumber(32)
		setNotf(old => { return [...old, [text, type, id, setTimeout(() => {
			const arr = JSON.parse($('.hud .hud-notf').attr('data-array')).filter(el => el[2] !== id)
			setNotf(i => { return [...arr] })
		}, time + 5)]] })
	}

	const [ banner, setBanner ] = React.useState(['', ''])
	const [ quest, setQuest ] = React.useState(['', ''])

	const [ data, setData ] = React.useState({
		online: 1513,
		id: 275,

		accountName: 'Nezuko_Kamado',
		accountID: 1,

		cash: 58172346,
		bank: 295812,

		needs: [52, 78]
	})
	const [ map, setMap ] = React.useState({
		gps: ['Los Santos', 'Santa-Maria'],
		pos: ['15%', '15%']
	})
	const [ micro, setMicro ] = React.useState(false)

	const [ keysPos, setKeysPos ] = React.useState(['1%', '30%'])
	const [ keys, setKeys ] = React.useState([
		[ 'TAB', 'Открыть меню' ],
		[ 'F5', 'Тех. поддержка' ],
		[ 'I', 'Инвентарь' ],
		[ 'UP', 'Телефон' ]
	])
	const [ keysToggle, setKeysToggle ] = React.useState(1)

	const [ action, setAction ] = React.useState({
		key: "E",
		text: ''
	})

	function toggle(status) {
		$('.hud').css('display', !status ? 'none' : 'block')
	}

	React.useEffect(() => {
		ragemp.eventCreate('client::hud', (cmd, data) => {
            switch(cmd)
            {
                case 'toggle':
                {
                    toggle(data.status)
                    break
                }
            	case 'addNotf':
                {
                    addNotf(data.text, !data.type && 'info', !data.time && 5000)
                    break
                }
                case 'setData':
                {
                    setData(data)
                    break
                }
            	case 'setAccountData':
                {
                    setAccountData(data)
                    break
                }
            	case 'setMicro':
                {
                    setMicro(data.micro)
                    break
                }
            	case 'setQuest':
                {
                    setQuest(data)
                    break
                }
            	case 'setBanner':
                {
                    setBanner(data)
                    break
                }
            	case 'setMap':
                {
                    setMap(data)
                    break
                }
            	case 'setKeys': {
            		setKeys(data)
            		break
            	}
            	case 'setKeysPos': {
            		setKeysPos(data)
            		break
            	}
            	case 'setKeysToggle': {
            		setKeysToggle(data.status)
            		break
            	}
            	case 'setAction': {
            		setAction(data)
            		break
            	}
            }
        })
	}, [])

	return (
		<div className="hud" style={{display: 'none'}}>
			<div className="hud-action" style={{display: !action.text.length ? 'none' : 'flex'}}>
				<BtnKey keys={action.key} />
				<h1>{action.text}</h1>
			</div>
			<div className="hud-keys" style={{left: keysPos[0], bottom: keysPos[1], display: keysToggle === 0 ? 'none' : 'block'}}>
				{keys.map((item, i) => {
					return (<h1>
							<BtnKey keys={item[0]} />
							<span>{item[1]}</span>
						</h1>)
				})}
			</div>
			<div className="hud-map" style={{left: map.pos[0], bottom: map.pos[1]}}>
				<div className="hud-map-gps">
					<h1>{map.gps[0]}</h1>
					<h2>{map.gps[1]}</h2>
				</div>
				<div className="hud-map-needs">
					<section className="hud-map-needs-satiety">
						<svg viewBox="0 0 50 50">
						    <circle id="path" cx="25" cy="25" r="20" fill="none" stroke-width="4" style={{"stroke-dashoffset": -126 + ((126 / 100) * (100 / (100 / data.needs[0])))}}></circle>
						</svg>
						<MdFastfood className="hud-map-needs-bg" />
					</section>
					<section className="hud-map-needs-thirst">
						<svg viewBox="0 0 50 50">
						    <circle id="path" cx="25" cy="25" r="20" fill="none" stroke-width="4" style={{"stroke-dashoffset": -126 + ((126 / 100) * (100 / (100 / data.needs[1])))}}></circle>
						</svg>
						<MdEmojiFoodBeverage className="hud-map-needs-bg" />
					</section>
				</div>
				<div className="hud-map-micro" style={micro !== true ? {display: 'none'} : {display: 'flex'}}>
					<FaMicrophoneAlt />
				</div>
			</div>
			<div className="hud-banner" style={!banner[0].length ? {display: 'none'} : {display: 'flex'}}>
				<h1 style={banner[0] === 'text' ? {display: 'block'} : {display: 'none'}}>{banner[1]}</h1>
				<img style={banner[0] === 'img' ? {display: 'block'} : {display: 'none'}} src={banner[1]} />
			</div>
			<div className="hud-notf" data-array={`${JSON.stringify(notf)}`}>
				{notf.map((item, i) => {
					return (<section key={i} className={`hud-notf-${item[1]}`}>
							{item[1] === 'success' ? (<IoIosCheckmarkCircle />) : item[1] === 'error' ? (<MdError />) : (<TiInfo />)}
							<span>{item[0]}</span>
						</section>)
				})}
			</div>
			<HudChat accountData={accountData} />
			<div className="hud-logo">
				<div className="hud-logo-img">
					{/*<img src='/assets/logo2.png' />*/}
					<h1>{CONFIG.projectName}</h1>
				</div>
				<div className="hud-data">
					<section>
						<h1>
							<RiRadioButtonLine />
							<span>{data.online}</span>
						</h1>
						<h1>
							<RiUserFill />
							<span>{data.id}</span>
						</h1>
					</section>
					<section>
						<h1>
							<HiOutlineIdentification />
							<span>{data.accountName}#{data.accountID}</span>
						</h1>
					</section>
				</div>
				<div className="hud-cash">
					<h1>
						<MdOutlineAttachMoney />
						<span>{data.cash.toLocaleString()}</span>
					</h1>
					<h1>
						<RiBankCardLine />
						<span>{data.bank.toLocaleString()}</span>
					</h1>
				</div>
				<div className="hud-quest" style={!quest[0].length ? {display: 'none'} : {display: 'block'}}>
					<h1>
						<BsFillPatchQuestionFill />
						<span>{quest[0]}</span>
					</h1>
					<h2>{quest[1]}</h2>
				</div>
			</div>
		</div>)
}