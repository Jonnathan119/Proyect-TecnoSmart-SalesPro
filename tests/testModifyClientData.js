const { Builder, By, until } = require('selenium-webdriver');

async function testModifyClientData() {
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


       // Navegar a la Gestión de clientes
    const inventoryButton = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(., 'Gestión de Clientes')]")),
        10000
      );
      await inventoryButton.click();
      await driver.wait(until.urlContains('/clients'), 10000);

      // 4. Seleccionar el primer botón de editar en la lista de clientes
      await driver.findElement(By.css('table tbody tr:first-child button')).click();

     // 5. Modificar los datos del cliente
     await driver.findElement(By.css('input[name="Nombre del Cliente"]')).clear();
     await driver.findElement(By.css('input[name="Nombre del Cliente"]')).sendKeys('Daniel Felipe');

    await driver.findElement(By.css('input[type="date"][name="Fecha de Expedición"]')).clear();
    await driver.findElement(By.css('input[type="date"][name="Fecha de Expedición"]')).sendKeys('24-10-2024');

     await driver.findElement(By.css('input[name="Teléfono"]')).clear();
     await driver.findElement(By.css('input[name="Teléfono"]')).sendKeys('3001234567');

     await driver.findElement(By.css('input[name="Dirección"]')).clear();
     await driver.findElement(By.css('input[name="Dirección"]')).sendKeys('Samaná calle 7');

     // 6. Guardar los cambios
     await driver.findElement(By.css('button[name="submit"]')).click();

     // 7. Verificar que los cambios se reflejan en la tabla
     const modifiedClientName = await driver.findElement(By.css('table tbody tr:first-child td:nth-child(2)')).getText();
     const modifiedPhone = await driver.findElement(By.css('table tbody tr:first-child td:nth-child(4)')).getText();

     if (modifiedClientName === 'Cliente Modificado' && modifiedPhone === '3001234567') {
         console.log('Datos del cliente actualizados correctamente.');
     } else {
         console.error('Los datos del cliente no se actualizaron correctamente.');
     }

 } catch (error) {
     console.error('Error durante la prueba:', error);
 } finally {
     await driver.quit();
 }
}

testModifyClientData();