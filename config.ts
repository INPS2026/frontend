import z from 'zod';

const EnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.string().default('http://localhost:5000'),
  ),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    'Invalid environment variables:',
    parsed.error.flatten().fieldErrors,
  );
  process.exit(1);
}

const env = parsed.data;

export { env };
