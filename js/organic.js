/*

 OrganicJS is a reusable component pattern and feather-weight micro-framework

 OrganicJS supports reusable components with chain*able properties and public methods, dynamic setters/getters,
 HTML/SVG template support, and a contextual component cache (for sharing data/behavior among components in a
 decoupled, soft manner)

 @MarcFawzi

 Created: 2013

 v0.3

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

    app.render = app.render || function Template(template, index) {

        // jQuery to native
        var tmpl = template[0] || template;

        if (typeof tmpl.getAttribute("template") == 'undefined')
            throw new Error("element is not a template").stack

        if (typeof tmpl.innerHTML == 'undefined' && tmpl.textContent == 'undefined')
            throw new Error("invalid root element in template").stack

        if (typeof index == 'undefined')
            throw new Error("new instance index must be specified").stack

        // start of custom cloning

        var el = document.createElement(tmpl.tagName);

        // copy node's html or text content (like clone(deep) but without invisible text nodes)
        if (typeof tmpl.innerHTML != 'undefined') {
            el.innerHTML = tmpl.innerHTML
        } else {
            el.textContent = tmpl.textContent
        }

        for (var attr, i = 0, attributes = tmpl.attributes, length =attributes.length; i < length; i++) {
            attr = attributes.item(i)
            if (attr.nodeName != 'template' && attr.nodeName != 'd' && attr.nodeName != 'id')
                el.setAttribute(attr.nodeName, attr.nodeValue);
            else if (attr.nodeName = 'd')
                el.setAttribute("d", attr.nodeValue + "-instance-" + index)
        }

        var frag = document.createDocumentFragment();

        frag.appendChild(el)

        // end of custom cloning

        // insert new instance in place
        tmpl.parentNode.appendChild(frag);

        frag = null;
    }

    app.save = app.save || function Template(template) {

        // jQuery to native
        var tmpl = template[0] || template;

        if (typeof tmpl.getAttribute("template") == 'undefined')
            throw new Error("element is not a template").stack

        if (typeof tmpl.innerHTML != 'undefined') {
            if (typeof tmpl._cache == 'undefined') tmpl._cache = tmpl.innerHTML
        } else {
            if (typeof tmpl._cache == 'undefined') tmpl._cache = tmpl.textContent
        }
    }

    app.restore = app.restore || function Template(template) {

        // jQuery to native
        var tmpl = template[0] || template;

        if (typeof tmpl.getAttribute("template") == 'undefined')
            throw new Error("element is not a template").stack

        if (typeof tmpl.innerHTML != 'undefined') {
            if (tmpl.innerHTML != tmpl._cache) tmpl.innerHTML = tmpl._cache
        } else {
            if (tmpl.textContent != tmpl._cache) tmpl.textContent = tmpl._cache
        }
    }

    window.app = app;

} ())