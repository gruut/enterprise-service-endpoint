module.exports = {
  apps: [
    {
      name: 'service-endpoint',
      script: './node_modules/nuxt/bin/nuxt.js',
      args: 'run start',
      env: {
        'NODE_ENV': 'production'
      }
    }
  ]
}
