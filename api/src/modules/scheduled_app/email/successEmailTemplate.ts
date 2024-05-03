import donationType from "@/modules/inscripcion/enums/donationType.enum";
const successEmailSubject = "Comprobante de aporte Greenpeace";
const createEmailSuccessBody = (
  data: any,
  transaccion: any,
  cliente: any,
  date: string
) => {
  let message = "";
  if (transaccion.tipo_donacion === donationType.MENSUAL) {
    message = "mensual";
  } else {
    message = "única";
  }
  const successEmailTemplate = `
  <html>
  <head>
    <style></style>
  </head>
  <body>
    <div style="text-align: left;">
      <img src="https://imagedelivery.net/4UjGyQauyQ4cqduHdPPkww/59f42be4-258c-41fc-0998-0463ac697000/public" alt="Greenpeace Logo" style="max-width: 18%;">
    </div>
    <p> Hola, ${cliente.nombre} 👋</p>
    <p>Te informamos que tu aporte por COP $${transaccion.monto} correspondiente a tu donación ${message} ha sido exitoso. </p>
    <p>¡Recuerda! 👀</p>
    <p>Tú y todas las personas que aportan a Greenpeace <b> son esenciales para lograr nuestros objetivos.</b> Gracias por tu acto de solidaridad con el medioambiente. </p>
    <p>Estamos seguros que, si hubiera más personas como tú, el planeta sería mucho más consciente y respetuoso con la naturaleza 💚 ¡Gracias!</p>
    <table width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td bgcolor="#000000" height="1"></td>
        <td bgcolor="#ffffff" width="50%"></td>
      </tr>
    </table>
    <h4>Detalles de tu donación</h4>
    <p>Fecha ${date}</p>
    <p>Tipo de tarjeta: ${transaccion.metodo_pago}</p>
    <p>Nombre: ${cliente.nombre} ${cliente.apellido}</p>
    <p>Monto de donación: COP $${transaccion.monto}</p>
    <p>Frecuencia: ${message}</p>
    <p>*El cargo en tu cartola bancaria aparecerá como GREENPEACE*</p>
    <table width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td bgcolor="#000000" height="1"></td>
        <td bgcolor="#ffffff" width="50%"></td>
      </tr>
    </table>
    <p> Si tienes dudas, por favor envíanos un e-mail a socios@greenpeace.cl o llámanos al (02)2634 38 00 de lunes a viernes de 10:00 a 18:00 horas. </p>
    <p>
      <b>Equipo Greenpeace Colombia</b>
    </p>
  </body>
</html>`;
  return successEmailTemplate;
};

export { createEmailSuccessBody, successEmailSubject };
