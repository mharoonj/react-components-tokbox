import config from "./config.json";

const getEnvironment = () => {
  // Set the environment manually here ("local" or "production")
  const environment = "production"; 
  return config[environment].base_url;
};

export default getEnvironment;