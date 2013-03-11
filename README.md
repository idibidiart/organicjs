organicjs
=========

OrganicJS Code Sample

OrganicJS is a reusable component pattern and feather-weight micro-framework

OrganicJS supports reusable components with chain*able properties and public methods, dynamic setters/getters,
HTML/SVG template support, and a contextual component cache (for sharing data/behavior among components in a
decoupled, soft manner)

Example's Features: 

- Click on Ball to see it bounce inside rectangle.
- Change the slider position to change ball size as it bounces
- Resize browser window and see everything resizing (courtesy of SVG liquid layout, nothing has to be recomputed)

OrganicJS Current Architecture Features:

Reusable component framework with:

1. Chainable methods and properties (easy to unit test via automated means since all properties and methods are directly testable in
any order, with any arguments)

2. Closures allowed as property settings, allowing for dynamic properties (value is never static in such case)

3. Functions in property arguments are bound to component instance to allow inter-dependent properties

4. Functions in method arguments may be bound to element to handle DOM events

4. Provide/consume paradigm via Contextual Object Cache allows decoupled sharing of data and behavior across components,
without needing to resort to composition, resulting in an appropriately light plugin pattern

5. Scoped Data Model for sharing mutable data structures across widget contexts

Micro size: less than 500 lines of code

More to come (events abstracted down to signals and SEO-aware routing/push state functionality)
