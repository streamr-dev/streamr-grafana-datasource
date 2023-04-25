import { CustomWebpackConfigurationGetter } from '@grafana/toolkit/src/config'

const getWebpackConfig: CustomWebpackConfigurationGetter = (defaultConfig, options) => {
    console.log('Custom config @@@@@@@@@');
    //defaultConfig.plugins.push(new CustomPlugin())
    return defaultConfig;
}
export = getWebpackConfig;