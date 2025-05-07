import { z } from 'zod';
import { EnvEnum, NodeEnv } from './enn.enum';

const nodeEnvs = Object.values(NodeEnv) as [string, ...string[]];
const envVariables = Object.values(EnvEnum);

const validationOjb = {};

for (const env of envVariables) {
  // node env
  if (env === EnvEnum.NODE_ENV) {
    validationOjb[env] = z.enum(nodeEnvs);
    continue;
  }
  // other envs
  validationOjb[env] = z.string();
}

const envValidator = z.object(validationOjb);

export const environmentVariablesValidator = (
  config: Record<string, unknown>,
) => {
  const result = envValidator.safeParse(config);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format(), null, 2));
  }
  return result.data;
};
