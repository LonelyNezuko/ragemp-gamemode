const logger = require('../_modules/logger')
try
{
    const STORAGE = require('../_modules/storage')

    const user = require('../user/index')
    const chat = require('../user/chat')

    const func = require('../_modules/func')

    const sys_npc = {}

    sys_npc.create = (position, hash, name, model, data = {}) =>
    {
        const id = STORAGE.free('npc')

        STORAGE.set('npc', id, 'state', true)
        STORAGE.set('npc', id, 'name', name)

        STORAGE.set('npc', id, 'position', {
            x: position[0],
            y: position[1],
            z: position[2],
            a: position[3],
            vw: position[4]
        })
        STORAGE.set('npc', id, 'hash', hash)

        STORAGE.set('npc', id, 'model', model)
        STORAGE.set('npc', id, 'desc', data.desc || '')

        STORAGE.set('npc', id, '_label', mp.labels.new(`${name}${data.desc ? `\n~c~${data.desc}` : ''}`, new mp.Vector3(position[0], position[1], position[2]), {
            los: false,
            font: 0,
            drawDistance: 4,
            dimension: position[4]
        }))
        STORAGE.set('npc', id, '_colshape', mp.colshapes.newCircle(position[0], position[1], 2.5, position[4])).setVariable('npcID', id)
        if(data.blip) STORAGE.set('npc', id, '_blip', mp.blips.new(data.blip, new mp.Vector3(position[0], position[1], position[2]), {
                name: data.blipName || "Персонаж: " + name,
                color: 53,
                shortRange: true
            }))
    }

    sys_npc.isState = id =>
    {
        return STORAGE.get('npc', id, 'state')
    }
    sys_npc.nearPlayer = (player, id = -1) =>
    {
        if(!user.isLogged(player))return -1

        if(id === -1) id = user.getNears(player).npc
        if(!sys_npc.isState(id))
        {
            if(id === user.getNears(player).npc) user.removeNear(player, 'npc')
            return -1
        }

        if(func.distance2D(player.position, new mp.Vector3(sys_npc.getPosition(id).x, sys_npc.getPosition(id).y, sys_npc.getPosition(id).z)) >= 3.5
            || player.dimension !== sys_npc.getPosition(id).vw)
        {
            if(id === user.getNears(player).npc) user.removeNear(player, 'npc')
            return -1
        }

        return id
    }

    sys_npc.getName = id =>
    {
        if(!sys_npc.isState(id))return 'None'
        return STORAGE.get('npc', id, 'name')
    }
    sys_npc.getDesc = id =>
    {
        if(!sys_npc.isState(id))return 'None'
        return STORAGE.get('npc', id, 'desc')
    }

    sys_npc.getHash = id =>
    {
        if(!sys_npc.isState(id))return '-'
        return STORAGE.get('npc', id, 'hash')
    }
    sys_npc.getPosition = id =>
    {
        if(!sys_npc.isState(id))return {}
        return STORAGE.get('npc', id, 'position')
    }

    sys_npc.setCamera = (player, id) =>
    {
        if(!user.isLogged(player)
            || !sys_npc.isState(id))return
        if(sys_npc.nearPlayer(player, id) !== id)return

        const cameraPosition = func.getCameraOffset(new mp.Vector3(sys_npc.getPosition(id).x, sys_npc.getPosition(id).y, sys_npc.getPosition(id).z + 0.5), sys_npc.getPosition(id).a + 90, 1.3)
        user.setCamera(player, cameraPosition, [ sys_npc.getPosition(id).x, sys_npc.getPosition(id).y, sys_npc.getPosition(id).z + 0.5 ], {
            ease: 1000
        })
    }


    // Events
    sys_npc.enterColshape = (player, shape) =>
    {
        const id = shape.getVariable('npcID')
        if(!sys_npc.isState(id))return

        if(sys_npc.nearPlayer(player, id) === id) user.setNear(player, 'npc', id)
        else return

        user.actionText(player, `Нажмите, чтобы повогорить с ${sys_npc.getName(id)}`)
    }
    sys_npc.exitColshape = (player, shape) =>
    {
        const id = shape.getVariable('npcID')
        if(!sys_npc.isState(id))return

        user.removeNear(player, 'npc')
        user.actionTextHide(player)
    }

    sys_npc.action = player =>
    {
        const id = sys_npc.nearPlayer(player)
        if(id === -1)return

        switch(sys_npc.getHash(id))
        {
            case 'testnpc':
            {
                sys_npc.setCamera(player, id)
                user.npcDialog(player, 'Джордж', 'Тестовый NPC', 'Привет, я тестовый NPC, показываю систему NPC и диалогов с ними. Ты что-то хотел от меня?', [ 'Да', '%last%Нет' ], (player, btn) => {
                    if(btn === 'Да') {
                        user.npcDialog(player, 'Джордж', 'Тестовый NPC', 'Хорошо, что тебе нужно?', [ 'Дай деняк', 'Дай админку', '%last%Уже ничего' ], (player, btn) => {
                            if(btn === 'Дай деняк') {
                                user.npcDialog(player, 'Джордж', 'Тестовый NPC', 'Держи. Но потрать их с умом :)')
                                user.giveCash(player, 100000000)
                            }
                            else if(btn === 'Дай админку') {
                                if(user.isAdmin(player)) user.npcDialog(player, 'Джордж', 'Тестовый NPC', 'Но у тебя же уже есть админка... Больше я тебе не дам')
                                else
                                {
                                    STORAGE.set('user', player.id, 'admin', 1)
                                    user.save(player)

                                    user.npcDialog(player, 'Джордж', 'Тестовый NPC', 'Ладно, держи. Только не балуйся с ней :)')
                                }
                            }
                            else user.npcDialog(player, 'Джордж', 'Тестовый NPC', 'Ну, тогда еще увидемся')

                            setTimeout(() =>
                            {
                                user.npcDialogHide(player)
                                user.destroyCamera(player, { ease: 1000 })
                            }, 4000)
                        })
                    }
                    else {
                        user.npcDialogHide(player)
                        user.destroyCamera(player, { ease: 1000 })
                    }
                })
                break
            }
        }
    }

    module.exports = sys_npc
}
catch(e)
{
    logger.error('systems/npc')
}
