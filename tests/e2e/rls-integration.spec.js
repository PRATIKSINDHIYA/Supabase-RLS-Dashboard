const { test, expect } = require('@playwright/test')

test.describe('RLS Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/')
  })

  test('student can only see their own data', async ({ page }) => {
    // This test would require actual Supabase setup with test data
    // For now, we'll test the UI behavior
    
    // Navigate to login
    await page.click('text=Login')
    await expect(page).toHaveURL('/login')
    
    // Fill in student credentials (would need test data)
    await page.fill('input[name="email"]', 'student@test.com')
    await page.fill('input[name="password"]', 'password123')
    
    // Click sign in
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    
    // Should see student dashboard with own data only
    await expect(page.locator('h1')).toContainText('My Dashboard')
    
    // Should not see teacher panel link
    await expect(page.locator('text=Teacher Panel')).not.toBeVisible()
  })

  test('teacher can see all students and edit marks', async ({ page }) => {
    // Navigate to login
    await page.click('text=Login')
    await expect(page).toHaveURL('/login')
    
    // Fill in teacher credentials (would need test data)
    await page.fill('input[name="email"]', 'teacher@test.com')
    await page.fill('input[name="password"]', 'password123')
    
    // Click sign in
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    
    // Should see teacher dashboard with all students
    await expect(page.locator('h1')).toContainText('All Students')
    
    // Should see teacher panel link
    await expect(page.locator('text=Teacher Panel')).toBeVisible()
    
    // Navigate to teacher panel
    await page.click('text=Teacher Panel')
    await expect(page).toHaveURL('/teacher')
    
    // Should see teacher dashboard
    await expect(page.locator('h1')).toContainText('Teacher Dashboard')
    
    // Should see student management table
    await expect(page.locator('table')).toBeVisible()
    
    // Should be able to edit marks (test the edit functionality)
    const editButton = page.locator('button:has-text("Edit")').first()
    if (await editButton.isVisible()) {
      await editButton.click()
      
      // Should see edit form
      await expect(page.locator('input[type="number"]')).toBeVisible()
      
      // Update marks
      await page.fill('input[type="number"]', '95')
      await page.click('button:has-text("Save")')
      
      // Should see updated marks
      await expect(page.locator('text=95/100')).toBeVisible()
    }
  })

  test('unauthorized access is blocked', async ({ page }) => {
    // Try to access teacher panel without authentication
    await page.goto('/teacher')
    
    // Should redirect to login
    await expect(page).toHaveURL('/login')
  })

  test('student cannot access teacher panel', async ({ page }) => {
    // Login as student
    await page.click('text=Login')
    await page.fill('input[name="email"]', 'student@test.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // Try to access teacher panel directly
    await page.goto('/teacher')
    
    // Should redirect to dashboard (student doesn't have teacher role)
    await expect(page).toHaveURL('/dashboard')
  })

  test('authentication flow works correctly', async ({ page }) => {
    // Test sign up flow
    await page.click('text=Login')
    await page.click('text=Sign up')
    
    // Fill in sign up form
    await page.fill('input[name="name"]', 'Test User')
    await page.selectOption('select[name="role"]', 'student')
    await page.fill('input[name="email"]', 'newuser@test.com')
    await page.fill('input[name="password"]', 'password123')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard or role selection
    await expect(page).toHaveURL(/\/(dashboard|select-role)/)
  })

  test('Google OAuth flow', async ({ page }) => {
    // Test Google OAuth button
    await page.click('text=Login')
    await page.click('button:has-text("Continue with Google")')
    
    // Should redirect to Google OAuth (in real test, would need proper setup)
    // For now, just verify the button exists and is clickable
    await expect(page.locator('button:has-text("Continue with Google")')).toBeVisible()
  })

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Navigate to home page
    await page.goto('/')
    
    // Should see mobile-friendly navigation
    await expect(page.locator('nav')).toBeVisible()
    
    // Should see mobile-friendly buttons
    await expect(page.locator('button:has-text("Get Started")')).toBeVisible()
  })

  test('error handling displays correctly', async ({ page }) => {
    // Test with invalid credentials
    await page.click('text=Login')
    await page.fill('input[name="email"]', 'invalid@test.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    // Should see error message
    await expect(page.locator('.bg-red-50')).toBeVisible()
  })
})