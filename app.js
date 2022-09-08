const express = require('express')
const mongoose = require('mongoose')
var cors = require('cors')
const app = express()

app.use(express.json());




// mongoose.connect('mongodb+srv://dvndrptl:dvndrptl@cluster0.yytkf4e.mongodb.net/newdatabase?retryWrites=true&w=majority',
//     {
//         useCreateIndex: true,
//         useFindAndModify: false,
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     }
// ).then((res) => console.log("res", res)).catch((err) => console.log("err", err))





// const connectionParams = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }

// mongoose.connect("mongodb://localhost:27017/mydatabase").then((res)=>console.log("res", res)).catch((err)=>console.log("err", err))

// const url = `mongodb + srv://dvndrptl:dvndrptl@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority`;
// const connectionParams = {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// }
// mongoose.connect(url, connectionParams)
//     .then(() => {
//         console.log('Connected to the database ')
//     })
//     .catch((err) => {
//         console.error(`Error connecting to the database. n${err}`);
//     })

    app.use(cors())
const port = process.env.PORT || 3000;
const http = require("http");
const { Server } = require("socket.io");
const { emit } = require('process');

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

app.get('/', (req, res) => {
    res.send('Hello its localhost  3000')
    console.log("first app")
})


// let socketarr = []

// let roomsObj = {}
// let roomcountTemp = 0
// let roomArr = []

// let roomID
let dataArr = []
let arr = []
let tempobj = {}
let playerrank = {}
let temphold
let winnerScore = {}

let connections = [null, null];
let players = ["player2","player1"]

io.on("connection", async (socket) => {
    let roomCount = 0

    let playerIndex = -1;
    for (const i in connections) {
        if (connections[i] === null) {
            playerIndex = i;
        }
    }
    players.forEach((el)=>{
        winnerScore[el]=0
    })
    winnerScore["gameRound"]=0


    if (playerIndex == -1) return;

    connections[playerIndex] = socket;

    socket.broadcast.emit('player-connect', playerIndex);

    if (connections[0] == null || connections[1] == null) {
        io.emit("wait-2nd-player", "")
        io.emit("player-name", players[playerIndex])
        // winnerScore[players[playerIndex]] = 0
    } else {
        io.emit("player-name", players[playerIndex])
        io.emit("2nd-player-connected", "")
        // winnerScore[players[playerIndex]] = 0
    }

    socket.on("players-name", res => {
        // winnerScore[res] = 0
    })


    await socket.on("join", room => {
        socket.join(room)
        temphold = room
    })





    let count = 0
    for (let key in tempobj) {
        ++count;
    }

    socket.on("disconnect", async () => {
        arr.pop(socket.id)
        delete tempobj[socket.id]
        console.log("disconnect")
        io.emit("ondisconnect", `data ${socket.id}`)

        await io.emit("TotalUser", tempobj, `total online users  ${count}`);
        roomCount--
       
        playerrank = {}
        connections[playerIndex] = null;
        
    });

    socket.on("ondisconnect", res => {
        delete winnerScore[players[playerIndex]]
    })


    // socket.on("TotalUser", async (data) => {

    //     let dataObj = {}
    //     if (!arr.includes(socket.id)) {
    //         tempobj[socket.id] = data.userid
    //         dataObj[socket.id] = data.userid
    //         dataObj["name"] = data.name
    //         dataObj[socket] = socket
    //         dataArr.push(dataObj)
    //         arr.push(socket.id)
    //         console.log("arr", tempobj)

    //     }
    //     count = 0
    //     for (let key in tempobj) {
    //         ++count;
    //     }
    //     await io.emit("TotalUser", tempobj, `total online users  ${count}`);
    // })


    socket.on("action", async (data) => {
        let count = 0
        data.data.forEach(ele => {
            count += ele.rank
        });
        playerrank[data.name] = count

        await io.to(data.room).emit("action", { data: data, socketid: socket.id });
    })

    socket.on("ready-to-play", res => {
        io.emit("ready-to-play", "ready to play")
    })

    socket.on("random-slected", res => {
        io.emit("random-slected", "")
    })

    socket.on("play-again", res=>{
        io.emit("play-again", "")
    })

    socket.on("playgame", async res => {
        const winnerUser = Object.entries(playerrank).sort((x, y) => y[1] - x[1])[0]
        winnerScore[winnerUser[0]]++
        winnerScore["gameRound"]++
        await io.emit("winner", winnerUser[0]);
        setTimeout(async () => {
            await io.emit("winnerScore", winnerScore)
        }, 100)

    })
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});



// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })


// io.on('connection', (socket) => {
//     console.log('a user connected');
// });
// // console.log("connect")


// useCreateIndex: true,







 // socket.on('join', function (room) {
            //     console.log("room name", room)
            //     roomcountTemp++
            //     roomsObj[room] = roomcountTemp
            //     socket.join(room);
            //     console.log("room", room)
            // });
            // if (connections[0] == null && connections[1] == null) {
            //     roomID = Math.round(Math.random() * 10000)
            // }

            // await io.emit("joinsame", "room con")
            // if (playerIndex !== -1) {
            //     connections[playerIndex] = socket
            //     await socket.on("join", room => {
            //         socket.join(roomID)
            //         temphold = room
            //     })
            // } else {
            //     if (connections[0] != null && connections[1] != null) {
            //         socketarr.push(socket)
            //         connections = [null, null]
            //         // connections[0] = null
            //         // connections[1] = null
            //         // io.emit("changeRoom", temphold)
            //     } else (
            //         io.emit("playerStatus", "wait for second player")
            //     )
            // }






                // io.sockets.adapter.rooms.get(roomName).size
    // let roomUsers = await io.in(`room-id`).fetchSockets()
    // const clients = io.sockets.adapter.rooms.get('room number').size
    // console.log("clients", clients)

    // io.sockets.in("room number").emit('join', "You are in room no");




    // let roomAtFirst
    // socket.on("join", async (room) => {
    //     roomAtFirst = room
    //     console.log("ressss", room)
    // })

    // socket.join("hello")



    // const socketChunks = chunk(roomArr, 2)
    // socketChunks.forEach((el, ind, arr) => {


    //     el.forEach(async (e, ind) => {
    //        await io.emit("joinsame", "room con")

    //         // await e.join(roomAtFirst);
    //         e.on('join', async function (room) {
    //             e.join(room);
    //             console.log("room sss", room)
    //         })
    //     })
    //     io.emit("join", "roomchanged")
    // })


    // console.log(chunk([1, 2, 3, 4, 5], 2));

    // const tempArrRoom= [null, null]

    // for (let i = 0; i < roomArr.length; i++){
    //     let tempofRoomarr = 1
    // }

    // roomArr.forEach(ele, ind => {
    //     let tempofRoomarr = []
    //     if (playerIndex != -1 ){
    //         connections[0] = ele
    //         connections[1] = ele
    //     }
    // });


       // if (connections[0] != null && connections[1] != null) {
    //     socketarr.push(socket)
    //     connections = [null, null]
    //     // connections[0] = null
    //     // connections[1] = null
    //     // io.emit("changeRoom", temphold)
    // }

    // if (connections[0] === null && connections[1] === null) {
    //     roomID = Math.round(Math.random() * 10000)
    // }

    // await io.emit("joinsame", roomID)
    // if ((connections[0] === null && connections[1] === null) || (connections[0] !== null && connections[1] === null) || (connections[0] === null && connections[1] !== null)) {
    //     // connections[playerIndex] = socket
    //     if (connections[0] === null) {
    //         connections[0] = socket
    //     }
    //     if (connections[0] !== null && connections[1] === null) {
    //         connections[1] = socket
    //     }
    //     // connections.push(socket)
    //     await socket.on("join", room => {
    //         console.log("roooooom", room)
    //         socket.join(room)
    //         temphold = room
    //     })
    // } else {
    //     // // socketarr.push(socket)
    //     // // connections = [null, null]
    //     // if (connections[0] != null && connections[1] != null) {
    //     //     socketarr.push(socket)
    //     //     connections = [null, null]
    //     //     // connections[0] = null
    //     //     // connections[1] = null
    //     //     // io.emit("changeRoom", temphold)
    //     // } else (
    //     //     io.emit("playerStatus", "wait for second player")
    //     // )
    // }
    // // console.log("connections arr", connections)





