/*
 OrganicJS is a super light framework for reusable JS+HTML+SVG components

 OrganicJS supports reusable JS+HTML+SVG componentsJS+HTML+SVG components with chainable
 properties and methods, dynamic setters/getters, reusable HTML/SVG markup and safe sharing of
 mutable state among components.

 @MarcFawzi

 Last modified: Dec 27th, 2013

 v0.4
 */

(function(){

    var app = app || {};

    // Getters/Setters
    // this creates getter/setter on the object for each of its public properties
    // so that public properties may be accessed as componentInstance.property(value) (when setting)
    // and componentInstance.property() (when getting)
    app.build = app.build || function Build(obj)  {
        if (obj.props === undefined)
            throw new Error("no public properties defined").stack;
        //explicitly set to undefined so it can be found in props
        obj.props.import = undefined;

        for (var o in obj.props) {
            obj[o] =  new Function("value", "if (!arguments.length) return typeof this.props['" + o +
                "'] == 'function' ? this.props['" + o + "'].call(this) : this.props['" + o + "'];" +
                "this.props['" + o + "'] = value; return this")
        }

    }

    // Model Object
    //
    // For storing and safely accessing data in named models
    //
    // use model("name").set({key1: value, key2: value, etc}) to create/update a given model
    // use model("name").get() to get a cloned copy of a given model
    // use model("name").key() to get a cloned copy of the value of some "key" in a given model
    // use model("name").key(value) to set the value of some "key" in the given model
    // use console.log(model.root()) to view all the models
    //
    // Model Object setters are chain-able

    app.model = app.model || function Model(name) {
        var obj = {}
        obj.root = function() { return obj}

        obj.set = function(json) {
            if (typeof name == 'undefined')
                throw new Error("no name defined").stack
            // create or update
            obj[name] = obj[name] || {}
            obj[name].props = obj[name].props || {}

            for (var key in json) {
                if (json.hasOwnProperty(key)) obj[name].props[key] = json[key]
            }

            for (var o in obj[name].props) {
                if (obj[name].props.hasOwnProperty(o)) {
                    obj[o] =  new Function("name, value", "if (!name) return; if (!value) " +
                        "return JSON.parse(JSON.stringify(this[name].props['" + o + "']));" +
                        "this[name].props['" + o +
                        "'] = value; return this")
                }
            }
            return obj;
        }

        obj.get = function() {
            var model = obj[name] || {}
            return JSON.parse(JSON.stringify(model))
        }

        return obj;
    }

    // in-place cloning of HTML/SVG fragments
    app.new = app.new || function Frig(frag) {
        // jQuery to native
        var el = frag[0] || frag;

        if (el.nodeType != 1)
            throw new Error("argument is not a DOM element").stack

        if (typeof el.getAttribute('frag') == 'undefined' || el.getAttribute('frag') == null)
            throw new Error("This DOM node is not a fragment").stack

        var node = el.cloneNode(true)

        if (typeof node.getAttributeNS(null, "id") != 'undefined')
            node.removeAttributeNS(null, "id")

        node.removeAttributeNS(null, "frag")

        var uuid = app.uuid();
        node.setAttributeNS(null, "uuid", uuid)
        // insert clone in place
        el.parentNode.appendChild(node)
        // return element's uuid
        return uuid;
    }

    app.getElementById = app.getElementById || function GetElementByUUID(uuid) {
        return document.querySelector('[uuid="' + uuid + '"]')
    }

    app.uuid = app.uuid ||

        (typeof(window.crypto) != 'undefined' &&
            typeof(window.crypto.getRandomValues) != 'undefined')

        ?
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