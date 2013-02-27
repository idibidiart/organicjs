/*

  SVG Bouncing Ball using OrganicJS

  Written as a coding exercise with robust design for more complex scenario

  @MarcFawzi 2013

 */

(function() {

    app.board = function Board(cache, model) {

        var obj = {};

        obj.props = {};

        // explicitly set to undefined so they may be found by the build function
        obj.props.top = undefined;
        obj.props.left = undefined;
        obj.props.width = undefined;
        obj.props.height = undefined;
        obj.props.fill = undefined;
        obj.props.elem = undefined;

        app.build(obj, cache, model);

        obj.draw = function () {

            obj.elem().attr("x", obj.left());
            obj.elem().attr("y", obj.top());
            obj.elem().attr("width", obj.width());
            obj.elem().attr("height", obj.height());
            obj.elem().attr("fill", obj.fill());

            return obj;
        }

        return obj;
    }


    app.slider = function Slider(cache, model) {

        var obj = {};

        obj.props = {};

        // explicitly set to undefined so they may be found by the build function
        obj.props.elem = undefined
        obj.props.left = undefined
        obj.props.top = undefined
        obj.props.min = undefined
        obj.props.max = undefined
        obj.props.value = undefined

        app.build(obj, cache, model);

        obj.onChange = function(func) {

            obj.elem().bind("change", func)

            return obj;
        }

        obj.init = function() {

            obj.elem().attr("min", obj.min())
            obj.elem().attr("max", obj.max())
            obj.elem().attr("value", obj.value())

            obj.elem().prop("hidden", null)
            obj.elem().css({visibility: "visible" ,position: "absolute", left: obj.left(), top: obj.top()})

            return obj;
        }

        return obj;
    }

    app.ball = function Ball(cache, model) {

       var rChange = 0;

       var obj = {};

       obj.props = {};

       // explicitly set to undefined so they may be found by the build function
       obj.props.radius = undefined;
       obj.props.dx = undefined;
       obj.props.dy = undefined;
       obj.props.x = undefined;
       obj.props.y = undefined;
       obj.props.fill = undefined;
       obj.props.animating = undefined;
       obj.props.elem = undefined;

       app.build(obj, cache, model);

       obj.draw = function() {

           obj.elem().attr("r", obj.radius());
           obj.elem().attr("cx", obj.x());
           obj.elem().attr("cy", obj.y());
           obj.elem().attr("fill", obj.fill());

           return obj;
       }

       obj.resize = function(val) {

           rChange = val - obj.props.radius;

           obj.elem().attr("r", val);

           return obj;
       }

       obj.animate = function() {

           animID = window.requestAnimationFrame(obj.animate)

           obj.x(obj.x() + obj.dx());
           obj.y(obj.y() + obj.dy());

           obj.elem().attr("cx", obj.x())
           obj.elem().attr("cy", obj.y())

           // In OrganicJS, components do not depend on other components directly but on anonymous data and behavior
           // from other components that are cached in an isolated context.
           //
           // Contextual Caching provides a soft, decoupled kind of dependency, allowing any component to serve as the
           // dependency as long as it offers the expected types of data and/or behavior. Component caching also
           // isolates the dependency from the actual component in both time and space, using 'widget context/component
           // type' as the path, where context is the cached component's .widget() property defined by the user (for
           // a set of collaborating components within a widget) and type is the cached component's .provide() which is
           // available to the consuming component via that component's .consume() map.
           //
           // Cached components behave exactly the same as regular components, except they're cloned from the
           // component at the time of caching so they have different state and a different JS native-object
           // context (not to be confused with the component's user-specified context)
           //
           // In case no imported types are found (in this case the 'board' type in the component's context was
           // imported) replace with the expected data/behaviors

           var consumed;

           // find out what type was imported ('animate' being this method's name)
           for (var n = 0; n < obj.consume().length; n++) {

               if (obj.consume()[n].into = "animate") {
                   consumed = obj.consume()[n].type;
                   break;
               }
           }

           // try to find a component in cache that has that type
           var cached = cache.get(obj.widget() + "/" + consumed) ?
                        cache.get(obj.widget() + "/" + consumed) :
           // else replace with the expected data/behaviors
                        {
                            left: function() {return 0},
                            top: function () {return 0},
                            width: function() {return 400},
                            height: function() {return 400}
                        }

           // to bounce it, mirror the ball's path after it runs into an edge

           // left or right
           if (obj.x() + obj.dx() > cached.width() - obj.radius() - rChange + cached.left() ||

               obj.x() + obj.dx() < obj.radius() + rChange + cached.left())

                    obj.dx(-obj.dx());

           // top or bottom
           if (obj.y() + obj.dy() < obj.radius() + rChange + cached.top() ||

               obj.y() + obj.dy() > cached.height() - obj.radius() - rChange + cached.top())

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


