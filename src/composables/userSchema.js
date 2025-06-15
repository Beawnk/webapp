import * as yup from 'yup';

export const getUserSchema = (logged) => {
  const schema = {
    email: yup
      .string()
      .required('Digite seu email')
      .email('Digite um email válido'),
    name: yup
      .string()
      .required('Digite seu nome')
      .min(3, 'Nome deve ter pelo menos 3 caracteres'),
    birthdate: yup
      .date()
      .required('Digite sua data de nascimento')
      .typeError('Data de nascimento inválida')
      .max(new Date(), 'Data de nascimento não pode ser no futuro'),
    phone: yup
      .string()
      .required('Digite seu telefone')
      .transform((value) => value.replace(/\D/g, ''))
      .matches(/^\d{10,11}$/, 'Telefone deve conter 10 ou 11 dígitos'),
    cep: yup
      .string()
      .required('Digite seu CEP')
      .transform((value) => value.replace(/\D/g, ''))
      .matches(/^\d{8}$/, 'CEP deve conter 8 dígitos'),
    street: yup.string().required('Digite sua rua'),
    number: yup.string().required('Digite o número'),
    district: yup.string().required('Digite seu bairro'),
    city: yup.string().required('Digite sua cidade'),
    state: yup.string().required('Digite seu estado')
  };

  if (!logged) {
    schema.password = yup
      .string()
      .required('Digite sua senha')
      .min(6, 'Senha deve ter pelo menos 6 caracteres');
  }

  return yup.object(schema);
};