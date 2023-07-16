import React from 'react'
import $ from 'jquery'
import "jquery-ui-dist/jquery-ui"
import 'jquery.scrollto'
import ragemp from '../../../modules/ragemp'

import './inventory.css'

import { GiTopHat } from 'react-icons/gi'
import { IoMdGlasses } from 'react-icons/io'
import { IoEarSharp } from 'react-icons/io5'
import { IoWatch } from 'react-icons/io5'
import { IoHandRight } from 'react-icons/io5'
import { GiHeartNecklace } from 'react-icons/gi'

import { GiMonclerJacket } from 'react-icons/gi'
import { GiArmoredPants } from 'react-icons/gi'
import { GiSonicShoes } from 'react-icons/gi'

import { GiKevlarVest } from 'react-icons/gi'
import { TbParachute } from 'react-icons/tb'

import { GiHeavyBullets } from 'react-icons/gi'
import { GiAk47 } from 'react-icons/gi'

import { GiLightBackpack } from 'react-icons/gi'

export default function Inventory() {
	const [ data, setData ] = React.useState({
		main: {
			weight: 30
		},
		backpack: {
			weight: 30
		}
	})
	const [ nearbyName, setNearbyName ] = React.useState('Окружение')

	const [ items, setItems ]  = React.useState([])
	const [ backpack, setBackpack ]  = React.useState([])
	const [ nearby, setNearby ] = React.useState([])
	const [ fastList, setFastList ] = React.useState([
		{}, {}, {}, {}
	])
	// { id: 1, name: 'Телефон', weight: .7, img: 'phone.png', count: 1, status: 100 },


	function getWeight(i) {
		let weight = 0.0
		i.map(item => {
			if(item.id) weight += item.weight * item.count
		})

		return weight.toFixed(1)
	}
	function getStatus(status) {
		if(status < 25)return 'verybad'
		if(status >= 25 && status < 50)return 'bad'
		if(status >= 50 && status < 75)return 'normal'
		if(status >= 75)return 'good'
	}


	const [ charList, setCharList ] = React.useState([
		{ id: "hat", styles: {top: '-5%', left: '50%', transform: 'translateX(-50%)'}, item: {} },
		{ id: "glassess", styles: {top: '5%', left: '50%', transform: 'translateX(-50%)', height: "30px"}, item: {} },
		{ id: "ear", styles: {top: '5%', right: '21%', width: "30px"}, item: {} },
		{ id: "watches", styles: {bottom: '42%', right: '0%', transform: 'translateY(-50%)'}, item: {} },
		{ id: "bracelets", styles: {bottom: '42%', left: '0%', transform: 'translateY(-50%)'}, item: {} },
		{ id: "accesory", styles: {top: '11.5%', left: '50%', transform: 'translateX(-50%)'}, item: {} },

		{ id: "top", styles: {top: '25%', left: '50%', transform: 'translateX(-50%)'}, item: {} },
		{ id: "legs", styles: {bottom: '22%', left: '50%', transform: 'translateX(-50%)'}, item: {} },
		{ id: "shoes", styles: {bottom: '0%', left: '50%', transform: 'translateX(-50%)'}, item: {} },

		{ id: "weapon", styles: {bottom: '0%', left: '-14%', height: "110px"}, item: {} },
		{ id: "ammo", styles: {bottom: '20%', left: '-14%'}, item: {} },
		{ id: "armour", styles: {bottom: '0%', right: '-14%'}, item: {} },
		{ id: "parachute", styles: {bottom: '10%', right: '-14%'}, item: {} },

		{ id: "backpack", styles: {bottom: '20%', right: '-14%'}, item: {} },
	])
	const charListSVG = [
		(<GiTopHat />), (<IoMdGlasses />), (<IoEarSharp />), (<IoWatch />), (<IoHandRight />), (<GiHeartNecklace />), (<GiMonclerJacket />), (<GiArmoredPants />), (<GiSonicShoes />), 
		(<GiAk47 />), (<GiHeavyBullets />), (<GiKevlarVest />), (<TbParachute />), (<GiLightBackpack />)
	]


	// Jquery Draggable
	const draggableRef = React.useRef([])
	const draggableRefNearby = React.useRef([])

	React.useEffect(() =>
	{
		draggableRef.current.map(item => {
			$(item).draggable({
				helper: 'clone',
				zIndex: 100,
				appendTo: 'body',
				containment: 'body',
				distance: 10
			})

			$(item).droppable({
				hoverClass: 'inventory-elem-hover',
				over: (event, ui) => {
					const target = event.target
					const targetParent = $(target).attr('data-parent')
				},
				drop: (event, ui) => {
		            const target = event.target
		            const targetParent = $(target).attr('data-parent')
		            const targetID = parseInt($(target).attr('data-id'))

		            const draggable = ui.draggable[0]
		            const draggableParent = $(draggable).attr('data-parent')
		            const draggableID = parseInt($(draggable).attr('data-id'))

		            if(targetParent === '#inventoryChar'
		            	&& targetParent === '#draggableParent')return

		            if(draggableParent === '#inventoryNearby'
		            	&& targetParent === '#inventoryChar')return

		            if(targetParent === '#inventoryFast'
		            	&& (draggableParent === '#inventoryChar'
		            		|| draggableParent === '#inventoryNearby'))return

		            ragemp.send('ui::client:menu:inventory:transfer', {
		            	targetParent,
		            	targetID,

		            	draggableParent,
		            	draggableID,

		            	draggableItem: draggableParent === '#inventoryNearby' ? nearby[draggableID] : null
		            })
		        }
			})


			$('.inventory #inventoryNearby .inventory-body-items').droppable({
				hoverClass: 'inventory-elem-hover-trash',
				drop: (event, ui) => {
		            const draggable = ui.draggable[0]
		            const draggableParent = $(draggable).attr('data-parent')
		            const draggableID = parseInt($(draggable).attr('data-id'))

		            if(draggableParent === '#inventoryNearby')return

		            ragemp.send('ui::client:menu:inventory:trash', {
		            	draggableParent,
		            	draggableID
		            })
		        }
			})
		})
	}, [items, backpack, charList, nearby, fastList])

	React.useEffect(() => {
		$('.inventory #inventoryBackpack').css('height', `calc(100% - ${$('.inventory #inventoryNearby').height()}px - 20px)`)
		draggableRefNearby.current.map(item => {
			$(item).draggable({
				helper: 'clone',
				zIndex: 100,
				appendTo: 'body',
				containment: 'body',
				distance: 10
			})
		})
	}, [nearby])


	React.useEffect(() => {
		ragemp.send('ui::menu:inventory:update:items', items)
	}, [items])
	React.useEffect(() => {
		ragemp.send('ui::menu:inventory:update:backpack', backpack)
	}, [backpack])
	React.useEffect(() => {
		ragemp.send('ui::menu:inventory:update:charList', charList)
	}, [charList])
	React.useEffect(() => {
		ragemp.send('ui::menu:inventory:update:fastList', fastList)
	}, [fastList])


	React.useEffect(() => {
		ragemp.eventCreate('client::menu:inventory', (cmd, data) => {
			switch(cmd) {
				case 'setItems': {
					if(data.items) setItems(data.items)
					if(data.backpack) setBackpack(data.backpack)
					if(data.charList) setCharList(data.charList)
					if(data.nearby) setNearby(data.nearby)
					if(data.fastList) setFastList(data.fastList)

					break
				}
				case 'setData': {
					setData(data)
					break
				}
				case 'setNearbyName': {
					setNearbyName(data.name)
					break
				}
			}
		})
	}, [])


	return (
		<div className="inventory">
			<div className="inventory-wrap">
				<div style={{height: 'auto'}} className="inventory-body" id="inventoryNearby" data-items={JSON.stringify(nearby)}>
					<h1>{nearbyName}</h1>
					<section style={{height: "auto", maxHeight: "calc(325px - 10px)", minHeight: 'calc(88px - 10px)'}} className="inventory-body-items inventory-elem-hover-trash-pre">
						{nearby.map((item, i) => {
							return (<div ref={el => draggableRefNearby.current[i] = el} key={i} data-id={i} className="inventory-elem" data-parent="#inventoryNearby">
									<div className="inventory-elem-drag">
										<div className="inventory-elem-img">
											{!item.id ? '' : (<img src={`./assets/inventory/items/${item.img}`} />)}
										</div>
										{item.count > 2 ? (<h3 className="inventory-elem-count">{item.count}</h3>) : ''}
										{item.id ? (<button className={`inventory-elem-status inventory-elem-status-${getStatus(item.status)}`}></button>) : ''}
									</div>
								</div>)
						})}
					</section>
				</div>
				<div className="inventory-body" id="inventoryBackpack" data-items={JSON.stringify(backpack)}>
					<h1>Рюкзак</h1>
					<div className="inventory-body-weight" style={data.backpack.weight === 0 ? {display: 'none'} : {display: 'block'}}>
						<h2>
							Вес
							<span>{getWeight(backpack)} / {data.backpack.weight} кг</span>
						</h2>
						<section>
							<section data-forUpdateHeight={nearby} style={{width: 100 / data.backpack.weight * getWeight(backpack) + "%"}}></section>
						</section>
					</div>
					<section className="inventory-body-items" style={data.backpack.weight === 0 ? {display: 'none'} : {display: 'flex'}}>
						{backpack.map((item, i) => {
							return (<div ref={el => draggableRef.current[i + items.length] = el} key={i} data-id={i} className={`inventory-elem ${item.charSet === true && 'inventory-char-set'}`} data-parent="#inventoryBackpack">
									<div className="inventory-elem-drag">
										<div className="inventory-elem-img">
											{!item.id ? '' : (<img src={`./assets/inventory/items/${item.img}`} />)}
										</div>
										{item.count > 2 ? (<h3 className="inventory-elem-count">{item.count}</h3>) : ''}
										{item.id ? (<button className={`inventory-elem-status inventory-elem-status-${getStatus(item.status)}`}></button>) : ''}
									</div>
								</div>)
						})}
					</section>
				</div>
			</div>
			<div className="inventory-wrap">
				<div className="inventory-char">
					<img className="inventory-char-img" src='./assets/inventory/character.png' />

					<div className="inventory-char-wrap" id="inventoryChar" data-items={JSON.stringify(charList)}>
						{charList.map((item, i) => {
							return (<div data-id={i} ref={el => draggableRef.current[i + items.length + backpack.length] = el} id={`inventoryCharList-${item.id}`} style={item.styles} className="inventory-elem" data-parent="#inventoryChar">
								<div className="inventory-elem-drag">
									<div className="inventory-elem-img">
										{!item.item.id ? charListSVG[i] : (<img src={`./assets/inventory/items/${item.item.img}`} />)}
									</div>
									{item.item.id ? (<button className={`inventory-elem-status inventory-elem-status-${getStatus(item.item.status)}`}></button>) : ''}
								</div>
							</div>)
						})}
					</div>
				</div>
				<div className="inventory-fast" id="inventoryFast" data-items={JSON.stringify(fastList)}>
					{fastList.map((item, i) => {
						return (<div data-id={i} ref={el => draggableRef.current[i + items.length + backpack.length + charList.length] = el} className="inventory-elem" data-parent="#inventoryFast">
							<div className="inventory-elem-drag">
								<div className="inventory-elem-img">
									{!item.id ? '' : (<img src={`./assets/inventory/items/${item.img}`} />)}
								</div>
								{item.count > 2 ? (<h3 className="inventory-elem-count">{item.count}</h3>) : ''}
								{item.id ? (<button className={`inventory-elem-status inventory-elem-status-${getStatus(item.status)}`}></button>) : ''}
								<h3 className="btn-key">{i + 1}</h3>
							</div>
						</div>)
					})}
				</div>
			</div>
			<div className="inventory-wrap">
				<div className="inventory-body" id="inventoryMain" data-items={JSON.stringify(items)}>
					<h1>Мои предметы</h1>
					<div className="inventory-body-weight">
						<h2>
							Вес
							<span>{getWeight(items)} / {data.main.weight} кг</span>
						</h2>
						<section>
							<section style={{width: 100 / data.main.weight * getWeight(items) + "%"}}></section>
						</section>
					</div>
					<section className="inventory-body-items">
						{items.map((item, i) => {
							return (<div ref={el => draggableRef.current[i] = el} key={i} data-id={i} className={`inventory-elem ${item.charSet === true && 'inventory-char-set'}`} data-parent="#inventoryMain">
									<div className="inventory-elem-drag">
										<div className="inventory-elem-img">
											{!item.id ? '' : (<img src={`./assets/inventory/items/${item.img}`} />)}
										</div>
										{item.count > 2 ? (<h3 className="inventory-elem-count">{item.count}</h3>) : ''}
										{item.id ? (<button className={`inventory-elem-status inventory-elem-status-${getStatus(item.status)}`}></button>) : ''}
									</div>
								</div>)
						})}
					</section>
				</div>
			</div>
		</div>
	)
}