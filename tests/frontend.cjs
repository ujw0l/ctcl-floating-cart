const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const script = fs.readFileSync(path.join(__dirname, '../build/frontend.js'), 'utf8');
const markup = `<div class="wp-block-ctc-lite-ctcl-floating-cart"><div class="ctcl-floating-cart-icon"><div class="ctcl-floating-cart-item-count">0</div></div><div class="ctcl-floating-cart-content" style="display:none"><p>No items in cart</p></div></div>`;
const items = [{ name: '<b>Shoe</b>', qty: 2, price: '12.50', pic: 'shoe.png' }];
function setup(value = items, copies = 1) {
    const dom = new JSDOM(markup.repeat(copies) + '<button id="outside">Outside</button>', { url: 'https://example.test', runScripts: 'outside-only', pretendToBeVisual: true });
    const w = dom.window;
    w.matchMedia = () => ({ matches: true });
    w.ctclParams = { qtyHead: 'Quantity', subTotal: 'Subtotal', currency: 'USD' };
    if (value !== null) w.localStorage.setItem('ctclHiddenCart', typeof value === 'string' ? value : JSON.stringify(value));
    Object.defineProperty(w.document, 'readyState', { value: 'complete' });
    w.eval(script);
    const icon = w.document.querySelector('.ctcl-floating-cart-icon');
    const panel = w.document.querySelector('.ctcl-floating-cart-content');
    const event = (node, type, options = {}) => node.dispatchEvent(new w.MouseEvent(type, { bubbles: true, ...options }));
    return { dom, w, icon, panel, event };
}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
test('renders cart safely, totals and quantities; preserves storage', () => {
    const { dom, w, icon, panel, event } = setup();
    event(icon, 'mouseenter');
    assert.equal(icon.getAttribute('aria-expanded'), 'true');
    assert.equal(panel.querySelector('.ctcl-mini-name').textContent, '<b>Shoe</b>');
    assert.equal(panel.querySelector('b'), null);
    assert.equal(panel.querySelector('.ctcl-mini-total').textContent, '25.00');
    assert.equal(panel.querySelector('.ctcl-mini-subtotal strong').textContent, '25.00');
    assert.deepEqual(JSON.parse(w.localStorage.getItem('ctclHiddenCart')), items);
    dom.window.close();
});
test('child mouseout does not hide cart and entering panel preserves it', async () => {
    const { dom, w, icon, panel, event } = setup();
    event(icon, 'mouseenter');
    event(icon, 'mouseout', { relatedTarget: icon.firstElementChild });
    event(icon, 'mouseleave');
    event(panel, 'mouseenter');
    await delay(220);
    assert.equal(icon.getAttribute('aria-expanded'), 'true');
    event(panel, 'mouseleave');
    await delay(220);
    assert.equal(icon.getAttribute('aria-expanded'), 'false');
    dom.window.close();
});
test('click toggle, keyboard, Escape and outside dismissal', () => {
    const { dom, w, icon, event } = setup();
    icon.click(); assert.equal(icon.getAttribute('aria-expanded'), 'true');
    icon.click(); assert.equal(icon.getAttribute('aria-expanded'), 'false');
    icon.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    assert.equal(icon.getAttribute('aria-expanded'), 'true');
    w.document.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape' }));
    assert.equal(icon.getAttribute('aria-expanded'), 'false');
    icon.dispatchEvent(new w.KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    event(w.document.getElementById('outside'), 'pointerdown');
    assert.equal(icon.getAttribute('aria-expanded'), 'false');
    dom.window.close();
});
test('empty, malformed and non-array storage render the empty state', () => {
    for (const value of [null, [], '{broken', '{}', '[null]']) {
        const { dom, icon, panel, event } = setup(value);
        event(icon, 'mouseenter');
        assert.equal(icon.textContent, '0');
        assert.equal(panel.querySelector('p').style.display, '');
        assert.equal(panel.querySelector('.ctcl-mini-item'), null);
        dom.window.close();
    }
});
test('multiple instances have distinct controls and independent state', () => {
    const { dom, w, icon } = setup(items, 2);
    const icons = w.document.querySelectorAll('.ctcl-floating-cart-icon');
    assert.notEqual(icons[0].getAttribute('aria-controls'), icons[1].getAttribute('aria-controls'));
    icon.click();
    assert.equal(icons[1].getAttribute('aria-expanded'), 'false');
    dom.window.close();
});
test('last-item removal refreshes after the CTC Lite event-before-storage ordering', async () => {
    const { dom, w, icon, panel } = setup();
    icon.click();
    w.document.dispatchEvent(new w.CustomEvent('addRemoveProduct', { detail: 0 }));
    w.localStorage.removeItem('ctclHiddenCart');
    await delay(0);
    assert.equal(icon.textContent, '0');
    assert.equal(panel.querySelector('.ctcl-mini-item'), null);
    assert.equal(panel.querySelector('p').style.display, '');
    dom.window.close();
});
test('missing blocks and inaccessible storage do not crash initialization', () => {
    const { dom, w, icon } = setup();
    Object.defineProperty(w, 'localStorage', { get() { throw new Error('Disabled'); } });
    icon.click();
    assert.equal(icon.textContent, '0');
    w.document.body.innerHTML = '';
    w.eval(script);
    dom.window.close();
});
