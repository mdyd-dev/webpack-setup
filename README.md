# Example of setting up Platform OS project with Webpack

To install all required packages run

    npm i

After that you can run

    npm run sync

to start syncing with marketplace-kit to you `development` environment (for setting up different environments refer to [Marketplace Kit Documentation](https://github.com/mdyd-dev/marketplace-kit#usage) )

To start development mode just run with `sync` running in other process

    npm start

To deploy production version run

    npm run deploy:<environment>

where `<environment>` is one of `development`, `staging` or `production`

## SSL issue

When running project in development mode there is a problem with serving assets from local server over SSL. All of PlatformOS servers are using SSL by default so in order to link to any static assets, we need to serve them over SSL as well.

Server that is used to host assets locally is using self-signed certificates, which are by default blocked in browsers due to security reasons.

In order to circumvent it open this url in your browser https://127.0.0.1:8080/assets/index.js and confirm that you want to accept this exception and continue (process is different depending on each browser). Once you see contents of the JS file you will be able to work normally.

**Please note** that local server is refreshing this certificate every 24 hours or so, so unfortunatelly you will have to repeat the process.
