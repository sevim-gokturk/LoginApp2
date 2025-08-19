import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000/api';

test.describe('Backend API tests', () => {

  test('Register user', async ({ request }) => {
    // Benzersiz user oluştur
    const timestamp = Date.now();
    const user = {
      username: `playwrightuser${timestamp}`,
      email: `pw${timestamp}@example.com`,
      password: '123456'
    };

    const response = await request.post(`${BASE_URL}/register`, {
      data: user
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('message', 'User registered');

    // Login testi için kullanıcı bilgilerini döndürelim
    test.info().annotations.push({ type: 'user', description: JSON.stringify(user) });
  });

  test('Login user', async ({ request }) => {
    // Önceki testten kullanıcı bilgilerini al (veya kendi oluştur)
    const timestamp = Date.now();
    const user = {
      email: `pw${timestamp}@example.com`,
      password: '123456'
    };

    // Eğer veritabanında user yoksa register et
    await request.post(`${BASE_URL}/register`, { data: { ...user, username: `pwuser${timestamp}` } });

    const response = await request.post(`${BASE_URL}/login`, {
      data: user
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('message', 'Login successful');
  });

});
