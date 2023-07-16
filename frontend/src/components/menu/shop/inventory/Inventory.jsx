import React from 'react'
import $ from 'jquery'
import ragemp from '../../../../modules/ragemp'
import func from '../../../../modules/func'

import './inventory.css'

export default function Inventory(props) {
	const [ items, setItems ] = React.useState([
		{ id: 1, type: 'cash', count: 1000, rare: '', rare2: 0, icon: './assets/sharkcards/1.png', name: '1.000$' },
		{ id: 2, type: 'cash', count: 15000, rare: '', rare2: 0, icon: './assets/sharkcards/2.png', name: '15.000$' },
		{ id: 3, type: 'cash', count: 50000, rare: 'green', rare2: 1, icon: './assets/sharkcards/3.png', name: '50.000$' },
		{ id: 4, type: 'cash', count: 150000, rare: 'blue', rare2: 2, icon: './assets/sharkcards/4.png', name: '150.000$' },
		{ id: 5, type: 'cash', count: 500000, rare: 'purple', rare2: 3, icon: './assets/sharkcards/5.png', name: '500.000$' },

		{ id: 6, type: 'vehicle', model: 'stafford', count: 1, rare: 'green', rare2: 1, icon: './assets/vehicles/stafford.png', name: 'Enus Stafford', sellPrice: 300 },
		{ id: 7, type: 'vehicle', model: 'trophytruck2', count: 1, rare: 'blue', rare2: 2, icon: './assets/vehicles/trophytruck2.png', name: 'Vapid Desert Raid', sellPrice: 750 },
		{ id: 8, type: 'vehicle', model: 'stromberg', count: 1, rare: 'purple', rare2: 3, icon: './assets/vehicles/stromberg.png', name: 'Ocelot Stromberg', sellPrice: 1500 },
		{ id: 9, type: 'vehicle', model: 'autarch', count: 1, rare: 'gold', rare2: 4, icon: './assets/vehicles/autarch.png', name: 'Overflod Autarch', sellPrice: 2000 },
		{ id: 10, type: 'vehicle', model: 'nero2', count: 1, rare: 'gold', rare2: 4, icon: './assets/vehicles/nero2.png', name: 'Truffade Nero Custom', sellPrice: 2000 },
		{ id: 11, type: 'vehicle', model: 'tezeract', count: 1, rare: 'gold', rare2: 4, icon: './assets/vehicles/tezeract.png', name: 'Pegassi Tezeract', sellPrice: 2000 },

		{ id: 12, type: 'vip', count: 1, rare: 'purple', rare2: 3, icon: './assets/vip/vip.png', name: 'Brilliant VIP' },

		{ id: 13, type: 'donate', count: 100, rare: 'green', rare2: 1, icon: './assets/donate.png', name: '100 доната' },
		{ id: 14, type: 'donate', count: 250, rare: 'blue', rare2: 2, icon: './assets/donate.png', name: '250 доната' },
		{ id: 15, type: 'donate', count: 500, rare: 'purple', rare2: 3, icon: './assets/donate.png', name: '500 доната' },
		{ id: 16, type: 'donate', count: 1500, rare: 'gold', rare2: 4, icon: './assets/donate.png', name: '1.500 доната' },

		{ id: 17, type: 'vehicle', model: 'banshee', count: 1, rare: 'red', rare2: 5, icon: './assets/vehicles/banshee.png', name: 'Bravado Banshee', sellPrice: 10000 }
	])

	return (
		<>
			{items.map((item, i) => {
				return (<div className="menu-shop-inventory-elem">
					<h1>{item.name}</h1>
					<section>
						<img src={item.icon} />
					</section>
					<div>
						<button className="btn" style={{display: item.sellPrice ? 'flex' : 'none'}}>
							Продать за <img src='./assets/donate.png' /> {item.sellPrice && item.sellPrice.toLocaleString()}
						</button>
						<button className="btn">Забрать в игру</button>
					</div>
				</div>)
			})}
		</>
	)
}