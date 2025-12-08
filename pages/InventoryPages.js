export class InventoryPage {
    constructor(page) {
        this.page = page;
        this.addToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
        this.cartLink = page.locator('.shopping_cart_link');
    }

    async addItemToCart() {
        await this.addToCartButton.click();
    }

    async goToCart() {
        await this.cartLink.click();
    }
}
