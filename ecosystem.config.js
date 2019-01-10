module.exports = {
  apps: [
    {
      name: 'service-endpoint',
      script: './node_modules/nuxt/bin/nuxt.js',
      args: '',
      env: {
        'NODE_ENV': 'production'
      }
    }
  ]
}
