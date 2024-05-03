import donationType from "@/modules/inscripcion/enums/donationType.enum";

const emailSubjectInscripcion = "Confirmación de donación Greenpeace";
const createEmailBodyInscripcion = (
  cliente: any,
  dataTBK: any,
  date: string,
  transaccion: any
) => {
  let message = "";
  if (transaccion.tipo_donacion === donationType.MENSUAL) {
    message = "mensual";
  } else {
    message = "único";
  }
  const successInscripcionEmailTemplate = `<html>
  <head>
    <style></style>
  </head>
  <body>
    <div style="text-align: left;">
      <img src="https://imagedelivery.net/4UjGyQauyQ4cqduHdPPkww/59f42be4-258c-41fc-0998-0463ac697000/public" alt="Greenpeace Logo" style="max-width: 18%;">
    </div>
    <p> Hola, ${cliente.nombre} 👋</p>
    <p>Te informamos que tu tarjeta bancaria se registró exitosamente para realizar un aporte ${message} a Greenpeace por COP $${transaccion.monto}. </p>
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
    <p> Gracias a ti podemos ser una comunidad y contar con total independencia política y económica para denunciar libremente a cualquiera que atente contra el medio ambiente. </p>
    <p>¡Muchas gracias por hacerlo posible! 💚🌈</p>
    <table width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td bgcolor="#000000" height="1"></td>
        <td bgcolor="#ffffff" width="50%"></td>
      </tr>
    </table>
    <p> Si tienes dudas, por favor envíanos un e-mail a socios@greenpeace.cl o llámanos al (02)2634 38 00 de lunes a viernes de 10:00 a 18:00 horas. </p>
    <p>Equipo Greenpeace Colombia</p>
  </body>
</html>`;
  return successInscripcionEmailTemplate;
};

export { emailSubjectInscripcion, createEmailBodyInscripcion };
