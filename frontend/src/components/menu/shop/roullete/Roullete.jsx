import React from 'react'
import $ from 'jquery'
import ragemp from '../../../../modules/ragemp'
import func from '../../../../modules/func'

import './roullete.css'
import { FaPlay } from 'react-icons/fa'

export default function Roullete(props) {
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

	const [ price, setPrice ] = React.useState(250)
	const [ toggle, setToggle ] = React.useState(false)
	const [ count, setCount ] = React.useState(1)
	const [ fast, setFast ] = React.useState(false)
	const [ roullete, setRoullete ] = React.useState([
		[],
		[],
		[],
		[]
	])

	const [ prize, setPrize ] = React.useState({})
	const [ prizeToggle, setPrizeToggle ] = React.useState(false)

	// function setRoulleteItems() {
	// 	const temp = [ [], [], [], [] ]
	// 	for(var d = 0; d < 4; d ++) {
	// 		const array = []

	// 		for(var i = 0; i < 100; i ++) {
	// 			const random = func.random(0, 100)

	// 			if(random >= 99 && random <= 100) {
	// 				let a = items.filter(item => item.rare === 'red')
	// 				array.push(a[func.random(0, a.length - 1)])
	// 			}
	// 			else if(random >= 97 && random <= 98) {
	// 				let a = items.filter(item => item.rare === 'gold')
	// 				array.push(a[func.random(0, a.length - 1)])
	// 			}
	// 			else if(random >= 90 && random < 97) {
	// 				let a = items.filter(item => item.rare === 'purple')
	// 				array.push(a[func.random(0, a.length - 1)])
	// 			}
	// 			else if(random >= 70 && random < 90) {
	// 				let a = items.filter(item => item.rare === 'blue')
	// 				array.push(a[func.random(0, a.length - 1)])
	// 			}
	// 			else if(random >= 50 && random < 70) {
	// 				let a = items.filter(item => item.rare === 'green')
	// 				array.push(a[func.random(0, a.length - 1)])
	// 			}
	// 			else if(random >= 0 && random < 50) {
	// 				let a = items.filter(item => item.rare === '')
	// 				array.push(a[func.random(0, a.length - 1)])
	// 			}
	// 		}
	// 		temp[d] = array
	// 	}
	// 	setRoullete(temp)
	// }
	function _setCount(c) {
		if(toggle === true)return
		return

		setCount(c)
		setTimeout(() => {
			for(var i = 1; i <= c; i ++) roulleteItemsCenter(i, 3)
		}, 50)
	}
	function roulleteItemsCenter(id, item, time = 0) {
		if(toggle === true)return
		$(`.menu-shop-roulette .menu-shop-roulette-body .menu-shop-roulette-body-wrap:nth-child(${id}) section .menu-shop-roulette-elem`).removeClass('menu-shop-roulette-elem-sel')

		const elem = $(`.menu-shop-roulette .menu-shop-roulette-body .menu-shop-roulette-body-wrap:nth-child(${id}) section .menu-shop-roulette-elem:nth-child(${item + 1})`)
		const parent = $(`.menu-shop-roulette .menu-shop-roulette-body .menu-shop-roulette-body-wrap:nth-child(${id}) section`)

		if(!elem.length)return

		parent[0].scrollLeft = 0
		$(`.menu-shop-roulette .menu-shop-roulette-body .menu-shop-roulette-body-wrap:nth-child(${id}) .menu-shop-roulette-body-center`).attr('class', 'menu-shop-roulette-body-center')

        parent.animate({
            scrollLeft: elem.position().left - parent[0].clientWidth / 2 + elem[0].clientWidth / 2 + 55
        }, {
        	duration: time,
        	complete: () => {
        		const temp = JSON.parse($(`.menu-shop-roulette .menu-shop-roulette-body`).attr('data-i'))

		    	elem.addClass('menu-shop-roulette-elem-sel')
		    	$(`.menu-shop-roulette .menu-shop-roulette-body .menu-shop-roulette-body-wrap:nth-child(${id}) .menu-shop-roulette-body-center`).addClass(`menu-shop-roulette-body-center-${temp[id - 1][item].rare}`)

		    	ragemp.send('ui::shop:roullete:prize')
		    }
        })
	}

	React.useEffect(() => {
		let temp = items
		temp.sort((a, b) => b.rare2 - a.rare2)

		setItems(temp)
		setCount(1)


		ragemp.eventCreate('client::shop:roullete', (cmd, data) => {
			switch(cmd) {
				case 'setItems': {
					setItems(data)
					break
				}
				case 'setPrice': {
					setPrice(data.price)
					break
				}
				case 'setRoullete': {
					setRoullete(data)
					break
				}
				case 'setPrize': {
					setPrize(data)
					setTimeout(() => setPrizeToggle(true), 200)

					break
				}
				case 'start': {
					for(var i = 1; i <= count; i ++) roulleteItemsCenter(i, data.item, !fast ? 7000 : 0)
					setToggle(true)

					break
				}
			}
		})

	}, [])
	React.useEffect(() => {
		for(var i = 1; i <= 4; i ++) roulleteItemsCenter(i, 3)
	}, [roullete])

	return (
		<>
			<div className={`menu-shop-roulette-prize ${prizeToggle === true && 'menu-shop-roulette-prize-show'} menu-shop-roulette-prize-${prize.rare}`}>
				<section>
					{prize.rare && prize.rare !== '' ? (<img className="menu-shop-roulette-prize-bg" src={`./assets/shop/roullete/prize-bg-${prize.rare}.png`} />) : ''}
					<h1>Поздравляем! Вы выйграли:</h1>
					<section>
						{prize.icon ? (<img src={prize.icon} />) : ''}
					</section>
					<h2>{prize.name}</h2>
					<div>
						<button onClick={() => {
							setPrizeToggle(false)
							ragemp.send('ui::shop:roullete:sellPrize')
						}} className="btn" style={{display: prize.sellPrice ? 'flex' : 'none'}}>
							Продать за <img src='./assets/donate.png' /> {prize.sellPrice && prize.sellPrice.toLocaleString()}
						</button>
						<button onClick={() => setPrizeToggle(false)} className="btn">Забрать</button>
					</div>
				</section>
			</div>
			<div className={`menu-shop-roulette-body menu-shop-roulette-body-${count}`} data-i={JSON.stringify(roullete)}>
				<div className="menu-shop-roulette-body-wrap">
					<section>
						{roullete[0].map((item, i) => {
							return (<div className={`menu-shop-roulette-elem menu-shop-roulette-elem-${item.rare}`}>
								<img src={item.icon} />
							</div>)
						})}
					</section>
					<div className="menu-shop-roulette-body-center"></div>
				</div>
				<div style={{display: count >= 2 ? 'block' : 'none'}} className="menu-shop-roulette-body-wrap">
					<section>
						{roullete[1].map((item, i) => {
							return (<div className={`menu-shop-roulette-elem menu-shop-roulette-elem-${item.rare}`}>
								<img src={item.icon} />
							</div>)
						})}
					</section>
					<div className="menu-shop-roulette-body-center"></div>
				</div>
				<div style={{display: count >= 3 ? 'block' : 'none'}} className="menu-shop-roulette-body-wrap">
					<section>
						{roullete[2].map((item, i) => {
							return (<div className={`menu-shop-roulette-elem menu-shop-roulette-elem-${item.rare}`}>
								<img src={item.icon} />
							</div>)
						})}
					</section>
					<div className="menu-shop-roulette-body-center"></div>
				</div>
				<div style={{display: count >= 4 ? 'block' : 'none'}} className="menu-shop-roulette-body-wrap">
					<section>
						{roullete[3].map((item, i) => {
							return (<div className={`menu-shop-roulette-elem menu-shop-roulette-elem-${item.rare}`}>
								<img src={item.icon} />
							</div>)
						})}
					</section>
					<div className="menu-shop-roulette-body-center"></div>
				</div>
				
			</div>
			<div className="menu-shop-roulette-bottom">
				<div className="menu-shop-roulette-bottom-count">
					<button onClick={() => _setCount(1)} className={`${count === 1 && 'btn-sel'}`}>
						<span>x1</span>
					</button>
				</div>
				<div onClick={() => {
					if(toggle === true)return
					ragemp.send('ui::shop:roullete:start')
				}} className={`menu-shop-roulette-bottom-play ${toggle === true && 'menu-shop-roulette-bottom-play-block'}`}>
					<FaPlay />
				</div>
				<div className="menu-shop-roulette-bottom-price">
					<h1>
						<img src='./assets/donate.png' />
						{price * count}
					</h1>
					<h2>
						<span>Быстро ?</span>
						<input onClick={() => toggle === false && setFast(!fast)} type="checkbox" className="input-swap" checked={fast} />
					</h2>
				</div>
			</div>
			<div className="menu-shop-roulette-prizes">
				{items.map((item, i) => {
					return (<div className={`menu-shop-roulette-elem menu-shop-roulette-elem-${item.rare} menu-shop-roulette-elem-sel`} data-name={item.name}>
							<img src={item.icon} />
						</div>)
				})}
			</div>
		</>
	)
}