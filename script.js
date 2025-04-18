// This was vibe coded BTW
let admin = false;

const { entries, values } = Object;
const { isArray } = Array;
const { seedrandom, random, floor } = Math;

function clamp(min, x, max) {
    return Math.min(Math.max(x, min), max);
}

function s4() {
    return floor((1 + random()) * 0x10000).toString(16).substring(1);
}

function youtubeParser(url) {
    let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    let match = url.match(regExp);
    return match?.[7].length == 11 ? match[7] : false;
}

function sanitize(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("\"", "&quot;")
        .replaceAll("'", "&apos;");
}

window.onclick = (e) => {
    let spoiler = e.target.closest("GAY-SPOILER");
    spoiler?.classList.add("reveal");
};

let rules = {
    "**": "b",
    "~~": "i",
    "--": "s",
    "__": "u",
    "``": "code",
    "^^": "gay-big", // these are fine
    "$r$": "gay-rainbow",
    "||": "gay-spoiler",
}

function markup(text) {
    text = sanitize(text);
    text = text
        .replace(/(^|\\n)(&gt;.*?)($|\\n)/g, "$1<span class=\"greentext\">$2</span>$3")
        .replaceAll("\\n", "<br>");
        for (let [token, tag] of entries(rules)) {
            let closing = false;
            while (text.includes(token)) {
                text = text.replace(token, closing ? `</${tag}>` : `<${tag}>`);
                closing = !closing;
            }
            if (closing) {
                text += `</${tag}>`;
            }
        }
    text = text.replace(/(https?:\/\/[^\s<>"']+)/g, "<a target=\"_blank\" href=\"$1\">$1</a>");
    return text;
}

function nmarkup(text) {
    while (text.includes("^^") || text.includes("||")) {
        text = text.replaceAll("^^", "").replaceAll("||", "").replaceAll("\\n", "").replaceAll("://", "//");
    }
    return markup(text);
}

function createPoll(poll) {
    let element = document.createElement("div");
    element.classList.add("poll");
    element.classList.add(`poll_${poll.id}`);
    element.innerHTML = `
        ${markup(poll.title)}<br>
        <div class="yes">Yes: <span class="yes_number">0</span></div>
        <div class="no">No: <span class="no_number">0</span></div>
    `;
    element.poll = poll;
    element.querySelector(".yes").onclick = () => {
        socket.emit("vote", {
            poll: poll.id,
            vote: true
        });
    };
    element.querySelector(".no").onclick = () => {
        socket.emit("vote", {
            poll: poll.id,
            vote: false
        });
    };
    return element;
}

function updatePoll(id, voterId, vote) {
    let elements = document.querySelectorAll(`.poll_${id}`);
    if (elements.length === 0) return;
    let poll = elements[0].poll;
    poll.votes[voterId] = vote;
    let yesVotes = values(poll.votes).filter(x => x).length;
    let allVotes = values(poll.votes).length;
    let noVotes = allVotes - yesVotes;
    let yesPercentage = yesVotes / allVotes * 100;
    let noPercentage = noVotes / allVotes * 100;
    for (let element of elements) {
        element.querySelector(".yes_number").innerText = yesVotes;
        element.querySelector(".no_number").innerText = noVotes;
        element.querySelector(".yes").style.backgroundImage = `linear-gradient(to right, lime ${yesPercentage}%, #cfc ${yesPercentage}%)`;
        element.querySelector(".no").style.backgroundImage = `linear-gradient(to right, red ${noPercentage}%, #fcc ${noPercentage}%)`;
    }
}

let lastZ = 1;
let dragged = null;
let dragX = 0;
let dragY = 0;
let chatLogDragged = false;

let colors = ["purple", "blue", "green", "yellow", "red", "pink", "brown", "black", "cyan", "black", "pope"];
let hats = ["tophat", "bfdi", "bieber", "evil", "elon", "kamala", "maga", "troll", "bucket", "obama"]

let blobs = Object.create(null);
for (let image of [...colors, ...hats]) {
    let img = new Image();
    img.src = `./img/bonzi/${image}.png`;
    img.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.width = 50;
        canvas.height = 50;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 76, 39, 50, 50, 0, 0, 50, 50);
        canvas.toBlob((blob) => {
            blobs[image] = URL.createObjectURL(blob);
        }, "image/png");
    }
}

let quote = null;
let lastUser = "";

function bonzilog(id, name, html, color, text, single) {
    // hacky
    // remind me to rewrite this as this is the biggest peice of dogshit
    let icon = "";
    let scrolled = chat_log_content.scrollHeight - chat_log_content.clientHeight - chat_log_content.scrollTop <= 1;
    if (color) {
        let [baseColor, hat] = color.split(" ");
        let baseColorBlob = blobs[baseColor] ?? "";
        let hatBlob = blobs[hat] ?? "";
        icon = `<div class="log_icon">
            <img class="color" src="${baseColorBlob}">
            <img class="hat" src="${hatBlob}" ${hat ? "" : "hidden"}> 
        </div>`;
    } else {
        icon = `<div class="log_left_spacing"></div>`;
    }
    let thisUser = `${id};${name};${color}`;
    if (thisUser !== lastUser || single) {
        chat_log_content.insertAdjacentHTML("beforeend", `
            <hr>
            <div class="log_message">
                ${icon}
                <div class="log_message_cont">
                    <div class="reply"></div>
                    <b>${nmarkup(name)}</b>
                    <div class="log_message_content">${html}</div>
                </div>
            </div>`);
        if (color?.includes(" ")) {
            chat_log_content.lastChild.querySelector(".log_icon").style.backgroundSize = "100px 80px, calc(var(--src-width) * var(--scale))";
        }
        lastUser = single ? "" : thisUser;
    } else {
        chat_log_content.insertAdjacentHTML("beforeend", `
            <div class="log_message log_continue">
                <div class="reply"></div>
                <div class="log_left_spacing"></div>
                <div class="log_message_cont">
                    <div class="log_message_content">${html}</div>
                </div>
            </div>`);
    }
    chat_log_content.lastChild.querySelector(".reply").onclick = () => {
        quote = { name, text: text };
        talkcard.innerHTML = `Replying to ${nmarkup(name)}`;
        chat_message.focus();
        talkcard.hidden = false;
    };
    if (scrolled) {
        chat_log_content.scrollTop = chat_log_content.scrollHeight;
    }
}

function toBgImg(name, color) {
    return color.split(" ").map(sprite => `url("img/bonzi/${sprite}.png")`).reverse().join(", ");
}

let logJoins = false;

class Bonzi {
    constructor(id, userPublic) {
        this.userPublic = userPublic ?? {
            name: "BonziBUDDY",
            color: "purple",
            speed: 175,
            pitch: 50,
            voice: "en-us",
        };
        this.color = this.userPublic.color;
        this.data = window.BonziData;

        this.eventList = [];
        this.eventFrame = 0;
        this.currentAnim = "idle";
        this.animFrame = 0;
        this.sprite = 0;

        this.mute = false;
        this.id = id ?? s4() + s4();

        this.rng = new seedrandom(this.id || random());

        this.element = document.createElement("div");
        this.element.classList.add("bonzi");
        this.element.style.backgroundImage = this.toBgImg();
        this.element.style.zIndex = lastZ++;
        this.nametag = document.createElement("div");
        this.nametag.classList.add("bonzi_name");
        this.element.appendChild(this.nametag);
        this.bubble = document.createElement("div");
        this.bubble.classList.add("bubble");
        this.bubble.hidden = true;
        this.bubbleCont = document.createElement("div");
        this.bubbleCont.classList.add("bubble_cont");
        this.bubble.appendChild(this.bubbleCont);
        this.element.appendChild(this.bubble);
        content.appendChild(this.element);

        this.updateName();
        this.updateSprite();

        this.element.onpointerdown = (e) => {
            if (this.bubble.contains(e.target)) return;
            if (e.which === 1) {
                dragged = this;
                dragX = e.pageX - this.x;
                dragY = e.pageY - this.y;
                this.lastX = this.x;
                this.lastY = this.y;
                this.element.style.zIndex = lastZ++;
            }
            if (e.which === 2) {
                this.cancel();
                this.mute = !this.mute;
                this.updateName();
            }
        };
        this.element.onclick = (e) => {
            if (this.bubble.contains(e.target)) return;
            if (this.x === this.lastX && this.y === this.lastY) {
                this.cancel();
            }

        };

        var coords = this.maxCoords();
        this.x = coords.x * this.rng();
        this.y = coords.y * this.rng();
        this.move();
        this.element.id = s4() + s4();

        $.contextMenu({
            selector: `#${this.element.id}`,
            build: () => {
                let extra = {};
                if (admin) {
                    extra = {
                        "kick": {
                            name: "Kick",
                            callback: () => {
                                socket.emit("command", {
                                    list: ["kick", this.id],
                                });
                            },
                        },
                        "ban": {
                            name: "Ban",
                            callback: () => {
                                socket.emit("command", {
                                    list: ["ban", this.id],
                                });
                            },
                        },
                        "info": {
                            name: "Info",
                            callback: () => {
                                socket.emit("command", {
                                    list: ["info", this.id],
                                });
                            },
                        },
                    };
                }
                return {
                    items: {
                        "cancel": {
                            name: "Cancel",
                            callback: () => { this.cancel(); }
                        },
                        "mute": {
                            name: () => this.mute ? "Unmute" : "Mute",
                            callback: () => {
                                this.cancel();
                                this.mute = !this.mute;
                                this.updateName();
                            }
                        },
                        "asshole": {
                            name: "Call an Asshole",
                            callback: () => {
                                socket.emit("command", {
                                    list: ["asshole", this.userPublic.name]
                                });
                            }
                        },
                        "bass": {
                            name: "Call a Bass",
                            callback: () => {
                                socket.emit("command", {
                                    list: ["bass", this.userPublic.name]
                                });
                            }
                        },
                        "owo": {
                            name: "Notice Bulge",
                            callback: () => {
                                socket.emit("command", {
                                    list: ["owo", this.userPublic.name]
                                });
                            }
                        },
                        ...extra,
                    }
                };
            },
            animation: {
                duration: 175,
                show: 'fadeIn',
                hide: 'fadeOut'
            }
        });
        this.eventList = [{
            type: "anim",
            anim: "surf_intro",
            ticks: 30
        }, { type: "idle" }];
    }

    toBgImg() {
        return toBgImg(this.userPublic.name, this.color);
    }

    move(x, y) {
        if (arguments.length !== 0) {
            this.x = x;
            this.y = y;
        }
        let max = this.maxCoords();
        let chatLog = chat_log.getBoundingClientRect();
        this.x = clamp(chatLog.width, this.x, max.x);
        this.y = clamp(0, this.y, max.y);
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.updateDialog();
    }

    runEvent(list) {
        if (this.mute) return;
        this.cancel();
        this.eventList = [{ type: "idle" }, ...list, { type: "idle" }];
    }

    clearDialog() {
        this.bubbleCont.textContent = "";
        this.bubble.hidden = true;
    }

    cancel() {
        this.clearDialog();
        this.stopSpeaking();
        this.eventList = [{ type: "idle" }];
        this.eventFrame = 0;
    }

    stopSpeaking() {
        if (this.voiceSource) {
            this.voiceSource.stop();
            // This is most fragile part of the code and all bugs will happen here
            this.voiceSource.onended?.();
            this.voiceSource.onended = () => { };
            if (this.voiceSource.endTimeout) {
                this.clearDialog();
                clearTimeout(this.voiceSource.endTimeout);
            }
        }
    }

    setSprite(sprite) {
        this.sprite = sprite;
        this.element.style.backgroundPositionX = `-${sprite % 17 * 200}px`;
        this.element.style.backgroundPositionY = `-${floor(sprite / 17) * 160}px`;
    }

    setAnim(anim) {
        this.currentAnim = anim;
        this.animFrame = 0;
    }

    update() {
        let anim = this.data.sprite.animations[this.currentAnim];
        let frame = anim[this.animFrame];
        while (typeof frame === "string") {
            this.setAnim(frame);
            anim = this.data.sprite.animations[this.currentAnim];
            frame = anim[this.animFrame];
        }
        if (frame != null) this.setSprite(frame);
        this.animFrame++;
        if (this.eventList.length === 0) {
            return;
        }
        let nextEvent = () => {
            this.eventList.shift();
            this.eventFrame = 0;
        };
        let event = this.eventList[0];
        let eventType = event.type;
        switch (eventType) {
            case "anim":
                if (this.eventFrame === 0) {
                    this.setAnim(event.anim);
                }
                this.eventFrame++;
                if (this.eventFrame >= event.ticks) {
                    nextEvent();
                }
                break;
            case "text":
                if (this.eventFrame === 0) {
                    this.talk(event.text, event.say, event.quote);
                    this.eventFrame = 1;
                };
                if (this.bubble.hidden) nextEvent();
                break;
            case "idle":
                if (this.eventFrame === 0) {
                    this.eventFrame = 1;
                    let toIdle = this.data.to_idle[this.currentAnim];
                    if (toIdle) {
                        this.setAnim(toIdle);
                    } else {
                        this.setAnim("idle");
                    }
                }
                if (this.sprite === 0) {
                    nextEvent();
                }
                break;
            case "add_random":
                let pool = event.pool;
                let index = floor(pool.length * this.rng());
                let events = pool[index];
                nextEvent();
                for (let e of events.toReversed()) {
                    this.eventList.unshift(e);
                }
                break;
        }
    }

    talk(text, say, quote) {
        say ??= text;
        this.stopSpeaking();
        this.bubble.hidden = false;
        text = text
            .replaceAll("{NAME}", this.userPublic.name.replaceAll("$", "$$"))
            .replaceAll("{COLOR}", this.color);
        if (say != null) {
            say = say
                .replaceAll("{NAME}", this.userPublic.name)
                .replaceAll("{COLOR}", this.color)
                .replace(/\|\|.+?(\|\||$)/g, "spoiler")
                .replace(/\^\^|\$r\$|\*\*|--|~~|__|\[\[|\\n/g, "");
        }

        // text = linkify(text);
        let quoteHTML = "";
        if (quote) {
            quoteHTML = `
                <blockquote>
                    ${markup(quote.text)}
                </blockquote>
                <font color="blue">@${nmarkup(quote.name)}</font>
            `;
            if (!say.startsWith("-")) say = `at ${quote.name}, ${say}`;
        }
        let html = `${quoteHTML}${markup(text)}`;
        for (let word of wordBlacklist) {
            word = word.trim().toLowerCase();
            if (word.length === 0) continue;
            if (text.toLowerCase().includes(word)) {
                html = `This message was blacklisted. <button data-html="${sanitize(html)}" onclick="this.parentElement.innerHTML = this.getAttribute('data-html')">Show</button>`;
                say = "-";
                break;
            }
        }
        this.bubbleCont.innerHTML = html;

        // here marks the point where i fucking give up
        bonzilog(this.id, this.userPublic.name, html, this.color, text, quoteHTML !== "");

        if (!say.startsWith("-")) {
            speak.play(say, {
                "pitch": this.userPublic.pitch,
                "speed": this.userPublic.speed
            }, () => {
                if (!text.includes("||")) this.clearDialog();
            }, (source) => {
                this.voiceSource = source;
            });
        }
    }

    joke() { this.runEvent(this.data.event_list_joke); }

    fact() { this.runEvent(this.data.event_list_fact); }

    poll(id, text) {
        let poll = {
            id: id,
            title: text,
            votes: [],
        };
        let element = createPoll(poll);
        this.cancel();
        if (!this.mute) {
            this.bubbleCont.textContent = "";
            this.bubbleCont.appendChild(element);
            this.bubble.hidden = false;
            let element2 = createPoll(poll);
            let scrolled = chat_log_content.scrollHeight - chat_log_content.clientHeight - chat_log_content.scrollTop <= 1;
            bonzilog(this.id, this.userPublic.name, "", this.color, `(POLL) ${text}`, true);
            chat_log_content.lastChild.querySelector(".log_message_content").appendChild(element2);
            if (scrolled) {
                chat_log_content.scrollTop = chat_log_content.scrollHeight;
            }
            speak.play(text.replaceAll("[[", ""), {
                "pitch": this.userPublic.pitch,
                "speed": this.userPublic.speed
            }, () => {}, (source) => {
                this.voiceSource = source;
            });
        }
    }

    image(url) {
        this.cancel();
        if (!this.mute) {
            let image = new Image();
            image.src = url;
            image.onload = () => {
                let html = `<img src="${sanitize(url)}" class="userimage">`;
                if (localStorage.hideImages) {
                    html = `This image is hidden. <button data-html="${sanitize(html)}" onclick="this.parentElement.innerHTML = this.getAttribute('data-html')">Show</button>`;
                }
                this.bubbleCont.innerHTML = html;
                this.bubble.hidden = false;
                bonzilog(this.id, this.userPublic.name, html, this.color, `(IMAGE)`, false);
            };
        }
    }

    exit() {
        this.runEvent([{
            type: "anim",
            anim: "surf_away",
            ticks: 30
        }]);
        setTimeout(() => {
            this.deconstruct();
            bonzis.delete(this.id);
            usersPublic.delete(this.id);
        }, 2000);
    }

    deconstruct() {
        this.stopSpeaking();
        if (dragged === this) {
            dragged = null;
        }
        this.element.remove();
    }

    updateName() {
        let typing = "";

        if (this.mute) {
            typing = " (muted)";
        } if (this.userPublic.typing) {
            typing = ` (${this.userPublic.typing})`;
        };
        this.nametag.innerHTML = nmarkup(this.userPublic.name) + "" + typing;
    }

    youtube(vid) {
        if (!this.mute) {
            this.bubbleCont.innerHTML = `
                    <iframe type="text/html" width="173" height="173" 
					src="https://www.youtube.com/embed/${vid.replaceAll("\"", "'")}?autoplay=1" 
					style="width:173px;height:173px"
					frameborder="0"
					allowfullscreen="allowfullscreen"
					mozallowfullscreen="mozallowfullscreen"
					msallowfullscreen="msallowfullscreen"
					oallowfullscreen="oallowfullscreen"
					webkitallowfullscreen="webkitallowfullscreen"
					></iframe>
			`;
            this.bubble.hidden = false;
        }
    }

    backflip(swag) {
        var event = [{
            type: "anim",
            anim: "backflip",
            ticks: 15
        }];
        if (swag) {
            event.push({
                type: "anim",
                anim: "cool_fwd",
                ticks: 30
            });
            event.push({
                type: "idle"
            });
        }
        this.runEvent(event);
    }

    updateDialog() {
        let max = this.maxCoords();
        this.bubble.classList.remove("bubble-top");
        this.bubble.classList.remove("bubble-left");
        this.bubble.classList.remove("bubble-right");
        this.bubble.classList.remove("bubble-bottom");
        let bubbleRect = this.bubble.getBoundingClientRect();
        if (this.data.size.x + bubbleRect.width > max.x) {
            if (this.y < innerHeight / 2 - this.data.size.x / 2) {
                this.bubble.classList.add("bubble-bottom");
            } else {
                this.bubble.classList.add("bubble-top");
            }
        } else {
            if (this.x < innerWidth / 2 - this.data.size.x / 2) {
                this.bubble.classList.add("bubble-right");
            } else {
                this.bubble.classList.add("bubble-left");
            }
        }
    }

    maxCoords() {
        return {
            x: innerWidth - this.data.size.x,
            y: innerHeight - this.data.size.y - chat_bar.getBoundingClientRect().height,
        };
    }

    asshole(target) {
        this.runEvent(
            [{
                type: "text",
                text: `Hey, ${target}!`
            }, {
                type: "text",
                text: "You're a fucking asshole!",
                say: "your a fucking asshole!"
            }, {
                type: "anim",
                anim: "grin_fwd",
                ticks: 15
            }]
        );
    }

    owo(target) {
        this.runEvent(
            [{
                type: "text",
                text: `*notices ${target}'s BonziBulge™*`,
                say: `notices ${target}s bonzibulge`
            }, {
                type: "text",
                text: "owo, wat dis?",
                say: "oh woah, what diss?"
            }]
        );
    }

    bass(target) {
        this.runEvent(
            [{
                type: "text",
                text: `Hey, ${target}!`,
            }, {
                type: "text",
                text: "You're a fucking bass!",
            }, {
                type: "anim",
                anim: "grin_fwd",
                ticks: 15
            },]
        );
    }

    updateSprite() {
        this.cancel();
        this.element.style.backgroundImage = this.toBgImg();
        this.move();
    }
}

window.onload = () => {
    document.getElementById("login_load").hidden = true;
    document.getElementById("login_card").hidden = false;
};

window.onresize = () => {
    for (let bonzi of bonzis.values()) {
        bonzi.move();
    }
};

chat_log_resize.onpointerdown = (e) => {
    chatLogDragged = true;
    dragX = e.pageX - chat_log_resize.getBoundingClientRect().left;
};

window.onpointermove = (e) => {
    if (dragged) {
        dragged.move(e.pageX - dragX, e.pageY - dragY);
    }
    if (chatLogDragged) {
        window.onresize();
        chat_log.style.width = `${e.pageX - dragX}px`;
    }
};

window.onpointerup = () => {
    dragged = null;
    chatLogDragged = false;
};

btn_tile.onclick = () => {
    let winWidth = window.innerWidth;
    let winHeight = window.innerHeight;
    let minY = 0;
    let addY = 80;
    let x = 0, y = 0;
    for (let bonzi of bonzis.values()) {
        bonzi.move(x, y);

        x += 200;
        if (x + 100 > winWidth) {
            x = 0;
            y += 160;
            if (y + 160 > winHeight) {
                minY += addY;
                addY /= 2;
                y = minY;
            }
        }
    }
};

function bonzisCheck() {
    let safeBonzis = new Set;
    for (let [key, public] of usersPublic.entries()) {
        if (!bonzis.has(key)) {
            let bonzi = new Bonzi(key, public);
            bonzis.set(key, bonzi);
            safeBonzis.add(bonzi);
            if (logJoins) {
                let msg = `${nmarkup(public.name)} has joined.`;
                bonzilog("server", "", msg, null, msg, true);
            }
        } else {
            let bonzi = bonzis.get(key);
            bonzi.userPublic = public;
            bonzi.updateName();
            if (bonzi.color != public.color) {
                bonzi.color = public.color;
                bonzi.updateSprite();
            }
            safeBonzis.add(bonzi);
        }
    }
    for (let bonzi of bonzis.values()) {
        if (!safeBonzis.has(bonzi)) {
            bonzi.exit();
        }
    }
};

setInterval(() => {
    for (let bonzi of bonzis.values()) {
        bonzi.update();
    }
}, 66.67);

let socket = io("//");

let usersPublic = new Map;
let bonzis = new Map;

function login() {
    socket.emit("login", {
        name: login_name.value,
        room: login_room.value,
    });
    setup();
}

login_go.onclick = login;

login_room.value = window.location.hash.slice(1);

function loginOnEnter(e) {
    if (e.which == 13) login();
}

login_name.onkeypress = loginOnEnter;
login_room.onkeypress = loginOnEnter;

socket.on("ban", (data) => {
    page_ban.hidden = false;
    ban_reason.innerHMTL = data.reason;
    ban_end.textContent = new Date(data.end).toString();
});

socket.on("kick", (data) => {
    page_kick.hidden = false;
    kick_reason.innerHMTL = data.reason;
});

socket.on("loginFail", (data) => {
    login_card.hidden = false;
    login_load.hidden = true;
    login_error.hidden = false;
    login_error.textContent = `Error: ${data.reason}`;
});

socket.on("disconnect", () => {
    errorFatal();
    logJoins = false;
    socket.connect();
});

let typingTimeout = 0;

function errorFatal() {
    if (!page_ban.hidden || page_kick.hidden) {
        page_error.hidden = false;
    }
}

function typing(bool) {
    if (bool) {
        if (!typingTimeout) {
            socket.emit("typing", 1);
        } else {
            clearTimeout(typingTimeout)
        }
        typingTimeout = setTimeout(() => {
            socket.emit("typing", 0);
            typingTimeout = 0;
        }, 2000);
    } else {
        if (typingTimeout) {
            socket.emit("typing", 0);
            clearTimeout(typingTimeout)
            typingTimeout = 0;
        }
    }
}

let joined = false;

function setup() {
    chat_send.onclick = sendInput;
    joined = true;


    chat_message.onkeypress = (e) => {
        if (e.which === 13) sendInput();
    };

    chat_message.oninput = () => {
        let value = chat_message.value;
        if (value.trim() === "") {
            typing(false);
        } else {
            typing(true);
        }
    };

    socket.on("room", (data) => {
        room_owner.hidden = !data.isOwner;
        room_public.hidden = !data.isPublic;
        room_private.hidden = data.isPublic;
        room_id.textContent = data.room;
    });

    socket.on("updateAll", (data) => {
        page_login.hidden = true;
        usersPublic.clear();
        for (let [id, user] of entries(data.usersPublic)) {
            usersPublic.set(id, user);
        }
        bonzisCheck();
        logJoins = true;
    });

    socket.on("update", (data) => {
        usersPublic.set(data.guid, data.userPublic);
        bonzisCheck();
    });

    socket.on("talk", (data) => {
        let bonzi = bonzis.get(data.guid);
        bonzi.runEvent([{
            type: "text",
            text: data.text,
            quote: data.quote,
        }]);
    });

    socket.on("joke", (data) => {
        let bonzi = bonzis.get(data.guid);
        bonzi.rng = new seedrandom(data.rng);
        bonzi.cancel();
        bonzi.joke();
    });

    socket.on("youtube", (data) => {
        let bonzi = bonzis.get(data.guid);
        bonzi.cancel();
        bonzi.youtube(data.vid);
    });

    socket.on("fact", (data) => {
        let bonzi = bonzis.get(data.guid);
        bonzi.rng = new seedrandom(data.rng);
        bonzi.fact();
    });

    socket.on("backflip", (data) => {
        let bonzi = bonzis.get(data.guid);
        bonzi.backflip(data.swag);
    });

    socket.on("asshole", (data) => {
        let bonzi = bonzis.get(data.guid);
        bonzi.asshole(data.target);
    });

    socket.on("bass", (data) => {
        let bonzi = bonzis.get(data.guid);
        bonzi.bass(data.target);
    });

    socket.on("owo", (data) => {
        let bonzi = bonzis.get(data.guid);
        bonzi.owo(data.target);
    });

    socket.on("triggered", function (data) {
        let bonzi = bonzis.get(data.guid);
        bonzi.runEvent(bonzi.data.event_list_triggered);
    });

    socket.on("linux", (data) => {
        let bonzi = bonzis.get(data.guid);
        bonzi.runEvent(bonzi.data.event_list_linux);
    });

    socket.on("pawn", (data) => {
        let bonzi = bonzis.get(data.guid);
        bonzi.runEvent(bonzi.data.event_list_pawn);
    });

    socket.on("leave", (data) => {
        let bonzi = bonzis.get(data.guid);
        if (bonzi) {
            let msg = `${nmarkup(bonzi.userPublic.name)} has left.`;
            bonzilog("server", "", msg, null, msg, false);
            bonzi.exit();
        }
    });

    socket.on("poll", (data) => {
        let bonzi = bonzis.get(data.guid);
        bonzi.poll(data.poll, data.title);
    });

    socket.on("image", (data) => {
        let bonzi = bonzis.get(data.guid);
        bonzi.image(data.url);
    });

    socket.on("vote", (data) => {
        updatePoll(data.poll, data.guid, data.vote);
    });
}

function sendInput() {
    let text = chat_message.value;
    chat_message.value = "";
    typing(false);
    scope: if (text.length > 0) {
        let youtube = youtubeParser(text);
        if (youtube) {
            socket.emit("command", {
                list: ["youtube", youtube],
            });
            break scope;
        }

        if (quote) {
            socket.emit("talk", {
                text: text,
                quote: quote,
            });
        } else if (text[0] === "/") {
            let list = text.slice(1).split(" ");
            if (list[0] === "clear") {
                lastUser = "";
                chat_log_content.innerText = "";
            } else if (list[0] === "settings") {
                openSettings();
            } else {
                socket.emit("command", {
                    list: list,
                });
            }
        } else {
            socket.emit("talk", {
                text: text,
            });
        }
    }
    quote = null;
    talkcard.hidden = true;
}

chat_log_button.onclick = () => {
    chat_log_button.hidden = true;
    chat_log.hidden = false;
    window.onresize();
};

chat_log_close.onclick = () => {
    chat_log_button.hidden = false;
    chat_log.hidden = true;
};

socket.on("connect", () => {
    page_error.hidden = true;
    if (joined) {
        socket.emit("login", {
            name: login_name.value,
            room: login_room.value,
        });
    }
});

class Dialog {
    constructor(opt = {}) {
        opt.title ??= "Window";
        opt.width ??= 400;
        opt.height ??= 300;
        this.x = opt.x ?? 0;
        this.y = opt.y ?? 0;
        this.element = document.createElement("div");
        this.element.classList.add("window");
        if (opt.class) this.element.classList.add(opt.class);
        this.element.innerHTML = `
        <div class="window_header">
        ${sanitize(opt.title)}
        <div class="window_close"></div>
        </div>
        <div class="window_body"></div>
        `;
        this.move(this.x, this.y);
        this.element.style.position = "absolute";
        this.element.querySelector(".window_header").onpointerdown = (e) => {
            dragged = this;
            dragX = e.pageX - this.x;
            dragY = e.pageY - this.y;
        };
        this.element.querySelector(".window_close").onclick = () => {
            this.element.remove();
        };
        this.element.style.width = `${opt.width}px`;
        this.element.style.height = `${opt.height}px`;
        this.element.querySelector(".window_body").innerHTML = opt.html;
        content.appendChild(this.element);
    }

    move(x, y) {
        this.x = x;
        this.y = y;
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }
}

function initSettings() {
    localStorage.imageBlacklist ??= "false";
    localStorage.classicBg ??= "false";
    localStorage.wordBlacklist ??= "[]";
}

let wordBlacklist = [];

if (localStorage.length === 0) {
    initSettings();
} else try {
    wordBlacklist = JSON.parse(localStorage.wordBlacklist);
    if (!isArray(wordBlacklist)) throw TypeError("wordBlacklist is not an array");
    for (let word of wordBlacklist) {
        if (typeof word !== "string") throw TypeError("wordBlacklist is broken");
    }
    document.body.classList.toggle("classic", localStorage.classicBg === "true");
} catch (err) {
    console.error("Loading settings failed: ", err);
    initSettings();
}

function xpath(el, expr) {
    let result = el.getRootNode().evaluate(expr, el);
    switch (result.resultType) {
        case XPathResult.BOOLEAN_TYPE:
            return result.booleanValue;
        case XPathResult.NUMBER_TYPE:
            return result.numberValue;
        case XPathResult.STRING_TYPE:
            return result.stringValue;
        case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
            let list = [];
            let node;
            while (node = result.iterateNext()) {
                list.push(node);
            }
            return list;
    }
}

function exportSettings() {
    let xml = `<?xml version="1.0" encoding="utf-8"?>
<settings>
    <hideImages on="${localStorage.hideImages === "true"}"/>
    <classicBg on="${localStorage.classicBg === "true"}"/>
`;
    let wordBlacklist = JSON.parse(localStorage.wordBlacklist);
    if (wordBlacklist.length > 0) {
        xml += "    <blacklist>\n"
        for (let word of wordBlacklist) {
            xml += `        <word>${sanitize(word)}</word>\n`
        }
        xml += "    </blacklist>\n"
    }
    xml += "</settings>";
    return xml;
}

function importSettings(xml) {
    let parser = new DOMParser();
    let settingsXML = parser.parseFromString(xml, "application/xml");
    let settings = settingsXML.documentElement;
    if (settings.tagName === "parserrror") {
        throw Error(`Parser error: ${settings.textContent}`)
    } else if (settings.tagName !== "settings") {
        throw Error(`Root tag is <${settings.tagName}>, not <settings>`);
    }
    initSettings();
    localStorage.hideImages = xpath(settings, "string(./hideImages/@on)") === "true";
    localStorage.classicBg = xpath(settings, "string(./classicBg/@on)") === "true";
    wordBlacklist = [];
    for (let word of xpath(settings, "./blacklist/word")) {
        wordBlacklist.push(word.textContent);
    }
    localStorage.wordBlacklist = JSON.stringify(wordBlacklist);

    document.body.classList.toggle("classic", localStorage.classicBg === "true");
}

function openSettings() {
    let settingsDialog = new Dialog({
        title: "Settings",
        class: "settings",
        html: `
            <div>
                <input type="checkbox" class="hide"> Hide Images<br>
                <input type="checkbox" class="classic"> Classic Background Color
            </div>  
            <div class="blacklist">
                <header>Blacklisted words: <div class="add">+</div></header>
                <div class="blacklist_words"></div>
            </div>
        `,
        width: 600,
        height: 400,
        x: 20,
        y: 20
    });
    let element = settingsDialog.element;
    let hideImages = element.querySelector(".hide");
    let classicBg = element.querySelector(".classic");
    let blacklist = element.querySelector(".blacklist_words");
    let add = element.querySelector(".add");
    hideImages.checked = localStorage.hideImages === "true";
    classicBg.checked = localStorage.classicBg === "true";
    hideImages.oninput = () => {
        localStorage.hideImages = hideImages.checked;
    }
    classicBg.oninput = () => {
        localStorage.classicBg = classicBg.checked;
        document.body.classList.toggle("classic", classicBg.checked);
    }
    function setBlacklist() {
        let words = [...blacklist.children].map(el => el.querySelector(".text").value);
        localStorage.wordBlacklist = JSON.stringify(words);
        wordBlacklist = words;
    }
    function createWordEl() {
        let el = document.createElement("div");
        el.classList.add("word");
        el.innerHTML = `
            <br>
            <input class="text">
            <div class="remove">-</div>
        `;
        el.querySelector(".remove").onclick = () => {
            el.remove();
            setBlacklist();
        }
        el.querySelector(".text").oninput = () => {
            setBlacklist();
        }
        return el;
    }
    for (let word of wordBlacklist) {
        let el = createWordEl();
        el.querySelector(".text").value = word;
        blacklist.appendChild(el);
    }
    add.onclick = () => {
        let el = createWordEl();
        blacklist.appendChild(el);
        let word = el.querySelector(".text");
        word.focus();
    }
}
