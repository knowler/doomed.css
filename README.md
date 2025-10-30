# doomed.css

u r doomed

An experiment using CSS Mixins to style built-in elements and custom elements.
Only works in Chrome Canary as of writing and, even then, some stuff breaks.

The goal is create a component library of sorts which has mixins for built-in
elements, then as a treat we recreate a custom version of the built-in where we
also use the mixins.

## Observations

In the light DOM, mixins seem to have some limits… whereas the limits don’t seem
to occur in the shadow DOM.
