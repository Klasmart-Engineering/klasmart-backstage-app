# [Backstage](https://backstage.io)

This is your newly scaffolded Backstage App, Good Luck!

To start the app, run:

```sh
yarn install
yarn dev
```

Build and publish
```
k3d registry delete k3d-registry.localhost && k3d cluster delete k3s-default  

k3d registry create registry.localhost --port 12345
k3d cluster create --registry-use k3d-registry.localhost:12345
npm run build && npm run build-image
docker tag backstage:latest k3d-registry.localhost:12345/backstage:latest && \
docker push k3d-registry.localhost:12345/backstage:latest
```

Make your primary email visible! You must edit your kidsloop github profile so that your email is visible and it is displayed to the public.

