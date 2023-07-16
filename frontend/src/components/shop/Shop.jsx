import React from 'react'
import $ from 'jquery'
import ragemp from '../../modules/ragemp'

import { IoFastFoodSharp } from 'react-icons/io5'
import { FaTools } from 'react-icons/fa'
import { MdOtherHouses } from 'react-icons/md'
import { TiPointOfInterest } from 'react-icons/ti'

import './shop.css'

export default function Shop() {
	const [ toggle, setToggle ] = React.useState(false)

	const [ nav, setNav ] = React.useState([
		[ // shop 24.7
			{ name: 'Еда', ico: (<IoFastFoodSharp />) },
			{ name: 'Инструменты', ico: (<FaTools />) },
			{ name: 'Бытовое', ico: (<MdOtherHouses />) },
			{ name: 'Прочее', ico: (<TiPointOfInterest />) }
		]
	])
	const [ navSel, setNavSel ] = React.useState(0)

	const [ type, setType ] = React.useState(0)
	const [ items, setItems ] = React.useState([
		{ id: 2, ico: 'burger.png', name: 'Гамбургер', price: 250 }
	])

	const [ bankCard, setBankCard ] = React.useState(0)

	function submit(id, price, type) {
		ragemp.send('ui::shop', {
			id,
			price,
			type
		})
	}

	React.useEffect(() => {
		ragemp.eventCreate('client::shop', (cmd, data) => {
			switch(cmd) {
				case 'toggle': {
					setToggle(data.status)

					setType(data.type || 0)
					setItems(data.items || [])
					setBankCard(data.bankCard || 0)

					break
				}
			}
		})
	}, [])

	return (
		<div className="shop" style={{display: !toggle ? 'none' : 'block'}}>
			{/*<div className="shop-header">
				<div className="shop-header-logo">
					<img src='./assets/shop/247.png' />
				</div>
			</div>*/}

			<div className="shop-wrap">
				<div className="shop-nav">
					{nav[type].map((item, i) => {
						return (<section onClick={() => setNavSel(i)} className={`shop-nav-elem ${i === navSel && 'shop-nav-elem-sel'}`}>
								<div>
									{item.ico}
								</div>
								<h1>{item.name}</h1>
							</section>)
					})}
				</div>
				<div className="shop-body">
					{items.map((item, i) => {
						return (<div className="shop-body-item">
								<div className="shop-body-item-img">
									<img src={`./assets/inventory/items/${item.ico}`} />
								</div>
								<h1>
									{item.name}
									<span>{item.price.toLocaleString()} $</span>
								</h1>
								<div className="shop-body-item-btn">
									<h2>Оплатить</h2>
									<button onClick={() => submit(item.id, item.price, 0)} className="btn">Наличными</button>
									{bankCard > 0 ? (<button onClick={() => submit(item.id, item.price, 1)} className="btn">Картой</button>) : ''}
								</div>
							</div>)
					})}
				</div>
			</div>
		</div>
	)
}