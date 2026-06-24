export class InventoryPage {
    constructor(page) {
        this.page = page;
        this.addToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
        this.cartLink = page.locator('.shopping_cart_link');
        this.cartBadge = page.locator('.shopping_cart_badge');
    }

    async addItemToCart() {
        await this.addToCartButton.click();
    }

    async goToCart() {
        await this.cartLink.click();
    }

    async getCartBadgeCount() {
        const count = await this.cartBadge.count();
        if (count === 0) return 0;
        const text = await this.cartBadge.textContent();
        return Number(text?.trim() || 0);
    }
}
