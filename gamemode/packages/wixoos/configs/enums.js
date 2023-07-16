module.exports = {
    projectName: 'WIXOOS',

    devMode: ['LonelyNezuko'],

	clothesComponentID: {
        head: 0,
        mask: 1,
        hair: 2,
        torsos: 3,
        legs: 4,
        bags: 5,
        shoes: 6,
        accessories: 7,
        undershirts: 8,
        armour: 9,
        decals: 10,
        tops: 11,

        props: {
            hat: 0,
            glasess: 1,
            ears: 2,
            watch: 6,
            bracelet: 7
        }
    },
    clothesDefault: [
        {
            head: 0,
            mask: 0,
            torsos: 15,
            legs: 18,
            bags: 0,
            shoes: 34,
            accessories: 0,
            undershirts: 15,
            armour: 0,
            decals: 0,
            tops: 15,

            props: {
                hat: -1,
                glasess: -1,
                ears: -1,
                watch: -1,
                bracelet: -1
            }
        },
        {
            head: 0,
            mask: 0,
            torsos: 15,
            legs: 15,
            bags: 0,
            shoes: 35,
            accessories: 0,
            undershirts: 15,
            armour: 0,
            decals: 0,
            tops: 15,

            props: {
                hat: -1,
                glasess: -1,
                ears: -1,
                watch: -1,
                bracelet: -1
            }
        }
    ],

    characterCreateClothesList: [
        [ // male
            [ // hat
                { id: -1, name: 'Без шапки' }, // 1
                { id: 2, name: 'Шапка' }, // 2
                { id: 4, name: 'Кепка вперед' }, // 3
                { id: 9, name: 'Кепка назад' }, // 4
                { id: 3, name: 'Панамка' }, // 5
            ],
            [ // верх
                { torsos: 15, tops: 15, undershirts: 15, name: 'Без верха' }, // 1
                { torsos: 0, tops: 9, undershirts: 15, name: 'Футболка' }, // 2
                { torsos: 5, tops: 5, undershirts: 15, name: 'Майка' }, // 3
                { torsos: 6, tops: 6, undershirts: 2, name: 'Кофта' }, // 4
            ],
            [ // низ
                { legs: 18, name: 'Без низа' }, // 1
                { legs: 1, name: 'Джинсы' }, // 2
                { legs: 16, name: 'Шорты' }, // 3
                { legs: 8, name: 'Спортивные' }, // 4
            ],
            [ // обувь
                { shoes: 34, name: 'Без обуви' }, // 1
                { shoes: 1, name: 'Кеды' }, // 2
                { shoes: 12, name: 'Кросовки' }, // 3
                { shoes: 5, name: 'Шлепки' }, // 4
            ]
        ],
        [ // female
            [ // hat
                { id: -1, name: 'Без шапки' }, // 1
                { id: 5, name: 'Шапка' }, // 2
                { id: 64, name: 'Кепка вперед' }, // 3
                { id: 65, name: 'Кепка назад' }, // 4
                { id: 3, name: 'Панамка' }, // 5
            ],
            [ // верх
                { torsos: 15, tops: 15, undershirts: 15, name: 'Без верха' }, // 1
                { torsos: 0, tops: 14, undershirts: 15, name: 'Футболка' }, // 2
                { torsos: 4, tops: 33, undershirts: 15, name: 'Топик' }, // 3
                { torsos: 3, tops: 50, undershirts: 15, name: 'Кофта' }, // 4
            ],
            [ // низ
                { legs: 15, name: 'Без низа' }, // 1
                { legs: 1, name: 'Джинсы' }, // 2
                { legs: 24, name: 'Юбка' }, // 3
                { legs: 4, name: 'Спортивные' }, // 4
            ],
            [ // обувь
                { shoes: 35, name: 'Без обуви' }, // 1
                { shoes: 3, name: 'Кеды' }, // 2
                { shoes: 7, name: 'Туфли' }, // 3
                { shoes: 5, name: 'Шлепки' }, // 4
            ]
        ]
    ],

    keysSettings: {
        chatOpen: { name: 'Чат', desc: 'Открыть чат', key: 'T', keyCode: 84, isAdmin: 0, noChange: false, hudVisible: false },
        menuOpen: { name: 'Личное меню', desc: 'Открыть личное меню', key: 'M', keyCode: 77, isAdmin: 0, noChange: false, hudVisible: true },
        keysToggle: { name: 'Скрыть подсказки', desc: 'Скрыть подсказки', key: 'F9', keyCode: 120, isAdmin: 0, noChange: true, hudVisible: true },
        inventoryOpen: { name: 'Инвентарь', desc: 'Открыть инвентарь', key: 'I', keyCode: 73, isAdmin: 0, noChange: false, hudVisible: true },

        engineVehicle: { name: 'Двигатель', desc: 'Запустить двигатель транспорта', key: 'N', keyCode: 78, isAdmin: 0, noChange: false, hudVisible: false },
        lockedVehicle: { name: 'Двери Транспорта', desc: 'Закрыть двери транспора', key: 'L', keyCode: 76, isAdmin: 0, noChange: false, hudVisible: false },
        beltVehicle: { name: 'Ремень безопастности', desc: 'Надеть ремень безопастности', key: 'K', keyCode: 75, isAdmin: 0, noChange: false, hudVisible: false },

        action: { name: 'Взаимодействие', desc: 'Взаимодействие с чем-либо', key: 'E', keyCode: 69, isAdmin: 0, noChange: false, hudVisible: false },
        actionRadial: { name: 'Взаимодействие', desc: 'Взаимодействие с игроками/транспортом', key: 'G', keyCode: 71, isAdmin: 0, noChange: false, hudVisible: false },

        changeMinimap: { name: 'Миникарта', desc: 'Изменить размер миникарты', key: 'Z', keyCode: 90, isAdmin: 0, noChange: false, hudVisible: true }
    },
}