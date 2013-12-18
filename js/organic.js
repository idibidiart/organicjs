/*
 OrganicJS is a micro-framework for reusable JS+HTML+SVG components

 OrganicJS supports reusable JS+HTML+SVG components with chainable properties and public methods, dynamic
 setters/getters,reusable widget markup with nestable HTML/SVG fragments and in-place fragment cloning and
 rendering, and sharing of data/behavior among components in a soft, decoupled manner, using contextual
 component caching.

 @MarcFawzi

 Last modified: MARCH 21, 2013

 v0.3
 */

(function(){

    var app = app || {};

    // Getters/Setters
    // this creates getter/setter on the object for each of its public properties
    // so that public properties may be accessed as componentInstance.property(value) (when setting)
    // and componentInstance.property() (when getting)
    app.build = app.build || function Build(obj, cache, model)  {

        if (obj.props === undefined)
            throw new Error("no public properties defined").stack;

        //explicitly set to undefined so it can be found in props
        obj.props.cache = undefined;
        obj.props.model = undefined;
        obj.props.consume = undefined;
        obj.props.provide = undefined;

        for (var o in obj.props) {
            obj[o] =  new Function("value", "if (!arguments.length) return typeof this.props['" + o +
                "'] == 'function' ? this.props['" + o + "'].call(this) : this.props['" + o + "'];" +
                "this.props['" + o + "'] = (typeof value == 'function' ? value.call(this) : value); return this")
        }

        // special setter/getter
        obj.provide = function(name) {

            if (name !== undefined) {
                obj.props.provide = name

                // Contextual Component Cache
                // store the component using "cash context/component name" as the path (key)
                cache.set(obj.cache() + "/" + name, obj);

                return obj;
            }
            else {
                return obj.props.provide;
            }
        }
    }

    // Contextual Component Cache
    //
    // For caching component's data and behavior into user-defined context
    //
    // Contextual Component Cache clones the component and saves the clone (with its data and behaviors working in
    // the cloned context) under the 'cash context/component name' path where cache context is defined by the
    // .cache() setter of the component being cached and component name is defined by the .provide() setter of the
    // component being cached, which is available to the consuming component via that component's .consume() property.
    //
    // use .provide(name) to cache component
    // use .consume([{name: 'component name', into: 'method or property'}, { ... }, etc]) to consume cached component
    // use console.log(cache.contexts()) to view all cached objects and their properties/methods, in all cache contexts
    //
    //
    app.cache = app.cache || function Cache() {

        var obj = {}

        obj.contexts = function() { return obj}

        // cache the component in the given 'cache context/ component name' path
        obj.set = function(context$name, comp) {

            obj[context$name] = {};

            for (var key in comp) {
                if (comp.hasOwnProperty(key)) {

                    //clone object
                    obj[context$name][key] = comp[key]

                    // change cache and model strings to cached$ + string
                    // to isolate the cache context and model scope of cached components
                    if (key == "props") {
                        for (var prop in comp[key]) {
                            if (prop == "cache" || prop == "model") {
                                obj[context$name][key][prop] = "cached$" + comp[key][prop]
                            }
                        }
                    }
                }
            }

            console.log(obj[context$name])
        }

        // return component if it exists in cache in the given context/name
        obj.get = function(context$name) {
            return obj[context$name];
        }

        return obj;
    }

    // Scoped Data Model
    //
    // For storing global data structures in user-defined scope
    //
    // use model("scope").create({key1: value, key2: value, etc}) to create new properties
    // use model("scope").keyName() to get the value for a key in the given scope
    // use model("scope").keyName(value) to set the value for a key in the given scope
    // use console.log(model.scopes()) to view all scopes and keys within them
    //
    // setters are chain-able
    //
    // the scope specified and returned by the component's .model()

    app.model = app.model || function Model(scope) {

        var obj = {}

        obj.scopes = function() { return obj}

        obj.create = function(json) {

            if (typeof obj[scope] == 'undefined')
                throw new Error("no scope defined").stack

            obj[scope] = obj[scope] || {}

            obj[scope].props = obj[scope].props || {}

            for (var key in json) {
                if (json.hasOwnProperty(key)) obj[scope].props[key] = json[key]
            }

            for (var o in obj[scope].props) {
                if (obj[scope].props.hasOwnProperty(o)) {
                    obj[o] =  new Function("scope, value", "if (!scope) return; if (!value) " +
                        "return this[scope].props['" + o + "'];" +
                        "this[scope].props['" + o +
                        "'] = value; return this")
                }
            }
            return obj;
        }
        return obj;
    }

    // in-place cloning of HTML/SVG fragments
    app.new = app.new || function Frig(frag) {

        // jQuery to native
        var el = frag[0] || frag;

        // make sure the node exists
        if (!el.nodeType)
            throw new Error("argument is not a DOM node").stack

        // make sure it's an element
        if (el.nodeType != 1)
            throw new Error("Can't use this DOM node type").stack

        if (typeof el.getAttribute('frag') == 'undefined' || el.getAttribute('frag') == null)
            throw new Error("This DOM node is not a fragment").stack

        var node = el.cloneNode(true)

        if (typeof node.getAttributeNS(null, "id") != 'undefined')
            node.removeAttributeNS(null, "id")

        if (typeof node.getAttributeNS(null, "frag") != 'undefined')
            node.removeAttributeNS(null, "frag")

        var uuid = app.uuid();

        node.setAttributeNS(null, "uuid", uuid)

        // insert new instance in place and remove original fragment

        el.parentNode.appendChild(node)

        // return element's uuid
        return uuid;
    }


    // save HTML/SVG of parent element prior to cloning children
    // only needs to be called once per top-most fragment
    app.saveParent = app.save || function Save(frag) {

        // jQuery to native
        var el = frag[0] || frag;

        el._clone = el._clone || el.cloneNode(true);

    }

    // restore HTML/SVG of previously saved parent element
    app.restoreParent = app.restore || function Restore(frag) {

        // jQuery to native
        var el = frag[0] || frag;

        var parentNode = el.parentNode;

        var clone = el._clone.cloneNode(true)

        clone._clone = clone.cloneNode(true)

        parentNode.appendChild(clone)

        parentNode.removeChild(el)

    }

    app.getElementById = app.getElementById || function GetElementByUUID(uuid) {

        return document.querySelector('[uuid="' + uuid + '"]')
    }

    app.uuid = app.uuid ||

        (typeof(window.crypto) != 'undefined' &&
            typeof(window.crypto.getRandomValues) != 'undefined') ?

        function UUID() {
            // If we have a cryptographically strong PRNG
            // http://stackoverflow.com/questions/6906916/collisions-when-generating-uuids-in-javascript
            var buf = new Uint16Array(8);
            window.crypto.getRandomValues(buf);
            var S4 = function(num) {
                var ret = num.toString(16);
                while(ret.length < 4){
                    ret = "0"+ret;
                }
                return ret;
            };

            return (S4(buf[0])+S4(buf[1])+"-"+S4(buf[2])+"-"+S4(buf[3])+"-"+S4(buf[4])+"-"+
                S4(buf[5])+S4(buf[6])+S4(buf[7]));
        }

        :

        // Else limit chance of collisions to scenarios where calls to app.uuid() happen within the same millisecond
        // and use the same Math.random seed, which is only possible when different users using the same browser or
        // same Math.random implementation) load the app at the same exact millisecond in UTC time (the seed to
        // Math.random), which is of no concern for OrganicJS element UUID because the context of the PRNG collisions
        // is limited in the local window.document object.
        //
        // For other uses, e.g. generating any IDs above user/session scope to save on the server, you should avoid
        // using app.uuid() if the target browser does not support window.crypto

        function UUID() {
            var now = new Date();
            var ms = now.getTime() + (now.getTimezoneOffset() * 60000)

            var uuid = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function(c) {
                var r = (ms + Math.random()*16)%16 | 0;
                ms = Math.floor(ms/16);
                return (r).toString(16);
            });

            return uuid;
        };

    window.app = app;

} ())