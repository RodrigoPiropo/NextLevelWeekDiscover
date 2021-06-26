const Database = require("../db/config")

module.exports = {
    async create(req, res){
        const db = await Database()
        const pass = req.body.password
        let roomId = ''
        let isRoom = true
        while(isRoom) {
            // Generate roomId
            for(var i = 0; i < 6; i++){
                roomId += Math.floor(Math.random() * 10).toString()
            }

            // Verify if roomId already exists
            const roomsExistIds = await db.all(`SELECT id FROM rooms`)

            isRoom = roomsExistIds.some(roomExistId => roomExistId === roomId)
            if (!isRoom) {
                // Insert id and password into the database
                await db.run(`INSERT INTO rooms (
                    id,
                    pass
                ) VAlUES (
                    ${parseInt(roomId)},
                    "${pass}"
                )`)
            }
        }
        await db.close()
        res.redirect(`/room/${roomId}`)
    },

    async open(req, res){
        const db = await Database()
        const roomId = req.params.room
        const questions = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 0`)
        const questionsRead = await db.all(`SELECT * FROM questions WHERE room =  ${roomId} and read = 1`)
        let isNoQuestions

        if(questions.length == 0){
            if (questionsRead.length == 0){
                isNoQuestions = true
            }
        }

        res.render("room", {roomId: roomId, questions: questions, questionsRead: questionsRead, isNoQuestions: isNoQuestions})
    },

    async enter(req, res){
        const db = await Database()
        const roomId = req.body.roomId
        const ids = await db.all(`SELECT id FROM rooms`)
        let roomexists = false
        for (let i = 0; i < ids.length; i++) {
            if (ids[i].id == roomId) {
                res.redirect(`/room/${roomId}`)
                roomexists = true
            }
        
        }
        if (!roomexists){
            res.render('noroomid')
        }
    }
}