import React from 'react'
import $ from 'jquery'
import ragemp from '../../modules/ragemp'

import './rent.css'

import { IoCloseSharp } from 'react-icons/io5'

export default function Rent() {
	const [ toggle, setToggle ] = React.useState(false)

	const [ vehicle, setVehicle ] = React.useState([
		{ id: 'faggio', name: "Faggio", price: 150, data: {
			traction: [ 85, 125 ],
			acceleration: [ 85, 125 ],
			braking: [ 85, 125 ],
			agility: [ 85, 125 ],
			fuel: [ 20, 200 ],
			fuelType: 'AI-95'
		} },
		{ id: 'tailgater2', name: "Tailgater", price: 8500, data: {
			traction: [ 125, 250 ],
			acceleration: [ 85, 250 ],
			braking: [ 85, 250 ],
			agility: [ 85, 250 ],
			fuel: [ 20, 200 ],
			fuelType: 'AI-95'
		} },
		{ id: 'warrener', name: "Warrener", price: 5723, data: {
			traction: [ 85, 125 ],
			acceleration: [ 85, 125 ],
			braking: [ 85, 125 ],
			agility: [ 85, 125 ],
			fuel: [ 20, 200 ],
			fuelType: 'AI-95'
		} }
	])
	const [ vehicleSel, setVehicleSel ] = React.useState(0)

	React.useEffect(() => {
		ragemp.eventCreate('client::rent', (cmd, data) => {
			switch(cmd) {
				case 'toggle': {
					setToggle(data.status)
					break
				}
				case 'setVehicle': {
					setVehicleSel(0)
					setVehicle(data)

					break
				}
			}
		})

		// Закрытие
		$('body').keydown(e =>
		{
			if($('.rent').css('display') !== 'none'
				&& e.keyCode === 27) {
				e.preventDefault()

				setToggle(false)
				ragemp.send('ui::rent:close', {}, true)
			}
		})
	}, [])

	return (
		<div className="rent" style={{display: !toggle ? 'none' : 'block'}}>
			<header>
				<h1>Аренда транспорта</h1>
				<button onClick={() => {setToggle(false); ragemp.send('ui::rent:close', {}, true)}}>
					<IoCloseSharp />
				</button>
			</header>
			<div className="rent-wrap">
				<div className="rent-stats">
					<img src={`./assets/rent/${vehicle[vehicleSel].id}.png`} />
					<h1>{vehicle[vehicleSel].name}</h1>
					<section>
						<div className="rent-stats-elem">
							<h2>Скорость</h2>
							<div>
								<div style={{width: vehicle[vehicleSel].data.traction[0] / vehicle[vehicleSel].data.traction[1] * 100 + '%'}}></div>
							</div>
						</div>
						<div className="rent-stats-elem">
							<h2>Ускроение</h2>
							<div>
								<div style={{width: vehicle[vehicleSel].data.acceleration[0] / vehicle[vehicleSel].data.acceleration[1] * 100 + '%'}}></div>
							</div>
						</div>
						<div className="rent-stats-elem">
							<h2>Торможение</h2>
							<div>
								<div style={{width: vehicle[vehicleSel].data.braking[0] / vehicle[vehicleSel].data.braking[1] * 100 + '%'}}></div>
							</div>
						</div>
						<div className="rent-stats-elem">
							<h2>Управление</h2>
							<div>
								<div style={{width: vehicle[vehicleSel].data.agility[0] / vehicle[vehicleSel].data.agility[1] * 100 + '%'}}></div>
							</div>
						</div>
						<div className="rent-stats-elem">
							<h2>
								Топливо
								<span>20 литров</span>
							</h2>
							<div>
								<div style={{width: vehicle[vehicleSel].data.fuel[0] / vehicle[vehicleSel].data.fuel[1] * 100 + '%'}}></div>
							</div>
						</div>
						<div className="rent-stats-elem rent-stats-elem-text">
							<h2>
								Тип топлива
								<span>{vehicle[vehicleSel].data.fuelType}</span>
							</h2>
						</div>
					</section>
					<button onClick={() => ragemp.send('ui::rent', { vehicle: vehicle[vehicleSel] })} className="btn">Арендовать</button>
				</div>
				<div className="rent-body">
					{vehicle.map((item, i) => {
						return (<section onClick={() => setVehicleSel(i)} key={i} className={`rent-body-elem ${vehicleSel === i && 'rent-body-elem-sel'}`}>
								<img src={`./assets/rent/${item.id}.png`} />
								<h1>{item.name}</h1>
								<h2>{item.price.toLocaleString()}$ <span>/ час</span></h2>
							</section>)
					})}
				</div>
			</div>
		</div>
	)
}