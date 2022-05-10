// import { createRouter } from '@backstage/plugin-auth-backend';
// import { Router } from 'express';
// import { PluginEnvironment } from '../types';

// export default async function createPlugin(
//   env: PluginEnvironment,
// ): Promise<Router> {
//   return await createRouter({
//     logger: env.logger,
//     config: env.config,
//     database: env.database,
//     discovery: env.discovery,
//     tokenManager: env.tokenManager,
//   });
// }
import { DEFAULT_NAMESPACE, stringifyEntityRef, } from '@backstage/catalog-model';
import {
  createRouter,
  providers,
  defaultAuthProviderFactories,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  console.log(`creating router`);
  return await createRouter({
    ...env,
    providerFactories: {
      ...defaultAuthProviderFactories,
      github: providers.github.create({
        signIn: {
          // resolver: providers.github.resolvers.usernameMatchingUserEntityName(),
          resolver: async ({ profile }, ctx) => {
            if (!profile.email) {
              console.log(`profile: ${JSON.stringify(profile)}`);
              throw new Error(
                'Login failed, user profile does not contain an email',
              );
            }
            // We again use the local part of the email as the user name.
            const [localPart] = profile.email.split('@');
          
            // By using `stringifyEntityRef` we ensure that the reference is formatted correctly
            const userEntityRef = stringifyEntityRef({
              kind: 'User',
              name: localPart,
              namespace: DEFAULT_NAMESPACE,
            });
          
            return ctx.issueToken({
              claims: {
                sub: userEntityRef,
                ent: [userEntityRef],
              },
            });
          },
        },
      }),
    },
  });
}