import { Expose, Type } from "class-transformer";
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNumber,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsEnum,
  Min,
  IsDate,
  IsNumberString,
  Max,
  MinLength,
  ValidateIf,
  Matches,
} from "class-validator";
import PaymentMethodEnum from "../enums/paymentMethod.enum";
import DonationTypesEnum from "../enums/donationType.enum";
import TipoDocumentoEnum from "../enums/tipoDocumento.enum";
import BancoEnum from "../enums/banco.enum";
import CodDepartamentosEnum from "../enums/cod_departamentos.enum";

class InscripcionRequestDTO {

  public static regexpFecha = new RegExp('^\d{4}/(0[1-9]|1[0-2])$');

  @IsDefined({message: 'Tipo de donación inválido.'})
  @IsString({message: 'Tipo de donación inválido.'})
  @IsNotEmpty({message: 'Tipo de donación inválido.'})
  @Expose()
  @IsEnum(DonationTypesEnum, {message: 'Tipo de donación inválido.'})
  public tipo_donacion: string;

  @IsDefined({message: 'Nombre inválido.'})
  @IsString({message: 'Nombre inválido.'})
  @IsNotEmpty({message: 'Nombre inválido.'})
  @Expose()
  public nombre: string;

  @IsDefined({message: 'Apellido inválido.'})
  @IsString()
  @IsNotEmpty()
  @Expose()
  public apellido: string;

  @IsDefined({message: 'Tipo Documento inválido.'})
  @IsString({message: 'Tipo Documento inválido.'})
  @IsNotEmpty({message: 'Tipo Documento inválido.'})
  @IsEnum(TipoDocumentoEnum, {message: 'Tipo Documento inválido.'})
  @Expose()
  public tipo_documento_cliente: string;

  @IsDefined({message: 'Numero de Documento inválido.'})
  @IsNotEmpty({message: 'Numero de Documento inválido.'})
  @Expose()
  public numero_documento_cliente: string;

  @IsDefined({message: 'Email inválido.'})
  @IsEmail({}, {message: 'Email inválido.'})
  @IsString({message: 'Email inválido.'})
  @IsNotEmpty({message: 'Email inválido.'})
  @MaxLength(100, {message: 'Email inválido.'})
  @Expose()
  public email: string;

  @IsDefined({message: 'Prefijo inválido.'})
  @IsString({message: 'Prefijo inválido.'})
  @IsNotEmpty({message: 'Prefijo inválido.'})
  @Expose()
  public prefijo: string;

  @IsDefined({message: 'Telefono inválido.'})
  @IsString({message: 'Telefono inválido.'})
  @IsNotEmpty({message: 'Telefono inválido.'})
  @MaxLength(50,{message: 'Telefono inválido.'})
  @Expose()
  public telefono: string;

  @IsDefined({message: 'Fecha de Nacimiento inválida.'})
  @IsNotEmpty({message: 'Fecha de Nacimiento inválida.'})
  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {message: 'Fecha de Nacimiento inválida.'})
  @Expose()
  public fecha_nacimiento: Date;

  @IsDefined({message: 'País inválido.'})
  @IsString({message: 'País inválido.'})
  @MaxLength(100, {message: 'País inválido.'})
  @Expose()
  public pais: string;

  @IsDefined({message: 'Departamento inválido.'})
  @IsString({message: 'Departamento inválido.'})
  @MaxLength(100, {message: 'Departamento inválido.'})
  @IsEnum(CodDepartamentosEnum, {message: 'Departamento inválido.'})
  @Expose()
  public departamento: string;

  @IsDefined({message: 'Ciudad inválida.'})
  @IsString({message: 'Ciudad inválida.'})
  @MaxLength(100, {message: 'Ciudad inválida.'})
  @Expose()
  public ciudad: string;

  @IsDefined({message: 'Dirección inválida.'})
  @IsString({message: 'Dirección inválida.'})
  @MaxLength(100, {message: 'Dirección inválida.'})
  @Expose()
  public direccion: string;

  @IsDefined({message: 'Numero Dirección inválido.'})
  @IsNotEmpty({message: 'Numero Dirección inválido.'})
  @Expose()
  public numero: number;

  @IsDefined({message: 'Monto inválido.'})
  @IsNumber({},{message: 'Monto inválido.'})
  @IsNotEmpty({message: 'Monto inválido.'})
  @Min(1, {message: 'El monto debe ser mayor a 0.'})
  @Expose()
  public monto: number;

  @IsDefined({message: 'UTM inválido.'})
  @IsString({message: 'UTM inválido.'})
  @IsNotEmpty({message: 'UTM inválido.'})
  @Expose()
  public utm_source: string;

  @IsDefined({message: 'UTM inválido.'})
  @IsString({message: 'UTM inválido.'})
  @IsNotEmpty({message: 'UTM inválido.'})
  @Expose()
  public utm_medium: string;

  @IsDefined({message: 'UTM inválido.'})
  @IsString({message: 'UTM inválido.'})
  @IsNotEmpty({message: 'UTM inválido.'})
  @Expose()
  public utm_content: string;

  @IsDefined({message: 'UTM inválido.'})
  @IsString({message: 'UTM inválido.'})
  @IsNotEmpty({message: 'UTM inválido.'})
  @Expose()
  public utm_term: string;

  @IsDefined({message: 'UTM inválido.'})
  @IsString({message: 'UTM inválido.'})
  @IsNotEmpty({message: 'UTM inválido.'})
  @Expose()
  public utm_campaign: string;
  
  @IsDefined({message: 'Método de pago inválido.'})
  @IsNotEmpty({message: 'Método de pago inválido.'})
  @IsEnum(PaymentMethodEnum, {message: 'Método de pago inválido.'})
  @Expose()
  public metodo_pago: string;
  
  
  @ValidateIf((o) => o.metodo_pago !== PaymentMethodEnum.PSE)
  @IsDefined({message: 'Número de tarjeta inválido.'})
  @IsNotEmpty({message: 'Número de tarjeta inválido.'})
  @IsNumber({}, {message: 'Número de tarjeta inválido.'}) 
  @Expose()
  public numero_tarjeta: number;
  
  @ValidateIf((o) => o.metodo_pago != PaymentMethodEnum.PSE)
  @IsDefined({message: 'Tipo de documento tarjetahabiente inválido.'})
  @IsNotEmpty({message: 'Tipo de documento tarjetahabiente inválido.'})
  @IsEnum(TipoDocumentoEnum, {message: 'Tipo de documento tarjetahabiente inválido.'})
  @Expose()
  public tipo_documento_tarjetahabiente: string;

  @ValidateIf((o) => o.metodo_pago != PaymentMethodEnum.PSE)
  @IsDefined({message: 'Número de documento tarjetahabiente inválido.'})
  @IsNotEmpty({message: 'Número de documento tarjetahabiente inválido.'})
  @Expose()
  public numero_documento_tarjetahabiente: string;
  
  @ValidateIf((o) => o.metodo_pago != PaymentMethodEnum.PSE)
  @IsDefined({message: 'Nombre y apellido tarjetahabiente inválido.'})
  @IsNotEmpty({message: 'Nombre y apellido tarjetahabiente inválido.'})
  @IsString({message: 'Nombre y apellido tarjetahabiente inválido.'})
  @Expose()
  public nombre_apellido_tarjetahabiente: string;
  
  @ValidateIf((o) => o.metodo_pago != PaymentMethodEnum.PSE)
  @IsDefined({message: 'Fecha de vencimiento de la tarjeta inválida.'})
  @IsNotEmpty({message: 'Fecha de vencimiento de la tarjeta inválida.'})
  @Matches(/^[0-9]{4}\/(0[1-9]|1[0-2])$/, {message: 'Fecha de vencimiento de la tarjeta inválida.'})
  @Expose()
  public fecha_vencimiento_tarjeta: string;

  @ValidateIf((o) => o.metodo_pago != PaymentMethodEnum.PSE)
  @IsDefined({message: 'Código de seguridad inválido.'})
  @IsNotEmpty({message: 'Código de seguridad inválido.'})
  @MinLength(3)
  @MaxLength(4)
  @Expose()
  public cvv: string;
  
  @ValidateIf((o) => o.metodo_pago === PaymentMethodEnum.PSE)
  @IsDefined({message: 'Banco inválido.'})
  @IsNotEmpty({message: 'Banco inválido.'})
  @IsEnum(BancoEnum, {message: 'Banco inválido.'})
  @Expose()
  public banco: string;
  
  @ValidateIf((o) => o.metodo_pago === PaymentMethodEnum.PSE)
  @IsDefined({message: 'Número de cuenta inválido.'})
  @IsNotEmpty({message: 'Número de cuenta inválido.'})
  @Expose()
  public numero_cuenta: string;
  
  @ValidateIf((o) => o.metodo_pago === PaymentMethodEnum.PSE)
  @IsDefined({message: 'Tipo de cuenta inválido.'})
  @IsNotEmpty({message: 'Tipo de cuenta inválido.'})
  @Expose()
  public tipo_cuenta: string;
}

export default InscripcionRequestDTO;
