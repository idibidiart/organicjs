/*

  SVG Bouncing Ball using OrganicJS

  Written as a coding exercise with robust design for more complex scenario

  @MarcFawzi 2013

 */

(function() {

    app.board = function Board(model) {

        var obj = {};

        obj.props = {};

        // explicitly set to undefined so they may be found by the build function
        obj.props.top = undefined;
        obj.props.left = undefined;
        obj.props.width = undefined;
        obj.props.height = undefined;
        obj.props.fill = undefined;
        obj.props.elem = undefined;

        app.build(obj);

        obj.render = function () {

            var elem = obj.elem()[0] || obj.elem()

            elem.setAttributeNS(null, "x", obj.left());

            elem.setAttributeNS(null, "y", obj.top());
            elem.setAttributeNS(null, "width", obj.width());
            elem.setAttributeNS(null, "height", obj.height());
            elem.setAttributeNS(null, "fill", obj.fill());

            return obj;
        }

        obj.onClick = function(func) {

            $(obj.elem()).bind("click", func)

            return obj;
        }

        return obj;
    }


    app.slider = function Slider(model) {

        var obj = {};

        obj.props = {};

        // explicitly set to undefined so they may be found by the build function
        obj.props.elem = undefined
        obj.props.left = undefined
        obj.props.top = undefined
        obj.props.display = undefined
        obj.props.min = undefined
        obj.props.max = undefined
        obj.props.value = undefined

        app.build(obj);

        obj.onChange = function(func) {

            $(obj.elem()).bind("change", func)

            return obj;
        }

        obj.render = function() {

            var elem = obj.elem()[0] || obj.elem()

            elem.setAttributeNS(null, "min", obj.min())
            elem.setAttributeNS(null, "max", obj.max())
            elem.setAttributeNS(null, "value", obj.value())

            $(elem).css({"margin-left": obj.left(), "margin-top": obj.top(), display: obj.display()})

            return obj;
        }

        return obj;
    }

    app.ball = function Ball(model) {

       var rChange = 0;

       var obj = {};

       obj.props = {};

       // explicitly set to undefined so they may be found by the build function
       obj.props.radius = undefined;
       obj.props.dx = undefined;
       obj.props.dy = undefined;
       obj.props.speed = undefined;
       obj.props.x = undefined;
       obj.props.y = undefined;
       obj.props.fill = undefined;
       obj.props.animating = undefined;
       obj.props.elem = undefined;

       app.build(obj);

       obj.render = function() {

           var elem = obj.elem()[0] || obj.elem()

           elem.setAttributeNS(null, "r", obj.radius());
           elem.setAttributeNS(null, "cx", obj.x());
           elem.setAttributeNS(null, "cy", obj.y());
           elem.setAttributeNS(null, "fill", obj.fill());

           return obj;
       }

       obj.animate = function() {

           animID = window.requestAnimationFrame(obj.animate)

           var elem = obj.elem()[0] || obj.elem()

           obj.x((obj.x() + obj.dx() * obj.speed()));
           obj.y((obj.y() + obj.dy() * obj.speed()));

           elem.setAttributeNS(null, "cx", obj.x())
           elem.setAttributeNS(null, "cy", obj.y())

           var consumed = null;

           // find out what name was imported ('animate' being this method's name)
           for (var n = 0; n < obj.link().length; n++) {

               if (obj.link()[n].into == "animate") {
                   consumed = obj.link()[n].comp;
                   break;
               }
           }

           var dependencyObject = consumed ? consumed :
           // else replace with the expected data/behaviors
                        {
                            left: function() {return 0},
                            top: function () {return 0},
                            width: function() {return 400},
                            height: function() {return 400}
                        }

           // to bounce it, mirror the ball's path after it runs into an edge

           // left or right
           if (obj.x() + obj.dx() > dependencyObject.width() - obj.radius() - rChange + dependencyObject.left() ||

               obj.x() + obj.dx() < obj.radius() + rChange + dependencyObject.left())

                    obj.dx(-obj.dx());

           // top or bottom
           if (obj.y() + obj.dy() < obj.radius() + rChange + dependencyObject.top() ||

               obj.y() + obj.dy() > dependencyObject.height() - obj.radius() - rChange + dependencyObject.top())

           {

               obj.dy(-obj.dy());
           }

           obj.animating(true);

           return obj;

       }

       return obj;
    }

    // Polyfill source: Opera developer's blog
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    var animID;

    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };


}())


