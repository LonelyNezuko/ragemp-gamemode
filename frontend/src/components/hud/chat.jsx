import React from 'react'
import $ from 'jquery'
import ragemp from '../../modules/ragemp'
import 'jquery.scrollto'

import { MdSend } from 'react-icons/md'
import { MdCancelScheduleSend } from 'react-icons/md'

export default function HudChat(data) {
	const [ chat, setChat ] = React.useState([])
	const [ chatOpen, setChatOpen ] = React.useState(false)
	const [ chatTypeList, setChatTypeList ] = React.useState([''])
	const [ chatTypeSelect, setChatTypeSelect ] = React.useState(0)
	const [ chatSettings, setChatSettings ] = React.useState([ 450, 250, 13, 'Open Sans', 4, 7 ])

	function addChatMessage(text, type = '') {
		text = text.replace(/<(.|\n)*?>/g, '')

		while(text.match(/\{[a-fA-F0-9]{6}}/g)) {
			text = text.replace(/\{[a-fA-F0-9]{6}}/g, text => {
				text = text.replace('{', '').replace('}', '')
				text = text.replace('{', '').replace('}', '')

				const color = text.substr(0, 6)
				text = text.substr(6, text.length)

				return `<span style='color: #${color}'>${text}`
			})
		}
		while(text.match(/{B}/g)) text = text.replace(/{B}/g, `<strong style='font-weight: 700;'>`)
		while(text.match(/{I}/g)) text = text.replace(/{I}/g, `<i>`)

		setChat(old => [...old, [text, type]])
	}
	function returnChatType(type) {
		switch(type) {
			case 'add': {
				return (<button className="hud-chat-tag" style={{fontSize: chatSettings[2] + 'px', fontFamily: chatSettings[3], marginRight: chatSettings[5] + 'px', backgroundColor: "#28a028", color: "white"}}>ADD</button>)
			}
			case 'admin': {
				return (<button className="hud-chat-tag" style={{fontSize: chatSettings[2] + 'px', fontFamily: chatSettings[3], marginRight: chatSettings[5] + 'px', backgroundColor: "#d38642", color: "white"}}>ADMIN</button>)
			}
			case 'system': {
				return (<button className="hud-chat-tag" style={{fontSize: chatSettings[2] + 'px', fontFamily: chatSettings[3], marginRight: chatSettings[5] + 'px', backgroundColor: "#d93c3c", color: "white"}}>SYSTEM</button>)
			}
			case 'ooc': {
				return (<button className="hud-chat-tag" style={{fontSize: chatSettings[2] + 'px', fontFamily: chatSettings[3], marginRight: chatSettings[5] + 'px', backgroundColor: "#858585", color: "white"}}>OOC</button>)
			}
			case 'me': {
				return (<button className="hud-chat-tag" style={{fontSize: chatSettings[2] + 'px', fontFamily: chatSettings[3], marginRight: chatSettings[5] + 'px', backgroundColor: "#FF99FF", color: "white"}}>ME</button>)
			}
			case 'do': {
				return (<button className="hud-chat-tag" style={{fontSize: chatSettings[2] + 'px', fontFamily: chatSettings[3], marginRight: chatSettings[5] + 'px', backgroundColor: "#4276b5", color: "white"}}>DO</button>)
			}
			case 'try': {
				return (<button className="hud-chat-tag" style={{fontSize: chatSettings[2] + 'px', fontFamily: chatSettings[3], marginRight: chatSettings[5] + 'px', backgroundColor: "#FF99FF", color: "white"}}>TRY</button>)
			}
			case 'todo': {
				return (<button className="hud-chat-tag" style={{fontSize: chatSettings[2] + 'px', fontFamily: chatSettings[3], marginRight: chatSettings[5] + 'px', backgroundColor: "#FF99FF", color: "white"}}>TODO</button>)
			}
			case 'error': {
				return (<button className="hud-chat-tag" style={{fontSize: chatSettings[2] + 'px', fontFamily: chatSettings[3], marginRight: chatSettings[5] + 'px', backgroundColor: "#f67171", color: "white"}}>ERROR</button>)
			}
		}
	}
	function returnChatTypeStyle(type) {
		const style = { fontSize: chatSettings[2] + 'px', fontFamily: chatSettings[3] }

		switch(type) {
			case 'ooc': {
				style.color = 'silver'
			}
		}
		return style
	}
	function chatSubmit() {
		const text = $('.hud .hud-chat .hud-chat-i input').val().replace(/<(.|\n)*?>/g, '')

		$('.hud .hud-chat .hud-chat-i input').val('')
		
		setChatOpen(false)
		ragemp.send('ui::hud:chat:close', {}, true)

		if(data.accountData.mute === 0) {
			ragemp.send('ui::hud:chat:send', { text, type: $('.hud .hud-chat .hud-chat-i').attr('data-type') })
		}
	}

	React.useEffect(() =>
	{
		$('.hud .hud-chat-body').scrollTo($('.hud .hud-chat-body div:last-child'))
	}, [chat])

	function _setChatOpen(toggle) {
		if(toggle === true) {
			setTimeout(() => {
				$('.hud .hud-chat-i input').focus()
			}, 300)
		}

		$('.hud .hud-chat .hud-chat-i input').val('')
		setChatOpen(toggle)
	}

	React.useEffect(() => {
		$('body').on('blur', '.hud .hud-chat-i input', () => {
			setChatOpen(false)
			ragemp.send('ui::hud:chat:close', {}, true)
		})
		$('body').keydown(e =>
		{
			if($('.hud .hud-chat').hasClass('hud-chat-open')
				&& e.keyCode === 13) {
				e.preventDefault()
				chatSubmit()
			}
			if($('.hud .hud-chat').hasClass('hud-chat-open')
				&& e.keyCode === 27) {
				e.preventDefault()

				setChatOpen(false)
				ragemp.send('ui::hud:chat:close', {}, true)
			}
		})

		ragemp.eventCreate('client::hud:chat', (cmd, data) => {
            switch(cmd)
            {
                case 'addMessage':
                {
                    addChatMessage(data.text, data.type || '')
                    break
                }
            	case 'setOpen': {

            		_setChatOpen(data.status)
            		break
            	}
            	case 'setTypeList': {
            		setChatTypeSelect(0)
            		setChatTypeList(data)

            		break
            	}
            	case 'clear': {
            		setChat([])
            		break
            	}
            	case 'setChatSettings': {
            		setChatSettings(data)

            		break
            	}
            }
        })
	}, [])
	React.useEffect(() => {
		$('body').keydown(e =>
		{
			if($('.hud .hud-chat').hasClass('hud-chat-open')
				&& e.key === 'Tab') {
				e.preventDefault()
				$('.hud .hud-chat-i input').focus()

				const id = parseInt($('.hud .hud-chat .hud-chat-i').attr('data-typeID'))
				setChatTypeSelect(id >= chatTypeList.length - 1 ? 0 : id + 1)
			}
		})
	}, [chatTypeSelect, chatTypeList])

	return (
		<div className={`hud-chat ${chatOpen === true && 'hud-chat-open'}`} style={{width: chatSettings[0] + 'px'}}>
			<section className="hud-chat-body" style={{height: chatSettings[1] - 12 + 'px'}}>
				{chat.map((item, i) => {
					return (
						<div style={i !== 0 ? {marginTop: chatSettings[4] + 'px'} : {}} key={i}>
							<h1>
								{item[1].length ? returnChatType(item[1]) : ''}
								<h2 style={returnChatTypeStyle(item[1])} dangerouslySetInnerHTML={{__html: item[0]}}></h2>
							</h1>
						</div>)
				})}
			</section>
			<section className="hud-chat-i" data-type={chatTypeList[chatTypeSelect]} data-typeID={chatTypeSelect}>
				{returnChatType(chatTypeList[chatTypeSelect])}
				<input id="chat" type="text" maxlength="255" placeholder="Чат" />
				{data.accountData.mute > 0 ? (<MdCancelScheduleSend className="hud-chat-i-mute" />) : (<MdSend onClick={() => chatSubmit()} />)}
			</section>
		</div>
	)
}