const { Builder, By, until } = require('selenium-webdriver');

async function testRegisterProduct() {
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

    // Esperar a que el input del nombre del producto esté disponible
    await driver.wait(until.elementLocated(By.css('input[name="Nombre del Producto"]')), 15000);

    // Rellenar el formulario de nuevo producto
    await driver.findElement(By.css('input[name="Nombre del Producto"]')).sendKeys('Samsung A55');
    await driver.findElement(By.css('input[name="Descripción"]')).sendKeys('Celular de buena cámara');
    await driver.findElement(By.css('input[name="Precio"]')).sendKeys('1250000');
    await driver.findElement(By.css('input[name="Cantidad"]')).sendKeys('10');
    await driver.findElement(By.css('input[name="Categoría"]')).sendKeys('Smartphones');

    // Enviar el formulario
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Verificar que el producto se haya añadido
    await driver.wait(until.elementLocated(By.xpath('//td[contains(text(), "Samsung J2 Prime")]')), 10000);
    console.log('Prueba exitosa: El producto se ha registrado correctamente en el inventario.');

  } catch (error) {
    console.error('Error durante la prueba:', error);
  } finally {
    await driver.quit();
  }
}

testRegisterProduct();
