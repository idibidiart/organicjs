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

1. Reusable component architecture

2. Nest*able, reusable HTML5/+SVG templates with in-place rendering

3. Chain*able methods and properties (easy to unit test via automated means since all properties and methods are directly testable in any order, with any data)

4. Closures allowed as property settings, allowing for dynamic properties (value is never static in such case)

5. Context in property settings is the component instance

6. Contextual Object Cache with provide/consume paradigm allows decoupled sharing of data and behavior across components, without needing to resort to composition,
resulting in an appropriately light plugin pattern

7. Scoped Data Model for sharing mutable data structures across widget contexts

8. Micro size: less than 500 lines of code

More to come (events abstracted down to signals and SEO-aware routing/push state functionality)
