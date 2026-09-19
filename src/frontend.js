/* Presentation only: uses CTC Lite's existing cart and update event. */
(() => {
    const init = () => {
        const params = window.ctclParams || {};
        const readCart = () => {
            try {
                const value = JSON.parse(localStorage.getItem('ctclHiddenCart') || '[]');
                return Array.isArray(value) ? value.filter(item => item && typeof item === 'object') : [];
            } catch (_) { return []; }
        };
        document.querySelectorAll('.wp-block-ctc-lite-ctcl-floating-cart').forEach((root, index) => {
            const icon = root.querySelector('.ctcl-floating-cart-icon');
            const panel = root.querySelector('.ctcl-floating-cart-content');
            const count = root.querySelector('.ctcl-floating-cart-item-count');
            if (!icon || !panel || !count) return;
            let open = false, pinned = false, timer;
            panel.id = `ctcl-mini-cart-${index}`;
            panel.setAttribute('role', 'region');
            panel.setAttribute('aria-label', params.itemHead || 'Cart');
            icon.setAttribute('role', 'button');
            icon.tabIndex = 0;
            icon.setAttribute('aria-label', 'Cart');
            icon.setAttribute('aria-controls', panel.id);
            icon.setAttribute('aria-expanded', 'false');
            const empty = panel.querySelector('p');
            const element = (tag, className, text) => {
                const node = document.createElement(tag);
                node.className = className;
                if (text !== undefined) node.textContent = text;
                return node;
            };
            const position = () => {
                if (!open) return;
                const rect = icon.getBoundingClientRect();
                const viewport = window.visualViewport;
                const width = viewport ? viewport.width : document.documentElement.clientWidth;
                const height = viewport ? viewport.height : window.innerHeight;
                const x = viewport ? viewport.offsetLeft : 0;
                const y = viewport ? viewport.offsetTop : 0;
                panel.style.width = `${Math.min(380, width - 24)}px`;
                panel.style.left = `${Math.max(x + 12, Math.min(rect.right - panel.offsetWidth, x + width - panel.offsetWidth - 12))}px`;
                const below = y + height - rect.bottom - 20;
                const above = rect.top - y - 20;
                const upward = below < 240 && above > below;
                panel.style.maxHeight = `${Math.max(80, upward ? above : below)}px`;
                panel.style.top = `${upward ? Math.max(y + 12, rect.top - panel.offsetHeight - 8) : rect.bottom + 8}px`;
            };
            const render = () => {
                const items = readCart();
                count.textContent = String(items.length);
                icon.setAttribute('aria-label', `Cart (${items.length})`);
                panel.querySelector('.ctcl-floating-cart-item-list')?.remove();
                if (empty) empty.style.display = items.length ? 'none' : '';
                if (!items.length) return;
                const list = element('div', 'ctcl-floating-cart-item-list');
                let subtotal = 0;
                items.forEach(item => {
                    const qty = Number.parseInt(item.qty, 10) || 0;
                    const price = Number.parseFloat(item.price) || 0;
                    const total = qty * price;
                    subtotal += total;
                    const row = element('div', 'ctcl-mini-item');
                    const media = element('div', 'ctcl-mini-media');
                    if (item.pic) {
                        const img = element('img', 'ctcl-mini-image');
                        img.alt = '';
                        img.src = item.pic;
                        img.addEventListener('error', () => { img.hidden = true; });
                        media.append(img);
                    }
                    const details = element('div', 'ctcl-mini-details');
                    details.append(element('div', 'ctcl-mini-name', item.name || ''));
                    details.append(element('div', 'ctcl-mini-meta', `${params.qtyHead || 'Qty'}: ${qty} × ${price.toFixed(2)}`));
                    row.append(media, details, element('div', 'ctcl-mini-total', total.toFixed(2)));
                    list.append(row);
                });
                const total = element('div', 'ctcl-mini-subtotal');
                total.append(element('span', '', `${params.subTotal || 'Subtotal'}${params.currency ? ` (${params.currency})` : ''}`), element('strong', '', subtotal.toFixed(2)));
                list.append(total);
                panel.append(list);
            };
            const show = () => {
                clearTimeout(timer);
                if (!open) render();
                open = true;
                panel.style.display = 'block';
                icon.setAttribute('aria-expanded', 'true');
                position();
            };
            const hide = () => {
                clearTimeout(timer);
                open = pinned = false;
                panel.style.display = 'none';
                icon.setAttribute('aria-expanded', 'false');
            };
            const leave = () => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    if (!pinned && !icon.matches(':hover') && !panel.matches(':hover') && !root.contains(document.activeElement)) hide();
                }, 180);
            };
            // mouseleave ignores transitions between the icon and its child badge.
            [icon, panel].forEach(node => {
                node.addEventListener('mouseenter', () => { if (matchMedia('(hover: hover)').matches) show(); });
                node.addEventListener('mouseleave', leave);
            });
            icon.addEventListener('click', () => { if (pinned) hide(); else { pinned = true; show(); } });
            icon.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); icon.click(); }
            });
            root.addEventListener('focusout', () => setTimeout(() => { if (!root.contains(document.activeElement)) hide(); }, 0));
            document.addEventListener('keydown', event => { if (event.key === 'Escape' && open) hide(); });
            document.addEventListener('pointerdown', event => { if (!root.contains(event.target)) hide(); });
            const update = () => { render(); position(); };
            // CTC Lite may dispatch before removing the last item from storage.
            document.addEventListener('addRemoveProduct', () => queueMicrotask(update));
            window.addEventListener('storage', event => { if (event.key === 'ctclHiddenCart' || event.key === null) update(); });
            window.addEventListener('resize', position);
            window.addEventListener('scroll', position, true);
            if (window.visualViewport) {
                window.visualViewport.addEventListener('resize', position);
                window.visualViewport.addEventListener('scroll', position);
            }
            render();
            hide();
        });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
