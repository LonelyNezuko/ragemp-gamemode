import React from 'react'
import $ from 'jquery'
import ragemp from '../../modules/ragemp'

import './browser.css'

import { IoClose } from 'react-icons/io5'
import { IoAdd } from 'react-icons/io5'

import { HiOutlineArrowSmLeft } from 'react-icons/hi'
import { HiOutlineArrowSmRight } from 'react-icons/hi'
import { MdRefresh } from 'react-icons/md'

export default function Browser() {
	function toggle(toggle) {
		if(!toggle) $('.browser').hide()
		else $('.browser').show()
	}

	const [ sites, setSites ] = React.useState([
		{ title: 'Главная', favicon: './assets/browser/favicons/home.png', body: '' }
	])

	return (
		<div className="browser" style={{display: 'none'}}>
			<header className="browser-header">
				<div className="browser-tab">
					<section className="browser-tab-elem browser-tab-elem-sel">
						<section>
							<img src='./assets/browser/favicons/home.png' />
							<h1>Главная</h1>
						</section>
						<section>
							<button>
								<IoClose />
							</button>
						</section>
					</section>
					<section className="browser-tab-new">
						<IoAdd />
					</section>
				</div>
				<div className="browser-nav">
					<button className="browser-nav-close"></button>
				</div>
			</header>
			<div className="browser-url">
				<button>
					<HiOutlineArrowSmLeft />
				</button>
				<button className="browser-url-btn-block">
					<HiOutlineArrowSmRight />
				</button>
				<button>
					<MdRefresh />
				</button>
				<input placeholder="Введи URL" />
			</div>
			<div className="browser-body">

			</div>
		</div>
	)
}