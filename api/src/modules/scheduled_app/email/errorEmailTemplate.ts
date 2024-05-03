const errorEmailRecipient = String(process.env.API_EMAIL_ERROR_RECIPIENT);
const errorEmailSubject = "¡Alerta de Fallo en la Aplicación Programada!";
const createEmailErrorBody = (error: any) => {
  const errorEmailTemplate = `<html>
  <body>
    <h1 style="color: #0099cc;">¡Alerta de Fallo en la Aplicación Programada!</h1>
    <p>Estimados Usuarios,</p>
  
    <p><strong>Lamentamos informarles que la ejecución de nuestra aplicación programada no se completó correctamente.</strong></p>
    
    <p>Esta aplicación está diseñada para realizar tareas importantes y críticas, y su correcto funcionamiento es esencial para nuestro servicio.</p>
  
    <p><strong>Detalles del Error:</strong></p>
    <p style="background-color: #f44336; color: white; padding: 10px;">${error}</p>
  
    <p>Nuestro equipo de desarrollo ya está trabajando activamente para resolver este problema y asegurar que la aplicación vuelva a funcionar con normalidad.</p>
  
    <p>Agradecemos su comprensión y paciencia mientras trabajamos en una solución.</p>
  
    <p>Atentamente,</p>
    <p>El Equipo de Soporte Técnico</p>
  </body>
  </html>`;
  return errorEmailTemplate;
};

export { errorEmailRecipient, createEmailErrorBody, errorEmailSubject };
