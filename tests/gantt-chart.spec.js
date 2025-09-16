import { test, expect } from '@playwright/test';

test.describe('Gantt Chart Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the progress page
    await page.goto('/progress');
    // Wait for the page to load
    await page.waitForSelector('[data-testid="gantt-container"]');
  });

  test('Gantt chart zoom controls work', async ({ page }) => {
    // Get initial zoom level (should be 275%)
    const zoomDisplay = page.locator('span:has-text("%")');
    await expect(zoomDisplay).toContainText('275%');

    // Test zoom in (should max out at 300%)
    await page.click('button:has-text("+")');
    await expect(zoomDisplay).toContainText('300%');

    // Test zoom out multiple times
    await page.click('button:has-text("−")');
    await expect(zoomDisplay).toContainText('275%');

    await page.click('button:has-text("−")');
    await expect(zoomDisplay).toContainText('250%');

    // Test reset button
    await page.click('button:has-text("Reset")');
    await expect(zoomDisplay).toContainText('100%');
  });

  test('Gantt chart scrolls correctly at high zoom', async ({ page }) => {
    // Chart starts at 275% zoom
    const container = page.locator('[data-testid="gantt-container"]');

    // Check that horizontal scroll exists at high zoom
    const scrollWidth = await container.evaluate(el => el.scrollWidth);
    const clientWidth = await container.evaluate(el => el.clientWidth);
    expect(scrollWidth).toBeGreaterThan(clientWidth);

    // Test horizontal scrolling
    await container.evaluate(el => el.scrollLeft = 200);
    const newScrollLeft = await container.evaluate(el => el.scrollLeft);
    expect(newScrollLeft).toBe(200);

    // Test vertical scrolling
    await container.evaluate(el => el.scrollTop = 100);
    const newScrollTop = await container.evaluate(el => el.scrollTop);
    expect(newScrollTop).toBe(100);
  });

  test('Timeline header stays visible during vertical scroll', async ({ page }) => {
    const container = page.locator('[data-testid="gantt-container"]');
    const header = page.locator('[data-testid="timeline-header"]');

    // Check header is initially visible
    await expect(header).toBeVisible();

    // Scroll down significantly
    await container.evaluate(el => el.scrollTop = 300);

    // Timeline header should still be visible due to sticky positioning
    await expect(header).toBeVisible();

    // Check that header is at the top of the viewport
    const headerPosition = await header.boundingBox();
    const containerPosition = await container.boundingBox();

    // Header should be at or near the top of the container
    expect(headerPosition.y).toBeGreaterThanOrEqual(containerPosition.y);
    expect(headerPosition.y).toBeLessThanOrEqual(containerPosition.y + 50);
  });

  test('Gantt works with touch gestures', async ({ page, browserName }) => {
    // This test is most relevant for mobile browsers
    const container = page.locator('[data-testid="gantt-container"]');

    // Get initial scroll position
    const initialScrollLeft = await container.evaluate(el => el.scrollLeft);
    const initialScrollTop = await container.evaluate(el => el.scrollTop);

    // Simulate touch drag to scroll horizontally
    await container.dispatchEvent('touchstart', {
      touches: [{ clientX: 400, clientY: 300, identifier: 1 }]
    });

    await container.dispatchEvent('touchmove', {
      touches: [{ clientX: 200, clientY: 300, identifier: 1 }]
    });

    await container.dispatchEvent('touchend', {
      changedTouches: [{ clientX: 200, clientY: 300, identifier: 1 }]
    });

    // Wait a moment for scroll to update
    await page.waitForTimeout(100);

    // Verify horizontal scroll changed
    const newScrollLeft = await container.evaluate(el => el.scrollLeft);
    expect(newScrollLeft).not.toBe(initialScrollLeft);

    // Simulate vertical touch drag
    await container.dispatchEvent('touchstart', {
      touches: [{ clientX: 300, clientY: 400, identifier: 2 }]
    });

    await container.dispatchEvent('touchmove', {
      touches: [{ clientX: 300, clientY: 200, identifier: 2 }]
    });

    await container.dispatchEvent('touchend', {
      changedTouches: [{ clientX: 300, clientY: 200, identifier: 2 }]
    });

    // Wait a moment for scroll to update
    await page.waitForTimeout(100);

    // Verify vertical scroll changed
    const newScrollTop = await container.evaluate(el => el.scrollTop);
    expect(newScrollTop).not.toBe(initialScrollTop);
  });

  test('Mouse drag to pan works when zoomed', async ({ page }) => {
    const container = page.locator('[data-testid="gantt-container"]');

    // Ensure we're zoomed in (starts at 275%)
    const zoomDisplay = page.locator('span:has-text("%")');
    await expect(zoomDisplay).toContainText('275%');

    // Get initial scroll position
    const initialScrollLeft = await container.evaluate(el => el.scrollLeft);

    // Simulate mouse drag
    await container.hover({ position: { x: 400, y: 300 } });
    await page.mouse.down();
    await page.mouse.move(200, 300);
    await page.mouse.up();

    // Wait for scroll update
    await page.waitForTimeout(100);

    // Verify scroll changed
    const newScrollLeft = await container.evaluate(el => el.scrollLeft);
    expect(newScrollLeft).toBeGreaterThan(initialScrollLeft);
  });

  test('Zoom controls have correct data-testid', async ({ page }) => {
    // Check that zoom controls container exists
    const zoomControls = page.locator('[data-testid="zoom-controls"]');
    await expect(zoomControls).toBeVisible();

    // Check that zoom buttons are within the controls
    const zoomInButton = zoomControls.locator('button:has-text("+")');
    const zoomOutButton = zoomControls.locator('button:has-text("−")');
    const resetButton = zoomControls.locator('button:has-text("Reset")');

    await expect(zoomInButton).toBeVisible();
    await expect(zoomOutButton).toBeVisible();
    await expect(resetButton).toBeVisible();
  });

  test('Container has fixed dimensions', async ({ page }) => {
    const container = page.locator('[data-testid="gantt-container"]');

    // Check that container has the expected height
    const boundingBox = await container.boundingBox();
    expect(boundingBox.height).toBe(600);

    // Check that container takes full width
    const viewportSize = page.viewportSize();
    const containerWidth = boundingBox.width;

    // Container should be close to viewport width (minus padding/margins)
    expect(containerWidth).toBeGreaterThan(viewportSize.width * 0.9);
  });

  test('Gantt chart renders task bars correctly', async ({ page }) => {
    // Check that task bars are rendered
    const taskBars = page.locator('[style*="borderRadius"][style*="cursor: pointer"]');

    // Should have multiple task bars
    const count = await taskBars.count();
    expect(count).toBeGreaterThan(0);

    // Check that progress indicators are visible
    const firstTaskBar = taskBars.first();
    await expect(firstTaskBar).toBeVisible();
  });

  test('Today line is visible when in range', async ({ page }) => {
    // Look for the TODAY indicator
    const todayLine = page.locator('text="TODAY"');

    // The today line might or might not be visible depending on the current date
    // We just check that if it exists, it's properly styled
    const isVisible = await todayLine.isVisible().catch(() => false);

    if (isVisible) {
      // Check that it has the expected red color
      const parent = todayLine.locator('..');
      const backgroundColor = await parent.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      // Should be red color
      expect(backgroundColor).toContain('rgb(239, 68, 68)');
    }
  });
});