import { ImTab } from 'react-icons/im'
import { MdKeyboardBackspace } from 'react-icons/md'
import { MdOutlineKeyboardReturn } from 'react-icons/md'
import { BsCapslockFill } from 'react-icons/bs'

import { TfiShiftLeft } from 'react-icons/tfi'
import { TfiShiftRight } from 'react-icons/tfi'

import { TiArrowUpThick } from 'react-icons/ti'
import { TiArrowRightThick } from 'react-icons/ti'
import { TiArrowLeftThick } from 'react-icons/ti'
import { TiArrowDownThick } from 'react-icons/ti'

import { BsFillMouse2Fill } from 'react-icons/bs'

export default function btnKey(props) {
	let text = props.keys
	let className = ''

	if(props.keys.toUpperCase() === 'TAB') text = (<ImTab />)
	if(props.keys.toUpperCase() === 'BACKSPACE') text = (<MdKeyboardBackspace />)
	if(props.keys.toUpperCase() === 'ENTER') text = (<MdOutlineKeyboardReturn />)
	if(props.keys.toUpperCase() === 'CAPSLOCK') text = (<BsCapslockFill />)

	if(props.keys.toUpperCase() === 'SHIFT') text = (<TfiShiftLeft />)
	// if(props.keys.toUpperCase() === 'RSHIFT') text = (<TfiShiftRight />)

	if(props.keys.toUpperCase() === 'ARROWUP') text = (<TiArrowUpThick />)
	if(props.keys.toUpperCase() === 'ARROWRIGHT') text = (<TiArrowRightThick />)
	if(props.keys.toUpperCase() === 'ARROWLEFT') text = (<TiArrowLeftThick />)
	if(props.keys.toUpperCase() === 'ARROWDOWN') text = (<TiArrowDownThick />)

	if(props.keys.toUpperCase() === 'MOUSE') text = (<BsFillMouse2Fill />)
	if(props.keys.toUpperCase() === 'MOUSE1') text = (<img src='./assets/btn-keys/mouse/mouse1.png' />)
	if(props.keys.toUpperCase() === 'MOUSE2') text = (<img src='./assets/btn-keys/mouse/mouse2.png' />)
	if(props.keys.toUpperCase() === 'MOUSE3') text = (<img src='./assets/btn-keys/mouse/mouse3.png' />)
	if(props.keys.toUpperCase() === 'MOUSESCROLL') text = (<img src='./assets/btn-keys/mouse/mousescroll.png' />)
	if(props.keys.toUpperCase() === 'MOUSEUPDOWN') text = (<img src='./assets/btn-keys/mouse/mouseupdown.png' />)

	if(typeof text !== 'string') className = 'btn-key-other'

	return (<button className={`btn-key ${className}`}>{text}</button>)
}