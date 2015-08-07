/*$6*/



var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');

var domBuild = fs.
readFileSync("DOMBuilder.min.js")
.toString();
var reloadPage = true;

var users;
var boards;

Array.prototype.swap =
function(x, y)
{
    var b = this[x];
    this[x] = this[y];
    this[y] = b;
    return this;
}
function encrypt (echo)
{
    var x = "";
    var m = -10;
    for (var i = 0; i < echo.length; i++)
    {
        m += echo.
        charCodeAt(i)
        ^ echo.charCodeAt(echo.length - 1 - i);
        m *= 10;
        m = m ^ echo.charCodeAt(i);
        x += String.fromCharCode(m);
    }
    return escape(x);
}
function superEncrypt (echo, username)
{
    var result = "";
    for (var i = 0; i < echo.length; i++)
    {
        result += echo.charAt(i);
        result = unescape(encrypt(result));
        result = encryptPass(result, encrypt(result));
        result = encryptPass(result, encryptPass(username, result));
        if (echo.charAt(i) > 'l') result += "@";
    }
    return escape(result);
}
function encryptPass (info, key)
{
    var result = "";

    var helper = 0;

    for (var i = 0; i < info.length; i++)
    {
        var keyNum1 = key.charCodeAt(i % key.length);
        var keyNum2 = key.charCodeAt(key.length - (i % key.length) - 1);

        var letter = info.charCodeAt(i);

        var num = helper;

        if (i % 2 == 0)
        {
            num = (letter ^ keyNum1 + info.length) ^ (keyNum2) ^ i * i * 10;
        }
        else
        {
            num = (letter ^ keyNum2 + info.length) ^ (keyNum1) ^ i * i * 10;
        }
        helper += num;

        result += String.fromCharCode(num);
    }
    return result;
}
function saveUsers ()
{
    fs.writeFile("users.srs", JSON.stringify(users), function(err)
{
    return false;
}
    );
    return true;
}
function saveBoard ()
{
    fs.writeFile("board.srs", JSON.stringify(boards), function(err)
{
    if (err) return false;
}
    );
    return true;
}
function loadBoard ()
{
    fs.readFile("board.srs", function(err, data)
{
    if (err)
{
    return;
}
    boards = JSON.parse(data.toString());
}
    );

    fs.readFile("users.srs", function(err, data)
{
    if (err)
{
    return;
}
    users = JSON.parse(data.toString());
}
    );

    if (boards) return true;
    return false;
}
function createBoard (boardName)
{
    boards[boardName] = { };
    boards[boardName].threads = { };

    boards[boardName].threads.names = [];
    boards[boardName].threads.data = { };
    boards[boardName].threads.metadata = { };
}
if (!   loadBoard())
{
    users = { };
    boards = { };
    createBoard("default");
}
domBuild = "<script>" + domBuild + "</script>";

var mainPage = fs.
readFileSync("capiumPage.html")
.toString();
mainPage = mainPage.replace("%attachment%", domBuild);

var server = http.createServer
    (
        function(request, response)
{ if (reloadPage){ mainPage = fs.readFileSync("capiumPage.html").toString()
        ; mainPage = mainPage.replace
            ("%attachment%", domBuild); }response.writeHead
                (200, { 'Content-Type' : "text/html" }); response.write
                    (mainPage); response.end(); }
    );
var io = socketio.listen(server);

io.sockets.on
    (
        'connection', function(socket)
{
    //socket.emit("sendThread", { posts: JSON.stringify([ ["Jesse", "Hello Guys", new Date()]]) });
    //socket.emit("newPost", { poster: "Jesse", post: "Hello World", date: JSON.stringify(new Date()) });
        socket.thread = ""; socket.board = "default"; socket.username = "";
            function sendBoard()
{
    socket.leave(socket.thread); socket.emit
        (
            "sendBoard",
    {
        name : socket.board, threads : JSON.stringify
            (boards[socket.board].threads.names)
    }
        );
}
    sendBoard(); socket.on
        (
            "newPost", function(data)
    {
        if (socket.username != "")
    {
        boards[socket.board].threads.data[data.thread].push
            ([socket.username, data.post, new Date(), 0]); boards[socket.board].threads.metadata[data.thread].push(
    {
    }); saveBoard(); io.sockets.in(socket.thread).emit("newPost",
    {
        poster : socket.username, post : data.post, date : new Date(), score : 0
    });
    }
    }
        ); socket.on
        (
            "register", function(data)
    {
        if (users[data.username.toLowerCase()] == = undefined)
    {
        users[data.username.toLowerCase()] = [data.username, superEncrypt
            (privateKey.decrypt(data.password), data.username.toLowerCase())]; socket.emit('registerResponse',
    {
        response : "Success"
    }); saveUsers();
    }else
    {
        socket.emit('registerResponse',
    {
        response : "Failure"
    });
    }
    }
        ); socket.on
        (
            "login", function(data)
    {
        if (users[data.username.toLowerCase()] == = undefined); else if (users[data.username.toLowerCase()][1] == superEncrypt(
                       privateKey.decrypt
                       (data.password), data.username.toLowerCase()))
    {
        socket.username = users[data.username.toLowerCase()][0]; socket.emit
            ("loginResponse",
    {
        response : "Success"
    });
    }else
    {
        socket.emit("loginResponse",
    {
        response : "Failure"
    });
    }
    }
        ); socket.on("deletePost", function(data)
{
    boards[socket.board].threads.data[data.thread][data.id] = [];
}
    ); socket.on
        (
            "votePost", function(data)
    {
        if (!boards[socket.board].threads.metadata[data.thread][data.id][
                socket.username])
    {
        var num = 0; if (data.vote == "up")
        num = 1; else if (data.vote == "down")
        num = -1; boards[socket.board].threads.data[data.thread][data.id][3] +=
            num; boards[socket.board].threads.metadata[data.thread][data.id][
                socket.username] = true; io.sockets.in(socket.thread).emit
                    (
                        "votePost",
        {
            id : data.id, score : boards[socket.board].threads.data[data.thread][
                data.id][3]
        }
                    );
    }
    }
        ); socket.on
        (
            "editPost", function(data)
    {
        //console.log(data.id);
        if (boards[socket.board].threads.data[data.thread][data.id][0] ==
                                       socket.username)
    {
        boards[socket.board].threads.data[data.thread][data.id][1] = data.post;
            io.sockets.in(socket.thread).emit("editPost", data);
    }
    }
        ); socket.on
        (
            "newThread", function(data)
    {
        if (socket.username != "")
    {
        if (boards[socket.board].threads.data[data.thread] == = undefined)
    {
        boards[socket.board].threads.data[data.thread] = []; boards[socket.board].
            threads.metadata[data.thread] = []; //boards[socket.board].threads.metadata[data.thread]
            //boards[socket.board].threads.metadataNames = [];
            //boards[socket.board].threads.metadataNames.push(socket.username);
                boards[socket.board].threads.names.push
                    ([data.thread, socket.username]);
    }
        //socket.emit("sendBoard", { threads: JSON.stringify(boards[socket.board].threads.names)});
            sendBoard();
    }
    }
        ); socket.on
        (
            "createBoard", function(data)
    {
        if (data.board)
    {
        if (boards[data.board.toLowerCase()] == = undefined) createBoard(data.board.toLowerCase()); socket.board = data.board.toLowerCase()
            ; sendBoard();
    }
    }
        ); socket.on("requestBoard", function(data)
{
    if (boards[data.board.toLowerCase()] == = undefined); else
{
    socket.board = data.board.toLowerCase(); sendBoard();
}
}
    ); socket.on
        (
            "requestThread", function(data)
    {
        if (data.board == = undefined); else if (boards[data.board.toLowerCase()] == = undefined)
        ; else
    {
        socket.board = data.board.toLowerCase();
    }
        socket.leave(socket.thread); socket.thread = data.thread; socket.join
            (data.thread); socket.emit("sendThread",
    {
        posts : JSON.stringify(boards[socket.board].threads.data[data.thread])
    });
    }
        );
}
    );

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

server.listen(server_port, server_ip_address);
