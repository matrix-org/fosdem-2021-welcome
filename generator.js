const ROOMS = require("./rooms.json");
let fs = require('fs');
/*
Devrooms prefixes: D. M. K.
Stands: S. B.
Other stuff: L. I.

omit S.radio S.osi D.cloud
*/

var roomsArray = [];

for (var room in ROOMS) {
    roomsArray.push([room, ROOMS[room]]);
}

roomsArray = roomsArray.sort(function(a, b) {
    return a[1].name > b[1].name;
});

let template = fs.readFileSync("home_template.html", 'utf-8');
let mainTracksHtml = "";
let devRoomsHtml = "";
let standsHtml = "";
const fosdemIds = Object.keys(ROOMS);
roomsArray.forEach(room => {
    // ignore as hardcoded
    // if (id[0] === "M" || id[0] === "K") {
    //     mainTracksHtml += genRoomCard(id, "mainTrack");
    // }
    if (room[0][0] === "D") {
        devRoomsHtml += genRoomCard(room[0], "devRoom");
    }
    if (room[0][0] === "S" || room[0][0] === "B") {
        standsHtml += genRoomCard(room[0], "stand");
    }
});
template = template.replace("%%MAIN_TRACKS%%", mainTracksHtml);
template = template.replace("%%DEVROOMS%%", devRoomsHtml);
template = template.replace("%%STAND%%", standsHtml);
fs.writeFileSync("home.html", template);
function genRoomCard(id, mode) {
    let roomName = ROOMS[id].name;
    let canonicalAlias = ROOMS[id].canonicalAlias;

    if (!roomName || ! canonicalAlias) {
        console.log("Skipping: " + id);
        return "";
    }
    if (["S.radio", "S.osi", "D.cloud"].includes(id)) {
        console.log("Skipping: " + id);
        return "";
    }

    let html = 
`
    <div class="room_card">
        <div class="room_text" id="${mode}">
            <!--<img src="https://via.placeholder.com/32">-->
            <p>${roomName}</p>
        </div>
        <div class="btn"> <a href="/#/room/${canonicalAlias}">
                <div class="button">Join</div>
            </a>
        </div>
    </div>
`;
    return html;
}