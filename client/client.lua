local isOpen = false
local currentSession = nil -- { mode = 'solo'|'reader'|'client', partner = number }

local function notifyNoPermission()
    lib.notify({
        title = 'ArchiUrban Cartomante',
        description = 'Você precisa de um Baralho de Tarô ou ser Admin para realizar leituras.',
        type = 'error',
        icon = 'hand-sparkles',
        position = 'top-right'
    })
end

local function openTarot(spreadId, bypassCheck, sessionMode, partnerSrc)
    if isOpen then return end

    if not bypassCheck then
        local allowed = lib.callback.await('archiurban_cartomante:server:canUseTarot', false)
        if not allowed then
            notifyNoPermission()
            return
        end
    end

    currentSession = {
        mode = sessionMode or 'solo',
        partner = partnerSrc
    }

    isOpen = true
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'openTarot',
        spreadId = spreadId,
        mode = currentSession.mode,
        partner = currentSession.partner
    })
end

local function closeTarot()
    if not isOpen then return end
    isOpen = false
    SetNuiFocus(false, false)
    SendNUIMessage({
        action = 'closeTarot'
    })

    if currentSession and currentSession.partner then
        TriggerServerEvent('archiurban_cartomante:server:endSession')
    end
    currentSession = nil
end

RegisterNUICallback('close', function(_, cb)
    closeTarot()
    cb('ok')
end)

-- Relé de ações entre Leitor e Consulente via NUI
RegisterNUICallback('relaySyncAction', function(data, cb)
    if currentSession and currentSession.partner then
        TriggerServerEvent('archiurban_cartomante:server:relayAction', data)
    end
    cb('ok')
end)

-- Eventos de Sessão Recebidos do Servidor
RegisterNetEvent('archiurban_cartomante:client:openSession', function(sessionData)
    if isOpen then
        closeTarot()
        Wait(200)
    end
    openTarot(nil, true, sessionData.mode, sessionData.partner)
end)

RegisterNetEvent('archiurban_cartomante:client:onRelayAction', function(payload)
    if isOpen then
        SendNUIMessage({
            action = 'syncAction',
            payload = payload
        })
    end
end)

RegisterNetEvent('archiurban_cartomante:client:closeSession', function(msg)
    if isOpen then
        isOpen = false
        SetNuiFocus(false, false)
        SendNUIMessage({
            action = 'closeTarot'
        })
        currentSession = nil
        if msg then
            lib.notify({
                title = 'ArchiUrban Cartomante',
                description = msg,
                type = 'inform'
            })
        end
    end
end)

local pendingInvitePromise = nil

local function resolveInvite(accepted)
    if pendingInvitePromise then
        SendNUIMessage({ action = 'hideInvitePrompt' })
        local p = pendingInvitePromise
        pendingInvitePromise = nil
        p:resolve(accepted)
    end
end

-- Keymappings para Y e N
RegisterCommand('+cartomante_accept', function()
    if pendingInvitePromise then
        resolveInvite(true)
    end
end, false)
RegisterCommand('-cartomante_accept', function() end, false)
RegisterKeyMapping('+cartomante_accept', 'Aceitar leitura de Tarô', 'keyboard', 'Y')

RegisterCommand('+cartomante_decline', function()
    if pendingInvitePromise then
        resolveInvite(false)
    end
end, false)
RegisterCommand('-cartomante_decline', function() end, false)
RegisterKeyMapping('+cartomante_decline', 'Recusar leitura de Tarô', 'keyboard', 'N')

-- Callback NUI para resposta via clique
RegisterNUICallback('answerInvite', function(data, cb)
    if pendingInvitePromise then
        resolveInvite(data and data.accept == true)
    end
    cb('ok')
end)

-- Notificação discreta no rodapé para o player aceitar (Y) ou recusar (N)
lib.callback.register('archiurban_cartomante:client:confirmReading', function()
    if isOpen or IsPedDeadOrDying(cache.ped, true) or pendingInvitePromise then
        return false
    end

    local p = promise.new()
    pendingInvitePromise = p

    -- Exibe a notificação discreta na NUI no rodapé com estilo do script
    SendNUIMessage({
        action = 'showInvitePrompt',
        duration = 15000
    })

    -- Timeout automático de 15 segundos
    SetTimeout(15000, function()
        if pendingInvitePromise == p then
            resolveInvite(false)
        end
    end)

    -- Checagem contínua de controles (246 = Y, 249 = N)
    CreateThread(function()
        while pendingInvitePromise == p do
            if IsControlJustPressed(0, 246) or IsDisabledControlJustPressed(0, 246) then
                resolveInvite(true)
                break
            elseif IsControlJustPressed(0, 249) or IsDisabledControlJustPressed(0, 249) then
                resolveInvite(false)
                break
            end
            Wait(0)
        end
    end)

    local accepted = Citizen.Await(p)
    return accepted
end)

-- Integração com ox_target: só aparece a leitura se o player tiver o item baralho no inventário
local targetRegistered = false

local function removeOxTargetOption()
    if targetRegistered and GetResourceState('ox_target') == 'started' then
        pcall(function()
            exports.ox_target:removeGlobalPlayer('archiurban_cartomante_target_read')
        end)
        targetRegistered = false
    end
end

local function registerOxTargetOption()
    if GetResourceState('ox_target') ~= 'started' or targetRegistered then return end

    -- Remove preventivamente qualquer resquício anterior para não emitir warning
    pcall(function()
        exports.ox_target:removeGlobalPlayer('archiurban_cartomante_target_read')
    end)

    exports.ox_target:addGlobalPlayer({
        {
            name = 'archiurban_cartomante_target_read',
            icon = 'fa-solid fa-wand-magic-sparkles',
            label = 'Tirar Cartas de Tarô',
            distance = 2.5,
            items = 'baralho',
            canInteract = function(entity, distance, coords, name, bone)
                if entity == cache.ped or not IsPedAPlayer(entity) or IsPedDeadOrDying(entity, true) then
                    return false
                end
                local count = 0
                pcall(function()
                    count = exports.ox_inventory:Search('count', 'baralho') or 0
                end)
                return count > 0
            end,
            onSelect = function(data)
                local targetServerId = GetPlayerServerId(NetworkGetPlayerIndexFromPed(data.entity))
                if targetServerId and targetServerId > 0 then
                    TriggerServerEvent('archiurban_cartomante:server:requestSession', targetServerId)
                end
            end
        }
    })
    targetRegistered = true
end

CreateThread(function()
    registerOxTargetOption()
end)

AddEventHandler('onResourceStart', function(resourceName)
    if resourceName == 'ox_target' then
        targetRegistered = false
        Wait(500)
        registerOxTargetOption()
    end
end)

AddEventHandler('onResourceStop', function(resourceName)
    if resourceName == GetCurrentResourceName() then
        removeOxTargetOption()
    end
end)

-- Export para uso direto do item no inventário (lk_inventory / ox_inventory)
exports('useBaralho', function(data, slot)
    if exports.ox_inventory then
        pcall(function() exports.ox_inventory:closeInventory() end)
    end
    openTarot(nil, true, 'solo')
end)

RegisterCommand('cartas', function(_, args)
    local spreadId = args[1]
    openTarot(spreadId)
end, false)

RegisterCommand('cartasedit', function()
    local allowed = lib.callback.await('archiurban_cartomante:server:canUseTarot', false)
    if not allowed then
        notifyNoPermission()
        return
    end

    if not isOpen then
        openTarot(nil, true, 'solo')
    end
    SendNUIMessage({
        action = 'openColorEditor'
    })
end, false)

RegisterCommand('cartomante', function(_, args)
    local spreadId = args[1]
    openTarot(spreadId)
end, false)

RegisterCommand('tarot', function(_, args)
    local spreadId = args[1]
    openTarot(spreadId)
end, false)

exports('openTarot', openTarot)
exports('closeTarot', closeTarot)
