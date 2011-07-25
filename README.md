Filestream is a proof-of-concept application that implements asynchronous file uploading with server-side progress tracking in [Node.js][].

Unfortunately not all people use modern browsers. For this reason, tracking a file's upload progress using modern HTML and Javascript APIs, such as [HTML5's progress][html5-progress] or the [Progress Events API][progress-events], is often unfeasible. Filestream is a server-side solution that works with any browser supported by [jQuery][].

It supports concurrent uploads, server-side upload progress, and concurrent field updates.
Its only dependencies are the [Express][] microframework, the [connect-form][] multipart form parsing middleware, and the [jade][] template engine.

[Node.js][] was chosen because it supports streaming file uploads.

Filestream is deployed at http://filestream.herokuapp.com/

Installation and Usage
----------------------

1. [Install node.js and npm if you haven't yet][node-install]

2. Change directory to `filestream` and install the dependencies:

    npm install

3. Start the node server:

    node app.js

4. Go to http://localhost:3000

License
-------

Filestream is released under the MIT License.


[Node.js]: http://nodejs.org/
[node-install]: https://github.com/joyent/node/wiki/Installation
[Express]: http://expressjs.com/
[connect-form]: http://github.com/visionmedia/connect-form
[jade]: http://jade-lang.com/
[html5-progress]: http://dev.w3.org/html5/spec/Overview.html#the-progress-element
[progress-events]: http://dev.w3.org/2006/webapi/progress/
[jQuery]: http://jquery.com/
