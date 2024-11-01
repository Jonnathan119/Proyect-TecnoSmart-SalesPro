const { Builder, By, until } = require('selenium-webdriver');

async function testUpdateInventory() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('http://localhost:3000/login');
    await driver.wait(until.elementLocated(By.css('input[type="email"]')), 10000);

    // Iniciar sesión
    await driver.findElement(By.css('input[type="email"]')).sendKeys('daniel@gmail.com');
    await driver.findElement(By.css('input[type="password"]')).sendKeys('123456');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Esperar a que cargue el Dashboard
    await driver.wait(until.urlContains('/dashboard'), 10000);

    // Navegar a la Gestión de Inventario
    const inventoryButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Gestión de Inventario')]")),
      10000
    );
    await inventoryButton.click();
    await driver.wait(until.urlContains('/inventory'), 10000);

    // Esperar a que la tabla de productos esté visible
    await driver.wait(until.elementLocated(By.css('table')), 5000);

    // Seleccionar el botón "Editar" del primer producto
    await driver.findElement(By.css('button[name="Editar"]')).click();

    // Esperar a que el formulario de edición esté visible
    await driver.wait(until.elementLocated(By.css('input[name="Cantidad"]')), 5000);

    // Cambiar la cantidad
    const quantityInput = await driver.findElement(By.css('input[name="Cantidad"]'));
    await quantityInput.clear();
    await quantityInput.sendKeys('100');

    // Enviar el formulario
    await driver.findElement(By.css('button[type="submit"]')).click();


    console.log('Escenario de actualización de inventario - PASSED');
  } catch (error) {
    console.error('Error durante la prueba:', error);
  } finally {
    await driver.quit();
  }
}
testUpdateInventory();
