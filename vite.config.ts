server: {
  proxy: {
    '/api': {
      target: 'http://casper-ai-573fqmg7wa-uc.a.run.app',
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, ''),
    },
  },
}
