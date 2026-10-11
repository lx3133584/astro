import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';
import { type Fixture, loadFixture } from './test-utils.ts';

describe('Serverless with dynamic routes', () => {
	let fixture: Fixture;

	before(async () => {
		fixture = await loadFixture({
			root: './fixtures/serverless-with-dynamic-routes/',
			output: 'server',
		});
		await fixture.build({});
	});

	it('build successful', { timeout: 30000 }, async () => {
		assert.ok(await fixture.readFile('../.vercel/output/static/index.html'));
		assert.ok(await fixture.readFile('../.vercel/output/functions/_render.func/.vc-config.json'));
	});

	it('does not bundle rolldown into the serverless function entry', async () => {
		const configJson = JSON.parse(
			await fixture.readFile('../.vercel/output/functions/_render.func/.vc-config.json'),
		);
		const entryCode = await fixture.readFile(
			`../.vercel/output/functions/_render.func/${configJson.handler}`,
		);
		assert.doesNotMatch(entryCode, /import\s+["']rolldown["']/);
		assert.doesNotMatch(entryCode, /from\s+["']rolldown["']/);
		assert.doesNotMatch(entryCode, /import\s+["']@vercel\/routing-utils["']/);
	});
});
