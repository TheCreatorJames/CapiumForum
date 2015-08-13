# CapiumForum
A small, lightweight portable forum written in Node.js


### Welcome
This is a lightweight forum. It is similar to [Reddit](https://www.reddit.com) in some ways, due to it being board based. 

The forum gives you the ability to like and dislike posts, post pictures, paste links, and format text. It supports markdown, which is the same syntax used by popular websites such as [Github](https://www.github.com) to display formatted text.

Having been developed in 2013, the website uses technologies that were fairly new at  the time. The website is built on [socket.io](http://socket.io/), which creates [websockets](https://en.wikipedia.org/wiki/WebSocket) to allow new posts and edits to show up on everyone's screen in real time. 

Browsing the forum is very quick, as all of the threads are served as compact [JSON]() through the websockets. Rather than using old techniques rendering the website on the server, the rendering is left to the client, which makes response times much faster and allows the server to serve many more requests.

Because the server is powered by [Node.js](https://nodejs.org/), which is based on [Google's V8 JavaScript Engine](https://developers.google.com/v8/?hl=en), JSON is native and serializing the forum to send to the clients is fast and easy. No libraries for parsing necessary.

The entire forum setup is 16KB compressed (with weaker compression algorithms), which is miniscule in comparison to other forums, but similar in core functionality. Now that I am a more mature developer, I will likely add more features to the forum, and enhance the security.


### Features


##### Post in Real Time
Many older forums required you to refresh to check for new content. Capium doesn't. With Capium, all posts and edits show up in real time using modern websocket technology. This can be extremely helpful in discussions, and deliver feedback as early as possible.

##### Markdown Syntax
Older forums used [BBCode](https://en.wikipedia.org/wiki/BBCode) for formatting, which is a lot like writing HTML. Capium uses Markdown, which is much easier to work with for lightweight syntax. Many people are familiar with Markdown already, so it was an obvious choice. 

##### No Database Required
While not having database support can seem like a bad thing, it doesn't do any harm here. Relational Databases can be slow and bloated, and sometimes unnecessary. For the purposes of a lightweight forum, a database was not necessary. This does not mean support will not be added down the line. 

##### Lightweight
This little application can is pretty efficient. The rendering for web pages is done on the client, rather than the server, which means faster response times and more requests fulfilled. Your Raspberry Pi could host your forum easily. Bigger Forums require more resources, and when you're running your database alongside your bloated forum on the same RPi, things can get slow.

##### Easily Accessible
With a small 16KB file, and a two step launch process, this forum is one of the easiest to launch and take advantage of.

### Running the Server

First you need to download the [socket.io](https://www.npmjs.com/package/socket.io) library.

Use the terminal command : 
```npm install socket.io```

Then you need to start the server by 

Running the terminal command :

```node server.js ```


### Demo
There is a small demo up and running at 

http://forum-creatorjames.rhcloud.com/
