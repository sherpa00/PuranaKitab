module.exports = {
  apps: [
    {
      name: 'puranakitab',
      script: 'build/server.js',
      instances: 2,
      env_production: {
        exec_mode: 'cluster_mode',
        PORT: 8003,

        NODE_ENV: 'production',

        DB_HOST: 'localhost',
        DB_USER: 'postgres',
        DB_PASSWORD: 'chawang5432',
        DB_PORT: 5432,
        DB_DATABASE: 'puranakitab',

        CLOUDINARY_CLOUD_NAME: 'drpt6kknz',
        CLOUDINARY_API_KEY: 559983587522358,
        CLOUDINARY_API_SECRET: 'fge5s4C6qjbAPg6uHfySiT4WfOQ',

        DEFAULT_GMAIL: 'nephack00@gmail.com',
        GMAIL_APP_PASSWORD: 'pwuibndqpgcasshp',

        PRIVATE_KEY: `-----BEGIN RSA PRIVATE KEY-----
                              MIIEpQIBAAKCAQEAxdfebVSvnYajss6gA7sPQwdcOMTQDX+pPe1NVb03Syej5cQD
                              80WqsZWpHT0cK9X2EX2g6dTTH2depcKlTHBlWl1103JoXyRnjx7ap2B/EAgl+mk0
                              232Ep1FI70VaFP+/NUjl7gclLT9lU5X+Acr4HgN3iF1steXFokizTuNe4lZV37L9
                              ARfVmeFpQeQRWOp8cJ14XVqlC6EfEqCVYAd01VfamxWc+zDXKZTBqnoRvdTMYjMt
                              +NTgLY2jbxXImi6XYRBb8KFEesWXdze3zgotCJZ9qS7oiNnFxApwb1Ftwbq8XTK2
                              8pAbJituOBOr1qv9qVlIJvrXExEVQa7JQL/Q4QIDAQABAoIBAHWtz2nsw4DJgzlq
                              Whed/pf6GsrRlodQ9hQVwLhNEkSr0XtruoXLXJrA0JTJsqYIYJNKzJoJs4Ksc8nZ
                              G4V6HW9AxEL/fEGLX+XrjlecuDeLATwPtBcSdAMqAF4CPHDdJpjFQa7xpRVi7hxn
                              zWy3lBoWKdV87JrNj17WK4GzEM9DSs6e+hULrGNdnb+6plstPD/s2KoUTU+e9UpJ
                              hIAQurPExOfy22G6aLrMMvP0yT95pDuiR49ij+pafw6lrePqydgeoNPI8WCqaPnJ
                              zxQZWibJlYyx444JMc8s/FGSZM8VusHCLv1Ev2XH2CLi6UCLmKZo740CeLOaYjet
                              To622yECgYEA8xdZ9fdOR0oFKfmQUGrUpFIzX9O6RZs3ymsMdy9QObDaCoLRZSj+
                              QT4wNd2EyDmeDjp4mucKtnIv2FzC5uY+7A3oVBQ0KSlTU7L7+gKlbpbysdvv8wTt
                              ZPvEFLFFgQkcOSaJIPmnk+V8qlp19slrAkJ8yYVtP2M9V2IEboQqNzUCgYEA0Fln
                              bmDlOGuPe7RXO9C7oPJ/16KWnjiuVQb+ZS8KJIJJZxhBQQz2MPYrfhMEnr41e9uw
                              8HF1elS0zGq5xZ/c0ri/L9ARgC3DDlJoGm5cVhq4D2Auw0pWeklhJHg/FIV75EQX
                              tjUXXFpJTa3C0uIdhlljZZ+wGR/hracImroG7H0CgYEA32vU6PY1YdwsRtnyw5aM
                              fcJ3KVnl19fDPS2KNXis2XkrzYFShxFYLgrEMJ26TnR2Skl/U4+KDwl/4/HNyH5R
                              0o8tuykej75FsaXNZYlNFwlxYfrs3ITo02l6XDJZ2TDQWc6LNl1+obXIEKI3zWxu
                              B5OoMWeKczn4xPl3bUPXsQkCgYEAu4KbCcX+xgZXvfeSQu0a0EEvOXzEnWVZ0IBY
                              1+u77xuqwDQeFlN6BpqmjfLDx7JcJDqWRe920UAG76plwyya6rMGrhtOhNOqpusX
                              ciI8y+mEGaJws6Xlqmz8Fnx6GRgBZnC5/mxNt/ox2s01d+G0vMMaJ83OCO6eh1C6
                              97XQoWkCgYEApV9GqCAbQl1wzQI/l3NaMIGrqPEut1iWTI72Y9DlHFYgCTwCstDA
                              otkPN6NJr46ns7HSsng9897uJZ9nKhnI0Hz3mbJEDHOMf2E71PQ1APKl+ZoHH1yb
                              gp/2wNLJMr2jyL5HLY/yWPr3yYhA7H8FUOoT3PPw7pou5UpCQlT8Fyw=
                              -----END RSA PRIVATE KEY-----`,

        PUBLIC_KEY: `-----BEGIN PUBLIC KEY-----
                              MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxdfebVSvnYajss6gA7sP
                              QwdcOMTQDX+pPe1NVb03Syej5cQD80WqsZWpHT0cK9X2EX2g6dTTH2depcKlTHBl
                              Wl1103JoXyRnjx7ap2B/EAgl+mk0232Ep1FI70VaFP+/NUjl7gclLT9lU5X+Acr4
                              HgN3iF1steXFokizTuNe4lZV37L9ARfVmeFpQeQRWOp8cJ14XVqlC6EfEqCVYAd0
                              1VfamxWc+zDXKZTBqnoRvdTMYjMt+NTgLY2jbxXImi6XYRBb8KFEesWXdze3zgot
                              CJZ9qS7oiNnFxApwb1Ftwbq8XTK28pAbJituOBOr1qv9qVlIJvrXExEVQa7JQL/Q
                              4QIDAQAB
                              -----END PUBLIC KEY-----`
      }
    }
  ]
}