import React from 'react'
import $ from 'jquery'
import ragemp from '../../../modules/ragemp'

import './info.css'

import { BsGlobe2 } from 'react-icons/bs'

import { BsCalendarDateFill } from 'react-icons/bs'

export default function Info(props) {

	return (
		<div className="menu-info">
			<div className="menu-info-root menu-info-root-account" style={{display: props.bodyNav !== 0 ? 'none' : 'block'}}>
				<header className="menu-info-root-header">
					<section>
						<h1>LonelyNezuko</h1>
						<h2>#23123</h2>
					</section>
					<section>
						<div className="menu-info-level">
							<div>
								<BsGlobe2 />
								<h1>26</h1>
							</div>
							<div>EXP 1 / 58</div>
						</div>
					</section>
				</header>
				<div className="menu-info-root-account-data menu-info-root-account-elem">
					<div className="menu-info-root-account-data-elem">
						<div className="menu-info-root-account-data-elem-svg">
							<BsCalendarDateFill />
						</div>
						<h1>
							Дата регистрации
							<span>14.03.2023; 2:11</span>
						</h1>
					</div>
					<div className="menu-info-root-account-data-elem">
						<div className="menu-info-root-account-data-elem-svg">
							<BsCalendarDateFill />
						</div>
						<h1>
							Дата регистрации
							<span>14.03.2023; 2:11</span>
						</h1>
					</div>
					<div className="menu-info-root-account-data-elem">
						<div className="menu-info-root-account-data-elem-svg">
							<BsCalendarDateFill />
						</div>
						<h1>
							Дата регистрации
							<span>14.03.2023; 2:11</span>
						</h1>
					</div>
				</div>
				<div className="menu-info-root-account-admin menu-info-root-account-elem menu-info-root-account-elem-box">
					<h1 className="menu-info-root-account-elem-title">Информация об админке</h1>

				</div>
			</div>
		</div>
	)
}