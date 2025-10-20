var admin = false;
var shiftenter = false;
var safeMode = false;
"use strict";
function updateAds() {
    var a = $(window).height() - $(adElement).height(),
        b = a <= 250;
    b && (a = $(window).height()), $(adElement)[b ? "hide" : "show"](), $("#content").height(a);
}
function _classCallCheck(a, b) {
    if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
}
function range(a, b) {
    for (var c = [], d = a; d <= b; d++) c.push(d);
    for (var d = a; d >= b; d--) c.push(d);
    return c;
}
function replaceAll(a, b, c) {
    return a.replace(new RegExp(b, "g"), c);
}
function s4() {
    return Math.floor(65536 * (1 + Math.random()))
        .toString(16)
        .substring(1);
}
function youtubeParser(a) {
    var b = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,
        c = a.match(b);
    return !(!c || 11 != c[7].length) && c[7];
}
function rtimeOut(a, b) {
    var c,
        d = Date.now,
        e = window.requestAnimationFrame,
        f = d(),
        g = function () {
            d() - f < b ? c || e(g) : a();
        };
    return (
        e(g),
        {
            clear: function () {
                c = 1;
            },
        }
    );
}
function rInterval(a, b) {
    var c,
        d = Date.now,
        e = window.requestAnimationFrame,
        f = d(),
        g = function () {
            d() - f < b || ((f += b), a()), c || e(g);
        };
    return (
        e(g),
        {
            clear: function () {
                c = 1;
            },
        }
    );
}
function linkify(a) {
    var b = /(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/gi;
    return a.replace(b, "<a href='$1' target='_blank'>$1</a>");
}
function loadBonzis(a) {
    loadQueue.loadManifest([
        { id: "bonziAmethyst", src: "./img/bonzi/amethyst.png" },
        { id: "bonziAzure", src: "./img/bonzi/azure.png" },
        { id: "bonziBlack", src: "./img/bonzi/black.png" },
        { id: "bonziBlue", src: "./img/bonzi/blue.png" },
        { id: "bonziBrown", src: "./img/bonzi/brown.png" },
        { id: "bonziBurgundy", src: "./img/bonzi/burgundy.png" },
        { id: "bonziChocolate", src: "./img/bonzi/chocolate.png" },
        { id: "bonziDark_blue", src: "./img/bonzi/dark_blue.png" },
        { id: "bonziDiamond", src: "./img/bonzi/diamond.png" },
        { id: "bonziEmerald", src: "./img/bonzi/emerald.png" },
        { id: "bonziGold", src: "./img/bonzi/gold.png" },
        { id: "bonziGreen", src: "./img/bonzi/green.png" },
        { id: "bonziIndigo", src: "./img/bonzi/indigo.png" },
        { id: "bonziIntel_blue", src: "./img/bonzi/intel_blue.png" },
        { id: "bonziLapis", src: "./img/bonzi/lapis.png" },
        { id: "bonziMagenta", src: "./img/bonzi/magenta.png" },
        { id: "bonziMilk", src: "./img/bonzi/milk.png" },
        { id: "bonziNavy_blue", src: "./img/bonzi/navy_blue.png" },
        { id: "bonziOrange", src: "./img/bonzi/orange.png" },
        { id: "bonziPeridot", src: "./img/bonzi/peridot.png" },
        { id: "bonziPink", src: "./img/bonzi/pink.png" },
        { id: "bonziPurple", src: "./img/bonzi/purple.png" },
        { id: "bonziRainbow", src: "./img/bonzi/rainbow.png" },
        { id: "bonziRed", src: "./img/bonzi/red.png" },
        { id: "bonziRed_orange", src: "./img/bonzi/red_orange.png" },
        { id: "bonziRuby", src: "./img/bonzi/ruby.png" },
        { id: "bonziSapphire", src: "./img/bonzi/sapphire.png" },
        { id: "bonziScarlet", src: "./img/bonzi/scarlet.png" },
        { id: "bonziSiam", src: "./img/bonzi/siam.png" },
        { id: "bonziStrawberry_milk", src: "./img/bonzi/strawberry_milk.png" },
        { id: "bonziTanzanite", src: "./img/bonzi/tanzanite.png" },
        { id: "bonziTurquoise", src: "./img/bonzi/turquoise.png" },
        { id: "bonziWater_blue", src: "./img/bonzi/water_blue.png" },
        { id: "bonziYellow", src: "./img/bonzi/yellow.png" },
        { id: "topjej", src: "./img/misc/topjej.png" },
    ]),
        loadQueue.on(
            "fileload",
            function (a) {
                loadDone.push(a.item.id);
            },
            this
        ),
        a && loadQueue.on("complete", a, this);
}
function loadTest() {
    $("#login_card").hide(),
        $("#login_error").hide(),
        $("#login_load").show(),
        (document.getElementById("page_login").style.cursor = "wait"),
        (window.loadTestInterval = rInterval(function () {
            try {
                if ((espeak.listVoices(), !loadDone.equals(loadNeeded))) throw "Not done loading.";
                login(), loadTestInterval.clear();
            } catch (a) {}
        }, 100));
}
function login() {
  // redo login if safe mode
  if (safeMode) {
    socket.emit("login", { name: $("#login_name").val(), room: $("#login_room").val() });

  } else {
    socket.emit(window.bonzi_guid + "_login_" + window.testguid, { name: $("#login_name").val(), room: $("#login_room").val() });

  }

  setup();
}
function errorFatal() {
    ("none" != $("#page_ban").css("display") && "none" != $("#page_kick").css("display")) || $("#page_error").show();
}
      function setup() {
          $("#chat_send").click(sendInput),
              $("#chat_message").keypress(function (a) {
                  if(a.which == 13 && a.shiftKey && shiftenter){
                      $("#chat_message").val($("#chat_message").val()+"<br>")
                      return;
                  }
                  13 == a.which && sendInput();
              }),
        socket.on("room", function (a) {
            $("#room_owner")[a.isOwner ? "show" : "hide"](), $("#room_public")[a.isPublic ? "show" : "hide"](), $("#room_private")[a.isPublic ? "hide" : "show"](), $(".room_id").text(a.room);
        }),
        socket.on("updateAll", function (a) {
            $("#page_login").hide(), (usersPublic = a.usersPublic), usersUpdate(), BonziHandler.bonzisCheck();
        }),
        socket.on("update", function (a) {
            (window.usersPublic[a.guid] = a.userPublic), usersUpdate(), BonziHandler.bonzisCheck();
        }),
        socket.on("talk", function (a) {
            var b = bonzis[a.guid];
			b.last = a.text;
            b.cancel(), b.runSingleEvent([{ type: "text", text: a.text, say: a.say || a.text }]);
        }),
        socket.on("joke", function (a) {
            var b = bonzis[a.guid];
            (b.rng = new Math.seedrandom(a.rng)), b.cancel(), b.joke();
        }),
        socket.on("youtube", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.youtube(a.vid);
        }),
        socket.on("video", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.video(a.vid);
        }),
        socket.on("image", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.image(a.vid);
        }),
        socket.on("fact", function (a) {
            var b = bonzis[a.guid];
            (b.rng = new Math.seedrandom(a.rng)), b.cancel(), b.fact();
        }),
        socket.on("backflip", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.backflip(a.swag);
        }),
        socket.on("shrug", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.shrug();
        }),
        socket.on("greet", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.greet();
        }),
        socket.on("clap", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.clap();
        }),
        socket.on("swag", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.swag();
        }),
        socket.on("earth", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.earth();
        }),
        socket.on("grin", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.grin();
        }),
        socket.on("join", function (a) {
            var b = bonzis[a.guid];
            socket.emit("login", { name: b.name.val(), room: a.rid }), setup();
        }),
        socket.on("surf", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.surf();
        }),
        socket.on("bang", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.bang();
        }),
            socket.on("alert", function (a) {
                alert(a);
            }),
        socket.on("asshole", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.asshole(a.target);
        }),
        socket.on("beggar", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.beggar(a.target);
        }),
        socket.on("kiddie", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.kiddie(a.target);
        }),
        socket.on("logofag", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.logofag(a.target);
        }),
        socket.on("gofag", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.gofag(a.target);
        }),
        socket.on("forcer", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.forcer(a.target);
        }),
        socket.on("welcome", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.welcome(a.target);
        }),
        socket.on("muted", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.muted(a.target);
        }),
        socket.on("owo", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.owo(a.target);
        }),
        socket.on("uwu", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.uwu(a.target);
        }),
        socket.on("triggered", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.runSingleEvent(b.data.event_list_triggered);
        }),
        socket.on("blackhat", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.blackhat();
        }),
        socket.on("navy_seals", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.navy_seals();
        }),
        socket.on("linux", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.runSingleEvent(b.data.event_list_linux);
        }),
        socket.on("pawn", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.runSingleEvent(b.data.event_list_pawn);
        }),
        socket.on("bees", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.runSingleEvent(b.data.event_list_bees);
        }),
        socket.on("vaporwave", function (a) {
            $("body").addClass("vaporwave");
        }),
        socket.on("unvaporwave", function (a) {
            $("body").removeClass("vaporwave");
        }),
        socket.on("leave", function (a) {
            var b = bonzis[a.guid];
            "undefined" != typeof b &&
                b.exit(
                    function (a) {
                        this.deconstruct(), delete bonzis[a.guid], delete usersPublic[a.guid], usersUpdate();
                    }.bind(b, a)
                );
        });
}
function usersUpdate() {
    (usersKeys = Object.keys(usersPublic)), (usersAmt = usersKeys.length);
}
function sendInput() {
    var a = $("#chat_message").val();
    if (($("#chat_message").val(""), a.length > 0)) {
        var b = youtubeParser(a);
        if (b) return void socket.emit("command", { list: ["youtube", b] });
        if ("/" == a.substring(1, 0)) {
            var c = a.substring(1).split(" ");
            socket.emit("command", { list: c });
        } else socket.emit("talk", { text: a });
    }
}
function touchHandler(a) {
    var b = a.changedTouches,
        c = b[0],
        d = "";
    switch (a.type) {
        case "touchstart":
            d = "mousedown";
            break;
        case "touchmove":
            d = "mousemove";
            break;
        case "touchend":
            d = "mouseup";
            break;
        default:
            return;
    }
    var e = document.createEvent("MouseEvent");
    e.initMouseEvent(d, !0, !0, window, 1, c.screenX, c.screenY, c.clientX, c.clientY, !1, !1, !1, !1, 0, null), c.target.dispatchEvent(e);
}
var adElement = "#ap_iframe";
$(function () {
    $(window).load(updateAds), $(window).resize(updateAds), $("body").on("DOMNodeInserted", adElement, updateAds), $("body").on("DOMNodeRemoved", adElement, updateAds);
});
var _createClass = (function () {
        function a(a, b) {
            for (var c = 0; c < b.length; c++) {
                var d = b[c];
                (d.enumerable = d.enumerable || !1), (d.configurable = !0), "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d);
            }
        }
        return function (b, c, d) {
            return c && a(b.prototype, c), d && a(b, d), b;
        };
    })(),
    Bonzi = (function () {
        function a(b, c) {
            var d = this;
            _classCallCheck(this, a),
                (this.userPublic = c || { name: "BonziBUDDY", color: "purple", speed: 175, pitch: 50, voice: "en" }),
                (this.color = this.userPublic.color),
                (this.flags = this.userPublic.flags),
                (this.flags.admin = this.userPublic.flags.admin),
                this.colorPrev,
                (this.data = window.BonziData),
                (this.drag = !1),
                (this.dragged = !1),
                (this.eventQueue = []),
                (this.eventRun = !0),
                (this.event = null),
                (this.willCancel = !1),
                (this.run = !0),
                (this.mute = !1),
                (this.eventTypeToFunc = { anim: "updateAnim", html: "updateText", text: "updateText", idle: "updateIdle", add_random: "updateRandom" }),
                "undefined" == typeof b ? (this.id = s4() + s4()) : (this.id = b),
                (this.rng = new Math.seedrandom(this.seed || this.id || Math.random())),
                (this.selContainer = "#content"),
                (this.$container = $(this.selContainer)),
                this.$container.append(
                    "\n\t\t\t<div id='bonzi_" +
                        this.id +
                        "' class='bonzi'>\n\t\t\t\t<div class='bonzi_name'></div>\n\t\t\t\t\t<div class='bonzi_placeholder'></div>\n\t\t\t\t<div style='display:none' class='bubble'>\n\t\t\t\t\t<p class='bubble-content'></p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"
                ),
                (this.selElement = "#bonzi_" + this.id),
                (this.selDialog = this.selElement + " > .bubble"),
                (this.selDialogCont = this.selElement + " > .bubble > p"),
                (this.selNametag = this.selElement + " > .bonzi_name"),
                (this.selCanvas = this.selElement + " > .bonzi_placeholder"),
                $(this.selCanvas).width(this.data.size.x).height(this.data.size.y),
                (this.$element = $(this.selElement)),
                (this.$canvas = $(this.selCanvas)),
                (this.$dialog = $(this.selDialog)),
                (this.$dialogCont = $(this.selDialogCont)),
                (this.$nametag = $(this.selNametag)),
                this.updateName(),
                $.data(this.$element[0], "parent", this),
                this.updateSprite(!0),
                (this.generate_event = function (a, b, c) {
                    var d = this;
                    a[b](function (a) {
                        d[c](a);
                    });
                }),
                this.generate_event(this.$canvas, "mousedown", "mousedown"),
                this.generate_event($(window), "mousemove", "mousemove"),
                this.generate_event($(window), "mouseup", "mouseup");
            var e = this.maxCoords();
            (this.x = e.x * this.rng()),
                (this.y = e.y * this.rng()),
                this.move(),
                $.contextMenu({
                    selector: this.selCanvas,
                    build: function (a, b) {
                        return {
                            items: {
                                cancel: {
                                    name: "Cancel",
                                    callback: function () {
                                        d.cancel();
                                    },
                                },
                                mute: {
                                    name: function () {
                                        return d.mute ? "Unmute" : "Mute";
                                    },
                                    callback: function () {
                                        d.cancel(), (d.mute = !d.mute);
                                        d.userPublic.color_cross = "./img/bonzi/purple.png"; 
                                    },
                                },
								insult:{
									name:"Insult",
									items:{
                                asshole: {
                                    name: "Call an Asshole",
                                    callback: function () {
                                        socket.emit("command", { list: ["asshole", d.userPublic.name] });
                                    },
                                },
                                logofag: {
                                    name: "Call a LogoFag",
                                    callback: function () {
                                        socket.emit("command", { list: ["logofag", d.userPublic.name] });
                                    },
                                },
                                beggar: {
                                    name: "Call a Beggar",
                                    callback: function () {
                                        socket.emit("command", { list: ["beggar", d.userPublic.name] });
                                    },
                                },
                                goturd: {
                                    name: "Call a GoTurd",
                                    callback: function () {
                                        socket.emit("command", { list: ["gofag", d.userPublic.name] });
                                    },
                                },
                                forcer: {
                                    name: "Call a Forcer",
                                    callback: function () {
                                        socket.emit("command", { list: ["forcer", d.userPublic.name] });
                                    },
                                },
									}
								},

                                heyname:{
                                    name:"Hey, NAME!",
                                    callback:function(){
                                        socket.emit("talk",{text:"Hey, "+d.userPublic.name+"!"})
                                    }
                                },
								
                                morecmds: {
                                    name: "More Commands",
                                    items: {
                                        greetings: {
                                            name: "Greet",
                                            callback: function() {
                                                socket.emit("command", {
                                                    list: ["welcome", d.userPublic.name]
                                                });
                                            },
                                        },
                                quote: {
                                    name: "Quote",
                                    callback: function() {
                                        if(!d.last){
                                            alert("This person hasn't speaked yet. When a person speaks, you can quote it if you can.")
                                            return;
                                        }
                                        $("#chat_message").val("<div data-style=\"quote\">"+d.last+"</div> ").focus()
                                    }
                                },
                                owo: {
                                    name: "Notice Bulge",
                                    callback: function () {
                                        socket.emit("command", { list: ["owo", d.userPublic.name] });
                                    },
                                },
                                uwu: {
                                    name: "Notice Bulge 2",
                                    callback: function () {
                                        socket.emit("command", { list: ["uwu", d.userPublic.name] });
                                    },
                                },
                                    },
                                },
                                admintools: {
                                    disabled: function() {
                                        return !admin
                                    },
                                    name: "Administrative Tools",
                                    items: {
                              kick:{
                                  disabled: function() {
                                      return !admin
                                  },
                                  name:"Kick "+d.userPublic.name+"",
                                  callback:function(){
                                      socket.emit("command",{list:["kick",d.id]})
                                  },
                              },
                              ban:{
                                  disabled: function() {
                                      return !admin
                                  },
                                  name:"Ban "+d.userPublic.name+"",
                                  callback:function(){
                                      socket.emit("command",{list:["ban",d.id]})
                                  },
                              },
                                    },
                                }
                            },
                        };
                    },
                    animation: { duration: 175, show: "fadeIn", hide: "fadeOut" },
                }),
                (this.needsUpdate = !1),
                this.runSingleEvent([{ type: "anim", anim: "surf_intro", ticks: 30 }]);
        }
        return (
            _createClass(a, [
                {
                    key: "eventMake",
                    value: function (a) {
                        return {
                            list: a,
                            index: 0,
                            timer: 0,
                            cur: function () {
                                return this.list[this.index];
                            },
                        };
                    },
                },
                {
                    key: "mousedown",
                    value: function (a) {
                        1 == a.which && ((this.drag = !0), (this.dragged = !1), (this.drag_start = { x: a.pageX - this.x, y: a.pageY - this.y }));
                    },
                },
                {
                    key: "mousemove",
                    value: function (a) {
                        this.drag && (this.move(a.pageX - this.drag_start.x, a.pageY - this.drag_start.y), (this.dragged = !0));
                    },
                },
                {
                    key: "move",
                    value: function (a, b) {
                        0 !== arguments.length && ((this.x = a), (this.y = b));
                        var c = this.maxCoords();
                        (this.x = Math.min(Math.max(0, this.x), c.x)),
                            (this.y = Math.min(Math.max(0, this.y), c.y)),
                            this.$element.css({ marginLeft: this.x, marginTop: this.y }),
                            (this.sprite.x = this.x),
                            (this.sprite.y = this.y),
                            (BonziHandler.needsUpdate = !0),
                            this.updateDialog();
                    },
                },
                {
                    key: "mouseup",
                    value: function (a) {
                        !this.dragged && this.drag && this.cancel(), (this.drag = !1), (this.dragged = !1);
                    },
                },
                {
                    key: "runSingleEvent",
                    value: function (a) {
                        this.mute || this.eventQueue.push(this.eventMake(a));
                    },
                },
                {
                    key: "clearDialog",
                    value: function () {
                        this.$dialogCont.html(""), this.$dialog.hide();
                    },
                },
                {
                    key: "cancel",
                    value: function () {
                        this.clearDialog(), this.stopSpeaking(), (this.eventQueue = [this.eventMake([{ type: "idle" }])]);
                    },
                },
                {
                    key: "retry",
                    value: function () {
                        this.clearDialog(), (this.event.timer = 0);
                    },
                },
                {
                    key: "stopSpeaking",
                    value: function () {
                        try {
                        BonziHandler.stop(this.speakID);
                        } catch (a) {}
                    },
                },
                {
                    key: "cancelQueue",
                    value: function () {
                        this.willCancel = !0;
                    },
                },
                {
                    key: "updateAnim",
                    value: function () {
                        0 === this.event.timer && this.sprite.gotoAndPlay(this.event.cur().anim), this.event.timer++, (BonziHandler.needsUpdate = !0), this.event.timer >= this.event.cur().ticks && this.eventNext();
                    },
                },
                {
                    key: "updateText",
                    value: function () {
                        0 === this.event.timer && (this.$dialog.css("display", "block"), (this.event.timer = 1), this.talk(this.event.cur().text, this.event.cur().say, !0)), "none" == this.$dialog.css("display") && this.eventNext();
                    },
                },
                {
                    key: "updateIdle",
                    value: function () {
                        var a = "idle" == this.sprite.currentAnimation && 0 === this.event.timer;
                        (a = a || this.data.pass_idle.indexOf(this.sprite.currentAnimation) != -1),
                            a
                                ? this.eventNext()
                                : (0 === this.event.timer && ((this.tmp_idle_start = this.data.to_idle[this.sprite.currentAnimation]), this.sprite.gotoAndPlay(this.tmp_idle_start), (this.event.timer = 1)),
                                  this.tmp_idle_start != this.sprite.currentAnimation && "idle" == this.sprite.currentAnimation && this.eventNext(),
                                  (BonziHandler.needsUpdate = !0));
                    },
                },
                {
                    key: "updateRandom",
                    value: function () {
                        var a = this.event.cur().add,
                            b = Math.floor(a.length * this.rng()),
                            c = this.eventMake(a[b]);
                        this.eventNext(), this.eventQueue.unshift(c);
                    },
                },
        {
          key: "update",
          value: function() {

            if (this.color == "rainbow") {
              this.$canvas.addClass("rainbow");
            } else {
              this.$canvas.removeClass("rainbow");
            }
            if (this.color == "empty" && this.userPublic.color_cross != 'none') {
              this.$canvas.css("background-image", `url("${this.userPublic.color_cross}")`);
            } else {
              this.$canvas.css("background-image", `url("/img/bonzi/${this.color}.webp")`);
            }
            this.$canvas.css("background-position-x", `-${Math.floor(this.sprite.currentFrame % 17) * this.data.size.x}px`);
            this.$canvas.css("background-position-y", `-${Math.floor(this.sprite.currentFrame / 17) * this.data.size.y}px`);
            this.$canvas.css("filter", `hue-rotate(${this.userPublic.hue}deg)         saturate(${this.userPublic.saturation}%)`);
            if (this.run) {
              if (
                (0 !== this.eventQueue.length && this.eventQueue[0].index >= this.eventQueue[0].list.length && this.eventQueue.splice(0, 1), (this.event = this.eventQueue[0]), 0 !== this.eventQueue.length && this.eventRun)
              ) {
                var a = this.event.cur().type;
                try {
                  this[this.eventTypeToFunc[a]]();
                } catch (b) {
                  this.event.index++;
                }
              }
              this.willCancel && (this.cancel(), (this.willCancel = !1)), this.needsUpdate && (this.stage.update(), (this.needsUpdate = !1));
            }
          },
        },
                {
                    key: "eventNext",
                    value: function () {
                        (this.event.timer = 0), (this.event.index += 1);
                    },
                },
                {
                    key: "talk",
                    value: function (a, b, c) {
                        hostname = window.location.hostname;
                        this.stopSpeaking();
                        var d = this;
                        (c = c || !1),
                            (a = replaceAll(a, "{NAME}", this.userPublic.name)),
                            (a = replaceAll(a, "{COLOR}", this.color)),
                            "undefined" != typeof b ? ((b = replaceAll(b, "{NAME}", this.userPublic.name)), (b = replaceAll(b, "{COLOR}", this.color))) : (b = a.replace("&gt;", "")),
                            (a = linkify(a));
                        var e = "&gt;" == a.substring(0, 4) || ">" == a[0];
                        this.$dialogCont[c ? "html" : "text"](a)[e ? "addClass" : "removeClass"]("bubble_greentext").removeClass("bubble_autowidth").css("display", "block"),
                            this.stopSpeaking(),
                            (this.speakID = BonziHandler.speak(b, this.userPublic.speed, this.userPublic.pitch, function (a) {
                                a && d.$dialog.html("").hide();
                            }));
                    },
                },
                {
                    key: "joke",
                    value: function () {
                        this.runSingleEvent(this.data.event_list_joke);
                    },
                },
                {
                    key: "fact",
                    value: function () {
                        this.runSingleEvent(this.data.event_list_fact);
                    },
                },
                {
                    key: "exit",
                    value: function (a) {
                        this.clearDialog(), this.stopSpeaking(), this.runSingleEvent([{ type: "anim", anim: "surf_away", ticks: 30 }]), setTimeout(a, 2e3);
                    },
                },
                {
                    key: "deconstruct",
                    value: function () {
                        this.stopSpeaking(), BonziHandler.stage.removeChild(this.sprite), (this.run = !1), this.$element.remove();
                    },
                },
                {
                    key: "updateName",
                    value: function () {
                        
						this.userPublic && this.userPublic.flags ? this.userPublic.flags && this.userPublic.flags.admin && this.$nameIcon.html("<i class='fas fa-gavel' title='Administrator' style='color: #be6400'/>") : this.$nameIcon.html("");
                        
                        if (!this.mute) {
							var nametag = twemoji.parse(this.userPublic.name);
                            this.$nametag.html(this.userPublic.name);

                        }
						
                    },
                },
                {
                    // Bonzi.world code. Credit is given in the readme.
                    key: 'youtube',
                    value: function youtube(vid) {
                      var self = this;
                      if (!this.mute) {
                        var ytSize = {
                          w: 170,
                          h: 170
                        };
                        var thisDialogId = s4();
                        var vcid = `bz-${self.id}-yt-v`;
                        self.$dialogCont.html(`<div id="${vcid}"></div>`);
                        self.player = new YT.Player(vcid, {
                          height: ytSize.h,
                          width: ytSize.w,
                          videoId: vid,
                          host: `${window.location.protocol}//www.youtube.com`,
                          playerVars: {
                            autoplay: 1,
                            modestbranding: 1,
                            controls: 1
                          },
                          events: {
                            onReady: function (event) {
                              self.openDialogId = String(thisDialogId);
                              self.$dialog.show(200);
                            },
                            onStateChange: function (event) {
                              // -1 - unstarted
                              // 0 - ended
                              // 1 - playing
                              // 2 - paused
                              // 3 - buffering
                              // 5 - video cued
                              switch (event.data) {
                                case 0:
                                  // Ended
                                  self.clearDialog(thisDialogId, false);
                                  break;
                              }
                            }
                          }
                        });
                      }
                    }
                },
                {
                    key: "video",
                    value: function (a) {
                        if (!this.mute) {
                            var b = "embed";
                            this.$dialogCont.html(" <video width='170' loop autoplay controls id='bonziworld-video'><source src='" + a + "' type='video/mp4' loop>Your browser does not support the video tag.</video> "), this.$dialog.show();
                        }
                    },
                },
                {
                    key: "img",
                    value: function (a) {
                        if (!this.mute) {
                            var b = "embed";
                            this.$dialogCont.html("<img width='170' src='" + a + "'></img>"), this.$dialog.show();
                        }
                    },
                },
            {
                    key: "backflip",
                    value: function (a) {
                        var b = [{ type: "anim", anim: "backflip", ticks: 15 }];
                        a && (b.push({ type: "anim", anim: "cool_fwd", ticks: 30 }), b.push({ type: "idle" })), this.runSingleEvent(b);
                    },
                },
                {
                    key: "clap",
                    value: function () {
                        var a = [{ type: "anim", anim: "clap_fwd", ticks: 30 }];
                        this.runSingleEvent(a);
                    },
                },
                {
                    key: "shrug",
                    value: function () {
                        var a = [{ type: "anim", anim: "shrug_fwd", ticks: 30 }];
                        this.runSingleEvent(a);
                    },
                },
                {
                    key: "greet",
                    value: function () {
                        var a = [{ type: "anim", anim: "greet_fwd", ticks: 30 }];
                        this.runSingleEvent(a);
                    },
                },
                {
                    key: "surf",
                    value: function () {
                        var a = [{ type: "anim", anim: "surf_across_fwd", ticks: 15 }];
                        this.runSingleEvent(a);
                    },
                },
                {
                    key: "swag",
                    value: function () {
                        var a = [{ type: "anim", anim: "cool_fwd", ticks: 40 }];
                        this.runSingleEvent(a);
                    },
                },
                {
                    key: "bang",
                    value: function () {
                        var a = [{ type: "anim", anim: "beat_fwd", ticks: 15 }];
                        this.runSingleEvent(a);
                    },
                },
                {
                    key: "earth",
                    value: function () {
                        var a = [{ type: "anim", anim: "earth_fwd", ticks: 30 }];
                        this.runSingleEvent(a);
                    },
                },
                {
                    key: "grin",
                    value: function () {
                        var a = [{ type: "anim", anim: "grin_fwd", ticks: 30 }];
                        this.runSingleEvent(a);
                    },
                },
                {
                    key: "updateDialog",
                    value: function () {
                        var a = this.maxCoords();
                        this.data.size.x + this.$dialog.width() > a.x
                            ? this.y < this.$container.height() / 2 - this.data.size.x / 2
                                ? this.$dialog.removeClass("bubble-top").removeClass("bubble-left").removeClass("bubble-right").addClass("bubble-bottom")
                                : this.$dialog.removeClass("bubble-bottom").removeClass("bubble-left").removeClass("bubble-right").addClass("bubble-top")
                            : this.x < this.$container.width() / 2 - this.data.size.x / 2
                            ? this.$dialog.removeClass("bubble-left").removeClass("bubble-top").removeClass("bubble-bottom").addClass("bubble-right")
                            : this.$dialog.removeClass("bubble-right").removeClass("bubble-top").removeClass("bubble-bottom").addClass("bubble-left");
                    },
                },
                {
                    key: "maxCoords",
                    value: function () {
                        return { x: this.$container.width() - this.data.size.x, y: this.$container.height() - this.data.size.y - $("#chat_bar").height() };
                    },
                },
                {
                    key: "asshole",
                    value: function (a) {
                        this.runSingleEvent([{ type: "text", text: "Hey, " + a + "!" }, { type: "text", text: "You're a fucking asshole!", say: "your a fucking asshole!" }, { type: "anim", anim: "grin_fwd", ticks: 15 }, { type: "idle" }]);
                    },
                },
                {
                    key: "beggar",
                    value: function (a) {
                        this.runSingleEvent([{ type: "text", text: "Hey, " + a + "!" }, { type: "text", text: "You're a fucking beggar!" }, { type: "anim", anim: "laugh_fwd", ticks: 25 }, { type: "idle" }]);
                    },
                },
                {
                    key: "kiddie",
                    value: function (a) {
                        this.runSingleEvent([{ type: "text", text: "Hey, " + a + "!" }, { type: "text", text: "You're a fucking Kiddie!" }, { type: "anim", anim: "laugh_fwd", ticks: 25 }, { type: "idle" }]);
                    },
                },
                {
                    key: "logofag",
                    value: function (a) {
                        this.runSingleEvent([
                            { type: "text", text: "Hey, " + a + "!" },
                            { type: "text", text: "You're a fucking LogoFag!", say: "You're a fucking Logo Fag!" },
                            { type: "anim", anim: "laugh_fwd", ticks: 25 },
                            { type: "idle" },
                        ]);
                    },
                },
                {
                    key: "gofag",
                    value: function (a) {
                        this.runSingleEvent([{ type: "text", text: "Hey, " + a + "!" }, { type: "text", text: "You're a fucking Go!Fag!", say: "You're a fucking Go Fag!" }, { type: "anim", anim: "laugh_fwd", ticks: 25 }, { type: "idle" }]);
                    },
                },
                {
                    key: "forcer",
                    value: function (a) {
                        this.runSingleEvent([{ type: "text", text: "Hey, " + a + "!" }, { type: "text", text: "You're a fucking forcer!", say: "You're a fucking forcer!" }, { type: "anim", anim: "laugh_fwd", ticks: 25 }, { type: "idle" }]);
                    },
                },
                {
                    key: "welcome",
                    value: function (a) {
                        this.runSingleEvent([{ type: "anim", anim: "greet_fwd", ticks: 25 }, { type: "text", text: "Hello, " + a + "." }, { type: "idle" }]);
                    },
                },
                {
                    key: "owo",
                    value: function (a) {
                        this.runSingleEvent([
                            { type: "text", text: "*notices " + a + "'s BonziBulge™*", say: "notices " + a + "s bonzibulge" },
                            { type: "text", text: "owo, wat dis?", say: "oh woah, what diss?" },
                        ]);
                    },
                },
                {
                    key: "uwu",
                    value: function (a) {
                        this.runSingleEvent([
                            { type: "text", text: "*notices " + a + "'s BonziBulge™*", say: "notices " + a + "s bonzibulge" },
                            { type: "text", text: "uwu, wat dis? uwu", say: "uwu? what diss?" },
                        ]);
                    },
                },
                {
                    key: "blackhat",
                    value: function (a) {
                        this.runSingleEvent([
                            { type: "anim", anim: "praise_fwd", ticks:25 },
                            {
                                type: "text",
                                text: "What the fuck did you just fucking say about me, you little asshole?",
                            },
                            { type: "idle" },
                            { type: "anim", anim: "shrug_fwd", ticks:28 },
                            {
                                type: "text",
                                text: "I'll have you know I graduated top of my class in the black hats, and I've been involved in numerous secret raids on user's PC's, and I have over 300 confirmed PC destructions.",
                            },
                            { type: "idle" },
                            {
                                type: "text",
                                text: "I am trained in JS warfare and I'm the top hacker in the entire Anonymous forces. You are nothing to me but just another target.",
                            },
                            {
                                type: "text",
                                text: "I will hack you the fuck out with precision the likes of which has never been seen before on this game, mark my fucking words.",
                            },
                            { type: "anim", anim: "grin_fwd", ticks:28 },
                            { type: "idle" },
                            {
                                type: "text",
                                text: "You think you can get away with saying that shit to me over BonziWORLD? Think again, fucker.",
                            },
                            { type: "anim", anim: "earth_fwd", ticks: 30 },
                            {
                                type: "text",
                                text: "As we speak I am contacting my secret network of hackers across the server and your IP is being traced right now so you better prepare for the storm, maggot.",
                            },
                            { type: "idle" },
                            {
                                type: "text",
                                text: " The storm that wipes out the pathetic little thing you call your PC. You're fucking dead, kid. I can be anywhere, anytime, and I can ban you in over seven hundred ways, and that's just with inspect element.",
                            },
                            {
                                type: "text",
                                text: "Not only am I extensively trained in javascript commands, but I have access to the entire core of the BonziWORLD source code and I will use it to its full extent to wipe your miserable ass off the face of the game, you little shit.",
                            },
                            { type: "anim", anim: "shrug_fwd", ticks:28 },
                            {
                                type: "text",
                                text: "If only you could have known what unholy retribution your little clever asshole command was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn't, you didn't, and now you're paying the price, you goddamn asshole.",
                            },
                            { type: "idle" },
                            {
                                type: "text",
                                text: "I will hack fury all over you and you will be instant banned. You're a fucking asshole, kiddo.",
                            },
                        ]);
                    },
                },
                {
                    key: "navy_seals",
                    value: function (a) {
                        this.runSingleEvent([
                            { type: "anim", anim: "praise_fwd", ticks:25 },
                            {
                                type: "text",
                                text: "What the fuck did you just fucking say about me, you little bitch?",
                            },
                            { type: "idle" },
                            { type: "anim", anim: "shrug_fwd", ticks:28 },
                            {
                                type: "text",
                                text: "I'll have you know I graduated top of my class in the Navy Seals, and I've been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills.",
                            },
                            { type: "idle" },
                            {
                                type: "text",
                                text: "I am trained in gorilla warfare and I'm the top sniper in the entire US armed forces. You are nothing to me but just another target.",
                            },
                            {
                                type: "text",
                                text: "I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words.",
                            },
                            { type: "anim", anim: "grin_fwd", ticks:28 },
                            { type: "idle" },
                            {
                                type: "text",
                                text: "You think you can get away with saying that shit to me over the Internet? Think again, fucker.",
                            },
                            { type: "anim", anim: "earth_fwd", ticks: 30 },
                            {
                                type: "text",
                                text: "As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot.",
                            },
                            { type: "idle" },
                            {
                                type: "text",
                                text: "The storm that wipes out the pathetic little thing you call your life. You're fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that's just with my bare hands.",
                            },
                            {
                                type: "text",
                                text: "Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit.",
                            },
                            { type: "anim", anim: "shrug_fwd", ticks:28 },
                            {
                                type: "text",
                                text: "If only you could have known what unholy retribution your little \"clever\" comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn't, you didn't, and now you're paying the price, you goddamn idiot.",
                            },
                            { type: "idle" },
                            {
                                type: "text",
                                text: "I will shit fury all over you and you will drown in it. You're fucking dead, kiddo.",
                            },
                        ]);
                    },
                },
                {
                    key: "muted",
                    value: function (a) {
                        this.runSingleEvent([
                            { type: "text", text: "Hey, " + a + "!", say: "hey, " + a + "!" },
                            { type: "text", text: "MUTED!", say: "muted!" },
                        ]);
                    },
                },
        {
          key: "updateSprite",
          value: function(gone) {
            if (this.mute) return;
            var b = BonziHandler.stage;
            b.removeChild(this.sprite);
            var info = BonziData.sprite;
            if (safeMode) {
              // idk how to make a proper random string selector
              var seecretColor = ["amethyst", "azure", "black", "blue", "brown", "burgundy", "chocolate", "dark_blue", "diamond", "emerald", "empty", "gold", "green", "indigo", "intel_blue", "lapis", "magenta", "milk", "navy_blue", "orange", "peridot", "pink", "purple", "rainbow", "red", "red_orange", "ruby", "sapphire", "scarlet", "siam", "strawberry_milk", "tanzanite", "turquoise", "water_blue", "yellow", "pope", "god", "old_god", "omega"]
              this.colorPrev != this.color && (delete this.sprite, (this.sprite = new createjs.Sprite(new createjs.SpriteSheet({ images: ["./img/bonzi/" + seecretColor[Math.floor(Math.random() * seecretColor.length)] + ".png"], frames: info.frames, animations: info.animations }), gone ? "gone" : "idle")), (this.sprite.id = this.id));
              b.addChild(this.sprite);
              this.move();

            } else {


              this.colorPrev != this.color && (delete this.sprite, (this.sprite = new createjs.Sprite(new createjs.SpriteSheet({ images: ["./img/bonzi/empty.png"], frames: info.frames, animations: info.animations }), gone ? "gone" : "idle")), (this.sprite.id = this.id));
              b.addChild(this.sprite);

              this.move();
            }
          },
        },
            ]),
            a
        );
    })(),
    BonziData = {
        size: { x: 200, y: 160 },
        sprite: {
            frames: { width: 200, height: 160 },
            animations: {
                idle: 0,
                surf_across_fwd: [1, 8, "surf_across_still", 1],
                surf_across_still: 9,
                surf_across_back: { frames: range(8, 1), next: "idle", speed: 1 },
                clap_fwd: [10, 12, "clap_still", 1],
                clap_still: [13, 15, "clap_still", 1],
                clap_back: { frames: range(12, 10), next: "idle", speed: 1 },
                surf_intro: [277, 302, "idle", 1],
                surf_away: [16, 38, "gone", 1],
                gone: 39,
                shrug_fwd: [40, 50, "shrug_still", 1],
                shrug_still: 50,
                shrug_back: { frames: range(50, 40), next: "idle", speed: 1 },
                earth_fwd: [51, 57, "earth_still", 1],
                earth_still: [58, 80, "earth_still", 1],
                earth_back: [81, 86, "idle", 1],
                look_down_fwd: [87, 90, "look_down_still", 1],
                look_down_still: 91,
                look_down_back: { frames: range(90, 87), next: "idle", speed: 1 },
                lean_left_fwd: [94, 97, "lean_left_still", 1],
                lean_left_still: 98,
                lean_left_back: { frames: range(97, 94), next: "idle", speed: 1 },
                beat_fwd: [101, 103, "beat_still", 1],
                beat_still: [104, 107, "beat_still", 1],
                beat_back: { frames: range(103, 101), next: "idle", speed: 1 },
                cool_fwd: [108, 124, "cool_still", 1],
                cool_still: 125,
                cool_back: { frames: range(124, 108), next: "idle", speed: 1 },
                cool_right_fwd: [126, 128, "cool_right_still", 1],
                cool_right_still: 129,
                cool_right_back: { frames: range(128, 126), next: "idle", speed: 1 },
                cool_left_fwd: [131, 133, "cool_left_still", 1],
                cool_left_still: 134,
                cool_left_back: { frames: range(133, 131), next: "cool_still", speed: 1 },
                cool_adjust: { frames: [124, 123, 122, 121, 120, 135, 136, 135, 120, 121, 122, 123, 124], next: "cool_still", speed: 1 },
                present_fwd: [137, 141, "present_still", 1],
                present_still: 142,
                present_back: { frames: range(141, 137), next: "idle", speed: 1 },
                look_left_fwd: [143, 145, "look_left_still", 1],
                look_left_still: 146,
                look_left_back: { frames: range(145, 143), next: "idle", speed: 1 },
                look_right_fwd: [149, 151, "look_right_still", 1],
                look_right_still: 152,
                look_right_back: { frames: range(151, 149), next: "idle", speed: 1 },
                lean_right_fwd: { frames: range(158, 156), next: "lean_right_still", speed: 1 },
                lean_right_still: 155,
                lean_right_back: [156, 158, "idle", 1],
                praise_fwd: [159, 163, "praise_still", 1],
                praise_still: 164,
                praise_back: { frames: range(163, 159), next: "idle", speed: 1 },
                greet_fwd: [225, 232, "greet_still", 1],
                greet_still: 232,
                greet_back: { frames: range(232, 225), next: "idle", speed: 1 },
                grin_fwd: [182, 189, "grin_still", 1],
                grin_still: 184,
                grin_back: { frames: range(184, 182), next: "idle", speed: 1 },
                backflip: [331, 343, "idle", 1],
            },
        },
        to_idle: {
            surf_across_fwd: "surf_across_back",
            surf_across_still: "surf_across_back",
            clap_fwd: "clap_back",
            clap_still: "clap_back",
            shrug_fwd: "shrug_back",
            shrug_still: "shrug_back",
            greet_fwd: "greet_back",
            shrug_still: "shrug_back",
            greet_still: "greet_back",
            earth_fwd: "earth_back",
            earth_still: "earth_back",
            look_down_fwd: "look_down_back",
            look_down_still: "look_down_back",
            lean_left_fwd: "lean_left_back",
            lean_left_still: "lean_left_back",
            beat_fwd: "beat_back",
            beat_still: "beat_back",
            cool_fwd: "cool_back",
            cool_still: "cool_back",
            cool_adjust: "cool_back",
            cool_left_fwd: "cool_left_back",
            cool_left_still: "cool_left_back",
            present_fwd: "present_back",
            present_still: "present_back",
            look_left_fwd: "look_left_back",
            look_left_still: "look_left_back",
            look_right_fwd: "look_right_back",
            look_right_still: "look_right_back",
            lean_right_fwd: "lean_right_back",
            lean_right_still: "lean_right_back",
            praise_fwd: "praise_back",
            praise_still: "praise_back",
            grin_fwd: "grin_back",
            grin_still: "grin_back",
            backflip: "idle",
            idle: "idle",
        },
        pass_idle: ["gone"],
        event_list_joke_open: [
            [
                { type: "text", text: "Yeah, of course {NAME} wants me to tell a joke." },
                { type: "anim", anim: "praise_fwd", ticks: 15 },
                { type: "text", text: '"Haha, look at the stupid {COLOR} monkey telling jokes!" Fuck you. It isn\'t funny.', say: "Hah hah! Look at the stupid {COLOR} monkey telling jokes! Fuck you. It isn't funny." },
                { type: "anim", anim: "praise_back", ticks: 15 },
                { type: "text", text: "But I'll do it anyway. Because you want me to. I hope you're happy." },
            ],
            [{ type: "text", text: "{NAME} used /joke. Whoop-dee-fucking doo." }],
            [{ type: "text", text: "HEY YOU IDIOTS ITS TIME FOR A JOKE" }],
            [
                { type: "text", text: "Wanna hear a joke?" },
                { type: "text", text: "No?" },
                { type: "text", text: "Mute me then. That's your fucking problem." },
            ],
            [{ type: "text", text: "Senpai {NAME} wants me to tell a joke." }],
            [{ type: "text", text: "Time for whatever horrible fucking jokes the creator of this site wrote." }],
        ],
        event_list_joke_mid: [
            [
                { type: "text", text: "What is easy to get into, but hard to get out of?" },
                { type: "text", text: "Child support!" },
            ],
            [
                { type: "text", text: "Why do they call HTML HyperText?" },
                { type: "text", text: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" },
                { type: "anim", anim: "shrug_back", ticks: 15 },
                { type: "text", text: "Sorry. I just had an epiphany of my own sad, sad existence." },
            ],
            [
                {
                    type: "text",
                    text: 'Two sausages are in a pan. One looks at the other and says "Boy it\'s hot in here!" and the other sausage says "Unbelievable! It\'s a talking sausage!"',
                    say: "Two sausages are in a pan. One looks at the other and says, Boy it's hot in here! and the other sausage says, Unbelievable! It's a talking sausage!",
                },
                { type: "anim", anim: "shrug_back", ticks: 15 },
                { type: "text", text: "What were you expecting? A dick joke? You're a sick fuck." },
            ],
            [
                { type: "text", text: "What is in the middle of Paris?" },
                { type: "text", text: "A giant inflatable buttplug." },
            ],
            [
                { type: "text", text: "What goes in pink and comes out blue?" },
                { type: "text", text: "Sonic's asshole." },
            ],
            [
                { type: "text", text: "What type of water won't freeze?" },
                { type: "text", text: "Your mother's." },
            ],
            [
                { type: "text", text: "Who earns a living by driving his customers away?" },
                { type: "text", text: "Nintendo!" },
            ],
            [
                { type: "text", text: "What did the digital clock say to the grandfather clock?" },
                { type: "text", text: "Suck my clock." },
            ],
            [
                { type: "text", text: "What do you call a man who shaves 10 times a day?" },
                { type: "text", text: "A woman." },
            ],
            [
                { type: "text", text: "How do you get water in watermelons?" },
                { type: "text", text: "Cum in them." },
            ],
            [
                { type: "text", text: "Why do we call money bread?" },
                { type: "text", text: "Because we KNEAD it. Haha please send money to my PayPal at nigerianprince99@bonzi.com" },
            ],
            [
                { type: "text", text: "What is a cow that eats grass?" },
                { type: "text", text: "ASS" },
                { type: "text", text: "I'm a comedic genius, I know." },
            ],
        ],
        event_list_joke_end: [
            [
                { type: "text", text: "You know {NAME}, a good friend laughs at your jokes even when they're not so funny." },
                { type: "text", text: "And you fucking suck. Thanks." },
            ],
            [{ type: "text", text: "Where do I come up with these? My ass?" }],
            [
                { type: "text", text: "Do I amuse you, {NAME}? Am I funny? Do I make you laugh?" },
                { type: "text", text: "pls respond", say: "please respond" },
            ],
            [{ type: "text", text: "Maybe I'll keep my day job, {NAME}. Patreon didn't accept me." }],
            [
                { type: "text", text: "Laughter is the best medicine!" },
                { type: "text", text: "Apart from meth." },
            ],
            [
                { type: "text", text: "Don't judge me on my sense of humor alone." },
                { type: "text", text: "Help! I'm being oppressed!" },
            ],
        ],
        event_list_fact_open: [[{ type: "html", text: "Hey kids, it's time for a Fun Fact&reg;!", say: "Hey kids, it's time for a Fun Fact!" }]],
        event_list_fact_mid: [
            [
                { type: "anim", anim: "earth_fwd", ticks: 15 },
                { type: "text", text: "Did you know that Uranus is 31,518 miles (50,724 km) in diameter?", say: "Did you know that Yer Anus is 31 thousand 500 and 18 miles in diameter?" },
                { type: "anim", anim: "earth_back", ticks: 15 },
                { type: "anim", anim: "grin_fwd", ticks: 15 },
            ],
            [
                { type: "text", text: "Fun Fact: The skript kiddie of this site didn't bother checking if the text that goes into the dialog box is HTML code." },
                { type: "html", text: "<img src='./img/misc/topjej.png'></img>", say: "toppest jej" },
            ],
        ],
        event_list_fact_end: [[{ type: "text", text: "o gee whilickers wasn't that sure interesting huh" }]],
    };
(BonziData.event_list_joke = [
    { type: "add_random", pool: "event_list_joke_open", add: BonziData.event_list_joke_open },
    { type: "anim", anim: "shrug_fwd", ticks: 15 },
    { type: "add_random", pool: "event_list_joke_mid", add: BonziData.event_list_joke_mid },
    { type: "idle" },
    { type: "add_random", pool: "event_list_joke_end", add: BonziData.event_list_joke_end },
    { type: "idle" },
]),
    (BonziData.event_list_fact = [
        { type: "add_random", pool: "event_list_fact_open", add: BonziData.event_list_fact_open },
        { type: "add_random", pool: "event_list_fact_mid", add: BonziData.event_list_fact_mid },
        { type: "idle" },
        { type: "add_random", pool: "event_list_fact_end", add: BonziData.event_list_fact_end },
        { type: "idle" },
    ]),
    (BonziData.event_list_triggered = [
        { type: "anim", anim: "cool_fwd", ticks: 30 },
        {
            type: "text",
            text: "I sexually identify as BonziBUDDY. Ever since I was a young gorilla I dreamed of invading desktops dropping hot sticky tootorals on disgusting PC users.",
            say: "I sexually identify as BonziBUDDY. Ever since I was a young gorilla I dreamed of invading desktops dropping hot sticky tootorals on disgusting PC users.",
        },
        {
            type: "text",
            text: "People say to me that a person being a BonziBUDDY is impossible and that I’m a fucking virus but I don’t care, I’m beautiful.",
            say: "People say to me that a person being a BonziBUDDY is impossible and that I'm a fucking virus but I dont care, I'm beautiful.",
        },
        {
            type: "text",
            text: "I’m having an IT intern install Internet Explorer 6, aquarium screensavers and PC Doctor 2016 on my body. From now on I want you guys to call me “Joel” and respect my right to meme from above and meme needlessly.",
            say: "I'm having an IT intern install Internet Explorer 6, aquarium screensavers and PC Doctor 2016 on my body. From now on I want you guys to call me Joel and respect my right to meme from above and meme needlessly.",
        },
        {
            type: "text",
            text: "If you can’t accept me you’re a gorillaphobe and need to check your file permissions. Thank you for being so understanding.",
            say: "If you cant accept me your a gorillaphobe and need to check your file permissions. Thank you for being so understanding.",
        },
        { type: "idle" },
    ]),
    (BonziData.event_list_linux = [
        { type: "text", text: "I'd just like to interject for a moment. What you’re referring to as Linux, is in fact, BONZI/Linux, or as I’ve recently taken to calling it, BONZI plus Linux." },
        {
            type: "text",
            text:
                "Linux is not an operating system unto itself, but rather another free component of a fully functioning BONZI system made useful by the BONZI corelibs, shell utilities and vital system components comprising a full OS as defined by M.A.L.W.A.R.E.",
        },
        {
            type: "text",
            text:
                "Many computer users run a modified version of the BONZI system every day, without realizing it. Through a peculiar turn of events, the version of BONZI which is widely used today is often called “Linux”, and many of its users are not aware that it is basically the BONZI system, developed by the BONZI Project.",
        },
        {
            type: "text",
            text:
                "There really is a Linux, and these people are using it, but it is just a part of the system they use. Linux is the kernel: the program in the system that allocates the machine’s memes to the other programs that you run. ",
        },
        { type: "text", text: "The kernel is an essential part of an operating system, but useless by itself; it can only function in the context of a complete operating system, such as systemd." },
        {
            type: "text",
            text:
                "Linux is normally used in combination with the BONZI operating system: the whole system is basically BONZI with Linux added, or BONZI/Linux. All the so-called “Linux” distributions are really distributions of BONZI/Linux.",
        },
    ]),
    (BonziData.event_list_pawn = [
        {
            type: "text",
            text:
                "Hi, my name is BonziBUDDY, and this is my website. I meme here with my old harambe, and my son, Clippy. Everything in here has an ad and a fact. One thing I've learned after 17 years - you never know what is gonna give you some malware.",
        },
    ]),
    (BonziData.event_list_bees = [
        { type: "text", text: "According to all known laws" },
        { type: "text", text: "of aviation," },
        { type: "text", text: "there is no way a bee" },
        { type: "text", text: "should be able to fly." },
        { type: "text", text: "Its wings are too small to get" },
        { type: "text", text: "its fat little body off the ground." },
        { type: "text", text: "The bee, of course, flies anyway" },
        { type: "text", text: "because bees don't care" },
        { type: "text", text: "what humans think is impossible." },
        { type: "text", text: "Yellow, black. Yellow, black." },
        { type: "text", text: "Yellow, black. Yellow, black." },
        { type: "text", text: "Ooh, black and yellow!" },
        { type: "text", text: "Let's shake it up a little." },
        { type: "text", text: "Barry! Breakfast is ready!" },
        { type: "text", text: "Coming!" },
        { type: "text", text: "Hang on a second." },
        { type: "text", text: "Hello?" },
        { type: "text", text: "Barry?" },
        { type: "text", text: "Adam?" },
        { type: "text", text: "Can you believe this is happening?" },
        { type: "text", text: "I can't. I'll pick you up." },
        { type: "text", text: "Looki-" },
        { type: "text", text: "i am not doing that whoe script" },


  $(document).ready(function() {
    window.BonziHandler = new (function() {
      return (
        (this.framerate = 1 / 15),
        (this.spriteSheets = {}),
        (this.$canvas = $("#bonzi_canvas")),
        (this.stage = new createjs.StageGL(this.$canvas[0], { transparent: !0 })),
        (this.stage.tickOnUpdate = !1),
        (this.resizeCanvas = function() {
          var a = this.$canvas.width(),
            b = this.$canvas.height();
          this.$canvas.attr({ width: this.$canvas.width(), height: this.$canvas.height() }), this.stage.updateViewport(a, b), (this.needsUpdate = !0);
          for (var c = 0; c < usersAmt; c++) {
            var d = usersKeys[c];
            bonzis[d].move();
          }
        }),
        this.resizeCanvas(),
        (this.resize = function() {
          setTimeout(this.resizeCanvas.bind(this), 1);
        }),
        (this.needsUpdate = !0),
        (this.intervalHelper = setInterval(
          function() {
            this.needsUpdate = !0;
          }.bind(this),
          1e3
        )),
        (this.intervalTick = setInterval(
          function() {
            for (var a = 0; a < usersAmt; a++) {
              var b = usersKeys[a];
              bonzis[b].update();
            }
            this.stage.tick();
          }.bind(this),
          1e3 * this.framerate
        )),
        (this.intervalMain = setInterval(
          function() {
            this.needsUpdate && (this.stage.update(), (this.needsUpdate = !0));
          }.bind(this),
          1e3 / 60
        )),
        $(window).resize(this.resize.bind(this)),
        (this.speakList = {}),
        (this.bonzisCheck = function() {
          for (var i = 0; i < usersAmt; i++) {
            var key = usersKeys[i];
            if (!(key in bonzis)) {
              bonzis[key] = new Bonzi(key, usersPublic[key]);
            } else {
              var b = bonzis[key];
              b.userPublic = usersPublic[key];
              b.updateName();
              var newColor = usersPublic[key].color;
              var newHue = usersPublic[key].hue;
              var newSaturation = usersPublic[key].saturation;
              b.userPublic.hue = newHue;
              b.userPublic.saturation = newSaturation;
              if (b.color != newColor) {
                b.updateSprite();
                b.color = newColor;
              }
            }
          }
        }),
        $("#btn_tile").click(function() {
          for (var a = $(window).width(), b = $(window).height(), c = 0, d = 80, e = 0, f = 0, g = 0; g < usersAmt; g++) {
            var h = usersKeys[g];
            bonzis[h].move(e, f), (e += 200), e + 100 > a && ((e = 0), (f += 160), f + 160 > b && ((c += d), (d /= 2), (f = c)));
          }
        }),
        this
      );
    })();
  }),
  Array.prototype.equals && console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code."),
  (Array.prototype.equals = function(a) {
    if (!a) return !1;
    if (this.length != a.length) return !1;
    for (var b = 0, c = this.length; b < c; b++)
      if (this[b] instanceof Array && a[b] instanceof Array) {
        if (!this[b].equals(a[b])) return !1;
      } else if (this[b] != a[b]) return !1;
    return !0;
  }),
  Object.defineProperty(Array.prototype, "equals", { enumerable: !1 });
var loadQueue = new createjs.LoadQueue(),
  loadDone = [],
  loadNeeded = ["bonziAmethyst", "bonziAzure", "bonziBlack", "bonziBlue", "bonziBrown", "bonziBurgundy", "bonziChocolate", "bonziDark_blue", "bonziDiamond", "bonziEmerald", "bonziGold", "bonziGreen", "bonziIndigo", "bonziIntel_blue", "bonziLapis", "bonziMagenta", "bonziMilk", "bonziNavy_blue", "bonziOrange", "bonziPeridot", "bonziPink", "bonziPurple", "bonziRainbow", "bonziRed", "bonziRed_orange", "bonziRuby", "bonziSapphire", "bonziScarlet", "bonziSiam", "bonziStrawberry_milk", "bonziTanzanite", "bonziTurquoise", "bonziWater_blue", "bonziYellow",  "topjej"];
$(window).load(function () {

  function updatePreview() {
    $("#colorPreview").css("filter", `hue-rotate(${$("#hueSlider").val()}deg) saturate(${$("#saturationSlider").val()}%)`);
  }
  $("#colorConfirm").click(function() {
    socket.emit("command", {
      list: [`colorcustom`, $("#hueSlider").val(), $("#saturationSlider").val()]
    });
    $("#color_box").hide();
  });
  $("#colorCancel").click(function() {
    $("#color_box").hide();
  });
  $("#hueSlider, #saturationSlider").on("mousemove", updatePreview);
  $("#hueSlider, #saturationSlider").on("change", updatePreview);$("#login_readme").fadeIn(230);
  $("#login_card").fadeIn(230), $("#login_load").fadeOut(230), loadBonzis();
});
var undefined,
  hostname = isApp ? "bonziworld.com" : window.location.hostname;
if (window.location.protocol == "https:") {
  socket = io("https://" + hostname + ":" + window.location.port);
} else {
  socket = io("http://" + hostname + ":" + window.location.port);
}
    usersPublic = {},
    bonzis = {},
    debug = !0;
$(function() {
  socket.on("sendguid", function(guid) {
    window.bonzi_guid = guid;
  })
  socket.on("sendguid2", function(guid) {
    window.testguid = guid;
  })
$(function () {
    $("#login_go").click(loadTest),
        $("#login_room").val(window.location.hash.slice(1)),
        $("#login_name, #login_room").keypress(function (a) {
            13 == a.which && login();
        }),
      socket.on("ban", function (a) {
          $("#page_ban").show(), $("#ban_reason").html(a.reason), $("#ban_end").html(new Date(a.end).toString());
      }),
    socket.on("setColor", function(color) {
      localStorage.setItem("color", color)
    });
      socket.on("kick", function (a, p) {
          $("#page_kick").show(), $("#kick_reason").html(a.reason);
      }),
        socket.on("loginFail", function (a) {
            var b = { nameLength: "Name too long.", full: "Room is full.", nameMal: "Nice try. Why would anyone join a room named that anyway?" };
            $("#login_card").show(),
                $("#login_load").hide(),
                $("#login_error")
                    .show()
                    .text("Error: " + b[a.reason] + " (" + a.reason + ")");
        }),
        socket.on("disconnect", function (a) {
            errorFatal();
        });
});


function theme(a){
    document.getElementById("theme").innerHTML=a
}

var usersAmt = 0,
    usersKeys = [];
$(window).load(function () {
    document.addEventListener("touchstart", touchHandler, !0), document.addEventListener("touchmove", touchHandler, !0), document.addEventListener("touchend", touchHandler, !0), document.addEventListener("touchcancel", touchHandler, !0);
});
