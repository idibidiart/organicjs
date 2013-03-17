organicjs
=========

OrganicJS Code Sample

OrganicJS is a reusable component pattern and feather-weight micro-framework

OrganicJS supports reusable components with chain*able properties and public methods, dynamic setters/getters,
reusable widget markup, using nestable HTML/SVG fragments with in-place cloning and rendering, and
sharing of data/behavior among components in a soft, decoupled manner, using contextual component caching.

Example's Features: 

- Click on Ball to see it bounce inside rectangle.
- Change the slider position to change ball properties
- Resize browser window and see everything resizing (courtesy of SVG liquid layout)

OrganicJS Current Architecture Features:

Reusable JS component framework with support for:

1. Chainable methods and properties (easy to unit test via automated means since all properties and methods are directly
testable in any order, with any arguments)

2. Closures allowed as property settings, allowing for dynamic properties (value is never static in such case)

3. Functions in property arguments are bound to component instance to allow inter-dependent properties

4. Functions in method arguments may be bound to element to handle DOM events

5. Provide/Consume pattern, which allows for sharing of data and behavior between components, in a soft, decoupled manner,
via Contextual Component Cache.

6. Scoped Data Model for sharing mutable data structures across widget contexts.

Supports reusable widget markup with nestable HTML/SVG fragments and in-place fragment cloning and rendering.

Micro size: less than 500 lines of code

More to come (events abstracted down to signals and SEO-aware routing/push state functionality)
