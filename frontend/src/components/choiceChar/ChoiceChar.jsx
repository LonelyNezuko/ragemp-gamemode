import React from 'react'
import $ from 'jquery'
import ragemp from '../../modules/ragemp'

import './choiceChar.css'

import { BsGlobe2 } from 'react-icons/bs'

import { FaDollarSign } from 'react-icons/fa'
import { FaPiggyBank } from 'react-icons/fa'
import { HiUserGroup } from 'react-icons/hi'
import { RiBarChartGroupedFill } from 'react-icons/ri'

import { IoIosCreate } from 'react-icons/io'
import { FaDonate } from 'react-icons/fa'

import { SiBitcoincash } from 'react-icons/si'

export default function ChoiceChar() {
	const [ toggle, setToggle ] = React.useState(false)

	const [ characters, setCharacters ] = React.useState([
		{},
		{},
		{ donate: true }
	])
	function submit(id) {
		if(characters[id].id) {
			ragemp.send('ui::user:choiceChar', { id: characters[id].id })
		}
		else if(characters[id].donate) {
			ragemp.send('ui::user:choiceChar:buy')
		}
		else ragemp.send('ui::user:choiceChar:create')
	}

	React.useEffect(() => {
		ragemp.eventCreate('client::choiceChar', (cmd, data) => {
			switch(cmd) {
				case 'toggle': {
					setToggle(data.status)
					break
				}
				case 'setCharacters': {
					setCharacters(data)
					break
				}
			}
		})
	}, [])

	return (
		<div className="choicechar" style={!toggle ? {display: 'none'} : {display: 'flex'}}>
			{characters.map((item, i) => {
				if(item.name)return (
					<section key={i} className="choicechar-elem">
						<header className="choicechar-elem-header">
							<h1>
								{item.name}
								<span>#{item.id}</span>
							</h1>
							<div>
								<BsGlobe2 />
								<h2>{item.level}</h2>
							</div>
						</header>
						<div className="choicechar-elem-body">
							<section>
								<div>
									<button>
										<FaDollarSign />
									</button>
									<h1>Наличные</h1>
								</div>
								<h2>{item.data.cash.toLocaleString()} $</h2>
							</section>
							<section>
								<div>
									<button>
										<FaPiggyBank />
									</button>
									<h1>Банк</h1>
								</div>
								<h2>{item.data.bank.toLocaleString()} $</h2>
							</section>
							<section>
								<div>
									<button>
										<RiBarChartGroupedFill />
									</button>
									<h1>Фракция</h1>
								</div>
								<h2>{item.data.fraction}</h2>
							</section>
							<section>
								<div>
									<button>
										<HiUserGroup style={{transform: 'translateY(-1px)'}} />
									</button>
									<h1>Семья</h1>
								</div>
								<h2>{item.data.family}</h2>
							</section>
						</div>
						<div className="choicechar-elem-footer">
							<button onClick={() => submit(i)} className="btn">Выбрать</button>
						</div>
					</section>)
				if(item.donate)return (
					<section key={i} className="choicechar-elem">
						<header className="choicechar-elem-header">
							<h1>Закрыто</h1>
						</header>
						<div className="choicechar-elem-body">
							<section className="choicechar-elem-body-svg">
								<FaDonate />
							</section>
							<h3>Сперва данный слот нужно купить, после уже можно создать персонажа</h3>
						</div>
						<div className="choicechar-elem-footer">
							<button onClick={() => submit(i)} className="btn">Купить <span style={{fontSize: '12px', display: 'flex', alignItems: 'center', marginLeft: '10px'}}>( 500 <SiBitcoincash style={{margin: '0 3px 0 3px', fontSize: '12px'}} /> )</span></button>
						</div>
					</section>)
				return (
					<section key={i} className="choicechar-elem">
						<header className="choicechar-elem-header">
							<h1>Пусто</h1>
						</header>
						<div className="choicechar-elem-body">
							<section className="choicechar-elem-body-svg">
								<IoIosCreate />
							</section>
							<h3>Ты можешь создать нового персонажа на данный слот</h3>
						</div>
						<div className="choicechar-elem-footer">
							<button onClick={() => submit(i)} className="btn">Создать</button>
						</div>
					</section>)
			})}
		</div>
	)
}