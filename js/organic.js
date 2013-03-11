/*

 OrganicJS is a reusable component pattern and feather-weight micro-framework

 OrganicJS supports reusable components with chain*able properties and public methods, dynamic setters/getters,
 HTML/SVG in-place cloning, and a contextual component cache (for sharing data/behavior among components in a
 decoupled, soft manner)

 @MarcFawzi

 Created: 2013

 v0.4

 */

(function(){

    var app = app || {};

    // Auto Getters/Setters
    // this creates getter/setter on the object for each of its public properties
    // so that public properties may be accessed as componentInstance.property(value) (when setting)
    // and componentInstance.property() (when getting)
    app.build = app.build || function Build(obj, cache, model)  {

        if (obj.props === undefined)
            throw new Error("no public properties defined").stack;

        //explicitly set to undefined so it can be found in props
        obj.props.widget = undefined;
        obj.props.scope = undefined;
        obj.props.consume = undefined;
        obj.props.provide = undefined;

        for (o in obj.props) {
            obj[o] =  new Function("value", "if (!arguments.length) return typeof this.props['" + o +
                "'] == 'function' ? this.props['" + o + "'].call(this) : this.props['" + o + "'];" +
                "this.props['" + o + "'] = (typeof value == 'function' ? value.call(this) : value); return this")
        }

        // special setter/getter
        obj.provide = function(name) {

            if (name !== undefined) {
                obj.props.provide = name

                // Contextual Component Cache
                // store the component using "widget context/component name" as the path (key)
                cache.set(obj.widget() + "/" + name, obj);

                return obj;
            }
            else {
                return obj.props.provide;
            }
        }
    }

    // Contextual Component Cache
    //
    // For caching and sharing component's data and behavior with components that have the same user-defined context
    //
    // Contextual Component Cache clones the component and saves the clone (with its data and behaviors operating in
    // the cloned context) under the 'widget context/component name' path where context is the component .widget() 
    // property while name is specified in the .provide() property of the component being provided, and available 
    // to the consuming component via that component's .consume() property.
    //
    // use .provide(name) to cache component
    // use .consume([{name: 'component name', into: 'method or property'}, { ... }, etc]) to consume cached component
    // use console.log(cache.objects()) to view all cached objects and their properties/methods, in all widget contexts
    //
    //
    app.cache = app.cache || function Cache() {

        var obj = {}

        obj.objects = function() { return obj}

        // cache the component in the given 'widget context/ component name' path
        obj.set = function(context$name, comp) {

            obj[context$name] = {};

            for (key in comp) {
                obj[context$name][key] = comp[key]
            }
        }

        // return component if it exists in cache in the given context/name
        obj.get = function(context$name) {
            return obj[context$name];
        }

        return obj;
    }

    // Scoped Data Model
    //
    // For sharing independent data structures between widgets that have the same scope
    //
    // Scoped Model offers the ability to create, access and update independent data structures within a given
    // scope that may transcend the widget context.
    //
    // use model.create("scope", {key1: value, key2: value, etc}) to create new properties
    // use model.keyName("scope") to get the value for a key in the given scope
    // use model.keyName("scope", value) to set the value for a key in the given scope
    // use console.log(model.keys()) to view all keys for all scopes
    //
    // setters are chain-able
    //
    // the scope specified and returned by the component's .model()

    app.model = app.model || function Model() {

        var obj = {}

        obj.keys = function() { return obj}

        obj.create = function(scope, json) {

            if (scope === undefined)
                throw new Error("scope property not configured").stack

            obj[scope] = obj[scope] || {}

            obj[scope].props = obj[scope].props || {}

            for (key in json) {
                obj[scope].props[key] = json[key]
            }

            for (o in obj[scope].props) {
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

    app.create = app.create || function Create(element, n) {

        // jQuery to native
        var el = element[0] || element;

        if (el.nodeType != 1)
            throw new Error("Can't use this node type").stack

        if (typeof n == 'undefined')
            throw new Error("Can't create without name or index").stack

        // start of custom cloning

        var node = document.createElement(el.tagName);

        // copy node's html or text content (like clone(deep) but without invisible text nodes)
        if (typeof node.innerHTML != 'undefined') {
            node.innerHTML = el.innerHTML
        } else {
            node.textContent = el.textContent
        }

        for (var attr, i = 0, attributes = el.attributes, length =attributes.length; i < length; i++) {
            attr = attributes.item(i)
            if (attr.nodeName != 'create' && attr.nodeName != 'id')
                node.setAttribute(attr.nodeName, attr.nodeValue);
        }

        node.setAttribute("n", n)

        var frag = document.createDocumentFragment();

        frag.appendChild(node)

        // end of custom cloning

        // insert new instance in place
        el.parentNode.appendChild(frag);

        frag = null;
    }

    app.save = app.save || function Save(element) {

        // jQuery to native
        var el = element[0] || element;

        el._clone = el.cloneNode(true)
    }

    app.restore = app.restore || function Restore(element) {

        // jQuery to native
        var el = element[0] || element;

        var parentNode = el.parentNode,
            clone = el._clone;

        parentNode.removeChild(el);

        parentNode.appendChild(clone);
    }

    window.app = app;

} ())