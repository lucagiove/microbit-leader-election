enum RadioMessage {
    message1 = 49434
}
radio.onReceivedValue(function (name, value) {
    if (name == "election") {
        if (control.deviceSerialNumber() > value) {
            basic.showLeds(`
                . # . . .
                . . # . .
                . . . # .
                . . # . .
                . # . . .
                `)
            candidateLeader = 1
            radio.sendValue("election", control.deviceSerialNumber())
        } else {
            basic.showLeds(`
                . . . # .
                . . # . .
                . # . . .
                . . # . .
                . . . # .
                `)
            candidateLeader = 0
        }
    }
    if (name == "leader") {
        leaderElected = 1
        if (!(leader)) {
            radio.sendValue("player", control.deviceSerialNumber())
        }
        basic.showLeds(`
            # # # # #
            # . . . #
            # . . . #
            # . . . #
            # # # # #
            `)
    }
    if (name == "setup") {
        doElection()
    }
    if (name == "player") {
        if (leader) {
            radio.sendValue("player", control.deviceSerialNumber() + 100000000)
        } else {
            serialPlusPlayer = value
            playerNumber = (serialPlusPlayer - control.deviceSerialNumber()) / 100000000
            if (true) {
            	
            }
            serial.writeLine("" + name + value)
        }
    }
})
function doElection () {
    basic.showLeds(`
        . . . . .
        . . . . .
        . . # . .
        . . . . .
        . . . . .
        `)
    leader = 0
    candidateLeader = 0
    leaderElected = 0
    electionCountdown = 5
    radio.sendValue("election", control.deviceSerialNumber())
}
let electionCountdown = 0
let playerNumber = 0
let serialPlusPlayer = 0
let leader = 0
let leaderElected = 0
let candidateLeader = 0
radio.setGroup(1)
radio.sendValue("setup", control.deviceSerialNumber())
doElection()
loops.everyInterval(1000, function () {
    electionCountdown += -1
    if (electionCountdown == 0) {
        if (candidateLeader) {
            leader = 1
            leaderElected = 1
            radio.sendValue("leader", control.deviceSerialNumber())
            basic.showLeds(`
                # # # # #
                # . . . #
                # . # . #
                # . . . #
                # # # # #
                `)
        }
    }
})
basic.forever(function () {
    if (!(leaderElected)) {
        if (candidateLeader) {
            basic.showLeds(`
                . . . . .
                # # . # .
                # . . # .
                # # . # #
                . . . . .
                `)
        }
    } else {
        if (leader) {
            basic.showLeds(`
                . . . . .
                . # . . .
                . # . . .
                . # # # .
                . . . . .
                `)
        } else {
            basic.showLeds(`
                . . . . .
                . # . # .
                . . # . .
                . # . # .
                . . . . .
                `)
        }
    }
})
