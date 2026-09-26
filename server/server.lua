-- ArchiUrban Cartomante - Server
-- Validação de regras de acesso: item Baralho de Tarô ou Admin

local function isPlayerAdmin(source)
    if not source or source <= 0 then return false end

    -- Verificação via ACE permissions (command ou admin)
    if IsPlayerAceAllowed(source, 'command') or IsPlayerAceAllowed(source, 'admin') then
        return true
    end

    -- Verificação via qbx_core HasPermission
    local qbxOk, hasAdmin = pcall(function()
        return exports.qbx_core:HasPermission(source, 'admin')
    end)
    if qbxOk and hasAdmin then
        return true
    end

    -- Verificação via grupo do jogador no qbx_core
    local groupOk, inAdminGroup = pcall(function()
        local player = exports.qbx_core:GetPlayer(source)
        if player and player.PlayerData and player.PlayerData.group == 'admin' then
            return true
        end
        return false
    end)
    if groupOk and inAdminGroup then
        return true
    end

    return false
end

local function getPlayerBaralhoCount(source)
    if not source or source <= 0 then return 0 end

    -- Consulta via ox_inventory / lk_inventory
    local oxOk, count = pcall(function()
        return exports.ox_inventory:GetItemCount(source, 'baralho')
    end)
    if oxOk and type(count) == 'number' then
        return count
    end

    local lkOk, lkCount = pcall(function()
        return exports.lk_inventory:GetItemCount(source, 'baralho')
    end)
    if lkOk and type(lkCount) == 'number' then
        return lkCount
    end

    return 0
end

local function canPlayerUseTarot(source)
    -- Regra 1: Administradores sempre têm permissão
    if isPlayerAdmin(source) then
        return true, 'admin'
    end

    -- Regra 2: Jogador deve possuir o item 'baralho' no inventário
    local count = getPlayerBaralhoCount(source)
    if count > 0 then
        return true, 'item'
    end

    return false, 'no_item_or_permission'
end

lib.callback.register('archiurban_cartomante:server:canUseTarot', function(source)
    local allowed, reason = canPlayerUseTarot(source)
    return allowed, reason
end)

-- Sistema de Sessão Pareada (Leitor <-> Consulente)
local activeSessions = {}

local function endPlayerSession(src, notifyPartner)
    local partner = activeSessions[src]
    if partner then
        activeSessions[partner] = nil
        activeSessions[src] = nil
        if notifyPartner and GetPlayerPing(partner) > 0 then
            TriggerClientEvent('archiurban_cartomante:client:closeSession', partner, 'A sessão de Tarô foi encerrada.')
        end
    end
end

RegisterNetEvent('archiurban_cartomante:server:requestSession', function(targetServerId)
    local src = source
    targetServerId = tonumber(targetServerId)

    if not targetServerId or targetServerId <= 0 or targetServerId == src then
        return
    end

    -- Validação de permissão do leitor
    local allowed = canPlayerUseTarot(src)
    if not allowed then
        TriggerClientEvent('ox_lib:notify', src, {
            title = 'ArchiUrban Cartomante',
            description = 'Você precisa ter um Baralho de Tarô para ler para outra pessoa.',
            type = 'error'
        })
        return
    end

    local targetPed = GetPlayerPed(targetServerId)
    local srcPed = GetPlayerPed(src)
    if not DoesEntityExist(targetPed) or not DoesEntityExist(srcPed) then
        TriggerClientEvent('ox_lib:notify', src, {
            title = 'ArchiUrban Cartomante',
            description = 'O cidadão selecionado não foi encontrado.',
            type = 'error'
        })
        return
    end

    local dist = #(GetEntityCoords(srcPed) - GetEntityCoords(targetPed))
    if dist > 4.0 then
        TriggerClientEvent('ox_lib:notify', src, {
            title = 'ArchiUrban Cartomante',
            description = 'Aproxime-se do cidadão para iniciar a leitura das cartas.',
            type = 'error'
        })
        return
    end

    if activeSessions[src] or activeSessions[targetServerId] then
        TriggerClientEvent('ox_lib:notify', src, {
            title = 'ArchiUrban Cartomante',
            description = 'Você ou o cidadão já estão em uma leitura de Tarô.',
            type = 'error'
        })
        return
    end

    TriggerClientEvent('ox_lib:notify', src, {
        title = 'ArchiUrban Cartomante',
        description = 'Aguardando o cidadão aceitar a leitura...',
        type = 'inform'
    })

    -- Pergunta ao cidadão se aceita a leitura antes de abrir a NUI
    local accepted = lib.callback.await('archiurban_cartomante:client:confirmReading', targetServerId)

    if not accepted then
        TriggerClientEvent('ox_lib:notify', src, {
            title = 'ArchiUrban Cartomante',
            description = 'O cidadão recusou a leitura de Tarô.',
            type = 'inform'
        })
        return
    end

    -- Revalida se ambos continuam online e próximos
    if GetPlayerPing(src) <= 0 or GetPlayerPing(targetServerId) <= 0 then
        return
    end

    targetPed = GetPlayerPed(targetServerId)
    srcPed = GetPlayerPed(src)
    if not DoesEntityExist(targetPed) or not DoesEntityExist(srcPed) then
        return
    end

    if #(GetEntityCoords(srcPed) - GetEntityCoords(targetPed)) > 5.0 then
        TriggerClientEvent('ox_lib:notify', src, {
            title = 'ArchiUrban Cartomante',
            description = 'O cidadão se afastou.',
            type = 'error'
        })
        return
    end

    if activeSessions[src] or activeSessions[targetServerId] then
        return
    end

    -- Registra sessão mútua
    activeSessions[src] = targetServerId
    activeSessions[targetServerId] = src

    -- Abre para o leitor (modo leitor completo no lado direito)
    TriggerClientEvent('archiurban_cartomante:client:openSession', src, {
        mode = 'reader',
        partner = targetServerId
    })

    -- Abre para o consulente (modo cliente com visual limpo, apenas as cartas)
    TriggerClientEvent('archiurban_cartomante:client:openSession', targetServerId, {
        mode = 'client',
        partner = src
    })

    TriggerClientEvent('ox_lib:notify', src, {
        title = 'ArchiUrban Cartomante',
        description = 'O cidadão aceitou. Iniciando leitura de Tarô.',
        type = 'success'
    })

    TriggerClientEvent('ox_lib:notify', targetServerId, {
        title = 'ArchiUrban Cartomante',
        description = 'A cartomante abriu as cartas de Tarô para você.',
        type = 'info'
    })
end)

RegisterNetEvent('archiurban_cartomante:server:relayAction', function(payload)
    local src = source
    local partner = activeSessions[src]
    if partner and GetPlayerPing(partner) > 0 then
        TriggerClientEvent('archiurban_cartomante:client:onRelayAction', partner, payload)
    end
end)

RegisterNetEvent('archiurban_cartomante:server:endSession', function()
    local src = source
    endPlayerSession(src, true)
end)

AddEventHandler('playerDropped', function()
    local src = source
    endPlayerSession(src, true)
end)

exports('canPlayerUseTarot', canPlayerUseTarot)
exports('isPlayerAdmin', isPlayerAdmin)
exports('getPlayerBaralhoCount', getPlayerBaralhoCount)
