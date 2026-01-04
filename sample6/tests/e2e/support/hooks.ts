import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world.js';

BeforeAll(async function () {
  console.log('Starting E2E test suite...');
});

Before(async function (this: CustomWorld) {
  await this.init();
});

After(async function (this: CustomWorld, { result }) {
  if (result?.status === Status.FAILED && this.page) {
    // Take screenshot on failure
    const screenshot = await this.page.screenshot();
    this.attach(screenshot, 'image/png');
  }
  
  await this.cleanup();
});

AfterAll(async function () {
  console.log('E2E test suite completed.');
});
