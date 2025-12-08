export class CartPage {
    constructor(page) {
        this.page = page;
        this.cartItems = page.locator('.cart_item');
        this.checkoutButton = page.locator('[data-test="checkout"]');
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

    async validateItemInCart(itemName) {
        const itemLocator = this.cartItems.filter({ hasText: itemName });
        return await itemLocator.isVisible();
    }

    async validateItemQuantity(itemName, expectedQuantity) {
        const itemLocator = this.cartItems.filter({ hasText: itemName });
        const quantityLocator = itemLocator.locator('.cart_quantity');
        const quantityText = await quantityLocator.textContent();
        return parseInt(quantityText) === expectedQuantity;
    }

    
}
