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


    app.slider = function Slider(cache, model) {

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

        app.build(obj, cache, model);

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

    app.ball = function Ball(cache, model) {

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

       app.build(obj, cache, model);

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

           // In OrganicJS, components do not depend on other components directly but on anonymous data and behavior
           // from other components that are cached in an isolated context.
           //
           // Contextual Caching provides a decoupled kind of dependency, allowing any component to serve as the
           // dependency as long as it offers the expected data and/or behavior. Component caching decouples the
           // dependency from the actual source component, using 'cache context/component name' as
           // the path, where cache scope is the cached component's .cache() property defined by the user (for
           // a set of collaborating components within a widget) and name is the cached component's .provide() which
           // is available to the consuming component via that component's .consume() map.
           //
           // Cached components behave exactly the same as regular components, except they're cloned from the
           // component at the time of caching so they have different state and a different JS native-object
           // context
           //
           // In case no consumable components are found (in this case the 'board' in the component's widget context 
           // was consumed in 'animate' method) then replace with the expected data/behaviors

           var consumed;

           // find out what name was imported ('animate' being this method's name)
           for (var n = 0; n < obj.consume().length; n++) {

               if (obj.consume()[n].into = "animate") {
                   consumed = obj.consume()[n].name;
                   break;
               }
           }

           // try to find a component in cache that has that name
           var cachedObject = cache.get(obj.cache() + "/" + consumed) ?
                        cache.get(obj.cache() + "/" + consumed) :
           // else replace with the expected data/behaviors
                        {
                            left: function() {return 0},
                            top: function () {return 0},
                            width: function() {return 400},
                            height: function() {return 400}
                        }

           // to bounce it, mirror the ball's path after it runs into an edge

           // left or right
           if (obj.x() + obj.dx() > cachedObject.width() - obj.radius() - rChange + cachedObject.left() ||

               obj.x() + obj.dx() < obj.radius() + rChange + cachedObject.left())

                    obj.dx(-obj.dx());

           // top or bottom
           if (obj.y() + obj.dy() < obj.radius() + rChange + cachedObject.top() ||

               obj.y() + obj.dy() > cachedObject.height() - obj.radius() - rChange + cachedObject.top())

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


