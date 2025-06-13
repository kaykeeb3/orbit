import { z } from 'zod'

export const registerSchema = z.object({
  name: z
    .string({ required_error: 'O nome é obrigatório.' })
    .min(6, { message: 'O nome deve ter no mínimo 6 caracteres.' }),

  email: z
    .string({ required_error: 'O e-mail é obrigatório.' })
    .email({ message: 'Formato de e-mail inválido.' }),

  password: z
    .string({ required_error: 'A senha é obrigatória.' })
    .min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),

  profilePicture: z
    .string({
      invalid_type_error: 'A URL da foto de perfil deve ser uma string.',
    })
    .url({ message: 'A URL da foto de perfil deve ser válida.' })
    .optional(),

  isAdmin: z
    .boolean({
      invalid_type_error: 'O campo "isAdmin" deve ser verdadeiro ou falso.',
    })
    .optional(),
})

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'O e-mail é obrigatório.' })
    .email({ message: 'Formato de e-mail inválido.' }),

  password: z
    .string({ required_error: 'A senha é obrigatória.' })
    .min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),
})
