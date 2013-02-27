organicjs
=========

OrganicJS Code Sample

Example's Features: 

- Click on Ball to see it bounce inside rectangle.
- Change the slider position to change ball size as it bounces
- Resize browser window and see everything resizing (courtesy of SVG liquid layout, nothing has to be recomputed)

OrganicJS Current Architecture Features:

1. Reusable component architecture

2. Chainable methods and properties (easy to unit test via automated means since all properties and methods are directly testable in any order, with any data) 

3. Closures allowed as property settings, allowing for dynamic properties (value is never static in such case) 

4. Context in property settings is the component instance

5. Contextual Object Cache with provide/consume paradigm allows decoupled sharing of data and behavior across components, without needing to resort to composition,
resulting in an appropriately light plugin pattern

6. Scoped Data Model for sharing mutable data structures across widget contexts

7. Micro size: less than 50 lines of code

More to come (specifically, events abstracted down to signals and SEO-aware routing/push state functionality)
