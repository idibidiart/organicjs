organicjs
=========

OrganicJS Code Sample

 OrganicJS is a micro-framework for reusable JS+HTML+SVG components

        OrganicJS supports reusable JS+HTML+SVG components with chainable properties and public methods, dynamic
        setters/getters,reusable widget markup with nestable HTML/SVG fragments and in-place fragment cloning and
        rendering, and sharing of data/behavior among components in a soft, decoupled manner, using contextual
        component caching.

Example's Features: 

- Click on Ball to see it bounce inside rectangle.
- Change the slider position to change ball properties
- Resize browser window and see everything resizing (courtesy of SVG liquid layout)

OrganicJS Current Architecture Features:

Reusable JS component framework with support for:

1. Chainable methods and properties (easy to unit test via automated means since all properties and methods are directly
testable in any order, with any arguments)

2. Functions are allowed as property arguments and function's context is bound to component instance to allow for
inter-dependent properties (properties that reference each other, e.g. someComponent.height(this.width() + 500)

3. Closures (both by reference as well as self executing closures) are allowed as property arguments, allowing,
 in the latter case, dynamic properties (where the returned property value is never static in such case)

4. Functions are allowed as method arguments and their context may be bound to the element (for components with HTML
or SVG elements) to handle DOM events, e.g. someComponent.on("click", handler) or someComponent.onClick(handler)

5. "Provide/Consume" pattern allows for sharing of data and behavior between components, in a soft, decoupled manner,
via Contextual Component Caching.

6. Scoped Data Model for sharing mutable data structures in user defined cross-component cooperation scopes.

Supports reusable widget markup with nestable HTML/SVG fragments and in-place fragment cloning and rendering.

Micro size: less than 500 lines of code!

More to come (events abstracted down to signals and SEO-aware routing/push state functionality)
