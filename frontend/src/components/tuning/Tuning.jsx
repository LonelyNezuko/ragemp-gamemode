import React from 'react'
import $ from 'jquery'

import './tuning.css'

import { IoCheckmarkCircle } from 'react-icons/io5'

export default function Tuning() {
	const [ toggle, setToggle ] = React.useState(false)

	const [ tuning, setTuning ] = React.useState([
		{ img: 'engine.png', name: 'Двигатель', desc: 'Чем лучше двигатель, тем тачка быстрее. Да?', elems: [
			{ name: 'Двигатель 1 уровня', price: 7599, buy: true },
			{ name: 'Двигатель 2 уровня', price: 7599 },
			{ name: 'Двигатель 3 уровня', price: 7599 },
			{ name: 'Двигатель 4 уровня', price: 7599 },
			{ name: 'Двигатель 5 уровня', price: 7599 }
		] },
		{ img: 'wheels.png', name: 'Колеса', desc: 'Хорошие колеса - жизнь дольше', elems: [
			{ name: 'Какие-то там колеса', price: 7599 },
			{ name: 'Какие-то там колеса 2', price: 7599 },
			{ name: 'Какие-то там колеса 3', price: 7599 },
			{ name: 'Какие-то там колеса 4', price: 7599, buy: true },
			{ name: 'Какие-то там колеса 5', price: 7599 }
		] }
	])

	const [ tuningSel, setTuningSel ] = React.useState(-1)
	const [ tuningElemSel, setTuningElemSel ] = React.useState(0)

	React.useEffect(() => {
		if(tuningSel !== -1) {
			let id = null
			tuning[tuningSel].elems.map((item, i) => {
				if(item.buy && id === null) id = i
			})

			setTuningElemSel(id || 0)
		}
	}, [tuningSel])

	return (
		<div className="tuning" style={{display: !toggle ? 'none' : 'flex'}}>
			<div className="tuning-menu">
				<h1 className="tuning-menu-title">Los Santos Customs</h1>
				<section className="tuning-menu-list">
					{tuning.map((item, i) => {
						return (<section data-id={i} key={i} className={`tuning-menu-list-item ${tuningSel === i && 'tuning-menu-list-item-sel'}`}>
								<div onClick={() => setTuningSel(tuningSel === i ? -1 : i)} className="tuning-menu-list-item-desc">
									<img src={`./assets/tuning/menu/${item.img}`} className="tuning-menu-list-item-desc-img" />
									<h1>
										{item.name}
										<span>{item.desc}</span>
									</h1>
								</div>
								<div className="tuning-menu-list-item-body">
									<div style={{height: `calc(100% - 15px - 8px - 0.5px${item.elems[item.elems.length - 1].buy ? ' - 8px' : ''}${!item.elems[item.elems.length - 1].buy && tuningElemSel === item.elems.length - 1 ? ' - 19px' : ''})`}} className="tuning-menu-list-item-body-visual"></div>
									{item.elems.map((e, ei) => {
										return (<section onClick={() => setTuningElemSel(ei)} key={ei} className={`${tuningElemSel === ei && 'tuning-menu-list-item-body-sel'}`}>
												<h1>{e.name}</h1>
												<div>
													{e.buy ? (<IoCheckmarkCircle />) : ''}
													<h2>{e.buy ? 'Куплено' : e.price.toLocaleString() + ' $'}</h2>
													{tuningElemSel === ei && !e.buy ? (<button className="btn">Купить</button>) : ''}
												</div>
											</section>)
									})}
								</div>
							</section>)
					})}
				</section>
			</div>
		</div>
	)
}