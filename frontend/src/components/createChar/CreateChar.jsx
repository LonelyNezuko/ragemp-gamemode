import React from 'react'
import $ from 'jquery'
import ragemp from '../../modules/ragemp'
import 'jquery.scrollto'
import func from '../../modules/func'

import './createChar.css'

import { MdSettings } from 'react-icons/md'
import { TbGenderBigender } from 'react-icons/tb'
import { GiBeard } from 'react-icons/gi'
import { MdInvertColors } from 'react-icons/md'
import { GiLipstick } from 'react-icons/gi'
import { MdOutlineFace } from 'react-icons/md'
import { GiClothes } from 'react-icons/gi'

import { FaArrowRight } from 'react-icons/fa'
import { FaArrowLeft } from 'react-icons/fa'

import { GiCheckMark } from 'react-icons/gi'
import { BiCopy } from 'react-icons/bi'
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi'

export default function CreateChar() {
	const [ toggle, setToggle ] = React.useState(false)

	const [ nav, setNav ] = React.useState([
		(<MdSettings />),
		(<TbGenderBigender />),
		(<GiBeard />),
		(<MdInvertColors />),
		(<GiLipstick />),
		(<MdOutlineFace />),
		(<GiClothes />),
		(<GiCheckMark />)
	])
	const [ selNav, setSelNav ] = React.useState(0)
	function selectNav(id) {
		setSelNav(id)

		if(id >= nav.length - 3) {
			$('.createchar .createchar-header section').scrollTo($(`.createchar .createchar-header section button:last-child`))
		}
		else if(id <= 3) {
			$('.createchar .createchar-header section').scrollTo($(`.createchar .createchar-header section button:first-child`))
		}
		ragemp.send('ui::createChar:changeType', { type: id })
	}
	React.useEffect(() => {
		$('body').keydown(e =>
		{
			if($('.createchar').css('display') !== 'none'
				&& e.keyCode === 81
				&& parseInt($('.createchar .createchar-header section').attr('data-nav')) > 0) {
				e.preventDefault()
				selectNav(parseInt($('.createchar .createchar-header section').attr('data-nav')) - 1)
			}
			if($('.createchar').css('display') !== 'none'
				&& e.keyCode === 69
				&& parseInt($('.createchar .createchar-header section').attr('data-nav')) < nav.length - 1) {
				e.preventDefault()
				selectNav(parseInt($('.createchar .createchar-header section').attr('data-nav')) + 1)
			}
		})
	}, [])


	const [ parentsList, setParentsList ] = React.useState([
		0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43,
		21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41
	])
	const [ parentSel, setParentSel ] = React.useState(0)
	const [ hairList, setHairList ] = React.useState([
		[ 0, 1, 2, 5, 6, 8, 11, 12, 13, 16 ],
		[ 0, 1, 2, 3, 5, 6, 7, 8, 11, 14 ]
	])
	const faceList = [ 'Ширина носа', 'Высота носа', 'Длина носа', 'Переносица', 'Кончик носа', 'Сдвиг переносицы', 'Высота бровей', 'Ширина бровей', 'Высота скул', 'Ширина скул', 'Ширина щек', 'Глаза', 'Губы', 'Ширина челюсти', 'Высота челюсти', 'Длина подбородка', 'Сдвиг подбородка', 'Ширина подбородка', 'Форма подбородка', 'Шея' ]
	const hairColorList = [
        { id: 0, color: '#1c1f21' },
        { id: 2, color: '#312e2c' },
        { id: 4, color: '#4b321f' },
        { id: 6, color: '#6d4c35' },
        { id: 11, color: '#a79369' },
        { id: 14, color: '#d6b97b' },
        { id: 17, color: '#845039' },
        { id: 22, color: '#a02e19' },
        { id: 24, color: '#a2502f' },
        { id: 28, color: '#aaaaaa' },
        { id: 31, color: '#5a3f6b' },
        { id: 33, color: '#ed74e3' },
        { id: 36, color: '#04959e' },
        { id: 40, color: '#217c61' },
        { id: 42, color: '#b6c034' },
        { id: 44, color: '#439d13' },
        { id: 46, color: '#e5b103' },
        { id: 47, color: '#e69102' },
        { id: 49, color: '#fb8057' },
        { id: 51, color: '#d1593c' },
        { id: 53, color: '#ad0903' },
        { id: 49, color: '#fb8057' }
    ]
    const [ clothesList, setClothesList ] = React.useState([
    	[ 'Без шапки', 'Шапка', 'Кепка вперед', 'Кепка назад', 'Панамка' ],
        [ 'Без верха', 'Футболка', 'Майка', 'Кофта' ],
        [ 'Без низа', 'Джинсы', 'Шорты', 'Спортивные' ],
        [ 'Без обуви', 'Кеды', 'Кросовки', 'Шлепки' ]
    ])
    const [ defaultData, setDefaultData ] = React.useState({})


    const [ type, setType ] = React.useState(0)
	const [ data, setData ] = React.useState({
		gender: 0,
		genetic: {
			father: 0,
			mother: 21,

			similarity: 0.5,
			skinTone: 0.5
		},
		hair: {
			head: 0,
			beard: 0,
			eyebrow: 0,
			breast: 0,

			head_color: 0,
			beard_color: 0,
			eyebrow_color: 0,
			breast_color: 0
		},
		appearance: [0, 0, 0, 0, 0, 0, 0, 0, 0],
		face: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		clothes: [0, 0, 0, 0]
	})
	const [ name, setName ] = React.useState(['', ''])


	React.useEffect(() => {
		ragemp.eventCreate('client::createChar', (cmd, result) => {
			switch(cmd) {
				case 'toggle': {
					setToggle(result.status)
					break
				}
				case 'setData': {
					setData(result)
					setDefaultData(result)

					break
				}
				case 'setClothesList': {
					setClothesList(result)
					break
				}
				case 'setType': {
					setType(result.type)
					break
				}
			}
		})
	}, [])
	React.useEffect(() => {
		ragemp.send('ui::createChar:update', data)
	}, [data])


	function random()
    {
    	let faceTemp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        faceTemp.map((item, i) => faceTemp[i] = func.randomFloat(0.1, 1.0))

    	setData({
			gender: data.gender,
			genetic: {
				father: parentsList[func.random(0, 23)],
				mother: parentsList[21 + func.random(0, 21)],

				similarity: func.randomFloat(0.1, 1.0),
				skinTone: func.randomFloat(0.1, 1.0)
			},
			hair: {
	            head: hairList[data.gender][func.random(0, hairList[data.gender].length - 1)],
	            beard: data.gender === 1 ? 0 : func.random(0, 28),
	            eyebrow: func.random(0, 33),
	            breast: data.gender === 1 ? 0 : func.random(0, 16),

	            head_color: func.random(0, 63),
	            beard_color: data.gender === 1 ? 0 : func.random(0, 63),
	            eyebrow_color: func.random(0, 63),
	            breast_color: data.gender === 1 ? 0 : func.random(0, 63)
	        },
			appearance: [
	            func.random(0, 31),
	            func.random(0, 23),
	            func.random(0, 14),
	            func.random(0, 11),
	            func.random(0, 10),
	            func.random(0, 9),
	            func.random(0, 63),
	            func.random(0, 17),
	            func.random(0, 11)
	        ],
			face: faceTemp,
			clothes: [
	            func.random(0, clothesList[0].length - 1),
	            func.random(0, clothesList[1].length - 1),
	            func.random(0, clothesList[2].length - 1),
	            func.random(0, clothesList[3].length - 1)
	        ]
		})
    }

	return (
		<div className="createchar" style={!toggle ? {display: 'none'} : {display: 'block'}}>
			<div className="createchar-wrap">
				<header className="createchar-header">
					<button className="btn-key">Q</button>
					<section data-nav={selNav}>
						{nav.map((item, i) => {
							return (<button onClick={() => selectNav(i)} key={i} className={`${i === selNav && 'createchar-header-sel'}`}>
									{item}
								</button>)
						})}
					</section>
					<button style={{padding: '2px 7.5px'}} className="btn-key">E</button>
				</header>
				<div className="createchar-body">
					<div style={selNav !== 0 ? {display: 'none'} : {display: 'block'}}>
						<h1 className="createchar-body-title">Настройки</h1>
						<div style={type ? {display: 'none'} : {display: 'block'}} className="createchar-edit createchar-edit-choice">
							<h1>А кто ты?</h1>
							<div className="createchar-edit-s-choice">
								<button onClick={() => setData({...defaultData, gender: 0})} className={`btn ${data.gender === 0 && 'createchar-edit-s-choice-sel'}`}>Парень</button>
								<button onClick={() => setData({...defaultData, gender: 1})} className={`btn ${data.gender === 1 && 'createchar-edit-s-choice-sel'}`}>Девушка</button>
							</div>
						</div>
						<div style={{marginTop: '30px'}} className="createchar-edit createchar-edit-btn">
							<button onClick={() => ragemp.send('ui::createChar:copy')} className="btn">
								<BiCopy />
								Скопируем другого персонажа?
							</button>
						</div>
						<div className="createchar-edit createchar-edit-btn">
							<button onClick={() => random()} className="btn">
								<GiPerspectiveDiceSixFacesRandom style={{fontSize: '22px'}} />
								Поиграем в кубики?
							</button>
						</div>
					</div>
					<div style={selNav !== 1 ? {display: 'none'} : {display: 'block'}}>
						<h1 className="createchar-body-title">Родословная</h1>
						<div className="createchar-edit createchar-edit-range">
							<h1>На кого больше похож?</h1>
							<section>
								<span>Отец</span>
								<input type="range" min="0.1" max="1.0" step="0.1" value={data.genetic.similarity} onChange={elem => setData({...data, genetic: {...data.genetic, similarity: parseFloat($(elem.currentTarget).val())}})} />
								<span>Мать</span>
							</section>
						</div>
						<div className="createchar-edit createchar-edit-range">
							<h1>Цвет кожи?</h1>
							<section>
								<span>Отец</span>
								<input type="range" min="0.1" max="1.0" step="0.1" value={data.genetic.skinTone}  onChange={elem => setData({...data, genetic: {...data.genetic, skinTone: parseFloat($(elem.currentTarget).val())}})} />
								<span>Мать</span>
							</section>
						</div>
						<div className="createchar-edit createchar-edit-img">
							<h1>
								Выбери предков
								<div className="createchar-edit-s-choice">
									<button onClick={() => setParentSel(0)} className={`btn ${parentSel === 0 && 'createchar-edit-s-choice-sel'}`}>Отец</button>
									<button onClick={() => setParentSel(1)} className={`btn ${parentSel === 1 && 'createchar-edit-s-choice-sel'}`}>Мать</button>
								</div>
							</h1>
							<section style={parentSel === 0 ? {display: 'none'} : {display: 'flex'}}>
								{new Array(21).fill(0).map((item, i) => {
									return (
										<button onClick={() => setData({...data, genetic: {...data.genetic, mother: parentsList[i + 23]}})} className={`${parentsList[i + 23] === data.genetic.mother && 'createchar-edit-img-sel'}`} key={i}>
											<img src={`./assets/createChar/mothers/${i}.png`} />
										</button>)
								})}
							</section>
							<section style={parentSel === 1 ? {display: 'none'} : {display: 'flex'}}>
								{new Array(23).fill(0).map((item, i) => {
									return (
										<button onClick={() => setData({...data, genetic: {...data.genetic, father: parentsList[i]}})} className={`${parentsList[i] === data.genetic.father && 'createchar-edit-img-sel'}`} key={i}>
											<img src={`./assets/createChar/fathers/${i}.png`} />
										</button>)
								})}
							</section>
						</div>
					</div>
					<div style={selNav !== 2 || type ? {display: 'none'} : {display: 'block'}}>
						<h1 className="createchar-body-title">Волосы</h1>
						<div className="createchar-edit createchar-edit-img">
							<h1>Ты лысый?</h1>
							<section>
								{hairList[data.gender].map((item, i) => {
									return (
										<button onClick={() => setData({...data, hair: {...data.hair, head: item}})} className={`${item === data.hair.head && 'createchar-edit-img-sel-border'}`} key={i}>
											<img src={`./assets/createChar/hairs/${data.gender === 0 ? 'male' : 'female'}/${i}.jpg`} />
										</button>)
								})}
							</section>
						</div>
						<div style={data.gender === 1 ? {display: 'none'} : {display: 'block'}} className="createchar-edit createchar-edit-range">
							<h1>Борода или усики?</h1>
							<section>
								<input type="range" min="0" max="28" step="1" value={data.hair.beard}  onChange={elem => setData({...data, hair: {...data.hair, beard: parseInt($(elem.currentTarget).val())}})} />
							</section>
						</div>
						<div className="createchar-edit createchar-edit-range">
							<h1>Брови</h1>
							<section>
								<input type="range" min="0" max="33" step="1" value={data.hair.eyebrow}  onChange={elem => setData({...data, hair: {...data.hair, eyebrow: parseInt($(elem.currentTarget).val())}})} />
							</section>
						</div>
						<div style={data.gender === 1 ? {display: 'none'} : {display: 'block'}} className="createchar-edit createchar-edit-range">
							<h1>Орангутанг?</h1>
							<section>
								<input type="range" min="0" max="16" step="1" value={data.hair.breast}  onChange={elem => setData({...data, hair: {...data.hair, breast: parseInt($(elem.currentTarget).val())}})} />
							</section>
						</div>
					</div>
					<div style={(selNav === 2 || selNav === 3 || selNav === 6) && type ? {display: 'block'} : {display: 'none'}}>
						<h1 className="createchar-body-title">Листай дальше, здесь ничего нет</h1>
					</div>
					<div style={selNav !== 3 || type ? {display: 'none'} : {display: 'block'}}>
						<h1 className="createchar-body-title">Цвет волос</h1>
						<div className="createchar-edit createchar-edit-select createchar-edit-color">
							<h1>Черный или ... (Прическа)</h1>
							<section>
								{hairColorList.map((item, i) =>
                                {
                                    return (<button onClick={() => setData({...data, hair: {...data.hair, head_color: item.id}})} style={{"background-color": item.color}}></button>)
                                })}
							</section>
						</div>
						<div style={data.gender === 1 ? {display: 'none'} : {display: 'block'}} className="createchar-edit createchar-edit-select createchar-edit-color">
							<h1>... белый ? (Борода)</h1>
							<section>
								{hairColorList.map((item, i) =>
                                {
                                    return (<button onClick={() => setData({...data, hair: {...data.hair, beard_color: item.id}})} style={{"background-color": item.color}}></button>)
                                })}
							</section>
						</div>
						<div className="createchar-edit createchar-edit-select createchar-edit-color">
							<h1>Вот в чем ... (Брови)</h1>
							<section>
								{hairColorList.map((item, i) =>
                                {
                                    return (<button onClick={() => setData({...data, hair: {...data.hair, eyebrow_color: item.id}})} style={{"background-color": item.color}}></button>)
                                })}
							</section>
						</div>
						<div style={data.gender === 1 ? {display: 'none'} : {display: 'block'}} className="createchar-edit createchar-edit-select createchar-edit-color">
							<h1>... вопрос (На теле)</h1>
							<section>
								{hairColorList.map((item, i) =>
                                {
                                    return (<button onClick={() => setData({...data, hair: {...data.hair, breast_color: item.id}})} style={{"background-color": item.color}}></button>)
                                })}
							</section>
						</div>
					</div>
					<div style={selNav !== 4 ? {display: 'none'} : {display: 'block'}}>
						<h1 className="createchar-body-title">Внешность</h1>
						<div className="createchar-edit createchar-edit-range">
							<h1>Цвет глаз</h1>
							<section>
								<input type="range" min="0" max="31" step="1" value={data.appearance[0]} onChange={e => { let appearanceTemp = [...data.appearance]; appearanceTemp[0] = parseInt(e.target.value); setData({...data, appearance: appearanceTemp}) }} />
							</section>
						</div>
						<div className="createchar-edit createchar-edit-range">
							<h1>Пятна на теле</h1>
							<section>
								<input type="range" min="0" max="23" step="1" value={data.appearance[1]} onChange={e => { let appearanceTemp = [...data.appearance]; appearanceTemp[1] = parseInt(e.target.value); setData({...data, appearance: appearanceTemp}) }} />
							</section>
						</div>
						<div className="createchar-edit createchar-edit-range">
							<h1>Старение</h1>
							<section>
								<input type="range" min="0" max="14" step="1" value={data.appearance[2]} onChange={e => { let appearanceTemp = [...data.appearance]; appearanceTemp[2] = parseInt(e.target.value); setData({...data, appearance: appearanceTemp}) }} />
							</section>
						</div>
						<div className="createchar-edit createchar-edit-range">
							<h1>Цвет лица</h1>
							<section>
								<input type="range" min="0" max="11" step="1" value={data.appearance[3]} onChange={e => { let appearanceTemp = [...data.appearance]; appearanceTemp[3] = parseInt(e.target.value); setData({...data, appearance: appearanceTemp}) }} />
							</section>
						</div>
						<div className="createchar-edit createchar-edit-range">
							<h1>Повреждения кожи</h1>
							<section>
								<input type="range" min="0" max="10" step="1" value={data.appearance[4]} onChange={e => { let appearanceTemp = [...data.appearance]; appearanceTemp[4] = parseInt(e.target.value); setData({...data, appearance: appearanceTemp}) }} />
							</section>
						</div>
						<div className="createchar-edit createchar-edit-range">
							<h1>Губная помада</h1>
							<section>
								<input type="range" min="0" max="9" step="1" value={data.appearance[5]} onChange={e => { let appearanceTemp = [...data.appearance]; appearanceTemp[5] = parseInt(e.target.value); setData({...data, appearance: appearanceTemp}) }} />
							</section>
						</div>
						<div className="createchar-edit createchar-edit-range">
							<h1>Цвет помады</h1>
							<section>
								<input type="range" min="0" max="31" step="1" value={data.appearance[6]} onChange={e => { let appearanceTemp = [...data.appearance]; appearanceTemp[6] = parseInt(e.target.value); setData({...data, appearance: appearanceTemp}) }} />
							</section>
						</div>
						<div className="createchar-edit createchar-edit-range">
							<h1>Родинки</h1>
							<section>
								<input type="range" min="0" max="17" step="1" value={data.appearance[7]} onChange={e => { let appearanceTemp = [...data.appearance]; appearanceTemp[7] = parseInt(e.target.value); setData({...data, appearance: appearanceTemp}) }} />
							</section>
						</div>
						<div className="createchar-edit createchar-edit-range">
							<h1>Пятна на теле</h1>
							<section>
								<input type="range" min="0" max="11" step="1" value={data.appearance[8]} onChange={e => { let appearanceTemp = [...data.appearance]; appearanceTemp[8] = parseInt(e.target.value); setData({...data, appearance: appearanceTemp}) }} />
							</section>
						</div>
					</div>
					<div style={selNav !== 5 ? {display: 'none'} : {display: 'block'}}>
						<h1 className="createchar-body-title">Форма лица</h1>
						{faceList.map((item, i) => {
							return (<div key={i} className="createchar-edit createchar-edit-range">
									<h1>{item}</h1>
									<section>
										<input type="range" min="-1" max="1" step="0.1" value={data.face[i]} onChange={e => { let faceTemp = [...data.face]; faceTemp[i] = parseFloat(e.target.value); setData({...data, face: faceTemp}) }} />
									</section>
								</div>)
						})}
					</div>
					<div style={selNav !== 6 || type ? {display: 'none'} : {display: 'block'}}>
						<h1 className="createchar-body-title">Одежда или голый попа?</h1>
						<div className="createchar-edit createchar-edit-select">
							<h1>Головной убор</h1>
							<section>
								<button onClick={() => { ragemp.send('ui::createChar:changeType', { type: 20 }); let clothesTemp = [...data.clothes]; clothesTemp[0] = clothesTemp[0] > 0 ? clothesTemp[0] - 1 : clothesTemp[0]; setData({...data, clothes: clothesTemp}) }}><FaArrowLeft /></button>
								<h2>{clothesList[0][data.clothes[0]]}</h2>
								<button onClick={() => { ragemp.send('ui::createChar:changeType', { type: 20 }); let clothesTemp = [...data.clothes]; clothesTemp[0] = clothesTemp[0] < clothesList[0].length - 1 ? clothesTemp[0] + 1 : clothesTemp[0]; setData({...data, clothes: clothesTemp}) }}><FaArrowRight /></button>
							</section>
						</div>
						<div className="createchar-edit createchar-edit-select">
							<h1>Верх</h1>
							<section>
								<button onClick={() => { ragemp.send('ui::createChar:changeType', { type: 21 }); let clothesTemp = [...data.clothes]; clothesTemp[1] = clothesTemp[1] > 0 ? clothesTemp[1] - 1 : clothesTemp[1]; setData({...data, clothes: clothesTemp}) }}><FaArrowLeft /></button>
								<h2>{clothesList[1][data.clothes[1]]}</h2>
								<button onClick={() => { ragemp.send('ui::createChar:changeType', { type: 21 }); let clothesTemp = [...data.clothes]; clothesTemp[1] = clothesTemp[1] < clothesList[1].length - 1 ? clothesTemp[1] + 1 : clothesTemp[1]; setData({...data, clothes: clothesTemp}) }}><FaArrowRight /></button>
							</section>
						</div>
						<div className="createchar-edit createchar-edit-select">
							<h1>Низ</h1>
							<section>
								<button onClick={() => { ragemp.send('ui::createChar:changeType', { type: 22 }); let clothesTemp = [...data.clothes]; clothesTemp[2] = clothesTemp[2] > 0 ? clothesTemp[2] - 1 : clothesTemp[2]; setData({...data, clothes: clothesTemp}) }}><FaArrowLeft /></button>
								<h2>{clothesList[2][data.clothes[2]]}</h2>
								<button onClick={() => { ragemp.send('ui::createChar:changeType', { type: 22 }); let clothesTemp = [...data.clothes]; clothesTemp[2] = clothesTemp[2] < clothesList[2].length - 1 ? clothesTemp[2] + 1 : clothesTemp[2]; setData({...data, clothes: clothesTemp}) }}><FaArrowRight /></button>
							</section>
						</div>
						<div className="createchar-edit createchar-edit-select">
							<h1>Обувь</h1>
							<section>
								<button onClick={() => { ragemp.send('ui::createChar:changeType', { type: 23 }); let clothesTemp = [...data.clothes]; clothesTemp[3] = clothesTemp[3] > 0 ? clothesTemp[3] - 1 : clothesTemp[3]; setData({...data, clothes: clothesTemp}) }}><FaArrowLeft /></button>
								<h2>{clothesList[3][data.clothes[3]]}</h2>
								<button onClick={() => { ragemp.send('ui::createChar:changeType', { type: 23 }); let clothesTemp = [...data.clothes]; clothesTemp[3] = clothesTemp[3] < clothesList[3].length - 1 ? clothesTemp[3] + 1 : clothesTemp[3]; setData({...data, clothes: clothesTemp}) }}><FaArrowRight /></button>
							</section>
						</div>
					</div>
					<div style={selNav !== 7 || type ? {display: 'none'} : {display: 'block'}}>
						<h1 className="createchar-body-title">Пажи, ща все будет...</h1>
						<div className="createchar-edit createchar-edit-input">
							<h1>Как звать? (Имя)</h1>
							<input type="text" maxlength="15" onChange={e => { let nameTemp = [...name]; nameTemp[0] = e.target.value; setName(nameTemp) }} />
						</div>
						<div className="createchar-edit createchar-edit-input">
							<h1>А для сделок? (Фамилия)</h1>
							<input type="text" maxlength="15" onChange={e => { let nameTemp = [...name]; nameTemp[1] = e.target.value; setName(nameTemp) }} />
						</div>
						<div className="createchar-edit createchar-edit-btn createchar-edit-btn-footer">
							<button onClick={() => ragemp.send('ui::createChar:submit', { viewData: data, name })} className="btn">Давай уже играть</button>
						</div>
					</div>
					<div style={selNav === 7 && type ? {display: 'block'} : {display: 'none'}}>
						<h1 className="createchar-body-title">Все ?</h1>
						<div className="createchar-edit createchar-edit-btn">
							<button onClick={() => ragemp.send('ui::createChar:submit', data)} className="btn">Ну тогда пошли</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}