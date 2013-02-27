/*

 OrganicJS is a self-authored reusable component pattern and feather-weight framework

 Organic supports reusable components with chain*able properties and public methods, dynamic setters/getters,
 and a contextual component cache (for sharing data/behavior among components in a decoupled, soft manner)

 @MarcFawzi

 Created: 2013

 v0.2

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
        obj.provide = function(type) {

            if (type !== undefined) {
                obj.props.provide = type

                // Contextual Component Cache
                // store the component using "widget context/component type" as the path (key)
                cache.set(obj.widget() + "/" + type, obj);

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
    // the cloned context) under the 'widget context/type' path where context is the component .widget() property and
    // type is unique within the widget's context, and is specified in the .provide() property of the component being
    // provided, and available to the consuming component via that component's .consume() property.
    //
    // use .provide(type) to cache component
    // use .consume([{type: 'type', into: 'method or property'}, { ... }, etc]) to consume cached component
    // use console.log(cache.objects()) to view all cached objects and their properties/methods, in all widget contexts
    //
    //
    app.cache = app.cache || function Cache() {

        var obj = {}

        obj.objects = function() { return obj}

        // cache the component in the given widget/type
        obj.set = function(widget$type, comp) {

            obj[widget$type] = {};

            for (key in comp) {
                obj[widget$type][key] = comp[key]
            }
        }

        // return component if it exists in cache in the given widget/type
        obj.get = function(widget$type) {
            return obj[widget$type];
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
    // use model.propertyName("scope") to get the value for a property in the given scope
    // use model.propertyName("scope", value) to set the value for a property in the given scope
    // use console.log(model.entries()) to view all entries for all components
    //
    // setters are chain-able
    //
    // the scope specified and returned by the component's .model()

    app.model = function Model() {

        var obj = {}

        obj.entries = function() { return obj}

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

    window.app = app;

} ())