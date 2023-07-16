import React from 'react';
import ReactDOM from 'react-dom/client';
import $ from 'jquery'
import ragemp from './modules/ragemp'

import Hud from './components/hud/Hud'
import Speedometr from './components/speedometr/Speedometr'
import Menu from './components/menu/Menu'
import Dialog from './components/dialog/Dialog'
import Auth from './components/auth/Auth'
import ChoiceChar from './components/choiceChar/ChoiceChar'
import CreateChar from './components/createChar/CreateChar'
import Notify from './components/notify/Notify'
import Shop from './components/shop/Shop'
import NPCDialog from './components/npcDialog/NPCDialog'
import Radial from './components/radial/Radial'
import Fuel from './components/fuel/Fuel'
import Phone from './components/phone/Phone'
import Tuning from './components/tuning/Tuning'
import Rent from './components/rent/Rent'
import Browser from './components/browser/Browser'

import "./index.css"

let keyPressed = []
let keyPressedKD = 0
const popularKeys = [ 87, 68, 65, 83 ]

$(document).on('keydown', event =>
{
    if(!$('*').is(':focus')
        && keyPressed.indexOf(event.keyCode) === -1
        && keyPressedKD >= +new Date()
        && popularKeys.indexOf(event.keyCode) === -1)
    {
        keyPressed.push(event.keyCode)
        ragemp.send('ui::keypressed', {
            keyCode: keyPressed,
            up: false
        })

        keyPressedKD = +new Date() + 150
    }
})
$(document).on('keyup', event => {
    if(!$('*').is(':focus'))
    {
        ragemp.send('ui::keypressed', {
            keyCode: event.keyCode,
            up: keyPressed.indexOf(event.keyCode) !== -1 ? true : false
        })
    }
    if(keyPressed.indexOf(event.keyCode) !== -1) keyPressed.splice(keyPressed.indexOf(event.keyCode), 1)
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <Hud />
        <Speedometr />
        <Menu />
        <Dialog />
        <Auth />
        <ChoiceChar />
        <CreateChar />
        <Notify />
        <Shop />
        <NPCDialog />
        <Radial />
        <Fuel />
        <Phone />
        <Tuning />
        <Rent />
        <Browser />
    </>
);


$(document).ready(() =>
{
    $('body').on('input', '.inputOnlyNumber', elem => {
        const val = $(elem.currentTarget).val().replace(/[^0-9]/g,"")
        $(elem.currentTarget).val(val)
    })
})