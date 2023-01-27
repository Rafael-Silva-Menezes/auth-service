const cloudEnvs = ['dev', 'prod', 'homolog'];
export function isCloudEnv() {
  const appEnv = process.env?.APP_ENV;

  const isCloud = appEnv && cloudEnvs.includes(appEnv);

  return isCloud ? true : false;
}

export { cloudEnvs };
