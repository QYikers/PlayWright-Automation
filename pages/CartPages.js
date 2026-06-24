export class CartPage {
    constructor(page) {
        this.page = page;
        this.cartItems = page.locator('.cart_item');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.cartBadge = page.locator('.shopping_cart_badge');
    }

    async getCartItems() {
        return this.cartItems;
    }

    async proceedToCheckout() {
        await this.checkoutButton.click();
    }

    async removeItem(itemDataTest) {
        await this.page.click(`[data-test="remove-${itemDataTest}"]`);
    }

    async isItemInCart(itemName) {
        const itemLocator = this.cartItems.filter({ hasText: itemName });
        return await itemLocator.isVisible();
    }

    async getItemQuantity(itemName) {
        const itemLocator = this.cartItems.filter({ hasText: itemName });
        const quantityLocator = itemLocator.locator('.cart_quantity');
        const quantityText = await quantityLocator.textContent();
        return Number(quantityText?.trim() || 0);
    }

    async getCartBadgeCount() {
        const count = await this.cartBadge.count();
        if (count === 0) return 0;
        const text = await this.cartBadge.textContent();
        return Number(text?.trim() || 0);
    }
}
