const { Builder, By, until } = require('selenium-webdriver');

async function testLogin() {
    let driver = await new Builder().forBrowser('chrome').build();

  try {
    // Paso 1: Ir a la página de login
    await driver.get('http://localhost:3000/login');
    console.log('Página de login cargada');

    // Paso 2: Iniciar sesión con credenciales válidas
    await driver.findElement(By.css('input[type="email"]')).sendKeys('daniel@gmail.com');
    await driver.findElement(By.css('input[type="password"]')).sendKeys('123456');
    await driver.findElement(By.css('button[type="submit"]')).click();
    console.log('Formulario de login enviado');

    // Paso 3: Esperar a que la URL sea la del Dashboard
    await driver.wait(until.urlIs('http://localhost:3000/dashboard'), 15000);
    console.log('Redirigido al dashboard exitosamente');


    console.log('Escenario 1: Inicio de sesión exitoso con credenciales válidas - PASSED');

    // Paso 5: Intentar iniciar sesión con credenciales inválidas
    await driver.get('http://localhost:3000/login');
    await driver.findElement(By.css('input[type="email"]')).sendKeys('benito@gmail.com');
    await driver.findElement(By.css('input[type="password"]')).sendKeys('112233');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Paso 6: Esperar el mensaje de error
    const errorMessage = await driver.wait(
        until.elementLocated(By.css('.MuiAlert-message')),
        10000
      );
  
      const errorText = await errorMessage.getText();
      if (errorText.includes('Credenciales incorrectas')) {
        console.log('Mensaje de error por credenciales inválidas mostrado correctamente');
      } else {
        console.error('El mensaje de error no coincide con lo esperado');
      }

  } catch (error) {
    console.error('Error durante la prueba:', error);
  } finally {
    await driver.quit();
  }
}

testLogin();
