import React from 'react'
import $ from 'jquery'
import ragemp from '../../modules/ragemp'

import './fuel.css'

export default function Fuel() {
	const [ toggle, setToggle ] = React.useState(false)

	const [ type, setType ] = React.useState([ 7, 10, 3, 15, 25, -1, -1, -1 ])
	const [ typeSel, setTypeSel ] = React.useState(0)
	const typeList = [
		[ 'Dieasel', 'diesel' ],
		[ 'AI-92', 'ai92' ],
		[ 'AI-95', 'ai95' ],
		[ 'AI-98', 'ai98' ],
		[ 'AI-100', 'ai100' ],
		[ 'Electro', 'electro' ],
		[ 'B-92', 'b92' ],
		[ 'B-91', 'b91' ]
	]

	const [ count, setCount ] = React.useState(0)

	return (
		<div className="fuel" style={{display: !toggle ? 'none' : 'block'}}>
			<div className="fuel-type">
				{typeList.map((item, i) => {
					if(type[i] === -1)return (<></>)
					return (<div onClick={() => setTypeSel(i)} className="fuel-type-elem">
							<h1>{item[0]}</h1>
							<div className="fuel-type-preview">
								<div className={`fuel-liquid fuel-liquid-${item[1]} ${typeSel === i && 'fuel-liquid-playing'}`}></div>
							</div>
							<section>
								<h2>
									{type[i].toLocaleString()}$ <span>/ {item[1] === 'Electro' ? 'киловатт' : 'литр'}</span>
								</h2>
								<input type="radio" checked={typeSel === i ? true : false} />
							</section>
						</div>)
				})}
			</div>
			<div className="fuel-body">
				<div className="fuel-body-fill">
					<div className="fuel-body-fill-percent">
						<h1>100%</h1>
						<h1>80%</h1>
						<h1>60%</h1>
						<h1>40%</h1>
						<h1>20%</h1>
						<section></section>
						<h1>0%</h1>
					</div>
					<div className="fuel-body-fill-coub">
						<div className={`fuel-liquid fuel-liquid-playing fuel-liquid-${typeList[typeSel][1]}`}></div>
					</div>
					<div className="fuel-body-fill-range">
						<input type="range" min="0" max="120" step="1" value={count} onChange={elem => setCount(elem.target.value)} />
					</div>
				</div>
				<div className="fuel-body-shop">
					<header>
						<h1>Магазин</h1>
						<h2>Ешь, пей, чинись!</h2>
					</header>
					<div className="fuel-body-shop-elems">
						<div className="fuel-body-shop-item">
							<img src='./assets/inventory/items/burger.png' />
							<h1>Бургер</h1>
							<h2>1 572 $</h2>

							<div>
								<h2>Оплатить</h2>
								<button className="btn">Наличными</button>
								<button className="btn">Картой</button>
							</div>
						</div>
						<div className="fuel-body-shop-item">
							<img src='./assets/inventory/items/ak47.png' />
							<h1>Бургер</h1>
							<h2>1 572 $</h2>

							<div>
								<h2>Оплатить</h2>
								<button className="btn">Наличными</button>
								<button className="btn">Картой</button>
							</div>
						</div>
						<div className="fuel-body-shop-item">
							<img src='./assets/inventory/items/burger.png' />
							<h1>Бургер</h1>
							<h2>1 572 $</h2>

							<div>
								<h2>Оплатить</h2>
								<button className="btn">Наличными</button>
								<button className="btn">Картой</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}