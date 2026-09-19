# Floating cart 0.1.1 validation

Validated September 19, 2026.

## Automated checks

Run `npm ci --prefix tests` followed by `npm test --prefix tests` (Node 20+).
Eight checks pass against the shipped JavaScript:

- Safe item text, quantities, totals and unchanged cart storage.
- Icon-child mouseout, icon-to-panel transitions and delayed dismissal.
- Click toggling, Enter/Space, Escape and outside-click dismissal.
- Empty, malformed and non-array cart storage.
- Multiple independent cart instances and unique controls.
- Last-item removal with CTC Lite's event-before-storage ordering.
- Missing blocks and inaccessible storage.
- Editor bundle render/save with no global translation function.

JavaScript syntax checks pass for both shipped bundles. PHP syntax checks pass
on PHP 7.4.33, 8.3.14 and 8.4.1.

## Chrome fixture checks

The fixture loads the shipped frontend and style assets. Desktop and 320 × 640
layouts were inspected in Google Chrome. Hover transition events were exercised
through fixture controls; the icon pseudo-element and badge both ignore pointer
events. Click/keyboard opening, empty-cart updates and a 15-item cart passed.
The 320px panel spans x=12 to x=308 with no horizontal content overflow; long
carts scroll internally and remain inside the viewport.

## Scope and limitations

These are isolated browser and DOM contract checks, not a full WordPress editor,
activation, checkout or payment integration test. Saved markup was preserved;
the editor bundle was patched alongside source to remove obsolete hover handlers
and fix its translation import. No full webpack build was run in this environment.
The frontend has no imports and its shipped file matches the source directly;
styles use plain CSS and their shipped files match their SCSS sources directly.
No WordPress.org publishing or release tagging was performed.
