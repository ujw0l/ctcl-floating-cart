const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
function load() {
    let registered;
    const createElement = (type, props, ...children) => ({ type, props, children });
    const useBlockProps = () => ({ className: 'wp-block-ctc-lite-ctcl-floating-cart' });
    useBlockProps.save = useBlockProps;
    const context = { window: { React: { useRef: () => ({ current: null }) }, wp: {
        blocks: { registerBlockType: (_, settings) => { registered = settings; } },
        i18n: { __: text => text }, element: { createElement },
        components: { PanelBody: 'PanelBody', RangeControl: 'RangeControl', ColorPicker: 'ColorPicker' },
        blockEditor: { useBlockProps, InspectorControls: 'InspectorControls' }
    } } };
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../build/index.js'), 'utf8'), context);
    return registered;
}
test('shipped editor bundle renders and saves without relying on a global translation function', () => {
    const block = load();
    const attributes = { iconType: 'dashicons-cart', fontColor: '#ffffff', bgColor: '#4287f5', iconSize: 20 };
    assert.ok(block.edit({ attributes, setAttributes() {} }));
    const saved = block.save({ attributes });
    assert.equal(saved.type, 'div');
    assert.equal(saved.children[0].props.className, 'ctcl-floating-cart-icon dashicons dashicons-cart');
    assert.equal(saved.children[1].props.className, 'ctcl-floating-cart-content');
    assert.match(JSON.stringify(saved), /No items in cart/);
    assert.match(JSON.stringify(saved), /ctcl-floating-cart-item-count/);
});
