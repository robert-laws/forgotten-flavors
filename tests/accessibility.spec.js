import fs from 'node:fs'

import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
const recipes = JSON.parse(fs.readFileSync(new URL('../public/recipes.json', import.meta.url), 'utf8'))
const sampleRecipe = recipes.find((recipe) => recipe?.id && recipe?.name)

async function scanPage(page, testInfo) {
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze()

  await testInfo.attach('axe-results', {
    body: JSON.stringify(results, null, 2),
    contentType: 'application/json',
  })

  expect(results.violations).toEqual([])
}

test.describe('accessibility', () => {
  test('home page has no automatically detectable WCAG A/AA violations', async ({ page }, testInfo) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Lost tables, reframed as a modern culinary archive.' })).toBeVisible()

    await scanPage(page, testInfo)
  })

  test('recipe detail page has no automatically detectable WCAG A/AA violations', async ({ page }, testInfo) => {
    test.skip(!sampleRecipe, 'No recipe data is available for detail-page accessibility coverage.')

    await page.goto(`recipe/${sampleRecipe.id}`)
    await expect(page.getByRole('heading', { name: sampleRecipe.name })).toBeVisible()

    await scanPage(page, testInfo)
  })

  test('recipe dossier drawer has no automatically detectable WCAG A/AA violations', async ({ page }, testInfo) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Open dossier' }).first().click()
    await expect(page.getByText('Recipe Dossier', { exact: true })).toBeVisible()

    await scanPage(page, testInfo)
  })
})
