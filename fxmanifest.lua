fx_version 'cerulean'
game 'gta5'

name 'archiurban_cartomante'
description 'Sistema de Tarô e Cartomancia Mística - ArchiUrban'
author 'ANON & dj'
version '1.0.0'

ui_page 'web/dist/index.html'

shared_scripts {
    '@ox_lib/init.lua'
}

files {
    'web/dist/index.html',
    'web/dist/assets/**',
    'web/dist/cards/**',
    'web/dist/bg/**',
    'web/dist/som/**'
}

client_scripts {
    'client/client.lua'
}

server_scripts {
    'server/server.lua'
}
