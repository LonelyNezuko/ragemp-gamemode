import React from 'react'
import ragemp from '../../modules/ragemp'

import './speedometr.css'

import { GiBeltBuckles } from 'react-icons/gi'
import { TbEngine } from 'react-icons/tb'
import { MdWbTwighlight } from 'react-icons/md'
import { GiCarDoor } from 'react-icons/gi'
import { FaGasPump } from 'react-icons/fa'

export default function Speedometr() {
	const [ speedometr, setSpeedometr ] = React.useState(false)
    const [ speedometrSpeed, setSpeedometrSpeed ] = React.useState(0)
    const [ speedometrData, setSpeedometrData ] = React.useState({
        fuel: 124,
        maxFuel: 125,

        belt: true,
        engine: true,
        lights: false,
        doors: false,
    })
    const [ speedometrKeys, setSpeedometrKeys ] = React.useState({
        belt: 'K',
        engine: 'N',
        lights: 'CTRL',
        doors: 'L'
    })
    function getSpeedStickPos(speed) {
    	let pos = 128
    	if(speed < 300) {
    		if(speed <= 80) pos = -124 + (speed * 0.87)
    		else if(speed >= 100 && speed < 115) pos = -125 + (speed * 0.87)
    		else if(speed >= 215) pos = -132 + (speed * 0.87)
    		else pos = -130 + (speed * 0.87)
    	}

    	return pos
    }

    React.useEffect(() => {
    	ragemp.eventCreate('client::speedometr', (cmd, data) => {
            switch(cmd)
            {
                case 'toggle':
                {
                    setSpeedometr(data.status)
                    break
                }
                case 'update':
                {
                    if(data.data) setSpeedometrData(data.data)
                    if(data.keys) setSpeedometrKeys(data.keys)
                    if(data.speed) setSpeedometrSpeed(data.speed)

                    break
                }
            }
        })
    }, [''])

	return (
		<section className="hud-speed">
            <div className="hud-speedometr" style={!speedometr ? {display: "none"} : {}}>
                <div className="hud-speedometr-def">
                    <div className="hud-speedometr-def-bg" style={{backgroundImage: 'url(./assets/speedometr/bg.png)'}}>
                        <div className="hud-speedometr-def-count">
                            <h2>km/h</h2>
                            {Array.from(speedometrSpeed.toString().padStart(3, '-')).map((item, i) =>
                            {
                                if(item === '-' || speedometrSpeed === 0)return (<span>0</span>)
                                return (<h1>{item}</h1>)
                            })}
                        </div>

                        <h5 style={{ bottom: "0", left: "28px", transform: "rotate(0deg)" }}>0</h5>
                        <h5 style={{ bottom: "33px", left: "14px", transform: "rotate(0deg)" }}>20</h5>
                        <h5 style={{ bottom: "65px", left: "6px", transform: "rotate(0deg)" }}>40</h5>
                        <h5 style={{ top: "85px", left: "10px", transform: "rotate(0deg)" }}>60</h5>
                        <h5 style={{ top: "50px", left: "25px", transform: "rotate(0deg)" }}>80</h5>
                        <h5 style={{ top: "25px", left: "50px", transform: "rotate(0deg)" }}>100</h5>
                        <h5 style={{ top: "10px", left: "75px", transform: "rotate(0deg)" }}>120</h5>
                        <h5 style={{ top: "1px", left: "105px", transform: "rotate(0deg)" }}>140</h5>
                        <h5 style={{ top: "1px", right: "96px", transform: "rotate(0deg)" }}>160</h5>
                        <h5 style={{ top: "12px", right: "64px", transform: "rotate(0deg)" }}>180</h5>
                        <h5 style={{ top: "33px", right: "35px", transform: "rotate(0deg)" }}>200</h5>
                        <h5 style={{ top: "59px", right: "15px", transform: "rotate(0deg)" }}>220</h5>
                        <h5 style={{ bottom: "90px", right: "5px", transform: "rotate(0deg)" }}>240</h5>
                        <h5 style={{ bottom: "61px", right: "2px", transform: "rotate(0deg)" }}>260</h5>
                        <h5 style={{ bottom: "25px", right: "8px", transform: "rotate(0deg)" }}>280</h5>
                        <h5 style={{ bottom: "-9px", right: "23px", transform: "rotate(0deg)" }}>300</h5>

                        {/*<img className="hud-speedometr-def-piece" src={require('./images/speedometr_piece.png')} />*/}
                        <img style={{transform: `translate(-50%, -50%) rotate(${getSpeedStickPos(speedometrSpeed)}deg)`}} className="hud-speedometr-def-stick" src='./assets/speedometr/stick.png' />

                        <div style={{ bottom: "34px", left: "3px", transform: "rotate(-25deg)" }} className="hud-speedometr-def-piece-big"></div>
                        <div style={{ bottom: "70px", left: "-5px", transform: "rotate(0deg)" }} className="hud-speedometr-def-piece-big"></div>
                        <div style={{ bottom: "108px", left: "-1px", transform: "rotate(15deg)" }} className="hud-speedometr-def-piece-big"></div>
                        <div style={{ top: "54px", left: "14px", transform: "rotate(31deg)" }} className="hud-speedometr-def-piece-big"></div>
                        <div style={{ top: "25px", left: "39px", transform: "rotate(49deg)" }} className="hud-speedometr-def-piece-big"></div>
                        <div style={{ top: "5px", left: "70px", transform: "rotate(63deg)" }} className="hud-speedometr-def-piece-big"></div>
                        <div style={{ top: "-5px", left: "108px", transform: "rotate(81deg)" }} className="hud-speedometr-def-piece-big"></div>
                        <div style={{ top: "-5px", right: "102px", transform: "rotate(98deg)" }} className="hud-speedometr-def-piece-big"></div>
                        <div style={{ top: "6px", right: "65px", transform: "rotate(-64deg)" }} className="hud-speedometr-def-piece-big"></div>
                        <div style={{ top: "28px", right: "35px", transform: "rotate(-48deg)" }} className="hud-speedometr-def-piece-big"></div>
                        <div style={{ top: "56px", right: "9px", transform: "rotate(-31deg)" }} className="hud-speedometr-def-piece-big"></div>
                        <div style={{ top: "94px", right: "-4px", transform: "rotate(-18deg)" }} className="hud-speedometr-def-piece-big"></div>
                        <div style={{ bottom: "68px", right: "-9px", transform: "rotate(3deg)" }} className="hud-speedometr-def-piece-big"></div>
                        <div style={{ bottom: "31px", right: "-3px", transform: "rotate(19deg)" }} className="hud-speedometr-def-piece-big"></div>

                        <img style={{ bottom: "108px", right: "-7px", transform: "rotate(8deg)", height: "32px" }} className="hud-speedometr-def-piece-bigged" src='./assets/speedometr/bigged.png' />
                        <img style={{ bottom: "73px", right: "-16px", transform: "rotate(25deg)", height: "28px" }} className="hud-speedometr-def-piece-bigged" src='./assets/speedometr/bigged.png' />
                        <img style={{ bottom: "36px", right: "-15px", transform: "rotate(43deg)", height: "29px" }} className="hud-speedometr-def-piece-bigged" src='./assets/speedometr/bigged.png' />
                        <img style={{ bottom: "-5px", right: "-2px", transform: "rotate(55deg)", height: "34px" }} className="hud-speedometr-def-piece-bigged" src='./assets/speedometr/bigged.png' />

                        <svg className="hud-speedometr-speed" viewBox="0 0 50 50">
						    <circle cx="25" cy="25" r="20" fill="none" stroke-width="2" style={{"stroke-dashoffset": speedometrSpeed <= 300 ? -126 + (speedometrSpeed * (87 / 300)) : -39}}></circle>
						</svg>
						<svg className="hud-speedometr-speed hud-speedometr-speed-bg" viewBox="0 0 50 50">
						    <circle cx="25" cy="25" r="20" fill="none" stroke-width="2"></circle>
						</svg>
                    </div>
                </div>
                <div className="hud-speedometr-data">
                    <div style={{ top: "-161px", right: "-73px" }} className={`hud-speedometr-data-elem ${speedometrData.belt && "hud-speedometr-data-elem-on"}`}>
                    	<GiBeltBuckles />
                        <h1>{speedometrKeys.belt}</h1>
                    </div>
                    <div style={{ top: "-127px", right: "-54px" }} className={`hud-speedometr-data-elem ${speedometrData.engine && "hud-speedometr-data-elem-on"}`}>
                    	<TbEngine />
                        <h1>{speedometrKeys.engine}</h1>
                    </div>
                    <div style={{ top: "-94px", right: "-44px" }} className={`hud-speedometr-data-elem ${speedometrData.lights && "hud-speedometr-data-elem-on"}`}>
                    	<MdWbTwighlight />
                        <h1>{speedometrKeys.lights}</h1>
                    </div>
                    <div style={{ top: "-60px", right: "-34px" }} className={`hud-speedometr-data-elem ${speedometrData.doors && "hud-speedometr-data-elem-on"}`}>
                    	<GiCarDoor />
                        <h1>{speedometrKeys.doors}</h1>
                    </div>
                    <div className="hud-speedometr-data-fuel">
                        <FaGasPump className="hud-speedometr-data-fuel-bg" />
                        <h1>{speedometrData.fuel}L</h1>
                        <svg className="hud-speedometr-data-fuel-svg" viewBox="0 0 50 50">
						    <circle cx="25" cy="25" r="20" fill="none" stroke-width="4" style={{"stroke-dashoffset": -126 + (speedometrData.fuel * (78 / speedometrData.maxFuel))}}></circle>
						</svg>
						<svg className="hud-speedometr-data-fuel-svg hud-speedometr-data-fuel-svg-bg" viewBox="0 0 50 50">
						    <circle cx="25" cy="25" r="20" fill="none" stroke-width="4"></circle>
						</svg>
                    </div>
                </div>
            </div>
        </section>
	)
}